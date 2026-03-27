const readlineSync = require('readline-sync');

let balance = 1000.00;

function getBalance() {
  return balance;
}

function credit(amount) {
  if (amount < 0) {
    throw new Error('Invalid credit amount.');
  }
  balance += amount;
  return balance;
}

function debit(amount) {
  if (amount < 0) {
    throw new Error('Invalid debit amount.');
  }
  if (balance >= amount) {
    balance -= amount;
    return balance;
  } else {
    throw new Error('Insufficient funds for this debit.');
  }
}

function resetBalance() {
  balance = 1000.00;
}

function validateChoice(choice) {
  return ['1', '2', '3', '4'].includes(choice);
}

function main() {
  let continueFlag = true;
  while (continueFlag) {
    console.log("--------------------------------");
    console.log("Account Management System");
    console.log("1. View Balance");
    console.log("2. Credit Account");
    console.log("3. Debit Account");
    console.log("4. Exit");
    console.log("--------------------------------");
    const choice = readlineSync.question("Enter your choice (1-4): ");
    switch (choice) {
      case '1':
        console.log(`Current balance: ${getBalance().toFixed(2)}`);
        break;
      case '2':
        const creditAmount = parseFloat(readlineSync.question("Enter credit amount: "));
        credit(creditAmount);
        console.log(`Amount credited. New balance: ${getBalance().toFixed(2)}`);
        break;
      case '3':
        const debitAmount = parseFloat(readlineSync.question("Enter debit amount: "));
        try {
          debit(debitAmount);
          console.log(`Amount debited. New balance: ${getBalance().toFixed(2)}`);
        } catch (e) {
          console.log(e.message);
        }
        break;
      case '4':
        continueFlag = false;
        break;
      default:
        console.log("Invalid choice, please select 1-4.");
    }
  }
  console.log("Exiting the program. Goodbye!");
}

module.exports = { getBalance, credit, debit, resetBalance, validateChoice };

if (require.main === module) {
  main();
}