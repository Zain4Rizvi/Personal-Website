// Minimal MIPS interpreter for the CSCB58 bitmap game (MARS dialect, no delay slots).
// Supports only what game_final needs plus a few cheap extras. Runs in browser or Node.
// ponytail: interpreter covers the opcodes game_final uses; add more cases in OPS if a new program needs them.

const DISPLAY_BASE = 0x10008000;
const DISPLAY_WORDS = 64 * 64 + 256; // 64x64 units + slack (ERASE writes one word past the end)
const KB_CTRL = 0xffff0000;
const KB_DATA = 0xffff0004;

const REGS = ['zero','at','v0','v1','a0','a1','a2','a3','t0','t1','t2','t3','t4','t5','t6','t7',
  's0','s1','s2','s3','s4','s5','s6','s7','t8','t9','k0','k1','gp','sp','fp','ra'];

class MipsCPU {
  constructor(source) {
    this.eqv = {};
    this.labels = {};
    this.prog = [];
    this.assemble(source);
    this.reset();
  }

  reset() {
    this.r = new Int32Array(32);
    this.r[28] = DISPLAY_BASE;
    this.r[29] = 0x7fffeffc;
    this.pc = 0;
    this.display = new Int32Array(DISPLAY_WORDS);
    this.mem = new Map();
    this.kbReady = 0;
    this.kbData = 0;
    this.halted = false;
    this.sleep = 0;
  }

  // ---------- assembler ----------
  assemble(source) {
    const pending = [];
    source.split(/\r?\n/).forEach((raw, i) => {
      let line = raw.split('#')[0].trim();
      let m;
      while ((m = /^([A-Za-z_]\w*):\s*/.exec(line))) {
        this.labels[m[1]] = pending.length;
        line = line.slice(m[0].length);
      }
      if (!line) return;
      if (line[0] === '.') {
        const [d, name, val] = line.split(/\s+/);
        if (d === '.eqv') this.eqv[name] = val;
        return; // .text/.data/.globl ignored
      }
      const sp = line.search(/\s/);
      const op = (sp < 0 ? line : line.slice(0, sp)).toLowerCase();
      const args = sp < 0 ? [] : line.slice(sp).split(',').map(s => s.trim());
      pending.push({ op, args, line: i + 1 });
    });
    this.prog = pending.map(p => {
      try { return this.compile(p.op, p.args); }
      catch (e) { throw new Error(`line ${p.line}: ${p.op} ${p.args.join(', ')}: ${e.message}`); }
    });
  }

  imm(s) {
    s = this.eqv[s] ?? s;
    const n = Number(s);
    if (Number.isNaN(n)) throw new Error('bad immediate ' + s);
    return n | 0;
  }

  reg(s) {
    const n = s.startsWith('$') ? s.slice(1) : null;
    const i = n === null ? -1 : (/^\d+$/.test(n) ? +n : REGS.indexOf(n));
    if (i < 0 || i > 31) throw new Error('bad register ' + s);
    return i;
  }

  // register-or-immediate -> getter
  src(s) {
    if (s.startsWith('$')) { const i = this.reg(s); return r => r[i]; }
    const v = this.imm(s);
    return () => v;
  }

  target(name) {
    if (!(name in this.labels)) throw new Error('unknown label ' + name);
    return this.labels[name];
  }

  mop(s) { // offset($base)
    const m = /^(.*)\((\$\w+)\)$/.exec(s);
    if (!m) throw new Error('bad memory operand ' + s);
    return [m[1].trim() === '' ? 0 : this.imm(m[1].trim()), this.reg(m[2])];
  }

