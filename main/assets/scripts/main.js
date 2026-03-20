renderPage();
changeTheme();
updateBtn();
clearSchedule();

output.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete');
    const showBtn = e.target.closest('.show-recommendation');

    if (deleteBtn) {
        const id = Number(deleteBtn.dataset.id);
        const subject = subjects.find(s => s.id === id);
        if (!subject) return;

        const ok = await openConfirm({
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete "${subject.subjectName}"?`,
            okText: 'Delete',
            danger: true
        });

        if (!ok) return;

        subjects = subjects.filter(s => s.id !== id);

        calculatePriority();
        renderPage();
        saveInfo();
        updateBtn();
        if (scheduleVisible) renderSchedule();
        return;
    }

    if (showBtn) {
        const id = Number(showBtn.dataset.id);
        const subject = subjects.find(s => s.id === id);
        if (!subject) return;

        const card = showBtn.closest('.subject-container');
        const recBox = card.querySelector('.recommendations');

        recBox.innerHTML = giveARecommendation(subject);
        recBox.classList.toggle('is-visible');
        return;
    }
});

themeButton.addEventListener('click', () => {
    document.documentElement.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

addSubject.addEventListener('click', () => {
    clearErrors();
    formContainer.classList.add('is-open');
});

reset.addEventListener('click', async () => {
    const ok = await openConfirm({
        title: 'Confirm Deleting All',
        message: 'Are you sure you want to delete all subjects?',
        okText: 'Delete All',
        danger: true
    });

    if (!ok) return;

    subjects = [];
    idCounter = 0;
    renderPage();
    saveInfo();
    updateBtn();
    clearSchedule();
});

formClose.addEventListener('click', () => {
    clearErrors();
    formContainer.classList.remove('is-open');
    form.reset();
});

formContainer.addEventListener('click', (e) => {
    if (e.target === formContainer) {
        clearErrors();
        formContainer.classList.remove('is-open');
        form.reset();
    }
});

studentGrade.addEventListener('input', () => {
    studentGrade.value = studentGrade.value
        .replace(/[٫,]/g, '.')
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1');
});

if (createTable) {
    createTable.addEventListener('click', toggleSchedule);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkData()) return;
    saveData();
    calculatePriority();
    renderPage();
    saveInfo();
    updateBtn();
    if (scheduleVisible) renderSchedule();
    form.reset();
    formContainer.classList.remove('is-open');
});

confirmOk?.addEventListener('click', () => closeConfirm(true));
confirmCancel?.addEventListener('click', () => closeConfirm(false));

confirmModal?.addEventListener('click', (e) => {
    if (e.target === confirmModal) closeConfirm(false);
});

document.addEventListener('keydown', (e) => {
    if (!confirmModal?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeConfirm(false);
});
