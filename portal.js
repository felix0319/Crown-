/*
  Crown Heritage College of Health - Portal Interactivity
*/

document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage = window.location.pathname.includes('login.html');
  const isApplyPage = window.location.pathname.includes('apply.html');

  // Skip auth check for login and apply pages
  if (!isLoginPage && !isApplyPage) {
    const user = window.portalAuth.checkAuth();
    populateSidebar(user);
    populateDashboard(user);
    initLogout();
  }

  // 1. Sidebar Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.portal-sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // 2. Multi-step Form (Apply Page)
  if (isApplyPage) {
    initApplyForm();
  }

  // 3. Login Logic
  if (isLoginPage) {
    initLoginForm();
  }

  // 4. Payment Logic
  if (window.location.pathname.includes('payments.html')) {
    initPaymentLogic();
  }

  // 5. Results Logic
  if (window.location.pathname.includes('results.html')) {
    initResultsLogic();
  }

  // 6. Profile Logic
  if (window.location.pathname.includes('profile.html')) {
    initProfileLogic();
  }
});

function populateSidebar(user) {
  const userNameEl = document.querySelector('.user-info h4');
  const userIdEl = document.querySelector('.user-info p');
  const userAvatarEl = document.querySelector('.user-avatar img');
  
  if (userNameEl) userNameEl.innerText = user.name;
  if (userIdEl) userIdEl.innerText = user.id;
  if (userAvatarEl) userAvatarEl.src = user.avatar;
}

function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.portalAuth.logout();
      window.location.href = '/portal/login.html';
    });
  }
}

function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('student-id').value;
      const pass = document.getElementById('password').value;
      const btn = loginForm.querySelector('button');
      
      btn.innerText = 'Verifying...';
      btn.disabled = true;

      setTimeout(() => {
        if (window.portalAuth.login(id, pass)) {
          window.location.href = '/portal/dashboard.html';
        } else {
          alert('Invalid Credentials. Please use demo info.');
          btn.innerText = 'Login';
          btn.disabled = false;
        }
      }, 1000);
    });
  }
}

function initApplyForm() {
  const steps = document.querySelectorAll('.step-tab');
  const sideSteps = document.querySelectorAll('.step-list li');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    sideSteps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      s.classList.toggle('completed', i < index);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        if (currentStep < steps.length) {
          showStep(currentStep);
        } else {
          submitApplication();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  function validateStep(step) {
    const currentTab = steps[step];
    const inputs = currentTab.querySelectorAll('input[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value) {
        valid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });
    return valid;
  }

  function submitApplication() {
    const ref = 'CHCH-2025-' + Math.floor(10000 + Math.random() * 90000);
    const appData = {
      ref,
      date: new Date().toLocaleDateString(),
      status: 'Pending',
      name: document.getElementById('full-name').value
    };
    
    const data = window.portalAuth.getData();
    data.applications.push(appData);
    window.portalAuth.updateData(data);

    document.querySelector('.apply-content').innerHTML = `
      <div class="text-center" style="padding: 50px 0;">
        <div style="font-size: 4rem; color: var(--success); margin-bottom: 20px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="margin-bottom: 10px;">Application Submitted!</h2>
        <p style="margin-bottom: 30px;">Your application has been received and is being processed.</p>
        <div style="background: var(--light-bg); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <small>Reference Number</small>
          <h3 style="color: var(--primary);">${ref}</h3>
        </div>
        <a href="/portal/login.html" class="btn-portal-primary">Print Slip & Exit</a>
      </div>
    `;
  }
}

function initResultsLogic() {
  const filterForm = document.getElementById('results-filter');
  const resultsBody = document.getElementById('results-body');
  const gpaEl = document.getElementById('sem-gpa');
  const cgpaEl = document.getElementById('cum-gpa');

  if (filterForm) {
    filterForm.addEventListener('change', updateResults);
    updateResults(); // Initial load
  }

  function updateResults() {
    const session = document.getElementById('session-select').value;
    const semester = document.getElementById('semester-select').value;
    const key = `${session}_${semester}`;
    const data = window.portalAuth.getData();
    const results = data.results[key] || [];

    if (resultsBody) {
      resultsBody.innerHTML = results.map((r, i) => `
        <tr>
          <td>${i+1}</td>
          <td>${r.code}</td>
          <td>${r.title}</td>
          <td>${r.units}</td>
          <td>${r.ca}</td>
          <td>${r.exam}</td>
          <td>${r.total}</td>
          <td><strong>${r.grade}</strong></td>
          <td>${r.gp.toFixed(2)}</td>
          <td><span class="badge ${r.remark === 'Pass' ? 'badge-success' : 'badge-danger'}">${r.remark}</span></td>
        </tr>
      `).join('');
    }

    // Update Totals
    let totalUnits = 0;
    let totalPoints = 0;
    results.forEach(r => {
      totalUnits += r.units;
      totalPoints += (r.units * r.gp);
    });
    
    const semGPA = results.length > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';
    if (gpaEl) gpaEl.innerText = semGPA;
    if (cgpaEl) cgpaEl.innerText = data.user.cgpa;
  }

  const downloadBtn = document.getElementById('download-pdf');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      alert('Generating PDF... In a real app, this would use jsPDF.');
    });
  }
}

function initPaymentLogic() {
  const payBtn = document.getElementById('confirm-payment');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      const amountEl = document.getElementById('pay-amount');
      const purposeEl = document.getElementById('pay-purpose');
      if (!amountEl || !purposeEl) return;
      
      const amount = amountEl.value;
      const purpose = purposeEl.value;
      
      payBtn.innerText = 'Processing...';
      payBtn.disabled = true;

      setTimeout(() => {
        const data = window.portalAuth.getData();
        const newPayment = {
          id: data.payments.length + 1,
          date: new Date().toISOString().split('T')[0],
          desc: purpose,
          amount: parseFloat(amount),
          method: "Card Payment",
          ref: "TXN-" + Math.floor(Math.random()*10000000),
          status: "Successful"
        };
        data.payments.unshift(newPayment);
        window.portalAuth.updateData(data);
        
        alert('Payment Successful! Receipt generated.');
        location.reload();
      }, 2000);
    });
  }
}

function initProfileLogic() {
  const editBtn = document.getElementById('edit-profile-btn');
  const saveBtn = document.getElementById('save-profile-btn');
  const profileInputs = document.querySelectorAll('.profile-input');

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      profileInputs.forEach(input => input.disabled = false);
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      profileInputs.forEach(input => input.disabled = true);
      editBtn.style.display = 'inline-block';
      saveBtn.style.display = 'none';
      alert('Profile Updated Successfully!');
    });
  }
}

function populateDashboard(user) {
  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl) welcomeEl.innerText = user.name;
}
