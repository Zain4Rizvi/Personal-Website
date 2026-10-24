export const projects: import("@/lib/content").Project[] = [
  {
    "title": "Robotics VLA",
    "slug": "robotics-vla",
    "summary": "Fine-tuned the SmolVLA (450M) action expert to follow language commands, with attention visualized across 16 layers and a 7-joint MuJoCo simulator.",
    "tags": [
      "PyTorch",
      "SmolVLA",
      "MuJoCo",
      "Gymnasium",
      "React",
      "Three.js"
    ],
    "metrics": [
      {
        "value": "9/10",
        "label": "grasp success"
      },
      {
        "value": "5/10",
        "label": "stack success"
      },
      {
        "value": "87%",
        "label": "bin throws (scripted expert)"
      },
      {
        "value": "90%",
        "label": "peg insertion (scripted expert)"
      }
    ],
    "links": [
      {
        "label": "Visit website",
        "href": "https://robotics.zainrizvi.ca"
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/media/robotics-vla/demo.gif",
        "alt": "Looping clip of the robot arm simulation following a language command",
        "caption": "Simulation: the arm following a command"
      },
      {
        "type": "image",
        "src": "/media/robotics-vla/model.webp",
        "alt": "SmolVLA architecture view with 16-layer transformer blocks for the vision-language model and the action expert",
        "caption": "Model: 16-layer blocks, VLM and action expert"
      }
    ],
    "featured": true,
    "order": 1,
    "body": "\r\n## Problem\r\n\r\nA robot policy that only repeats one trained motion is not useful. The goal was a policy that takes a plain-language command and acts on it, plus a way to see what the model attends to while it does.\r\n\r\n## Approach\r\n\r\nI fine-tuned the action expert of SmolVLA (450M parameters) on demonstrations to follow language commands. To generate demonstrations and evaluate, I wrote a 7-joint arm simulator in MuJoCo with a Gymnasium interface and PyTorch, driven by scripted experts. A React and Three.js app visualizes the model's attention across all 16 layers.\r\n\r\n{/* TODO: dataset size, number of demonstrations, training hardware and time */}\r\n\r\n## Key technical decision\r\n\r\nFine-tune only the action expert rather than the full model. It keeps the pretrained vision-language backbone intact and makes training practical at this scale.\r\n\r\n{/* TODO: confirm which components were frozen and the exact training recipe */}\r\n\r\n## Result\r\n\r\nThe fine-tuned policy grasps 9 of 10 times and stacks 5 of 10 times when given a language command. The scripted experts that generate the data reach 87% on bin throws and 90% on peg insertion.\r\n\r\n{/* TODO: evaluation protocol (number of seeds, object set, command set) */}\r\n"
  },
  {
    "title": "Rocket League Analyzer",
    "slug": "rocket-league-analyzer",
    "summary": "A LangChain tool-calling LLM over match telemetry, plus a Dockerized 3D dashboard synced to replay playback.",
    "tags": [
      "LangChain",
      "LLM tool calling",
      "Docker",
      "3D dashboard"
    ],
    "metrics": [],
    "links": [
      {
        "label": "Visit website",
        "href": "https://rocket.zainrizvi.ca"
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/media/rocket-league-analyzer/sim.gif",
        "alt": "Looping 3D replay: cars and the ball on the pitch, with coverage, centroid and pressure overlays plus the coach console",
        "caption": "Replay simulation"
      },
      {
        "type": "image",
        "src": "/media/rocket-league-analyzer/site.png",
        "alt": "Replay Lab site: 3D match view beside the Ask the coach panel",
        "caption": "The analyzer site"
      }
    ],
    "featured": true,
    "order": 2,
    "body": "\r\n## Problem\r\n\r\nMatch telemetry is dense and hard to read by eye. Players want answers to questions about a match, not a spreadsheet.\r\n\r\n{/* TODO: telemetry source (replay parser), match volume, who it is for */}\r\n\r\n## Approach\r\n\r\nDrop in a Rocket League .replay file and the app prepares its telemetry and opens an interactive 3D simulation. A LangChain agent with tool calling answers natural-language questions (\"Why did we concede the third goal?\") by calling functions over that telemetry. The Dockerized dashboard stays synced to playback, with controls for follow-ball, coverage, centroid and pressure overlays.\r\n\r\n## Key technical decision\r\n\r\nLet the model call typed tools over the telemetry instead of reading it as text, so answers come from computed values.\r\n\r\n{/* TODO: list the tools, and how answers are checked for accuracy */}\r\n\r\n## Result\r\n\r\nA working analyzer: ask a question, get an answer grounded in the match data, and watch the same moment in 3D.\r\n\r\n{/* TODO: quantitative result, if any */}\r\n"
  },
  {
    "title": "Maple Market",
    "slug": "maple-market",
    "summary": "A visual explorer for big Canadian stocks: TSX companies as planets, a heatmap, and plain-English tools for compare, dividends, and compound growth.",
    "tags": [
      "Next.js",
      "React Three Fiber",
      "Three.js",
      "Recharts",
      "Zustand"
    ],
    "metrics": [],
    "links": [
      {
        "label": "Visit website",
        "href": "https://maplemarket.zainrizvi.ca"
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/media/maple-market/demo.gif",
        "alt": "Looping tour of Maple Market: the TSX sky of orbiting planets, a Shopify company card, then the market heatmap",
        "caption": "The sky, a company card, then the heatmap"
      }
    ],
    "featured": true,
    "order": 3,
    "body": "\r\n## Problem\r\n\r\nA table of tickers hides the shape of a market. Company size, the past year, and how much you pay for each dollar of profit should be readable at a glance, in plain English, without a trading terminal.\r\n\r\n## Approach\r\n\r\nMaple Market draws large TSX names as a sky. Bigger planets are bigger companies. Green is a stronger past year, red a weaker one, and distance from the sector sun is the price you pay for each dollar of profit. Search and the sector filters find a name. Clicking a planet opens the ticker, the price, and the past-year change.\r\n\r\nThe same names are also a treemap heatmap. Compare lines up to three companies as a report card. Beside that: a practice portfolio, a replay of prices already on record, a dividend reinvestment sketch, a compound-growth band, and a short quiz.\r\n\r\nThe public site is labeled demo data. It does not buy or sell anything, and it does not predict where prices go.\r\n\r\n## Key technical decision\r\n\r\nPut size, past-year colour, and valuation in a React Three Fiber scene instead of columns. The chart pages use Recharts. Zustand holds what is selected.\r\n\r\n## Result\r\n\r\nThe explorer is live at maplemarket.zainrizvi.ca.\r\n"
  },
  {
    "title": "StickDrift",
    "slug": "stickdrift",
    "summary": "A PS5-controller movement check disguised as games for long-term care.",
    "tags": [
      "Three.js",
      "Gamepad API",
      "React",
      "FastAPI",
      "TimescaleDB",
      "PyTorch"
    ],
    "metrics": [],
    "links": [
      {
        "label": "Visit site",
        "href": "https://stickdrift.health/"
      },
      {
        "label": "Devpost",
        "href": "https://devpost.com/software/stickdrift"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/AyanASaiyed/StickDrift"
      }
    ],
    "media": [
      {
        "type": "image",
        "src": "/media/stickdrift/gallery-5.jpg",
        "alt": "Harbour Fishing: a first-person view of a rod tracing a glowing lane between low-poly fish",
        "caption": "Harbour Fishing, played with one stick at a time"
      },
      {
        "type": "image",
        "src": "/media/stickdrift/gallery-2.jpg",
        "alt": "The StickDrift lobby listing Apple Picking, Harbour Fishing, and Rat Catching",
        "caption": "Residents pick a game. Staff see the scores."
      },
      {
        "type": "image",
        "src": "/media/stickdrift/card.jpg",
        "alt": "Blender view of the low-poly garden lobby with three game pads",
        "caption": "The lobby, modelled in Blender"
      }
    ],
    "featured": true,
    "order": 4,
    "body": "\r\n## Problem\r\n\r\nChanges in how someone moves can show up years before a diagnosis, and long-term care staff have little time to notice them. StickDrift was our Hack the Valley 11 entry for PointClickCare's Catch It Early challenge: make the check feel like a game, not a clinic.\r\n\r\n## Approach\r\n\r\nA resident logs in with a PS5 controller, walks a Three.js lobby, and plays Apple Picking, Harbour Fishing, or Rat Catching. The Gamepad API reads each stick. A separate measurement layer records reaction time, path error, and tremor, while the resident only sees scores and stars.\r\n\r\nStaff get a live view about a tenth of a second behind, a badge (No concerns, Keep an eye on, or Check soon), and plain-language visit cards. A small PyTorch model scores resemblance to three movement patterns. Gemini answers questions only from that resident's recorded numbers, and a PDF report is one click away. FastAPI and TimescaleDB are the only thing the two laptops share.\r\n\r\nBuilt with Bryan Wei, Hreem Pandya, and Ayan Saiyed. StickDrift does not diagnose. It flags a change, and a nurse decides what happens next.\r\n\r\n## Result\r\n\r\nResidents play three short games. Staff see trends across visits and a clinician report, without the resident ever looking at a health number.\r\n"
  },
  {
    "title": "Assembly Platformer",
    "slug": "assembly-platformer",
    "summary": "An 8-bit platformer written entirely in MIPS assembly, playable in the browser.",
    "tags": [
      "MIPS assembly",
      "sms32v50",
      "JavaScript"
    ],
    "metrics": [
      {
        "value": "2",
        "label": "jumps (double jump)"
      },
      {
        "value": "3",
        "label": "item pickups"
      }
    ],
    "links": [
      {
        "label": "Play now",
        "href": "/demos/assembly/player.html"
      },
      {
        "label": "Video demo",
        "href": "https://drive.google.com/file/d/12QJi8dmDWqEKQ2wYqBIx1lfLX601aeZ7/view?usp=sharing"
      }
    ],
    "embed": {
      "kind": "iframe",
      "src": "/demos/assembly/player.html",
      "title": "Assembly Platformer, playable",
      "badge": "Playable in your browser",
      "hint": "Click the game, then use A/D to move, W to jump, S to drop."
    },
    "media": [
      {
        "type": "image",
        "src": "/media/assembly-platformer/play.gif",
        "alt": "The assembly platformer being played: the character runs, double jumps between platforms, picks up three items, and clears the level",
        "caption": "Playthrough on the 64 x 64 bitmap display"
      }
    ],
    "featured": true,
    "order": 5,
    "body": "\r\n## Problem\r\n\r\nWrite a complete real-time game with no language runtime: no sprites, no engine, just registers, memory and a bitmap display.\r\n\r\n## Approach\r\n\r\nThe game targets a 64 x 64 memory-mapped display and the keyboard register. It has movement, double jumping, and three item pickups (slow time, higher jump, super speed). Everything, including collision and drawing, is hand-written assembly.\r\n\r\n## Key technical decision\r\n\r\nTo make it playable on the web, I ran the original assembly unchanged: `mips.js` is a small MIPS interpreter that executes the `game_final` source, and `player.html` draws the display to a canvas and feeds key presses into the keyboard registers. There is no port to JavaScript, so what you play is the assembly.\r\n\r\n## Result\r\n\r\nPlayable at the link above. Controls: A/D move, W jump (twice for double jump), S drop, R restart, Q quit. Collect the three items, then jump off the top.\r\n\r\n{/* TODO: lines of assembly, frame rate, and anything notable about collision handling */}\r\n"
  },
  {
    "title": "Light2D: Dispersion in 2D",
    "slug": "light2d",
    "summary": "A 2D light transport simulator in C: mirrors, scatterers and glass lenses, with colour dispersion that splits white light into rainbows.",
    "tags": [
      "C",
      "Optics",
      "Snell's law",
      "Fresnel",
      "Dispersion"
    ],
    "metrics": [
      {
        "value": "12",
        "label": "refracting lenses in the scene"
      },
      {
        "value": "n + 0.5h",
        "label": "dispersion: index shifts with hue h"
      }
    ],
    "links": [],
    "embed": {
      "kind": "light2d",
      "title": "Light2D interactive simulator",
      "badge": "Interactive",
      "hint": "Drag lights and shapes, add or remove them, and resize with the sliders. Rays re-trace live."
    },
    "media": [
      {
        "type": "image",
        "src": "/media/light2d/scene.webp",
        "alt": "Symmetric scene of twelve glass circles lit by a point source at the centre, with rainbow fringes along the refracted beams",
        "caption": "Full scene: 12 glass circles, point light at the centre"
      },
      {
        "type": "image",
        "src": "/media/light2d/dispersion.webp",
        "alt": "Close-up of a beam leaving a lens, split into red, green and blue bands",
        "caption": "Detail: dispersion fringes"
      }
    ],
    "featured": true,
    "order": 6,
    "body": "\r\n## Problem\r\n\r\nSimulate how light moves through a box of objects: it bounces off mirrors, scatters off rough walls, and bends through glass. The starter code (CSC D18, F.J. Estrada) supplied the scene, image and ray-drawing machinery. I wrote the propagation core and then went past the brief.\r\n\r\n## Approach\r\n\r\nRays leave a point source in random directions and are traced recursively. Each step finds the nearest hit among the four walls and the circles (a quadratic solve per circle), draws the segment, then branches by material. Mirrors reflect, scattering surfaces send the ray out in a random direction in the hemisphere around the normal, and glass splits it into a reflected and a transmitted ray whose brightness is shared by the Fresnel term. Each ray is drawn additively, so bright regions come from many rays overlapping.\r\n\r\n## Key technical decision\r\n\r\nDispersion. Every ray is born with a random hue in [0, 1], converted to RGB, and that hue also shifts the glass's refractive index (n + 0.5 &times; hue). Because Snell's law then bends each colour by a slightly different angle, the white light fans out into a spectrum with no extra rendering step. The strength of the effect is a single constant.\r\n\r\n## Result\r\n\r\nA symmetric scene of twelve glass circles produces caustics and rainbow fringes along the refracted beams. The image above is the submitted render.\r\n\r\n{/* TODO: rays, depth and resolution used for the submitted render (it is 1080 x 1080) */}\r\n\r\n## Build it\r\n\r\n```bash\r\ncd light2D_1009319881\r\ngcc -O2 -o light2D light2D.c -lm              # add -fopenmp for multithreading, if available\r\n./light2D 1080 1080 300000 12                 # width height rays max_depth, writes light2D_output.ppm\r\n```\r\n\r\nOutput is a PPM, so convert it to PNG to view it. Each glass hit spawns two child rays, so cost grows quickly with depth: a small run (512 x 512, 3,000 rays, depth 8) takes about 2 seconds single-threaded.\r\n"
  },
  {
    "title": "Songify",
    "slug": "songify",
    "summary": "OpenAI-powered lyrics and album art. 1st place at the AMACSS AI Olympics Hackathon, demoed to 200+ people.",
    "tags": [
      "OpenAI",
      "Hackathon"
    ],
    "metrics": [
      {
        "value": "1st",
        "label": "place, AMACSS AI Olympics"
      },
      {
        "value": "200+",
        "label": "people demoed to"
      }
    ],
    "links": [],
    "media": [],
    "featured": false,
    "order": 7,
    "body": "\r\n{/* TODO: repo/demo link, tech stack, team size. Compact list entry only, no case-study page. */}\r\n"
  }
];

