function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeName(name) {
  return (name ?? "").trim();
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function aggregateSubjects(items) {
  const map = new Map();

  for (const s of items) {
    const displayName = normalizeName(s.subjectName);
    if (!displayName) continue;

    const key = displayName.toLowerCase();
    const p = Number.isFinite(s.priority) ? s.priority : 0;
    const soon = !!s.examSoon;

    if (!map.has(key)) {
      map.set(key, { key, name: displayName, priority: p, examSoon: soon });
    } else {
      const cur = map.get(key);
      cur.priority = Math.max(cur.priority, p);
      cur.examSoon = cur.examSoon || soon;
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    if (b.examSoon !== a.examSoon) return b.examSoon - a.examSoon;
    return a.name.localeCompare(b.name, "en");
  });
}

function allocateSessionsFixedCap(subjects, totalSlots) {
  const n = subjects.length;
  if (n === 0) return [];
  if (totalSlots <= 0) return subjects.map((s) => ({ ...s, sessions: 0 }));

  const maxPerSubject = 3;

  const base = subjects.map((s) => ({ ...s, sessions: 1 }));
  let remainingSlots = totalSlots - n;

  if (remainingSlots <= 0) return base;

  let idx = 0;
  let safety = 0;
  const len = base.length;

  while (remainingSlots > 0 && safety < 20000) {
    safety += 1;

    const s = base[idx % len];
    idx += 1;

    if (s.sessions >= maxPerSubject) continue;

    s.sessions += 1;
    remainingSlots -= 1;

    if (base.every((x) => x.sessions >= maxPerSubject)) break;
  }

  return base;
}

function pickRandomOrganized(pool, dayKeySet, recentKeys) {
  const candidates = pool.filter((s) => s.remaining > 0 && !dayKeySet.has(s.key));
  if (!candidates.length) return null;

  const notRecent = candidates.filter((s) => !recentKeys.includes(s.key));
  const list = notRecent.length ? notRecent : candidates;

  list.sort((a, b) => {
    const sa =
      a.remaining * 1000 +
      a.priority * 20 +
      (a.examSoon ? 50 : 0) +
      Math.random() * 30;

    const sb =
      b.remaining * 1000 +
      b.priority * 20 +
      (b.examSoon ? 50 : 0) +
      Math.random() * 30;

    return sb - sa;
  });

  const topK = Math.min(3, list.length);
  return list[(Math.random() * topK) | 0] || null;
}

function placeMustAppear(schedule, poolMap, key, dayIndex) {
  if (!key || !schedule[dayIndex]) return;

  const day = schedule[dayIndex];
  if (day.keys.has(key)) return;

  const s = poolMap.get(key);
  if (!s || s.remaining <= 0) return;

  if (day.subjects.length >= day.capacity) return;

  day.subjects.push(s.name);
  day.keys.add(s.key);
  s.remaining -= 1;
  s.used += 1;
  day.placed += 1;
}

function decidePlan(uniqueCount) {
  const many = uniqueCount > 10;

  const daysCount = many ? (5 + 2) : (4 + 2);
  const perDay = many ? (2 + 2) : (1 + 2);

  return { daysCount, perDay };
}

function buildSchedule(items, daysCount, perDay) {
  const allDays = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const aggr = aggregateSubjects(items);
  if (aggr.length === 0) return [];

  const maxPerSubject = 3;

  const maxPossibleSlots = aggr.length * maxPerSubject;
  const wantedSlots = perDay * daysCount;
  const totalSlots = Math.min(wantedSlots, maxPossibleSlots);

  const withSessions = allocateSessionsFixedCap(aggr, totalSlots).map((s) => ({
    ...s,
    remaining: s.sessions,
    used: 0,
  }));

  const poolMap = new Map(withSessions.map((s) => [s.key, s]));

  const days = allDays.slice(0, clamp(daysCount, 1, allDays.length));
  const schedule = days.map((day) => ({
    day,
    subjects: [],
    keys: new Set(),
    capacity: perDay,
    placed: 0,
  }));

  const top1 = aggr[0]?.key;
  const top2 = aggr[1]?.key;

  placeMustAppear(schedule, poolMap, top1, 0);
  placeMustAppear(schedule, poolMap, top2, 1);

  const recentKeys = [];
  let placedTotal = schedule.reduce((sum, d) => sum + d.placed, 0);

  for (let di = 0; di < schedule.length; di++) {
    const dayObj = schedule[di];

    while (dayObj.subjects.length < dayObj.capacity && placedTotal < totalSlots) {
      const pick = pickRandomOrganized(withSessions, dayObj.keys, recentKeys);
      if (!pick) break;

      dayObj.subjects.push(pick.name);
      dayObj.keys.add(pick.key);

      pick.remaining -= 1;
      pick.used += 1;

      dayObj.placed += 1;
      placedTotal += 1;

      recentKeys.push(pick.key);
      if (recentKeys.length > 3) recentKeys.shift();
    }
  }

  for (const d of schedule) {
    shuffleInPlace(d.subjects);
  }

  const t1Name = aggr[0]?.name;
  const t2Name = aggr[1]?.name;

  if (t1Name && schedule[0] && !schedule[0].subjects.includes(t1Name) && schedule[0].subjects.length) {
    schedule[0].subjects[(Math.random() * schedule[0].subjects.length) | 0] = t1Name;
    shuffleInPlace(schedule[0].subjects);
  }

  if (t2Name && schedule[1] && !schedule[1].subjects.includes(t2Name) && schedule[1].subjects.length) {
    schedule[1].subjects[(Math.random() * schedule[1].subjects.length) | 0] = t2Name;
    shuffleInPlace(schedule[1].subjects);
  }

  return schedule.map((d) => ({ day: d.day, subjects: d.subjects })).filter((d) => d.subjects.length > 0);
}

function renderSchedule() {
  if (!scheduleBox) return;

  if (subjects.length < 3) {
    clearSchedule();
    return;
  }

  const uniqueCount = aggregateSubjects(subjects).length;
  const { daysCount, perDay } = decidePlan(uniqueCount);

  const schedule = buildSchedule(subjects, daysCount, perDay);

  if (!schedule.length) {
    clearSchedule();
    return;
  }

  scheduleBox.innerHTML = `
    <div class="schedule-header">
      <div class="schedule-title"><i class="ri-calendar-2-line"></i>Study Schedule</div>
    </div>

    <table class="schedule-table">
      <tbody>
        ${schedule
          .map(
            (d) => `
          <tr>
            <th>${d.day}</th>
            <td>
              <ul class="day-list">
                ${d.subjects.map((n) => `<li>${n}</li>`).join("")}
              </ul>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  scheduleBox.classList.add("is-visible");
  scheduleVisible = true;
  syncCreateBtnText();
}

function toggleSchedule() {
  if (!createTable) return;

  if (subjects.length < 3) {
    clearSchedule();
    updateCreateBtn?.();
    return;
  }

  if (scheduleVisible) {
    clearSchedule();
    return;
  }

  calculatePriority();
  renderSchedule();
}