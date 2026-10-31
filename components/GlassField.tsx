"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScroll;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){
  p.xz*=rot(uTime*0.16534698);
  p.x-=0.55;
  p.z+=sin(p.y*0.65)*0.22;
  p.xz*=rot(p.y*0.9);
  vec3 q=abs(p)-vec3(1.45,8.0,0.045);
  return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);
}
vec3 normal(vec3 p){
  float h=0.0015;
  vec2 k=vec2(1.0,-1.0);
  return normalize(k.xyy*map(p+k.xyy*h)+k.yyx*map(p+k.yyx*h)+k.yxy*map(p+k.yxy*h)+k.xxx*map(p+k.xxx*h));
}
vec3 film(float t){
  vec3 cyan=vec3(0.28,0.86,0.95);
  vec3 mag=vec3(0.96,0.30,0.72);
  vec3 vio=vec3(0.50,0.24,0.98);
  float w=fract(t);
  return mix(mix(cyan,mag,smoothstep(0.0,0.55,w)),vio,smoothstep(0.32,1.0,w));
}
vec3 shade(vec3 p,vec3 n,vec3 rd,vec3 light,float power){
  vec3 l=normalize(light-p);
  vec3 h=normalize(l-rd);
  float ndv=max(dot(n,-rd),0.0);
  float spec=pow(max(dot(n,h),0.0),40.0);
  float fres=pow(1.0-ndv,2.2);
  float ang=fres*2.4+dot(n,l)*0.7+p.y*0.15;
  return film(ang)*(spec*1.4+fres*0.55+ndv*0.16)*power;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uRes)/uRes.y;
  uv.x-=0.16;
  vec3 ro=vec3(0.0,0.02-uScroll*1.15,3.15);
  vec3 rd=normalize(vec3(uv,-1.2));
  float t=0.0;
  float tNear=0.0;
  float nearD=9.0;
  for(int i=0;i<72;i++){
    float d=map(ro+rd*t);
    if(d<nearD){nearD=d;tNear=t;}
    if(d<0.002)break;
    t+=d*0.55;
    if(t>12.0)break;
  }
  vec3 bg=vec3(0.020,0.024,0.039);
  vec3 col=bg;
  float cover=smoothstep(0.11,0.0,nearD);
  if(cover>0.001){
    vec3 p=ro+rd*tNear;
    vec3 n=normal(p);
    vec3 pointer=vec3(uPointer*vec2(1.85,1.25),1.55);
    vec3 idle=vec3(sin(uTime*0.23)*1.25,0.3+cos(uTime*0.17)*0.75,1.85);
    float tip=1.0-smoothstep(6.4,7.8,abs(p.y));
    col+=shade(p,n,rd,pointer,1.05)*cover*tip;
    col+=shade(p,n,rd,idle,0.62)*cover*tip;
  }
  float head=smoothstep(0.2,-0.65,uv.x)*smoothstep(-0.15,0.85,uv.y);
  col=mix(col,bg,head*0.8);
  gl_FragColor=vec4(pow(clamp(col,0.0,1.0),vec3(0.85)),1.0);
}`;

export default function GlassField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!canvas || !gl || gl.isContextLost()) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uPointer = gl.getUniformLocation(prog, "uPointer");
    const uScroll = gl.getUniformLocation(prog, "uScroll");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.55, y: 0.1 };
    const target = { x: 0.55, y: 0.1 };
    let raf = 0;
    const t0 = performance.now();

    const draw = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (!reduce.matches) {
        pointer.x += (target.x - pointer.x) * 0.12;
        pointer.y += (target.y - pointer.y) * 0.12;
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uScroll, window.scrollY / window.innerHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      draw((now - t0) / 1000);
      if (!reduce.matches && document.visibilityState === "visible") raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduce.matches && document.visibilityState === "visible") raf = requestAnimationFrame(frame);
    };
    const onPointer = (e: PointerEvent) => {
      if (reduce.matches) return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onReduce = () => {
      cancelAnimationFrame(raf);
      draw(2);
      start();
    };

    const onScroll = () => { if (reduce.matches) draw(2); };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", start);
    reduce.addEventListener("change", onReduce);
    draw(reduce.matches ? 2 : 0);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", start);
      reduce.removeEventListener("change", onReduce);
      queueMicrotask(() => {
        if (!canvas.isConnected) gl.getExtension("WEBGL_lose_context")?.loseContext();
      });
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -1, pointerEvents: "none", background: "#05060a" }}
    />
  );
}
