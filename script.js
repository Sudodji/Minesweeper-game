const smile = document.querySelector('.smile');
const field = document.querySelector('.field');
const minutesDozens = document.querySelector('.minutes__dozens');
const minutesUnits = document.querySelector('.minutes__units');
const secondsHundreds = document.querySelector('.seconds__hundreds');
const secondsDozens = document.querySelector('.seconds__dozens');
const secondsUnits = document.querySelector('.seconds__units');

const width = 16;
const height = 16;
const bombsCount = 38;
const cellsCount = width * height;
let closedCount = cellsCount;
let bombs = [...Array(cellsCount).keys()]
.sort(() => Math.random() - 0.5)
.slice(0, bombsCount);
let cells;

let leftMinutes = 40;
let seconds = 0;
let timeoutID, intervalID;
let arrSeconds, arrMinutes;


const refreshTime = () => {
    leftMinutes = 40;
    seconds = 0;
    window.clearInterval(intervalID);
}

const showBombs = () => {
    smile.classList.add('smile-sad');
    for (let i = 0; i < bombs.length; i++) {
        cells[bombs[i]].classList.remove('default');
        cells[bombs[i]].classList.add('bomb');
    }
    field.classList.add('disabled-buttons');
}

const isValid = (row, column) => {
    return row >=0 && row < height && column >= 0 && column < width;
}

const isBomb = (row, column) => {
    if (!isValid(row, column)) return false;
    const index = row * width + column;

    return bombs.includes(index);
}

const getCountMines = (row, column) => {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (isBomb(row + y, column + x)) {
                count++;
            }
        }
    }
    return count;
}

const open = (row, column) => {
    if (!isValid(row, column)) return;
    const index = row * width + column;
    const cell = cells[index];
     
    if (isBomb(row, column)) {
        if (closedCount == 256) {
            alert('Попробуйте еще раз!');
            return;
        }
        refreshTime();
        cell.classList.add('red-bomb');
        showBombs();
        return;
    }

    if (cell.disabled === true) return;

    cell.disabled = true;
    cell.classList.remove('default', 'flag', 'question-mark');

    closedCount--;
    const count = getCountMines(row, column);

    if (count !== 0) {
        cell.classList.add(`cell-${count}`);
        if (closedCount <= bombsCount) {
            refreshTime();
            smile.classList.add('smile-cool');
            field.classList.add('disabled-buttons');
        }
        return;
    } else {
        cell.classList.add('empty-cell');
        if (closedCount <= bombsCount) {
            refreshTime();
            smile.classList.add('smile-cool');
            field.classList.add('disabled-buttons');
            return;
        }
    }

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            open(row + y, column + x);
        }
    }
}



const handleClick =(event) => {
    if (event.target.tagName !== 'BUTTON') {
        return;
    }
    window.clearTimeout(timeoutID);
    smile.classList.remove('smile-scared');
    const index = cells.indexOf(event.target);
    const column = index % width;
    const row = Math.floor(index / width);
    open(row, column);
}

const handleContextMenu = (event) => {
    event.preventDefault();
    const index = cells.indexOf(event.target);
    const cell = cells[index];
    if (cell.classList.contains('default')) {
        cell.classList.remove('default');
        cell.classList.add('flag');
    } else if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.classList.add('question-mark');
    } else if (cell.classList.contains('question-mark')){
        cell.classList.remove('question-mark');
        cell.classList.add('default');
    } else return;
}

field.addEventListener('mousedown', (event) => {
    if (event.button == 2) return;
    timeoutID = window.setTimeout(() => {
        smile.classList.add('smile-scared');
    }, 150)
})

field.addEventListener('mouseout', () => {
    smile.classList.remove('smile-scared');
})

smile.addEventListener('click', () => {
    field.classList.remove('disabled-buttons');
    smile.classList.remove('smile-cool', 'smile-sad');
    refreshTime();
    setBackgroundPosition(0, secondsDozens);
    setBackgroundPosition(0, secondsUnits);
    setBackgroundPosition(4, minutesDozens);
    setBackgroundPosition(0, minutesUnits);
    startGame();
})

field.addEventListener('click', handleClick);
field.addEventListener('contextmenu', handleContextMenu);

const startGame = () => {
    closedCount = cellsCount;
    window.clearTimeout(timeoutID);
    intervalID = window.setInterval(() => {
        seconds++;
        arrMinutes = ("" + leftMinutes).split("").map(Number);
        arrSeconds = ("" + seconds).split("").map(Number);
        if (seconds % 60 == 0) {
            leftMinutes = leftMinutes - 1;
        }
        if (seconds >= 960) {
            seconds = 0;
        }
        if (leftMinutes == 0) {
            refreshTime();
            showBombs();
        }
         showTimer();
    }, 1000)
    
    field.innerHTML = '<button class="cell default"></button>'.repeat(cellsCount);
    cells = [...field.children];
    
    bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, bombsCount);
}

const showTimer = () => {
    if (arrSeconds.length == 1) {
        setBackgroundPosition(arrSeconds[0], secondsUnits);
    } else if (arrSeconds.length == 2) {
        setBackgroundPosition(arrSeconds[0], secondsDozens);
        setBackgroundPosition(arrSeconds[1], secondsUnits);
    } else {
        setBackgroundPosition(arrSeconds[0], secondsHundreds);
        setBackgroundPosition(arrSeconds[1], secondsDozens);
        setBackgroundPosition(arrSeconds[2], secondsUnits);
    }
    
    if (arrMinutes.length == 1) {
        setBackgroundPosition(arrMinutes[0], minutesUnits);
        setBackgroundPosition(0, minutesDozens);
    } else {
        setBackgroundPosition(arrMinutes[0], minutesDozens);
        setBackgroundPosition(arrMinutes[1], minutesUnits);
    }
    
}

const setBackgroundPosition = (number, rank) => {
    switch (number) {
        case 1:
            rank.style.backgroundPosition = '0px 0px';
            break;
        case 2:
            rank.style.backgroundPosition = '-14px 0px';
            break;
        case 3:
            rank.style.backgroundPosition = '-28px 0px';
            break;
        case 4:
            rank.style.backgroundPosition = '-42px 0px';
            break;
        case 5:
            rank.style.backgroundPosition = '-56px 0px';
            break;
        case 6:
            rank.style.backgroundPosition = '-70px 0px';
            break;
        case 7:
            rank.style.backgroundPosition = '-84px 0px';
            break;
        case 8:
            rank.style.backgroundPosition = '-98px 0px';
            break;
        case 9:
            rank.style.backgroundPosition = '-112px 0px';
            break;
        case 0:
            rank.style.backgroundPosition = '-126px 0px';
            break;
    }
    
}

startGame();

