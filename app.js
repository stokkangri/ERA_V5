(() => {
  const mechanisms = window.ATTENTION_MECHANISMS;
  const eras = window.ERAS;

  const timeline = document.getElementById("timeline");
  const detail = document.getElementById("detail");
  const detailInner = document.getElementById("detail-inner");
  const search = document.getElementById("search");
  const countEl = document.getElementById("count");
  const canvas = document.getElementById("bill-canvas");

  let filterEra = "all";
  let query = "";
  let activeId = null;

  function eraColor(era) {
    return (
      {
        exactness: "#0f766e",
        compute: "#1d4ed8",
        memory: "#b45309",
        length: "#0e7490",
      }[era] || "#0f766e"
    );
  }

  function drawHeroBill() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const items = mechanisms;
    const padX = 24;
    const usable = w - padX * 2;
    const yBase = h * 0.55;

    // Axis
    ctx.strokeStyle = "rgba(18,32,46,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, yBase);
    ctx.lineTo(w - padX, yBase);
    ctx.stroke();

    const t0 = new Date(items[0].dateISO).getTime();
    const t1 = new Date(items[items.length - 1].dateISO).getTime();

    items.forEach((m, i) => {
      const t = new Date(m.dateISO).getTime();
      const x = padX + ((t - t0) / (t1 - t0)) * usable;
      const rise = 40 + (i % 5) * 18;
      ctx.strokeStyle = eraColor(m.era);
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(x, yBase);
      ctx.lineTo(x, yBase - rise);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = eraColor(m.era);
      ctx.beginPath();
      ctx.arc(x, yBase - rise, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(18,32,46,0.55)";
    ctx.font = "12px IBM Plex Mono, monospace";
    ctx.fillText("2017", padX, yBase + 22);
    ctx.textAlign = "right";
    ctx.fillText("2025", w - padX, yBase + 22);
    ctx.textAlign = "left";
  }

  function matches(m) {
    if (filterEra !== "all" && m.era !== filterEra) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.short.toLowerCase().includes(q) ||
      m.problem.toLowerCase().includes(q) ||
      m.source.title.toLowerCase().includes(q)
    );
  }

  function vizSVG(m) {
    const c = eraColor(m.era);
    // Tiny schematic per family
    if (m.id === "sdp" || m.id === "flash") {
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">dense QKᵀ (n×n)</text>
        ${Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 6 }, (_, j) => {
            const v = (i + j) % 3 === 0 ? 0.85 : 0.25;
            return `<rect x="${40 + j * 18}" y="${28 + i * 10}" width="16" height="8" fill="${c}" opacity="${v}"/>`;
          }).join("")
        ).join("")}
        <text x="180" y="55" fill="#12202e" font-size="12">→ softmax → V</text>
      </svg>`;
    }
    if (m.id === "mqa" || m.id === "gqa") {
      const groups = m.id === "mqa" ? 1 : 2;
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">${m.id.toUpperCase()} KV sharing</text>
        ${[0, 1, 2, 3].map((i) => `<circle cx="${50 + i * 28}" cy="40" r="10" fill="${c}" opacity="0.85"/><text x="${46 + i * 28}" y="44" font-size="9" fill="#fff">Q</text>`).join("")}
        ${Array.from({ length: groups }, (_, g) => `<rect x="${50 + g * (groups === 1 ? 0 : 56)}" y="62" width="${groups === 1 ? 112 : 48}" height="14" rx="3" fill="${c}" opacity="0.45"/>`).join("")}
        <text x="200" y="48" font-size="12" fill="#12202e">fewer K/V heads</text>
      </svg>`;
    }
    if (m.id === "longformer" || m.id === "sinks") {
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">${m.id === "sinks" ? "sinks + window" : "sliding window"}</text>
        ${Array.from({ length: 14 }, (_, i) => {
          const sink = m.id === "sinks" && i < 2;
          const win = i >= 8;
          const on = sink || win;
          return `<rect x="${20 + i * 18}" y="40" width="14" height="28" fill="${c}" opacity="${on ? 0.9 : 0.15}"/>`;
        }).join("")}
      </svg>`;
    }
    if (m.id === "rope" || m.id === "alibi" || m.id === "sin-pe" || m.id === "abs-pe" || m.id === "ntk" || m.id === "yarn" || m.id === "pi" || m.id === "drope") {
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">position signal</text>
        <path d="M20 60 Q 80 10, 140 60 T 260 60" fill="none" stroke="${c}" stroke-width="2.5"/>
        <circle cx="80" cy="28" r="5" fill="${c}"/>
        <circle cx="200" cy="28" r="5" fill="${c}"/>
        <text x="20" y="82" font-size="11" fill="#3a4a5c">${m.short}</text>
      </svg>`;
    }
    if (m.id === "linear" || m.id === "delta" || m.id === "gated-delta" || m.id === "infini") {
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">recurrent state (O(1) memory)</text>
        <rect x="30" y="35" width="70" height="36" rx="4" fill="${c}" opacity="0.25" stroke="${c}"/>
        <text x="48" y="57" font-size="12" fill="#12202e">state</text>
        <path d="M110 53 H150" stroke="${c}" stroke-width="2" marker-end="url(#arrow)"/>
        <rect x="160" y="35" width="70" height="36" rx="4" fill="${c}" opacity="0.55"/>
        <text x="175" y="57" font-size="12" fill="#fff">update</text>
        <text x="250" y="57" font-size="12" fill="#12202e">→ out</text>
      </svg>`;
    }
    if (m.id === "mla" || m.id === "topk" || m.id === "sparse-transformer") {
      return `<svg viewBox="0 0 320 90" aria-hidden="true">
        <text x="8" y="16" fill="#3a4a5c" font-size="11" font-family="IBM Plex Mono, monospace">compress / sparsify</text>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${24 + i * 20}" y="38" width="16" height="30" fill="${c}" opacity="${i % 3 === 0 ? 0.9 : 0.2}"/>`).join("")}
        <path d="M200 53 H230" stroke="#12202e" stroke-width="2"/>
        <rect x="236" y="42" width="50" height="22" rx="3" fill="${c}"/>
        <text x="244" y="57" font-size="11" fill="#fff">latent</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 320 70"><text x="8" y="40" fill="#3a4a5c" font-size="12">${m.formula}</text></svg>`;
  }

  function openDetail(m) {
    activeId = m.id;
    document.querySelectorAll(".entry").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === m.id);
    });
    detailInner.innerHTML = `
      <div class="detail-head">
        <div>
          <div class="tag">${m.dateLabel} · ${eras[m.era].label}${m.bonus ? " · added beyond lecture list" : ""}${m.correction ? " · date corrected vs course page" : ""}</div>
          <h2>${m.name}</h2>
          <p style="margin:0;color:var(--ink-soft)">${m.short}</p>
        </div>
        <button class="close" type="button" aria-label="Close" id="close-detail">×</button>
      </div>
      <div class="formula">${m.formula}</div>
      <div class="viz">${vizSVG(m)}</div>
      <div class="grid-2">
        <div class="panel"><h4>Problem at the time</h4><p>${m.problem}</p></div>
        <div class="panel"><h4>What it answered</h4><p>${m.answer}</p></div>
        <div class="panel"><h4>Buys</h4><p>${m.buys}</p></div>
        <div class="panel"><h4>Costs</h4><p>${m.costs}</p></div>
      </div>
      <div class="panel" style="margin-top:1rem"><h4>When you would actually pick it</h4><p>${m.pickWhen}</p></div>
      <p class="source"><strong>Source:</strong> <a href="${m.source.url}" target="_blank" rel="noopener">${m.source.title}</a> — ${m.source.authors}. ${m.source.note}</p>
    `;
    detail.classList.add("open");
    detail.querySelector("#close-detail").onclick = closeDetail;
  }

  function closeDetail() {
    activeId = null;
    detail.classList.remove("open");
    document.querySelectorAll(".entry.active").forEach((el) => el.classList.remove("active"));
  }

  function render() {
    const list = mechanisms.filter(matches);
    countEl.textContent = `${list.length} mechanisms`;
    timeline.innerHTML = "";
    list.forEach((m, idx) => {
      const el = document.createElement("article");
      el.className = "entry";
      el.dataset.id = m.id;
      el.dataset.era = m.era;
      el.style.animationDelay = `${Math.min(idx, 12) * 0.03}s`;
      if (m.id === activeId) el.classList.add("active");
      el.innerHTML = `
        <div class="when">${m.dateLabel}</div>
        <div class="dot" aria-hidden="true"></div>
        <div class="entry-body" role="button" tabindex="0">
          <div class="entry-top">
            <h3>${m.name}</h3>
            <span class="tag">${eras[m.era].label}</span>
            ${m.bonus ? '<span class="tag bonus">beyond syllabus</span>' : ""}
            ${m.correction ? '<span class="tag correction">date check</span>' : ""}
          </div>
          <p class="problem-one">${m.problem}</p>
        </div>
      `;
      const body = el.querySelector(".entry-body");
      body.addEventListener("click", () => openDetail(m));
      body.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail(m);
        }
      });
      timeline.appendChild(el);
    });
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      filterEra = chip.dataset.era;
      render();
    });
  });

  search.addEventListener("input", () => {
    query = search.value.trim();
    render();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });

  window.addEventListener("resize", drawHeroBill);

  // stagger hero canvas paint after layout
  requestAnimationFrame(() => {
    drawHeroBill();
    render();
  });
})();
