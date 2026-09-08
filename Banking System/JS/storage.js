// storage.js
// Helper functions to manage users and transactions in localStorage

const USERS_KEY = "bank_users";
const TXN_KEY = "bank_transactions";
const SESSION_KEY = "bank_session";

// ---------- USERS ----------

function getUsers() {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserByAccountNumber(accNum) {
  return getUsers().find(u => u.accountNumber === accNum);
}

function generateAccountNumber() {
  // Generates a random 10-digit account number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.accountNumber === updatedUser.accountNumber);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
}

// ---------- SESSION ----------

function setSession(accountNumber) {
  localStorage.setItem(SESSION_KEY, accountNumber);
}

function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const accNum = getSession();
  if (!accNum) return null;
  return findUserByAccountNumber(accNum);
}

// ---------- TRANSACTIONS ----------

function getTransactions() {
  const data = localStorage.getItem(TXN_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTransactions(transactions) {
  localStorage.setItem(TXN_KEY, JSON.stringify(transactions));
}

function addTransaction(txn) {
  const transactions = getTransactions();
  transactions.push(txn);
  saveTransactions(transactions);
}

function getTransactionsForAccount(accNum) {
  return getTransactions()
    .filter(t => t.accountNumber === accNum)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function formatDate() {
  const now = new Date();
  return now.toLocaleString();
}

function formatCurrency(amount) {
  return "$" + Number(amount).toFixed(2);
}