  compile(op, a) {
    const alu = f => { const d = this.reg(a[0]), x = this.src(a[1]), y = this.src(a[2]); return c => { c.r[d] = f(x(c.r), y(c.r)); }; };
    const br = (f) => { const x = this.src(a[0]), y = this.src(a[1]), t = this.target(a[2]); return c => { if (f(x(c.r), y(c.r))) c.pc = t; }; };
    const br0 = (f) => { const x = this.src(a[0]), t = this.target(a[1]); return c => { if (f(x(c.r))) c.pc = t; }; };
    switch (op) {
      case 'add': case 'addu': case 'addi': case 'addiu': return alu((x, y) => x + y);
      case 'sub': case 'subu': return alu((x, y) => x - y);
      case 'mul': return alu(Math.imul);
      case 'and': case 'andi': return alu((x, y) => x & y);
      case 'or': case 'ori': return alu((x, y) => x | y);
      case 'sll': return alu((x, y) => x << y);
      case 'srl': return alu((x, y) => x >>> y);
      case 'slt': case 'slti': return alu((x, y) => +(x < y));
      case 'li': case 'move': { const d = this.reg(a[0]), x = this.src(a[1]); return c => { c.r[d] = x(c.r); }; }
      case 'lw': { const d = this.reg(a[0]), [o, b] = this.mop(a[1]); return c => { c.r[d] = c.load((c.r[b] + o) >>> 0); }; }
      case 'sw': { const s = this.reg(a[0]), [o, b] = this.mop(a[1]); return c => c.store((c.r[b] + o) >>> 0, c.r[s]); }
      case 'beq': return br((x, y) => x === y);
      case 'bne': return br((x, y) => x !== y);
      case 'blt': return br((x, y) => x < y);
      case 'ble': return br((x, y) => x <= y);
      case 'bgt': return br((x, y) => x > y);
      case 'bge': return br((x, y) => x >= y);
      case 'bgtz': return br0(x => x > 0);
      case 'bgez': return br0(x => x >= 0);
      case 'bltz': return br0(x => x < 0);
      case 'blez': return br0(x => x <= 0);
      case 'bgezal': { const x = this.src(a[0]), t = this.target(a[1]); return c => { if (x(c.r) >= 0) { c.r[31] = c.pc; c.pc = t; } }; } // MARS: links only if taken
      case 'j': { const t = this.target(a[0]); return c => { c.pc = t; }; }
      case 'jal': { const t = this.target(a[0]); return c => { c.r[31] = c.pc; c.pc = t; }; }
      case 'jr': { const x = this.reg(a[0]); return c => { c.pc = c.r[x]; }; }
      case 'syscall': return c => c.syscall();
      case 'break': return c => { c.halted = true; };
      case 'nop': return () => {};
      default: throw new Error('unsupported instruction');
    }
  }

  // ---------- machine ----------
  load(a) {
    if (a === KB_CTRL) return this.kbReady;
    if (a === KB_DATA) { this.kbReady = 0; return this.kbData; }
    if (a >= DISPLAY_BASE && a < DISPLAY_BASE + DISPLAY_WORDS * 4) return this.display[(a - DISPLAY_BASE) >> 2];
    return this.mem.get(a) || 0;
  }

  store(a, v) {
    if (a >= DISPLAY_BASE && a < DISPLAY_BASE + DISPLAY_WORDS * 4) this.display[(a - DISPLAY_BASE) >> 2] = v;
    else this.mem.set(a, v | 0);
  }

  syscall() {
    const v0 = this.r[2];
    if (v0 === 32) this.sleep = Math.max(0, this.r[4]); // sleep a0 ms
    else if (v0 === 10) this.halted = true;
  }

  pressKey(code) { this.kbReady = 1; this.kbData = code; }

  // Run until the program sleeps, halts, or the step budget runs out. Returns sleep ms (0 if none).
  runUntilSleep(maxSteps = 200000) {
    this.sleep = 0;
    for (let n = 0; n < maxSteps && !this.halted && !this.sleep; n++) {
      const f = this.prog[this.pc++];
      if (!f) { this.halted = true; break; }
      f(this);
      this.r[0] = 0;
    }
    return this.sleep;
  }
}

if (typeof module !== 'undefined') module.exports = { MipsCPU, DISPLAY_BASE };
