// game.js — polished visuals, parallax, particles, start/game-over screens
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: true });

  // logical resolution (scales to device)
  const W = 900, H = 1600;
  let scale = 1;
  function fit() {
    const pw = canvas.parentElement.clientWidth;
    const ph = canvas.parentElement.clientHeight;
    scale = Math.min(pw / W, ph / H);
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener('resize', fit);
  fit();

  // UI elements
  const scoreEl = document.getElementById('score');
  const startScreen = document.getElementById('startScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const finalScoreEl = document.getElementById('finalScore');
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('retryBtn').addEventListener('click', retryGame);

  // state
  let running = false;
  let score = 0;
  let gravity = 1800;
  let speed = 420;
  let last = 0;
  let spawnTimer = 0;
  let bgTimer = 0;

  // player
  const player = {
    x: 140,
    y: H - 320,
    w: 110,
    h: 88,
    vy: 0,
    onGround: true,
    jumping: false,
    diving: false,
    surfTilt: 0,   // tilt for animation
    bob: 0         // bob for idle animation
  };

  // world arrays
  const obstacles = [];   // rocks/buoys
  const coins = [];       // pickups
  const particles = [];   // splashes & pop effects

  // helpers
  function rand(a, b) { return Math.random() * (b - a) + a; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // spawn functions
  function spawnObstacle() {
    const size = rand(60, 150);
    obstacles.push({
      x: W + 80,
      y: H - 260 - (size - 60),
      w: size * 0.95,
      h: size,
      wob: Math.random() * 2 + 0.5,
      passed: false
    });
  }
  function spawnCoin() {
    coins.push({
      x: W + 80,
      y: rand(H - 420, H - 330),
      r: 20,
      angle: 0
    });
  }

  // particles factory
  function makeSplash(x, y, count=10) {
    for (let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: rand(-160,160),
        vy: rand(-600, -120),
        life: rand(0.4, 0.9),
        t: 0,
        size: rand(3,8),
        col: `rgba(255,255,255,${rand(0.6,1)})`,
        type: 'splash'
      });
    }
  }
  function makePop(x, y) {
    particles.push({
      x, y,
      vx: rand(-60,60),
      vy: rand(-140,-40),
      life: 0.7,
      t: 0,
      size: 10,
      col: 'rgba(255,200,60,1)',
      type: 'pop'
    });
  }

  // reset/start
  function reset() {
    score = 0;
    obstacles.length = 0;
    coins.length = 0;
    particles.length = 0;
    player.y = H - 320;
    player.vy = 0;
    player.onGround = true;
    player.diving = false;
    speed = 420;
    spawnTimer = 0.8;
    bgTimer = 0;
    updateScore();
  }

  function updateScore() {
    scoreEl.textContent = Math.floor(score);
    scoreEl.classList.add('pop');
    setTimeout(()=>scoreEl.classList.remove('pop'),140);
  }

  function startGame(){
    startScreen.classList.add('hidden');
    running = true; reset();
    last = performance.now();
    requestAnimationFrame(loop);
  }
  function retryGame(){
    gameOverScreen.classList.add('hidden');
    running = true; reset();
    last = performance.now();
    requestAnimationFrame(loop);
  }

  // input: pointer for mobile + mouse for desktop
  let touchStartY = null;
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!running) return;
    touchStartY = e.clientY;
    // jump logic
    if (player.onGround) {
      player.vy = -860;
      player.onGround = false;
      player.jumping = true;
      makeSplash(player.x + player.w*0.5, H - 240, 6);
    } else {
      // mid-air small boost
      player.vy = Math.min(player.vy, -420);
    }
  }, {passive:false});

  canvas.addEventListener('pointermove', (e) => {
    if (touchStartY === null) return;
    const dy = e.clientY - touchStartY;
    if (dy > 60 && !player.diving && !player.onGround) {
      player.diving = true;
      player.vy = 1300;
      player.diveCooldown = 0.45;
    }
  }, {passive:true});

  canvas.addEventListener('pointerup', () => { touchStartY = null; player.jumping = false; });

  // collision helper
  function overlap(a,b) {
    return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
  }

  // main loop
  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;
    bgTimer += dt * 0.6;

    // difficulty ramp
    speed += dt * 3.2;

    // spawn obstacles & coins
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnObstacle();
      spawnTimer = rand(0.9, 1.6) - clamp(score / 2500, 0, 0.6);
    }
    if (Math.random() < 0.03 + Math.min(score / 20000, 0.05)) spawnCoin();

    // physics
    if (!player.onGround) {
      const holdFactor = player.jumping ? 0.72 : 1.0;
      player.vy += gravity * dt * holdFactor;
      player.y += player.vy * dt;
      player.surfTilt = clamp(player.vy / 1100, -0.8, 0.8);
    } else {
      // idle bobbing on board
      player.bob += dt * 6;
      player.surfTilt = Math.sin(player.bob) * 0.06;
    }

    if (player.diving) {
      player.diveCooldown -= dt;
      if (player.diveCooldown <= 0) player.diving = false;
    }

    const groundY = H - 240 - (player.h - 56);
    if (player.y >= groundY) {
      if (!player.onGround) makeSplash(player.x + player.w*0.5, groundY + player.h*0.9, 12);
      player.y = groundY;
      player.vy = 0;
      player.onGround = true;
    } else player.onGround = false;

    // update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= speed * dt;
      o.y += Math.sin((now/300) + o.wob) * 0.12; // subtle wobble
      if (o.x + o.w < -60) obstacles.splice(i,1);
      else {
        const pbox = { x: player.x + 14, y: player.y + (player.diving ? player.h*0.35 : 0), w: player.w - 28, h: player.h - (player.diving ? player.h*0.35 : 0) };
        const obox = { x: o.x, y: o.y, w: o.w, h: o.h };
        if (overlap(pbox, obox)) {
          // hit -> game over
          running = false;
          finalScoreEl.textContent = 'Score: ' + Math.floor(score);
          gameOverScreen.classList.remove('hidden');
          return;
        }
        if (!o.passed && o.x + o.w < player.x) {
          o.passed = true;
          score += 12;
          updateScore();
        }
      }
    }

    // coins
    for (let i = coins.length - 1; i >= 0; i--) {
      const c = coins[i];
      c.x -= speed * dt;
      c.angle += dt * 6;
      if (c.x + c.r < -60) coins.splice(i,1);
      else {
        const cbox = { x: c.x - c.r/2, y: c.y - c.r/2, w: c.r, h: c.r };
        const pbox = { x: player.x + 14, y: player.y + (player.diving ? player.h*0.35 : 0), w: player.w - 28, h: player.h - (player.diving ? player.h*0.35 : 0) };
        if (overlap(cbox, pbox)) {
          score += 30;
          updateScore();
          makePop(c.x, c.y);
          coins.splice(i,1);
        }
      }
    }

    // particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.t += dt;
      if (p.t >= p.life) { particles.splice(i,1); continue; }
      if (p.type === 'splash') {
        p.vy += 1600 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      } else {
        p.vy += 1200 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }

    draw(now);
    requestAnimationFrame(loop);
  }

  // make a gold pop particle burst
  function makePop(x,y){
    for (let i=0;i<8;i++){
      particles.push({
        x, y,
        vx: rand(-120,120),
        vy: rand(-420,-80),
        life: 0.6 + Math.random()*0.4,
        t: 0,
        size: 8 + Math.random()*6,
        col: `rgba(255,${180+Math.round(Math.random()*40)},0,1)`,
        type: 'pop'
      });
    }
  }

  // draw function — high quality vector art
  function draw(now) {
    ctx.clearRect(0,0,W,H);

    // sky gradient overlay (soft)
    const sky = ctx.createLinearGradient(0,0,0,H*0.8);
    sky.addColorStop(0, 'rgba(255,255,255,0)');
    sky.addColorStop(1, '#1b7be033');
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,W,H);

    // distant sea color block
    const seaTop = H - 240;
    ctx.fillStyle = '#0b66b3';
    ctx.fillRect(0, seaTop, W, H - seaTop);

    // layered procedural waves (sine shapes)
    ctx.globalAlpha = 0.38;
    for (let k=0;k<3;k++){
      ctx.beginPath();
      const amp = 8 + k*6;
      const freq = 0.004 + k*0.002;
      const offset = bgTimer * (0.6 + k*0.3) * 80;
      ctx.moveTo(0, seaTop + 10*k);
      for (let x=0; x<=W; x+=6) {
        const y = seaTop + Math.sin((x*freq*10) + offset*(k+1)) * amp + (k*8);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = k===0 ? '#39a0df' : (k===1 ? '#1e90ff' : '#0f7acb');
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // sun reflection subtle glow on water
    const r = 48;
    const sunX = W - 140 - Math.sin(bgTimer*0.6)*18;
    ctx.save();
    ctx.beginPath();
    const grd = ctx.createRadialGradient(sunX, seaTop - 40, 8, sunX, seaTop + 40, 220);
    grd.addColorStop(0, 'rgba(255,255,200,0.08)');
    grd.addColorStop(1, 'rgba(255,255,200,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(sunX - 260, seaTop - 80, 520, 260);
    ctx.restore();

    // obstacles (textured rocks)
    for (const o of obstacles) {
      ctx.save();
      ctx.translate(o.x + o.w/2, o.y + o.h/2);
      ctx.rotate(Math.sin((now/400)+o.wob)*0.03);
      ctx.translate(-(o.x + o.w/2), -(o.y + o.h/2));
      // rock shadow
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.beginPath();
      ctx.ellipse(o.x + o.w/2, o.y + o.h*0.9, o.w*0.6, o.h*0.28, 0, 0, Math.PI*2);
      ctx.fill();
      // rock body
      const rockGrad = ctx.createLinearGradient(o.x, o.y, o.x, o.y+o.h);
      rockGrad.addColorStop(0, '#6b4a3a');
      rockGrad.addColorStop(1, '#4b3026');
      ctx.fillStyle = rockGrad;
      roundRect(ctx, o.x, o.y, o.w, o.h, 12, true, false);
      // highlight
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(o.x + 6, o.y + 6, Math.min(28, o.w-12), Math.min(18, o.h-14));
      ctx.restore();
    }

    // coins (glowing)
    for (const c of coins) {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      // glow
      const glow = ctx.createRadialGradient(0,0,c.r*0.1, 0,0,c.r*1.4);
      glow.addColorStop(0, 'rgba(255,230,120,0.9)');
      glow.addColorStop(1, 'rgba(255,170,30,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0,0,c.r*1.1,0,Math.PI*2);
      ctx.fill();
      // coin core
      ctx.beginPath();
      ctx.arc(0,0,c.r,0,Math.PI*2);
      ctx.fillStyle = '#ffd36b';
      ctx.fill();
      // inner ring
      ctx.beginPath();
      ctx.arc(0,0,c.r*0.55,0,Math.PI*2);
      ctx.fillStyle = 'rgba(255,220,120,0.8)';
      ctx.fill();
      ctx.restore();
    }

    // surfboard shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(player.x + player.w/2, H - 202, player.w*0.6, 18, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fill();
    ctx.restore();

    // surfer + board with tilt animation
    drawSurfer(player);

    // particles (splashes and pops)
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = clamp(1 - (p.t / p.life), 0, 1);
      if (p.type === 'splash') {
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size*0.9, p.size*0.6, 0, 0, Math.PI*2);
        ctx.fill();
      } else {
        // pop coin particle
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.t / p.life), 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // surfer drawing function (board + simple limbs/head)
  function drawSurfer(p) {
    ctx.save();
    // slight bob for idle
    const bob = Math.sin((performance.now()/400)+p.bob) * (p.onGround ? 2 : 0);
    const tilt = p.surfTilt; // radians small

    ctx.translate(p.x + p.w/2, p.y + p.h/2 + bob);
    ctx.rotate(tilt);

    // board (fancy gradient + stripe)
    ctx.save();
    ctx.translate(-p.w/2, -p.h/2 + 22);
    const grd = ctx.createLinearGradient(0,0,p.w,0);
    grd.addColorStop(0, '#ffd36b');
    grd.addColorStop(0.5, '#ffb84a');
    grd.addColorStop(1, '#ff8a2b');
    ctx.fillStyle = grd;
    roundRect(ctx, 0, 12, p.w, 26, 20, true, false);
    // stripe
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(p.w*0.2, 18, p.w*0.6, 8);
    ctx.restore();

    // body (wetsuit)
    ctx.save();
    ctx.translate(0, -8);
    ctx.fillStyle = '#0e3b66';
    ctx.beginPath();
    ctx.ellipse(6, 8, 16, 22, -0.3, 0, Math.PI*2);
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.fillStyle = '#f7c6b6';
    ctx.arc(-6, -14, 10, 0, Math.PI*2);
    ctx.fill();

    // arm
    ctx.strokeStyle = '#0e3b66';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(18, -2);
    ctx.lineTo(36, 6);
    ctx.stroke();

    // small surf hair (simple)
    ctx.fillStyle = '#0d2b3a';
    ctx.fillRect(-16, -22, 6, 8);

    ctx.restore();

    ctx.restore();
  }

  // rounded rect helper
  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (typeof r === 'undefined') r = 5;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // start with initial reset
  reset();

})();