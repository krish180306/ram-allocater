// ── Container Stats with Chart.js rolling graphs ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const HISTORY_LENGTH = 20;
  const historyMap = {};  // keyed by container fullId
  const chartMap   = {};  // keyed by container fullId → Chart instance

  function getOrInitHistory(id) {
    if (!historyMap[id]) {
      historyMap[id] = { cpu: [], mem: [] };
    }
    return historyMap[id];
  }

  function pushHistory(id, cpu, mem) {
    const h = getOrInitHistory(id);
    h.cpu.push(cpu);
    h.mem.push(mem);
    if (h.cpu.length > HISTORY_LENGTH) h.cpu.shift();
    if (h.mem.length > HISTORY_LENGTH) h.mem.shift();
  }

  function fillClass(pct) {
    if (pct >= 80) return 'fill-danger';
    if (pct >= 50) return 'fill-warning';
    return 'fill-normal';
  }

  function statusClass(s) {
    if (s === 'running') return 'status-running';
    if (s === 'exited')  return 'status-exited';
    return 'status-paused';
  }

  // ── Build or update a Chart.js mini line chart ─────────────────────────────
  function renderChart(canvasId, fullId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const h = getOrInitHistory(fullId);

    if (chartMap[fullId]) {
      chartMap[fullId].data.labels = h.cpu.map((_, i) => i);
      chartMap[fullId].data.datasets[0].data = [...h.cpu];
      chartMap[fullId].data.datasets[1].data = [...h.mem];
      chartMap[fullId].update('none');
      return;
    }

    chartMap[fullId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: h.cpu.map((_, i) => i),
        datasets: [
          {
            label: 'CPU %',
            data: [...h.cpu],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.12)',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mem %',
            data: [...h.mem],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: {
            display: true,
            min: 0,
            max: 100,
            ticks: { font: { size: 9 }, color: '#94a3b8', maxTicksLimit: 4 },
            grid: { color: 'rgba(148,163,184,0.1)' }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: { font: { size: 9 }, color: '#94a3b8', boxWidth: 10, padding: 8 }
          }
        }
      }
    });
  }

  // ── Apply resource limit ──────────────────────────────────────────────────
  window.applyLimit = async function(fullId, shortId) {
    const memInput = document.getElementById(`mem-limit-${shortId}`);
    const cpuInput = document.getElementById(`cpu-limit-${shortId}`);
    const memMB  = parseFloat(memInput?.value) || 0;
    const cpuPct = parseFloat(cpuInput?.value) || 0;

    try {
      const res = await fetch('/api/containers/limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fullId, memMB, cpuPercent: cpuPct })
      });
      const data = await res.json();
      showToast(data.success ? data.message : data.error, data.success ? 'success' : 'error');
    } catch (e) {
      showToast('Failed to apply limits: ' + e.message, 'error');
    }
  };

  // ── Container lifecycle action ────────────────────────────────────────────
  window.containerAction = async function(fullId, action) {
    try {
      const res = await fetch('/api/containers/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fullId, action })
      });
      const data = await res.json();
      showToast(data.success ? `Container ${action}ed ✓` : data.error, data.success ? 'success' : 'error');
      if (data.success) setTimeout(updateContainerStats, 1500);
    } catch (e) {
      showToast('Action failed: ' + e.message, 'error');
    }
  };

  // ── Show container logs ───────────────────────────────────────────────────
  window.showLogs = async function(fullId, name) {
    // Create modal
    const overlay = document.createElement('div');
    overlay.className = 'logs-modal-overlay';
    overlay.id = 'logs-overlay';
    overlay.innerHTML = `
      <div class="logs-modal">
        <div class="logs-modal-header">
          <span>📋 Logs: ${name}</span>
          <button class="btn-close-modal" onclick="document.getElementById('logs-overlay').remove()">✕</button>
        </div>
        <pre id="logs-pre">Loading...</pre>
      </div>`;
    document.body.appendChild(overlay);

    try {
      const res = await fetch(`/api/containers/logs/${fullId}`);
      const data = await res.json();
      document.getElementById('logs-pre').textContent = data.logs || '(no logs)';
    } catch (e) {
      document.getElementById('logs-pre').textContent = 'Failed to load logs.';
    }
  };

  // ── Toast helper ──────────────────────────────────────────────────────────
  function showToast(msg, type = '') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  }

  // ── Main render ───────────────────────────────────────────────────────────
  async function updateContainerStats() {
    const containerCards = document.getElementById('container-cards');
    if (!containerCards) return;

    try {
      const res = await fetch('/api/containers/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      if (!data.containers || data.containers.length === 0) {
        containerCards.innerHTML = '<div class="loader-center">No containers found</div>';
        return;
      }

      // Store which cards already exist so we can update in-place vs rebuild
      const existingIds = new Set([...containerCards.querySelectorAll('.container-card')].map(el => el.dataset.cid));
      const currentIds  = new Set(data.containers.map(c => c.fullId));

      // Remove cards for gone containers
      existingIds.forEach(id => {
        if (!currentIds.has(id)) {
          containerCards.querySelector(`[data-cid="${id}"]`)?.remove();
          delete chartMap[id];
        }
      });

      data.containers.forEach(c => {
        pushHistory(c.fullId, c.cpuPercent, c.memPercent);

        const cpuFill = fillClass(c.cpuPercent);
        const memFill = fillClass(c.memPercent);
        const sClass  = statusClass(c.status);
        const alertBadge = c.memPercent >= 80
          ? `<span class="alert-badge">⚠ High MEM</span>`
          : '';

        const cardHTML = `
          <div class="container-card-header">
            <div>
              <div class="container-name">📦 ${c.name}</div>
              <div class="container-id">ID: ${c.id} · ⏱ ${c.uptime}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
              <span class="status-pill ${sClass}">${c.status}</span>
              ${alertBadge}
            </div>
          </div>

          <div class="stat-row">
            <span class="stat-label">CPU Usage</span>
            <span class="stat-value">${c.cpuPercent}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${cpuFill}" style="width:${Math.min(c.cpuPercent,100)}%"></div></div>

          <div class="stat-row">
            <span class="stat-label">Memory</span>
            <span class="stat-value">${c.memUsage} / ${c.memLimit} MB (${c.memPercent}%)</span>
          </div>
          <div class="progress-bar"><div class="progress-fill ${memFill}" style="width:${Math.min(c.memPercent,100)}%"></div></div>

          <div class="net-io-row">
            <div class="net-io-item">📥 ${c.netIn} KB in</div>
            <div class="net-io-item">📤 ${c.netOut} KB out</div>
            <div class="net-io-item">🔢 PIDs: ${c.pids}</div>
          </div>

          <div class="chart-label">CPU & Memory (last ${HISTORY_LENGTH} polls)</div>
          <div class="chart-wrapper">
            <canvas id="chart-${c.id}" style="width:100%;height:80px;"></canvas>
          </div>

          <div class="limit-controls">
            <h4>⚙ Resource Limits</h4>
            <div class="limit-row">
              <label>RAM (MB)</label>
              <input class="limit-input" id="mem-limit-${c.id}" type="number" min="32" placeholder="e.g. 256">
              <button class="btn-apply" onclick="applyLimit('${c.fullId}','${c.id}')">Apply</button>
            </div>
            <div class="limit-row">
              <label>CPU (%)</label>
              <input class="limit-input" id="cpu-limit-${c.id}" type="number" min="1" max="100" placeholder="e.g. 50">
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-action btn-start"   onclick="containerAction('${c.fullId}','start')">▶ Start</button>
            <button class="btn-action btn-stop"    onclick="containerAction('${c.fullId}','stop')">■ Stop</button>
            <button class="btn-action btn-restart" onclick="containerAction('${c.fullId}','restart')">↺ Restart</button>
            <button class="btn-action btn-logs"    onclick="showLogs('${c.fullId}','${c.name}')">📋 Logs</button>
          </div>`;

        let card = containerCards.querySelector(`[data-cid="${c.fullId}"]`);
        if (!card) {
          card = document.createElement('div');
          card.className = 'container-card';
          card.dataset.cid = c.fullId;
          containerCards.appendChild(card);
        }
        card.innerHTML = cardHTML;

        // Render chart (update if exists, create if not)
        renderChart(`chart-${c.id}`, c.fullId);
      });

    } catch (err) {
      console.error('Container stats error:', err);
      if (!containerCards.querySelector('.container-card')) {
        containerCards.innerHTML = '<div class="loader-center">Error loading container stats — is the API running?</div>';
      }
    }
  }

  updateContainerStats();
  setInterval(updateContainerStats, 3000);
});
