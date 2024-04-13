'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

////////////////////////////////

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-07-11T23:36:17.929Z',
    '2022-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  
  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-10-05T14:43:26.374Z',
    '2022-10-09T18:49:59.371Z',
    '2022-10-10T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

//////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////////////

let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => {
  console.log(acc,inputLoginUsername.value, "Script loaded and DOM is ready.");
    return acc.username === inputLoginUsername.value;
  });
  //  (currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    labelWelcome.textContent = `Wellcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.classList.remove('hidden');

    // const now = new Date();
    // const Day = `${now.getDate()}`.padStart(2, 0);
    // const Month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const Year = now.getFullYear();
    // const Hour = `${now.getHours()}`.padStart(2, 0);
    // const Minutes = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${Day}/${Month}/${Year}, ${Minutes}:${Hour}`;

    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);
    if(timer) clearInterval(timer)
    timer = timeStarter();
    updateUI(currentAccount);
  }
});
//////////////////////////

const updateUI = currentAccount => {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  totalBalance(currentAccount);
};

////////////////////////////

const timeStarter = function () {
  const Tick = () => {
    const min = Math.trunc(time / 60);
    const sec = time % 60;
    labelTimer.textContent = `${min}:${sec}`;
    if (time == 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.classList.add('hidden');
    }
    time--;
  };
  let time = 300;
  Tick();
  const timer = setInterval(Tick, 1000);
  return timer;
};

///////////////////////////////////////

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  daysPassed;

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesturday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

//////////////////////////////

const formatCur = function (value, locale, currency) {
  value, locale, currency;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

///////////////////////////////////
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  mov.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    formattedMov;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

  // const deposits = movements.filter(mov => mov > 0);
  // const withdrawals = movements.filter(mov => mov < 0);
  //  (deposits);
  //  (withdrawals);
};

////////////////////////////////////

const totalBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur, i, arr) {
    //  (`Iterator ${i}: ${acc} ${arr[i]}`);
    return (acc += cur);
  }, 0);

  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

/////////////////////////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  amount;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //  (receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    receiverAcc.username !== currentAccount.username &&
    currentAccount.balance >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    ('log');
  }
  inputTransferTo.value = inputTransferAmount.value = '';
});

///////////////////////////////////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(acc => acc >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
  }

  inputLoanAmount.value = '';
});

////////////////////////////////////////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  ('ismaksm');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    ('kashi');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //  (accounts);
    accounts.splice(index, 1);
    //  (accounts);
    updateUI(currentAccount);
    containerApp.classList.add('hidden');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// const max = acc.movements.reduce(function (acc, mov) {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, acc.movements[0]);

//  (max);

////////////////////////////////////////////////

// const checkDogs = function (checkJessica, checkMilia) {
//   const jessicaCorrect = checkJessica.slice();
//   jessicaCorrect.shift();
//   jessicaCorrect.splice(-2);
//    (jessicaCorrect);
//   const dogs = jessicaCorrect.concat(checkMilia);
//    (dogs);
//   dogs.forEach(function (dogs) {
//     if (dogs >= 3) {
//        (`dog is adult and age is ${dogs}`);
//     } else {
//        (`dog is still puppy and age is ${dogs}`);
//     }
//   });
// };

// checkDogs([3, 2, 5, 7, 2], [6, 2, 7, 3, 1]);

// /////////////////

// const eurToUsd = 1.1;

// const movToUsd = movements.map(mov => {
//   return mov * eurToUsd;
// });
//  (movements);
// let a = [];
// movToUsd.forEach((items)=> {
//   const x = Math.trunc(items)
//   a.push(x)
// })
//  (a);

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);
accounts;

//////////////////////////////////////////////////

//////////////////////

/////////////////

const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${formatCur(income, acc.locale, acc.currency)}`;

  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${formatCur(
    Math.abs(withdrawal),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => {
      //  (deposit,"jdsakhf");
      return (deposit * acc.interestRate) / 100;
    })
    .filter((int, i, arr) => {
      //  (int>=1);
      return int >= 1;
    })
    .reduce((acc, int) => {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};
