/*
  Crown Heritage College of Health - Portal Auth Logic
  Handles localStorage session simulation and demo data.
*/

const APP_KEY = 'CHCH_PORTAL_DATA';

const DEMO_USER = {
  id: "CHC/2024/0042",
  password: "student123",
  name: "Adaeze Okonkwo",
  program: "B.Sc. Nursing Science",
  department: "Nursing",
  level: "300",
  cgpa: 4.25,
  email: "adaeze.okonkwo@student.chch.edu.ng",
  phone: "08012345678",
  dob: "2002-03-15",
  gender: "Female",
  state: "Anambra",
  advisor: "Dr. Emmanuel Chukwu",
  enrollmentYear: "2022",
  expectedGraduation: "2027",
  status: "Active",
  avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200'
};

const RESULTS_DATA = {
  "100L_1ST": [
    { code: "GSP 101", title: "Use of English I", units: 2, ca: 24, exam: 58, total: 82, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "MTH 101", title: "General Mathematics I", units: 3, ca: 18, exam: 42, total: 60, grade: "B", gp: 4.0, remark: "Pass" },
    { code: "BIO 101", title: "General Biology I", units: 3, ca: 22, exam: 51, total: 73, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "CHM 101", title: "General Chemistry I", units: 3, ca: 15, exam: 38, total: 53, grade: "C", gp: 3.0, remark: "Pass" },
    { code: "PHY 101", title: "General Physics I", units: 3, ca: 20, exam: 45, total: 65, grade: "B", gp: 4.0, remark: "Pass" },
  ],
  "100L_2ND": [
    { code: "GSP 102", title: "Use of English II", units: 2, ca: 21, exam: 54, total: 75, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "BIO 102", title: "General Biology II", units: 3, ca: 19, exam: 48, total: 67, grade: "B", gp: 4.0, remark: "Pass" },
    { code: "CHM 102", title: "General Chemistry II", units: 3, ca: 23, exam: 52, total: 75, grade: "A", gp: 5.0, remark: "Pass" },
  ],
  "200L_1ST": [
    { code: "ANP 201", title: "Anatomy I", units: 4, ca: 25, exam: 50, total: 75, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "PHS 201", title: "Physiology I", units: 4, ca: 20, exam: 45, total: 65, grade: "B", gp: 4.0, remark: "Pass" },
  ],
  "200L_2ND": [
    { code: "ANP 202", title: "Anatomy II", units: 4, ca: 22, exam: 53, total: 75, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "PHS 202", title: "Physiology II", units: 4, ca: 21, exam: 50, total: 71, grade: "A", gp: 5.0, remark: "Pass" },
  ],
  "300L_1ST": [
    { code: "NSC 301", title: "Medical-Surgical Nursing I", units: 4, ca: 26, exam: 54, total: 80, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "NSC 303", title: "Pharmacology for Nurses", units: 3, ca: 24, exam: 48, total: 72, grade: "A", gp: 5.0, remark: "Pass" },
    { code: "NSC 305", title: "Pathopathology", units: 3, ca: 20, exam: 45, total: 65, grade: "B", gp: 4.0, remark: "Pass" },
  ]
};

const PAYMENT_HISTORY = [
  { id: 1, date: "2024-10-15", desc: "100L 1st Semester Tuition Fee", amount: 150000, method: "Card Payment", ref: "TXN-7738221", status: "Successful" },
  { id: 2, date: "2024-11-20", desc: "Hostel Fee", amount: 85000, method: "Bank Transfer", ref: "TXN-9928112", status: "Successful" },
  { id: 3, date: "2025-01-10", desc: "200L Tuition Fee", amount: 200000, method: "Card Payment", ref: "TXN-1122331", status: "Successful" },
];

function initPortalData() {
  if (!localStorage.getItem(APP_KEY)) {
    const initialData = {
      user: DEMO_USER,
      results: RESULTS_DATA,
      payments: PAYMENT_HISTORY,
      applications: [],
      notifications: [
        { id: 1, title: "Welcome to Portal", date: "2024-10-01", read: false },
        { id: 2, title: "Semester Exam Schedule Out", date: "2025-05-01", read: false }
      ],
      session: null
    };
    localStorage.setItem(APP_KEY, JSON.stringify(initialData));
  }
}

function getPortalData() {
  return JSON.parse(localStorage.getItem(APP_KEY));
}

function updatePortalData(newData) {
  const current = getPortalData();
  const merged = { ...current, ...newData };
  localStorage.setItem(APP_KEY, JSON.stringify(merged));
}

function loginUser(id, password) {
  const data = getPortalData();
  if (id === data.user.id && password === data.user.password) {
    data.session = { id: data.user.id, loginTime: new Date().toISOString() };
    localStorage.setItem(APP_KEY, JSON.stringify(data));
    return true;
  }
  return false;
}

function logoutUser() {
  const data = getPortalData();
  data.session = null;
  localStorage.setItem(APP_KEY, JSON.stringify(data));
}

function checkAuth() {
  const data = getPortalData();
  if (!data.session) {
    window.location.href = '/portal/login.html';
  }
  return data.user;
}

// Global Exports for other scripts
window.portalAuth = {
  init: initPortalData,
  login: loginUser,
  logout: logoutUser,
  checkAuth: checkAuth,
  getData: getPortalData,
  updateData: updatePortalData
};

initPortalData();
