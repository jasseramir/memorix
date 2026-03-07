const addSubject = document.getElementById('addSubject'),
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

const createTable = document.getElementById('createTable');
const scheduleBox = document.getElementById('schedule');

const output = document.getElementById('subjects');
const stored = localStorage.getItem('subjects');

let subjects = stored ? JSON.parse(stored) : [];
let idCounter = localStorage.getItem('idCount') ? Number(localStorage.getItem('idCount')) : 0;

let scheduleVisible = false;