import React, { useEffect, useMemo, useRef } from 'react';

function createElement(tagName, className) {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  return el;
}

export default function Intro() {
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const containerRef = useRef(null);

  const config = useMemo(() => ({ cols: 8, rows: 5 }), []);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    if (!container || !stage || !grid) return;

    let rafId = 0;
    let cleanupFns = [];

    async function init() {
      document.documentElement.style.setProperty('--cols', String(config.cols));
      document.documentElement.style.setProperty('--rows', String(config.rows));

      const total = config.cols * config.rows;
      // Fetch popular anime covers
      const query = `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji english }
              coverImage { large }
            }
          }
        }
      `;
      const variables = { page: 1, perPage: total };
      let covers = [];
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables }),
        });
        const { data } = await response.json();
        covers = (data?.Page?.media || []).map(m => ({
          id: m.id,
          title: m.title?.english || m.title?.romaji || 'Unknown',
          img: m.coverImage?.large,
        }));
      } catch (e) {
        // fallback to empty; gradients will be used
        covers = [];
        // eslint-disable-next-line no-console
        console.error('Intro cover fetch failed', e);
      }

      const palettes = [
        ['#0f172a', '#512da8'],
        ['#0b1221', '#d32f2f'],
        ['#06121a', '#00695c'],
        ['#1a0f2c', '#ff9800'],
        ['#031028', '#7c4dff'],
      ];

      const cells = [];
      let idx = 0;
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          const cell = createElement('div', 'cell');
          const face = createElement('div', 'face');
          const cover = covers[idx];
          if (cover?.img) {
            face.style.background = `url(${cover.img}) center / cover no-repeat`;
          } else {
            const palette = palettes[(r * c + c + r) % palettes.length];
            face.style.background = `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`;
          }

          const label = createElement('div', 'label');
          label.textContent = cover?.title || `Room ${r + 1}-${c + 1}`;

          const door = createElement('div', 'door');

          face.appendChild(label);
          face.appendChild(door);
          cell.appendChild(face);
          grid.appendChild(cell);

          const onFaceClick = (e) => {
            e.stopPropagation();
            door.classList.toggle('open');
          };
          face.addEventListener('click', onFaceClick);
          cleanupFns.push(() => face.removeEventListener('click', onFaceClick));

          cells.push({ el: cell, face, door, row: r, col: c });
          idx++;
        }
      }

      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const onMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      const onTouch = (e) => { if (e.touches && e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } };
      window.addEventListener('mousemove', onMouse, { passive: true });
      window.addEventListener('touchmove', onTouch, { passive: true });
      cleanupFns.push(() => window.removeEventListener('mousemove', onMouse));
      cleanupFns.push(() => window.removeEventListener('touchmove', onTouch));

      let t0 = performance.now();
      const seed = Math.random() * 9999;
      const speed = 0.0006;

      function anim(now) {
        const time = now - t0;
        const mx = (mouse.x - window.innerWidth / 2) / window.innerWidth;
        const my = (mouse.y - window.innerHeight / 2) / window.innerHeight;

        for (let i = 0; i < cells.length; i++) {
          const c = cells[i];
          const col = c.col;
          const row = c.row;
          const phase = Math.sin(time * speed + row * 0.9 + col * 0.7 + seed);
          const depth = Math.cos(time * speed * 1.1 + row * 0.6 - col * 0.5 + seed);
          const tx = (col - config.cols / 2) * 36 + phase * 44 + mx * 120;
          const ty = (row - config.rows / 2) * 36 + depth * 48 + my * 120 - ((time * 0.008) % 200);
          const tz = (row + col) * -28 + phase * 100;
          const rx = phase * 12 + my * 6;
          const ry = depth * 24 + mx * 6;
          c.el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }

        stage.style.transform = `rotateX(${6 + Math.sin(time * 0.0002) * 4}deg) rotateY(${Math.sin(time * 0.00013) * 12}deg) translateZ(${Math.sin(time * 0.0006) * 40}px)`;
        rafId = requestAnimationFrame(anim);
      }
      rafId = requestAnimationFrame(anim);

      const onStageClick = () => { t0 = performance.now(); };
      stage.addEventListener('click', onStageClick);
      cleanupFns.push(() => stage.removeEventListener('click', onStageClick));

      return { cells };
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      cleanupFns.forEach((fn) => {
        try { fn(); } catch (_) { /* noop */ }
      });
      if (grid) grid.innerHTML = '';
    };
  }, [config.cols, config.rows]);

  const handleEnter = () => {
    sessionStorage.setItem('introSeen', '1');
    // navigation handled by route change via link or parent; here we just redirect
    window.location.assign('/home');
  };

  return (
    <div ref={containerRef} className="intro-root">
      <div className="hud">
        <div className="title">Otaku Vault</div>
        <div className="subtitle">press enter to descend</div>
        <button className="enter" id="enterBtn" onClick={handleEnter}>
          Enter the Vault
        </button>
      </div>
      <div className="stage" id="stage" ref={stageRef}>
        <div className="grid" id="grid" ref={gridRef} aria-hidden="false" />
      </div>
      <div className="hint">Explore the world of anime</div>
    </div>
  );
}


