function checkData() {
    const nameChecker = document.getElementById('nameChecker');
    const gradeChecker = document.getElementById('gradeChecker');
    const selectChecker = document.getElementById('selectChecker');
    const hoursChecker = document.getElementById('hoursChecker');

    let isValid = true;

    nameChecker.textContent = '';
    gradeChecker.textContent = '';
    selectChecker.textContent = '';
    hoursChecker.textContent = '';

    const cleanedName = subjectName.value.trim();

    if (!cleanedName) {
        nameChecker.textContent = 'Please fill in the required field.';
        isValid = false;
    }

    if (!studentGrade.value) {
        gradeChecker.textContent = 'Please fill in the required field.';
        isValid = false;
    } else if (
        Number(studentGrade.value.replace(/[٫,]/g, '.')) < 0 ||
        Number(studentGrade.value.replace(/[٫,]/g, '.')) > 100
    ) {
        gradeChecker.textContent = 'The entered value is invalid.';
        isValid = false;
    }

    if (!difficulty.value) {
        selectChecker.textContent = 'Please select the difficulty level of this subject.';
        isValid = false;
    }

    if (!studyingHours.value) {
        hoursChecker.textContent = 'Please select how many hours you study per week.';
        isValid = false;
    }

    const currentName = cleanedName.toLowerCase();
    let sameCount = 0;

    for (let i = 0; i < subjects.length; i++) {
        const { subjectName: savedName } = subjects[i];
        if ((savedName ?? '').trim().toLowerCase() === currentName) sameCount++;
    }

    if (sameCount >= 1) {
        nameChecker.textContent = 'This subject cannot be added more than once.';
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    const nameChecker = document.getElementById('nameChecker');
    const gradeChecker = document.getElementById('gradeChecker');
    const selectChecker = document.getElementById('selectChecker');
    const hoursChecker = document.getElementById('hoursChecker');

    nameChecker.textContent = '';
    gradeChecker.textContent = '';
    selectChecker.textContent = '';
    hoursChecker.textContent = '';
}