document.addEventListener('DOMContentLoaded', () => {
  // ── Theme toggle ────────────────────────────────────────────────────────
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
  }
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light Mode';
  }

  // ── Live clock ──────────────────────────────────────────────────────────
  function updateClock() {
    const now = new Date();
    const str = now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });
    const clock1 = document.getElementById('clock');
    if (clock1) clock1.textContent = '🕐 ' + str;
    const clock2 = document.getElementById('info-clock');
    if (clock2) clock2.textContent = str;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ── Visitor count ───────────────────────────────────────────────────────
  async function updateVisitorCount() {
    const el = document.getElementById('visits');
    if (!el) return;
    try {
      const res = await fetch('/api/visit');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      el.textContent = data.count.toLocaleString();
    } catch {
      el.textContent = '—';
    }
  }
  updateVisitorCount();
});