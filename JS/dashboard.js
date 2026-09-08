// dashboard.js
// Handles displaying account info on the dashboard page

document.addEventListener("DOMContentLoaded", function () {
  const user = requireLogin();
  if (!user) return;

  document.getElementById("welcomeName").textContent = user.name;
  document.getElementById("accNumber").textContent = user.accountNumber;
  document.getElementById("accEmail").textContent = user.email;
  document.getElementById("accBalance").textContent = formatCurrency(user.balance);

  // Show 5 most recent transactions on dashboard
  const recentTxns = getTransactionsForAccount(user.accountNumber).slice(0, 5);
  const recentList = document.getElementById("recentTransactions");

  if (recentTxns.length === 0) {
    recentList.innerHTML = "<li class='empty'>No transactions yet.</li>";
  } else {
    recentList.innerHTML = recentTxns.map(function (t) {
      return "<li class='txn-item txn-" + t.type + "'>" +
        "<span class='txn-type'>" + t.type.toUpperCase() + "</span>" +
        "<span class='txn-amount'>" + formatCurrency(t.amount) + "</span>" +
        "<span class='txn-date'>" + t.date + "</span>" +
        "</li>";
    }).join("");
  }
});
