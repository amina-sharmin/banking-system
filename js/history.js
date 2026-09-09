// history.js
// Renders the full transaction history table with filtering

document.addEventListener("DOMContentLoaded", function () {
  const user = requireLogin();
  if (!user) return;

  renderHistory(user.accountNumber, "all");

  document.getElementById("filterType").addEventListener("change", function () {
    renderHistory(user.accountNumber, this.value);
  });
});

function renderHistory(accountNumber, filter) {
  let txns = getTransactionsForAccount(accountNumber);

  if (filter !== "all") {
    txns = txns.filter(t => t.type === filter);
  }

  const tbody = document.getElementById("historyBody");

  if (txns.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4' class='empty'>No transactions found.</td></tr>";
    return;
  }

  tbody.innerHTML = txns.map(function (t) {
    return "<tr>" +
      "<td>" + t.date + "</td>" +
      "<td><span class='badge badge-" + t.type + "'>" + t.type.replace("-", " ").toUpperCase() + "</span></td>" +
      "<td>" + formatCurrency(t.amount) + (t.note ? " <small>(" + t.note + ")</small>" : "") + "</td>" +
      "<td>" + formatCurrency(t.balanceAfter) + "</td>" +
      "</tr>";
  }).join("");
}
