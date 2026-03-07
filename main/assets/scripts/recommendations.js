function giveARecommendation(subject) {
    const {
        studentGrade = 0,
        difficulty,
        studyingHours,
        examSoon,
        priority = 0
    } = subject;

    const diffMap = {
        'so-easy': 1,
        'easy': 2,
        'normal': 3,
        'hard': 4,
        'so-hard': 5
    };

    const hoursMap = {
        'less-than-hour': 0.5,
        '1-hour': 1,
        '2-hours': 2,
        '3-hours': 3,
        '4-hours': 4,
        '5-hours': 5,
        'more-than-5-hours': 6
    };

    const diff = diffMap[difficulty] ?? 3;
    const hours = hoursMap[studyingHours] ?? 0;

    const veryWeak = studentGrade < 50;
    const weak = studentGrade >= 50 && studentGrade < 60;
    const medium = studentGrade >= 60 && studentGrade < 75;
    const good = studentGrade >= 75 && studentGrade < 90;
    const excellent = studentGrade >= 90;

    const isHard = diff >= 4;
    const isVeryHard = diff === 5;
    const isEasy = diff <= 2;

    const isNeglected = hours <= 1;
    const isLowTime = hours > 1 && hours <= 2;
    const isBalancedTime = hours > 2 && hours <= 4;
    const isHighTime = hours > 4;

    let urgencyLevel = 'low';
    let urgencyText = 'Low';

    if (priority >= 78) {
        urgencyLevel = 'critical';
        urgencyText = 'Critical';
    } else if (priority >= 56) {
        urgencyLevel = 'high';
        urgencyText = 'High';
    } else if (priority >= 32) {
        urgencyLevel = 'medium';
        urgencyText = 'Moderate';
    }

    const reasons = [];

    if (examSoon) reasons.push('The exam is approaching');
    if (veryWeak) reasons.push('Your current performance is very low');
    else if (weak) reasons.push('Your current performance is below average');
    else if (medium) reasons.push('Your performance needs noticeable improvement');
    else if (good && !examSoon) reasons.push('Your performance is good but still needs smart reinforcement');

    if (isVeryHard) reasons.push('The subject difficulty is very high');
    else if (isHard) reasons.push('The subject difficulty is high');

    if (isNeglected) reasons.push('Your current study time is insufficient');
    else if (isLowTime) reasons.push('Your current study time is lower than recommended');
    else if (excellent && isHighTime && !examSoon) reasons.push('You may be investing more time than necessary here');

    if (priority >= 70) reasons.push('The calculated priority for this subject is very high');

    let strategy = 'balanced';
    let title = 'Balanced Improvement Plan';
    let focus = 'Your situation requires organized study with gradual improvement without excessive pressure.';

    if (priority >= 78 && examSoon && studentGrade < 75) {
        strategy = 'rescue';
        title = 'Rapid Recovery Plan';
        focus = 'The current objective is to maximize quick score gains by focusing on high-impact topics.';
    } else if (priority >= 72 && veryWeak && isHard) {
        strategy = 'rebuild';
        title = 'Foundation Rebuilding Plan';
        focus = 'The main issue appears to be foundational understanding, so rebuilding core concepts is essential.';
    } else if (priority >= 58 && (isNeglected || isLowTime)) {
        strategy = 'stability';
        title = 'Consistency Recovery Plan';
        focus = 'The primary issue here is lack of consistency, therefore regular study sessions matter more than long ones.';
    } else if (priority >= 45 && medium && isHard) {
        strategy = 'targeted';
        title = 'Targeted Improvement Plan';
        focus = 'Improvement at this stage depends on focusing on your real weak points rather than studying everything equally.';
    } else if (good && examSoon) {
        strategy = 'exam-polish';
        title = 'Final Exam Preparation Plan';
        focus = 'The goal now is to convert your current knowledge into stable exam performance.';
    } else if (excellent && isHighTime && !examSoon) {
        strategy = 'redistribute';
        title = 'Time Redistribution Plan';
        focus = 'You are investing more time here than necessary; some of that time could be redirected to weaker subjects.';
    } else if (excellent) {
        strategy = 'maintenance';
        title = 'Performance Maintenance Plan';
        focus = 'Your level is strong; the goal is to maintain it with minimal but effective effort.';
    } else if (studentGrade < 75 && isEasy) {
        strategy = 'practice';
        title = 'Practice-Focused Improvement Plan';
        focus = 'The main opportunity for improvement here lies in increasing the quantity and quality of practice.';
    }

    const stepBank = {
        rescue: [
            'Study for 40–50 minutes daily with full concentration on the most frequently tested topics.',
            'Solve exam-style questions or short practice sets almost every day, then review only your mistakes.',
            'Maintain a single “mistake sheet” and review it for about 10 minutes at the end of each day.',
            'Start with topics that yield the fastest score improvement.'
        ],
        rebuild: [
            'Begin each session with one concept or rule and apply it immediately through practice.',
            'Work with easier problems first until they become comfortable, then gradually increase the difficulty.',
            'Write a short personal summary after each concept since writing reinforces understanding.',
            'Keep sessions focused and relatively short rather than long and unfocused.'
        ],
        stability: [
            'Maintain a fixed daily study slot of at least 25 minutes regardless of how busy your day is.',
            'Set a single clear objective for each session such as one concept or ten questions.',
            'Review the week’s mistakes once rather than constantly jumping to new topics.',
            'If your energy is low, study less but do not skip the session.'
        ],
        targeted: [
            'Identify the two topics where you lose the most marks and start with them.',
            'Practice medium-level problems frequently since they provide the most effective improvement.',
            'After each session ask: what mistake occurred, why it happened, and how to prevent it.',
            'Avoid spending excessive time on very easy problems that do not raise your level.'
        ],
        'exam-polish': [
            'Solve a full or half practice exam under near-real conditions.',
            'Focus your revision mainly on mistakes and unstable topics.',
            'Prepare a very short summary of key rules or concepts.',
            'The day before the exam, reduce intensity and review only the essentials.'
        ],
        maintenance: [
            'One focused review session per week is usually enough to maintain your level.',
            'Solve two or three challenging problems to keep your thinking sharp.',
            'Avoid allocating extra time unless a real weakness appears.',
            'Redirect additional time toward higher-priority subjects.'
        ],
        redistribute: [
            'Reduce the current study time roughly by half during this period.',
            'Keep sessions here as short reviews or quick practice exercises.',
            'Transfer the saved time to a weaker subject or one with an upcoming exam.',
            'Perform a short weekly check to ensure the level remains stable.'
        ],
        practice: [
            'Increase daily practice volume since application is the key factor here.',
            'Use a variety of problem types rather than repeating the same pattern.',
            'Write down the reason behind each mistake to avoid repeating it.',
            'Divide practice into shorter sessions instead of one exhausting block.'
        ],
        balanced: [
            'Study twice a week with medium-length sessions instead of a single long session.',
            'After reviewing a topic, solve a small set of questions to reinforce it.',
            'Maintain a simple log of repeated mistakes and revisit it weekly.',
            'Keep a healthy balance: avoid both neglect and over-studying.'
        ]
    };

    const steps = [...(stepBank[strategy] || stepBank.balanced)];
    const warnings = [];
    const boosts = [];
    const metrics = [];

    if (examSoon && !steps.some(step => step.includes('exam'))) {
        steps.push('Include exam-style questions in your plan since the current phase requires direct exam preparation.');
    }

    if (isNeglected && !steps.some(step => step.includes('daily'))) {
        steps.push('Consistency is the most important factor right now, even if the session is short.');
    }

    if (isHard && !steps.some(step => step.includes('concept'))) {
        steps.push('For difficult material, always understand the concept first before extensive practice.');
    }

    if (priority >= 78) {
        warnings.push('This subject currently has one of the highest priorities, so avoid postponing it until the end of the day.');
    }

    if (examSoon && priority >= 56) {
        warnings.push('Focus on efficient score gains rather than perfection.');
    }

    if (excellent && !examSoon) {
        boosts.push('Your current level is reassuring, so focus on maintaining it rather than over-studying.');
    }

    if (studentGrade < 60 && !examSoon) {
        boosts.push('Consistent small improvements here will lead to noticeable progress.');
    }

    metrics.push(`Priority Level: ${urgencyText}`);
    metrics.push(`Priority Score: ${priority}`);
    metrics.push(`Difficulty Level: ${diff}/5`);

    const uniqueSteps = [...new Set(steps)].slice(0, 5);
    const uniqueWarnings = [...new Set(warnings)].slice(0, 2);
    const uniqueBoosts = [...new Set(boosts)].slice(0, 2);
    const uniqueMetrics = [...new Set(metrics)].slice(0, 3);

    const reasonsText = reasons.length
        ? `This recommendation is based on: ${reasons.join(', ')}.`
        : 'This recommendation is based on your current performance in this subject.';

    return `
      <div class="rec rec-${strategy} rec-urgency-${urgencyLevel}">
        <div class="rec-top">
          <h4>${title}</h4>
          <span class="rec-badge rec-badge-${urgencyLevel}">${urgencyText}</span>
        </div>

        <p class="rec-focus">${focus}</p>
        <p class="rec-why">${reasonsText}</p>

        <div class="rec-metrics">
          ${uniqueMetrics.map(item => `<span>${item}</span>`).join('')}
        </div>

        <ul class="rec-steps">
          ${uniqueSteps.map(step => `<li>${step}</li>`).join('')}
        </ul>

        ${uniqueWarnings.length ? `
          <div class="rec-warning">
            <strong>Attention</strong>
            <ul>
              ${uniqueWarnings.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${uniqueBoosts.length ? `
          <div class="rec-boost">
            <strong>Positive Note</strong>
            <ul>
              ${uniqueBoosts.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
}