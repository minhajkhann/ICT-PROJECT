let totalIncome = 0;
let totalExpense = 0;
let ExpenseCount = 0;
let ExpensesCost = [];
let ExpensesName = [];

function addIncome() {
    const incomeInput = document.getElementById('incomeInput');
    const transactionList = document.getElementById('transactionList');

    if (incomeInput.value !== '') {
        const incomeAmount = parseFloat(incomeInput.value);
        totalIncome += incomeAmount;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="income">Income: PKR ${incomeAmount.toFixed(2)}</span>
        `;
        transactionList.appendChild(listItem);

        document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);

        incomeInput.value = '';

        updateBalance();
        calculateTaxAndAddToExpense(totalIncome);
    }
}

function calculateTaxAndAddToExpense(income) {
    const shouldAskForTax = confirm("Do you want to calculate tax?");

    if (!shouldAskForTax) {
        return;
    }

    const age = parseInt(prompt("Please enter your age:"), 10);

    if (isNaN(age)) {
        alert("Invalid age. Please enter a valid number.");
        return;
    }

    let taxRate = 0;

    if (age < 60) {
        if (income <= 400000) {
            taxRate = 0;
        } else if (income <= 800000) {
            taxRate = 0.05;
        } else if (income <= 1200000) {
            taxRate = 0.1;
        } else if (income <= 2000000) {
            taxRate = 0.15;
        } else if (income <= 2500000) {
            taxRate = 0.2;
        } else {
            taxRate = 0.25;
        }
    } else if (age >= 60 && age < 75) {
        if (income <= 500000) {
            taxRate = 0;
        } else if (income <= 1000000) {
            taxRate = 0.05;
        } else if (income <= 1500000) {
            taxRate = 0.1;
        } else if (income <= 2500000) {
            taxRate = 0.15;
        } else if (income <= 3000000) {
            taxRate = 0.2;
        } else {
            taxRate = 0.25;
        }
    } else {
        if (income <= 750000) {
            taxRate = 0;
        } else if (income <= 1500000) {
            taxRate = 0.05;
        } else if (income <= 2500000) {
            taxRate = 0.1;
        } else if (income <= 3000000) {
            taxRate = 0.15;
        } else if (income <= 4000000) {
            taxRate = 0.2;
        } else {
            taxRate = 0.25;
        }
    }

    const taxAmount = income * taxRate;

    totalExpense += taxAmount;

    const transactionList = document.getElementById('transactionList');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span class="expense">Tax: PKR ${taxAmount.toFixed(2)}</span>
    `;
    transactionList.appendChild(listItem);

    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);

    updateBalance();
}

function updateBalance(income = totalIncome, expense = totalExpense) {
    const balance = income - expense;
    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = balance.toFixed(2);

    const statusMessage = document.getElementById('statusMessage');
    if (balance < 0) {
        statusMessage.textContent = "You're in debt!";
        statusMessage.style.color = 'red';
    } else if (balance > 0) {
        statusMessage.textContent = "You're saving!";
        statusMessage.style.color = 'green';
    } else {
        statusMessage.textContent = '';
    }
}

function resetTracker() {
    totalIncome = 0;
    totalExpense = 0;
    updateBalance();

    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    document.getElementById('incomeInput').value = '';
    document.getElementById('expenseNameInput').value = '';
    document.getElementById('expenseInput').value = '';
    document.getElementById("totalIncome").innerText = "0.00";
    document.getElementById("totalExpense").innerText = "0.00";
    document.getElementById("balance").innerText = "0.00";

    while (ExpenseCount !== 0) {
        ExpensesCost.pop();
        ExpensesName.pop();
        ExpenseCount--;
    }
}

function addExpense() {
    const expenseNameInput = document.getElementById('expenseNameInput');
    const expenseInput = document.getElementById('expenseInput');
    const transactionList = document.getElementById('transactionList');

    if (expenseInput.value !== '') {
        const expenseName = expenseNameInput.value || 'No Name';
        const expenseAmount = parseFloat(expenseInput.value);
        totalExpense += expenseAmount;
        ExpensesCost.push(expenseAmount);
        ExpensesName.push(expenseName);
        ExpenseCount++;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="expense">${expenseName}: PKR ${expenseAmount.toFixed(2)}</span>
        `;
        transactionList.appendChild(listItem);

        document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);

        expenseNameInput.value = '';
        expenseInput.value = '';

        updateBalance();
    }
}

function generateExcel() {
    const expenseData = getExpenseData();

    if (expenseData.length === 0) {
        alert('No Data to export.');
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(expenseData);

    XLSX.utils.book_append_sheet(wb, ws, 'Expense Sheet');

    XLSX.writeFile(wb, 'expenses.xlsx');
}

function getExpenseData() {
    const data = [];
    let remainingBalance = totalIncome;

    for (let i = 0; i < ExpenseCount; i++) {
        const expense = {
            'Expense Name': ExpensesName[i],
            'Expense Cost': ExpensesCost[i].toFixed(2),
            'Balance Before Expense': remainingBalance.toFixed(2),
            'Remaining Balance': (remainingBalance -= ExpensesCost[i]).toFixed(2),
        };
        data.push(expense);
    }

    return data;
}
