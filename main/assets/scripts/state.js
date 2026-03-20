const themeButton = document.getElementById('theme-button'),
      addSubject = document.getElementById('addSubject'),
      formContainer = document.getElementById('formContainer'),
      form = document.getElementById('form'),
      subjectName = document.getElementById('subjectName'),
      studentGrade = document.getElementById('studentGrade'),
      difficulty = document.getElementById('difficulty'),
      studyingHours = document.getElementById('studyingHours'),
      examSoon = document.getElementById('examSoon'),
      addForm = document.getElementById('addForm'),
      reset = document.getElementById('reset'),
      formClose = document.getElementById('formClose'),
      confirmModal = document.getElementById('confirmModal'),
      confirmTitle = document.getElementById('confirmTitle'),
      confirmMsg = document.getElementById('confirmMsg'),
      confirmOk = document.getElementById('confirmOk'),
      confirmCancel = document.getElementById('confirmCancel');

const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');
const getCurrentTheme = () => document.documentElement.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

const createTable = document.getElementById('createTable');
const scheduleBox = document.getElementById('schedule');

const output = document.getElementById('subjects');
const stored = localStorage.getItem('subjects');

let subjects = stored ? JSON.parse(stored) : [];
let idCounter = localStorage.getItem('idCount') ? Number(localStorage.getItem('idCount')) : 0;

let scheduleVisible = false;