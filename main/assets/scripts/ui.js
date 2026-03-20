function changeTheme() {
    if (selectedTheme) {
        document.documentElement.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
        themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
    }
}

function updateBtn() {
    const count = subjects.length;

    if (createTable) {
        const canCreate = count >= 3;
        createTable.style.display = canCreate ? 'inline-flex' : 'none';

        if (!canCreate) {
            clearSchedule();
        } else {
            syncCreateBtnText();
        }
    }

    if (reset) {
        const canDeleteAll = count > 1;
        reset.style.display = canDeleteAll ? 'inline-flex' : 'none';
    }
}

function syncCreateBtnText() {
    if (!createTable) return;

    if (scheduleVisible) {
        createTable.innerHTML = `<i class="ri-delete-bin-6-line"></i>Delete Schedule`;
    } else {
        createTable.innerHTML = `<i class="ri-calendar-schedule-line"></i>Create Schedule`;
    }
}

function clearSchedule() {
    scheduleVisible = false;

    if (scheduleBox) {
        scheduleBox.classList.remove('is-visible');
        scheduleBox.innerHTML = '';
    }

    syncCreateBtnText();
}

function renderPage() {
    let html = '';

    if (subjects.length === 0) {
        output.innerHTML = `<p class="message-empty">No subjects have been added yet.</p>`;
        return;
    }

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];
        const badge = i === 0 ? `<span class="badge">(Highest Priority)</span>` : '';

        html += `
          <div class="subject-container" data-id="${subject.id}">
            <div class="subject-header">
              <h2 class="subject-name">${subject.subjectName} ${badge}</h2>
              <div class="subject-actions">
                <button class="delete" data-id="${subject.id}">Delete</button>
                <button class="show-recommendation" data-id="${subject.id}">Recommendations</button>
              </div>
            </div>

            <div class="recommendations" data-id="${subject.id}"></div>
          </div>
        `;
    }
    
    output.innerHTML = html;
}

function saveInfo() {
    localStorage.setItem('idCount', idCounter);
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function saveData() {
    subjects.push({
        subjectName: subjectName.value.trim(),
        studentGrade: Number(studentGrade.value.replace(/[٫,]/g, '.')),
        difficulty: difficulty.value,
        studyingHours: studyingHours.value,
        examSoon: examSoon.checked ? true : false,
        id: idCounter
    });

    idCounter++;
}

/* Fancy Confirm Modal */

let _confirmResolver = null;

function closeConfirm(result) {
    if (!confirmModal) return;

    confirmModal.classList.remove('is-open');
    confirmModal.setAttribute('aria-hidden', 'true');

    if (_confirmResolver) _confirmResolver(result);
    _confirmResolver = null;
}

function openConfirm({
    title = 'Confirmation',
    message = 'Are you sure?',
    okText = 'Delete',
    danger = true
} = {}) {
    return new Promise((resolve) => {
        if (!confirmModal) return resolve(false);

        _confirmResolver = resolve;

        if (confirmTitle) confirmTitle.textContent = title;
        if (confirmMsg) confirmMsg.textContent = message;

        if (confirmOk) {
            confirmOk.innerHTML = danger
                ? `<i class="ri-delete-bin-6-line"></i>${okText}`
                : okText;

            confirmOk.classList.toggle('danger', !!danger);
        }

        confirmModal.classList.add('is-open');
        confirmModal.setAttribute('aria-hidden', 'false');

        setTimeout(() => confirmOk?.focus?.(), 0);
    });
}