function calculatePriority() {
    const diffMap = {
        'so-easy': 0,
        'easy': 4,
        'normal': 9,
        'hard': 15,
        'so-hard': 22
    };

    const hoursMap = {
        'less-than-hour': 22,
        '1-hour': 17,
        '2-hours': 12,
        '3-hours': 7,
        '4-hours': 3,
        '5-hours': 0,
        'more-than-5-hours': -6
    };

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const {
            studentGrade = 0,
            difficulty,
            studyingHours,
            examSoon
        } = subject;

        let priority = 0;

        if (studentGrade >= 95) priority += 0;
        else if (studentGrade >= 90) priority += 4;
        else if (studentGrade >= 85) priority += 8;
        else if (studentGrade >= 75) priority += 14;
        else if (studentGrade >= 65) priority += 22;
        else if (studentGrade >= 50) priority += 32;
        else priority += 45;

        priority += diffMap[difficulty] ?? 9;
        priority += hoursMap[studyingHours] ?? 0;

        if (examSoon) priority += 18;

        if (studentGrade < 50 && difficulty === 'so-hard') priority += 18;
        if (studentGrade < 50 && difficulty === 'hard') priority += 10;
        if (studentGrade < 55 && (studyingHours === 'less-than-hour' || studyingHours === '1-hour')) priority += 10;

        if (studentGrade >= 85 && difficulty === 'so-easy') priority -= 8;
        if (studentGrade >= 90 && studyingHours === 'more-than-5-hours' && !examSoon) priority -= 12;
        if (studentGrade >= 80 && difficulty === 'so-hard') priority -= 6;

        priority = Math.max(0, Math.round(priority));
        subject.priority = priority;
    }

    subjects.sort((a, b) => b.priority - a.priority);
}