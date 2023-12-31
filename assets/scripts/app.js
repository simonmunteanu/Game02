const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PlAYER_ATTACK = "PlAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "LOG_EVENT_MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = parseInt(
  prompt("Maximum life for you and the mosnter.", "100")
);

let chosenMaxLife = enteredValue;
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife); //impact health bard;

function writeToLog(event, value, monsterHealth, playerHealth) {
  //   let logEntry;
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (event) {
    case LOG_EVENT_PlAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: event,
        value: value,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }

    // if (event === LOG_EVENT_PlAYER_ATTACK) {
    //   logEntry = {
    //     event: event,
    //     value: value,
    //     target: "MONSTER",
    //     finalMonsterHealth: monsterHealth,
    //     finalPlayerHealth: playerHealth,
    //   };
    // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //   logEntry = {
    //     event: event,
    //     value: value,
    //     target: "MONSTER",
    //     finalMonsterHealth: monsterHealth,
    //     finalPlayerHealth: playerHealth,
    //   };
    // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    //   logEntry = {
    //     event: event,
    //     value: value,
    //     target: "PLAYER",
    //     finalMonsterHealth: monsterHealth,
    //     finalPlayerHealth: playerHealth,
    //   };
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //   logEntry = {
    //     event: event,
    //     value: value,
    //     target: "PLAYER",
    //     finalMonsterHealth: monsterHealth,
    //     finalPlayerHealth: playerHealth,
    //   };
    // } else if (event === LOG_EVENT_GAME_OVER) {
    //   logEntry = {
    //     event: event,
    //     value: value,
    //     finalMonsterHealth: monsterHealth,
    //     finalPlayerHealth: playerHealth,
    //   };
    // }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initailPlayerLife = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initailPlayerLife;
    alert("You would be dead but the bonus life saved you!");
    setPlayerHealth(initailPlayerLife);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PlAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  //   if (mode === MODE_ATTACK) {
  //     maxDamage = ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PlAYER_ATTACK;
  //   } else if (mode === MODE_STRONG_ATTACK) {
  //     maxDamage = STRONG_ATTACK_VALUE;
  //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  //   }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster("ATTACK");
}

function strongAttackHandler() {
  attackMonster("STRONG_ATTACK");
}

function healPlayerHanler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can`t heal to more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(HEAL_VALUE);
  currentPlayerHealth += HEAL_VALUE;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHanler);
logBtn.addEventListener("click", printLogHandler);


// const ATTACK_VALUE = 10;
// const STRONG_ATTACK_VALUE = 17;
// const MONSTER_ATTACK_VALUE = 14;

// let chosenMaxLife = 100;
// let currentMonsterHealth = chosenMaxLife;
// let currentPlayerHealth = chosenMaxLife;

// adjustHealthBars(chosenMaxLife); //impact health bard;

// function attackHandler() {
//   const damage = dealMonsterDamage(ATTACK_VALUE);
//   currentMonsterHealth -= damage;
//   const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
//   currentPlayerHealth -= playerDamage;
//   if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
//     alert("You Won!");
//   } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
//     alert("You lost!");
//   } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
//     alert("Draw!");
//   }
// }

// function strongAttackHandler() {
//  const damage = dealMonsterDamage(ATTACK_VALUE);
//   currentMonsterHealth -= damage;
//   const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
//   currentPlayerHealth -= playerDamage;
//   if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
//     alert("You Won!");
//   } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
//     alert("You lost!");
//   } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
//     alert("Draw!");
//   }
// }

// attackBtn.addEventListener("click", attackHandler);
// strongAttackBtn.addEventListener('click', strongAttackHandler)
