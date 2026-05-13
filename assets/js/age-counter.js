(() => {
  const els = document.querySelectorAll('.age-counter[data-since]');
  if (!els.length) return;

  const TZ = 'America/Chicago';

  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });

  const partsInTz = (date) => {
    const out = {};
    for (const p of tzFormatter.formatToParts(date)) {
      if (p.type !== 'literal') out[p.type] = parseInt(p.value, 10);
    }
    return out;
  };

  const daysInMonth = (year, monthOneBased) =>
    new Date(year, monthOneBased, 0).getDate();

  const diff = (since, now) => {
    const s = partsInTz(since);
    const n = partsInTz(now);

    let years = n.year - s.year;
    let months = n.month - s.month;
    let days = n.day - s.day;
    let hours = n.hour - s.hour;
    let minutes = n.minute - s.minute;
    let seconds = n.second - s.second;

    if (seconds < 0) { seconds += 60; minutes -= 1; }
    if (minutes < 0) { minutes += 60; hours -= 1; }
    if (hours < 0) { hours += 24; days -= 1; }
    if (days < 0) {
      let prevYear = n.year;
      let prevMonth = n.month - 1;
      if (prevMonth === 0) { prevMonth = 12; prevYear -= 1; }
      days += daysInMonth(prevYear, prevMonth);
      months -= 1;
    }
    if (months < 0) { months += 12; years -= 1; }

    return { years, months, days, hours, minutes, seconds };
  };

  const pad2 = (n) => String(n).padStart(2, '0');
  const compactMq = window.matchMedia('(max-width: 700px)');

  const longUnit = (n, singular) => `${n} ${singular}${n === 1 ? '' : 's'}`;
  const shortUnit = (n, letter) => `${n}${letter}`;

  const render = () => {
    const now = new Date();
    const compact = compactMq.matches;
    els.forEach((el) => {
      const since = new Date(el.dataset.since);
      const d = diff(since, now);
      const mm = pad2(d.minutes);
      const ss = pad2(d.seconds);

      if (compact) {
        el.textContent = [
          shortUnit(d.years, 'y'),
          shortUnit(d.months, 'm'),
          shortUnit(d.days, 'd'),
          shortUnit(d.hours, 'h'),
          shortUnit(mm, 'm'),
          shortUnit(ss, 's'),
        ].join(' ');
      } else {
        el.textContent = [
          longUnit(d.years, 'year'),
          longUnit(d.months, 'month'),
          longUnit(d.days, 'day'),
          longUnit(d.hours, 'hour'),
          longUnit(mm, 'minute'),
          longUnit(ss, 'second'),
        ].join(', ');
      }
    });
  };

  compactMq.addEventListener('change', render);

  render();
  setInterval(render, 1000);
})();
