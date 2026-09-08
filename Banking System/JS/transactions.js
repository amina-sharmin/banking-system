// transactions.js
// Handles deposit, withdraw, and transfer logic

let currentUser = null;

document.addEventListener("DOMContentLoaded", function () {
  currentUser = requireLogin();
  if (!currentUser) return;

  document.getElementById("currentBalance").textContent = formatCurrency(currentUser.balance);
});

// ---------- DEPOSIT ----------

function handleDeposit(event) {
  event.preventDefault();
  const amountInput = document.getElementById("depositAmount");
  const amount = parseFloat(amountInput.value);
  const msgEl = document.getElementById("depositMessage");

  if (isNaN(amount) || amount <= 0) {
    showMessage(msgEl, "Please enter a valid amount greater than 0.", "error");
    return;
  }

  currentUser.balance += amount;
  updateUser(currentUser);

  addTransaction({
    accountNumber: currentUser.accountNumber,
    type: "deposit",
    amount: amount,
    date: formatDate(),
    balanceAfter: currentUser.balance
  });

  showMessage(msgEl, "Deposit successful! New balance: " + formatCurrency(currentUser.balance), "success");
  document.getElementById("currentBalance").textContent = formatCurrency(currentUser.balance);
  amountInput.value = "";
}

// ---------- WITHDRAW ----------

function handleWithdraw(event) {
  event.preventDefault();
  const amountInput = document.getElementById("withdrawAmount");
  const amount = parseFloat(amountInput.value);
  const msgEl = document.getElementById("withdrawMessage");

  if (isNaN(amount) || amount <= 0) {
    showMessage(msgEl, "Please enter a valid amount greater than 0.", "error");
    return;
  }

  if (amount > currentUser.balance) {
    showMessage(msgEl, "Insufficient balance. Current balance: " + formatCurrency(currentUser.balance), "error");
    return;
  }

  currentUser.balance -= amount;
  updateUser(currentUser);

  addTransaction({
    accountNumber: currentUser.accountNumber,
    type: "withdraw",
    amount: amount,
    date: formatDate(),
    balanceAfter: currentUser.balance
  });

  showMessage(msgEl, "Withdrawal successful! New balance: " + formatCurrency(currentUser.balance), "success");
  document.getElementById("currentBalance").textContent = formatCurrency(currentUser.balance);
  amountInput.value = "";
}

// ---------- TRANSFER ----------

function handleTransfer(event) {
  event.preventDefault();
  const targetAccInput = document.getElementById("transferAccount");
  const amountInput = document.getElementById("transferAmount");
  const targetAcc = targetAccInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const msgEl = document.getElementById("transferMessage");

  if (!targetAcc) {
    showMessage(msgEl, "Please enter a recipient account number.", "error");
    return;
  }

  if (targetAcc === currentUser.accountNumber) {
    showMessage(msgEl, "You cannot transfer to your own account.", "error");
    return;
  }

  const recipient = findUserByAccountNumber(targetAcc);
  if (!recipient) {
    showMessage(msgEl, "No account found with that account number.", "error");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    showMessage(msgEl, "Please enter a valid amount greater than 0.", "error");
    return;
  }

  if (amount > currentUser.balance) {
    showMessage(msgEl, "Insufficient balance. Current balance: " + formatCurrency(currentUser.balance), "error");
    return;
  }

  // Update sender
  currentUser.balance -= amount;
  updateUser(currentUser);

  // Update recipient
  recipient.balance += amount;
  updateUser(recipient);

  const now = formatDate();

  addTransaction({
    accountNumber: currentUser.accountNumber,
    type: "transfer-out",
    amount: amount,
    date: now,
    balanceAfter: currentUser.balance,
    note: "To " + recipient.accountNumber
  });

  addTransaction({
    accountNumber: recipient.accountNumber,
    type: "transfer-in",
    amount: amount,
    date: now,
    balanceAfter: recipient.balance,
    note: "From " + currentUser.accountNumber
  });

  showMessage(msgEl, "Transfer successful! New balance: " + formatCurrency(currentUser.balance), "success");
  document.getElementById("currentBalance").textContent = formatCurrency(currentUser.balance);
  targetAccInput.value = "";
  amountInput.value = "";
}

// ---------- HELPER ----------

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = "message " + type;
  el.style.display = "block";
}
