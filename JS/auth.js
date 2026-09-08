// auth.js
// Handles login and registration logic

// ---------- REGISTER ----------

function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const initialDeposit = parseFloat(document.getElementById("regInitialDeposit").value);

  const errorEl = document.getElementById("regError");
  errorEl.textContent = "";

  // Validation
  if (!name || !email || !password || !confirmPassword || isNaN(initialDeposit)) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }

  if (password.length < 4) {
    errorEl.textContent = "Password must be at least 4 characters.";
    return;
  }

  if (password !== confirmPassword) {
    errorEl.textContent = "Passwords do not match.";
    return;
  }

  if (initialDeposit < 0) {
    errorEl.textContent = "Initial deposit cannot be negative.";
    return;
  }

  if (findUserByEmail(email)) {
    errorEl.textContent = "An account with this email already exists.";
    return;
  }

  // Create new user
  const newUser = {
    accountNumber: generateAccountNumber(),
    name: name,
    email: email,
    password: password, // Note: plain text for learning purposes only!
    balance: initialDeposit
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  // Log initial deposit as a transaction if greater than 0
  if (initialDeposit > 0) {
    addTransaction({
      accountNumber: newUser.accountNumber,
      type: "deposit",
      amount: initialDeposit,
      date: formatDate(),
      balanceAfter: initialDeposit
    });
  }

  alert("Account created successfully! Your account number is " + newUser.accountNumber + "\nPlease save this for login/transfers.");
  window.location.href = "index.html";
}

// ---------- LOGIN ----------

function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errorEl = document.getElementById("loginError");
  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Please enter email and password.";
    return;
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    errorEl.textContent = "Invalid email or password.";
    return;
  }

  setSession(user.accountNumber);
  window.location.href = "dashboard.html";
}

// ---------- LOGOUT ----------

function handleLogout() {
  clearSession();
  window.location.href = "index.html";
}

// ---------- PAGE PROTECTION ----------
// Call this at the top of any page that requires login

function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
  return user;
}