export const projectBodyHtml: Record<string, string> = {
  "robotics-vla": "<h2>Problem</h2>\n<p>A robot policy that only repeats one trained motion is not useful. The goal was a policy that takes a plain-language command and acts on it, plus a way to see what the model attends to while it does.</p>\n<h2>Approach</h2>\n<p>I fine-tuned the action expert of SmolVLA (450M parameters) on demonstrations to follow language commands. To generate demonstrations and evaluate, I wrote a 7-joint arm simulator in MuJoCo with a Gymnasium interface and PyTorch, driven by scripted experts. A React and Three.js app visualizes the model&#39;s attention across all 16 layers.</p>\n<h2>Key technical decision</h2>\n<p>Fine-tune only the action expert rather than the full model. It keeps the pretrained vision-language backbone intact and makes training practical at this scale.</p>\n<h2>Result</h2>\n<p>The fine-tuned policy grasps 9 of 10 times and stacks 5 of 10 times when given a language command. The scripted experts that generate the data reach 87% on bin throws and 90% on peg insertion.</p>\n",
  "rocket-league-analyzer": "<h2>Problem</h2>\n<p>Match telemetry is dense and hard to read by eye. Players want answers to questions about a match, not a spreadsheet.</p>\n<h2>Approach</h2>\n<p>Drop in a Rocket League .replay file and the app prepares its telemetry and opens an interactive 3D simulation. A LangChain agent with tool calling answers natural-language questions (&quot;Why did we concede the third goal?&quot;) by calling functions over that telemetry. The Dockerized dashboard stays synced to playback, with controls for follow-ball, coverage, centroid and pressure overlays.</p>\n<h2>Key technical decision</h2>\n<p>Let the model call typed tools over the telemetry instead of reading it as text, so answers come from computed values.</p>\n<h2>Result</h2>\n<p>A working analyzer: ask a question, get an answer grounded in the match data, and watch the same moment in 3D.</p>\n",
  "maple-market": "<h2>Problem</h2>\n<p>A table of tickers hides the shape of a market. Company size, the past year, and how much you pay for each dollar of profit should be readable at a glance, in plain English, without a trading terminal.</p>\n<h2>Approach</h2>\n<p>Maple Market draws large TSX names as a sky. Bigger planets are bigger companies. Green is a stronger past year, red a weaker one, and distance from the sector sun is the price you pay for each dollar of profit. Search and the sector filters find a name. Clicking a planet opens the ticker, the price, and the past-year change.</p>\n<p>The same names are also a treemap heatmap. Compare lines up to three companies as a report card. Beside that: a practice portfolio, a replay of prices already on record, a dividend reinvestment sketch, a compound-growth band, and a short quiz.</p>\n<p>The public site is labeled demo data. It does not buy or sell anything, and it does not predict where prices go.</p>\n<h2>Key technical decision</h2>\n<p>Put size, past-year colour, and valuation in a React Three Fiber scene instead of columns. The chart pages use Recharts. Zustand holds what is selected.</p>\n<h2>Result</h2>\n<p>The explorer is live at maplemarket.zainrizvi.ca.</p>\n",
  "stickdrift": "<h2>Problem</h2>\n<p>Changes in how someone moves can show up years before a diagnosis, and long-term care staff have little time to notice them. StickDrift was our Hack the Valley 11 entry for PointClickCare&#39;s Catch It Early challenge: make the check feel like a game, not a clinic.</p>\n<h2>Approach</h2>\n<p>A resident logs in with a PS5 controller, walks a Three.js lobby, and plays Apple Picking, Harbour Fishing, or Rat Catching. The Gamepad API reads each stick. A separate measurement layer records reaction time, path error, and tremor, while the resident only sees scores and stars.</p>\n<p>Staff get a live view about a tenth of a second behind, a badge (No concerns, Keep an eye on, or Check soon), and plain-language visit cards. A small PyTorch model scores resemblance to three movement patterns. Gemini answers questions only from that resident&#39;s recorded numbers, and a PDF report is one click away. FastAPI and TimescaleDB are the only thing the two laptops share.</p>\n<p>Built with Bryan Wei, Hreem Pandya, and Ayan Saiyed. StickDrift does not diagnose. It flags a change, and a nurse decides what happens next.</p>\n<h2>Result</h2>\n<p>Residents play three short games. Staff see trends across visits and a clinician report, without the resident ever looking at a health number.</p>\n",
  "assembly-platformer": "<h2>Problem</h2>\n<p>Write a complete real-time game with no language runtime: no sprites, no engine, just registers, memory and a bitmap display.</p>\n<h2>Approach</h2>\n<p>The game targets a 64 x 64 memory-mapped display and the keyboard register. It has movement, double jumping, and three item pickups (slow time, higher jump, super speed). Everything, including collision and drawing, is hand-written assembly.</p>\n<h2>Key technical decision</h2>\n<p>To make it playable on the web, I ran the original assembly unchanged: <code>mips.js</code> is a small MIPS interpreter that executes the <code>game_final</code> source, and <code>player.html</code> draws the display to a canvas and feeds key presses into the keyboard registers. There is no port to JavaScript, so what you play is the assembly.</p>\n<h2>Result</h2>\n<p>Playable at the link above. Controls: A/D move, W jump (twice for double jump), S drop, R restart, Q quit. Collect the three items, then jump off the top.</p>\n",
  "light2d": "<h2>Problem</h2>\n<p>Simulate how light moves through a box of objects: it bounces off mirrors, scatters off rough walls, and bends through glass. The starter code (CSC D18, F.J. Estrada) supplied the scene, image and ray-drawing machinery. I wrote the propagation core and then went past the brief.</p>\n<h2>Approach</h2>\n<p>Rays leave a point source in random directions and are traced recursively. Each step finds the nearest hit among the four walls and the circles (a quadratic solve per circle), draws the segment, then branches by material. Mirrors reflect, scattering surfaces send the ray out in a random direction in the hemisphere around the normal, and glass splits it into a reflected and a transmitted ray whose brightness is shared by the Fresnel term. Each ray is drawn additively, so bright regions come from many rays overlapping.</p>\n<h2>Key technical decision</h2>\n<p>Dispersion. Every ray is born with a random hue in [0, 1], converted to RGB, and that hue also shifts the glass&#39;s refractive index (n + 0.5 &times; hue). Because Snell&#39;s law then bends each colour by a slightly different angle, the white light fans out into a spectrum with no extra rendering step. The strength of the effect is a single constant.</p>\n<h2>Result</h2>\n<p>A symmetric scene of twelve glass circles produces caustics and rainbow fringes along the refracted beams. The image above is the submitted render.</p>\n<h2>Build it</h2>\n<pre><code class=\"language-bash\">cd light2D_1009319881\ngcc -O2 -o light2D light2D.c -lm              # add -fopenmp for multithreading, if available\n./light2D 1080 1080 300000 12                 # width height rays max_depth, writes light2D_output.ppm\n</code></pre>\n<p>Output is a PPM, so convert it to PNG to view it. Each glass hit spawns two child rays, so cost grows quickly with depth: a small run (512 x 512, 3,000 rays, depth 8) takes about 2 seconds single-threaded.</p>\n",
  "songify": ""
};

export const availableProjectMedia = new Set<string>([
  "/media/robotics-vla/demo.gif",
  "/media/robotics-vla/model.webp",
  "/media/rocket-league-analyzer/sim.gif",
  "/media/rocket-league-analyzer/site.png",
  "/media/maple-market/demo.gif",
  "/media/stickdrift/gallery-5.jpg",
  "/media/stickdrift/gallery-2.jpg",
  "/media/stickdrift/card.jpg",
  "/media/assembly-platformer/play.gif",
  "/media/light2d/scene.webp",
  "/media/light2d/dispersion.webp"
]);
