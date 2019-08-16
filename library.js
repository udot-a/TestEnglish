// npm install -g json-server
// json-server --watch db.json
// http://localhost:3000/users?_sort=id&_order=desc

let onePoint = {
    name: '',
    qtyWords: 0
}
// Вывод мигающей строки с заданными параметрами
let blinkStrP = function (str,tagId, timeP, fontS, color) {
    let count = 0;
    let pause = document.getElementById(tagId);
    pause.style.fontSize = fontS;
    pause.style.color = color;
    pause.innerText = '';
    pause.style.fontWeight = '700';
    let timerSec = setInterval(function () {
        if (count % 2 != 0) pause.innerText = '';
        else pause.innerHTML = str;
        if (count == timeP) { clearInterval(timerSec); pause.innerText = ''; }
        count++;
    }, 300);
}
// Генерация случ.числа в диапазоне
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}
// Генерация массива случ.чисел в диапазоне от 0 до number
function randomArray(number) {
    let result = [randomInteger(0, number - 1)];
    let val = 0;
    for (let i = 1; i < number; i++) {
        do {
            val = randomInteger(0, number - 1);
            if (!result.some(function (n) { return n === val })) {
                result.push(val);
                val = -1;
            }
        } while (val != -1);
    }
    return result;
}
// Сортировка массива обектов по ключу
function sortObj(arr, attrib) {
    return arr.sort(function (a, b) {
        return b[attrib] - a[attrib];
    })
}

// Сравнение строк
let strMatch = function (str, sample) {
    let regexp = new RegExp(str, 'i');
    if (sample.match(regexp) != null && str != '') return true;
    return false;
};
// Печать таблицы с результатами
function printTable(sortItem, sortDirect) {
    fetch(`http://localhost:3000/tableWin?_sort=${sortItem}&_order=${sortDirect}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let table = document.getElementById('table');
            let i = 0;
            for (i = 0; i < data.length; i++) {
                let str = document.createElement('tr');
                str.className = 'del';
                table.appendChild(str);
                for (let j = 0; j < 4; j++) {
                    let col = document.createElement('td');
                    switch (j) {
                        case 0: { col.innerText = i + 1; col.align = 'center'; break };
                        case 1: { col.innerText = data[i].name; break };
                        case 2: {
                            col.innerText = data[i].qtyWords;
                            col.align = 'center'; break
                        };
                        case 3: { col.innerText = data[i].date; break };
                        default: break;
                    }
                    col.className = 'del';
                    str.appendChild(col);
                }
            }

        })
}
// Удаление таблицы результатов
function delTable(str) {
    let table = document.getElementById(str);
    if (table.length == 0) return;
    let rowCount = table.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}
// Вывод отсортированной таблицы с результатами
function printSorterRes() {
    let sort = document.getElementById('sort');
    let direct = document.getElementById('direct');
    let itemSort = document.getElementById('itemSort');
    let sortDirect = direct.options[direct.selectedIndex].value;
    let sortItem = itemSort.options[itemSort.selectedIndex].value;

    delTable('table');
    printTable(sortItem, sortDirect);

    sort.onclick = function () {
        delTable('table');
        let sortDirect = direct.options[direct.selectedIndex].value;
        let sortItem = itemSort.options[itemSort.selectedIndex].value;
        printTable(sortItem, sortDirect);

    }
};
// Нажатие на кнопку начало теста Главный экран
let beginScreen = function () {
    let beginTest = document.getElementById('beginTest');
    let beginCount = document.getElementById('beginCount');
    let kubok = document.getElementById('kubok');
    let butResult = document.getElementById('butResult');
    beginTest.disabled = false;
    beginCount.innerText = 5;
    let buttonStartOn = false;
    beginTest.onclick = function () {
        buttonStartOn = true;
        beginTest.disabled = true;
        beginCount.innerText = 5;
        let count = 5;
        let timerId = setInterval(function () {
            count--;
            beginCount.innerText = count;
            if (count === 0) {
                clearInterval(timerId);
                let main = document.getElementById('main');
                let start = document.getElementById('start');
                start.classList.toggle("d-block");
                start.classList.toggle("d-none");
                main.classList.toggle("d-none");
                main.classList.toggle("d-block");

                startTest();
            }
        }, 1000);
    };
            // Вешаем одно событие на два обработчика
        kubok.onclick = clickFunc;
        butResult.onclick = clickFunc;
        function clickFunc() {
            // Проверка что не нажата кнопка начать Тест
            if (buttonStartOn===false){
                let back = document.getElementById('back');
                start.classList.toggle("d-block");
                start.classList.toggle("d-none");
                tabRes.classList.toggle("d-none");
                tabRes.classList.toggle("d-block");

                printSorterRes();
                back.onclick = function () {
                    // start.style = 'd-none';
                    // tabRes.style = 'd-block';
                    start.classList.toggle("d-none");
                    start.classList.toggle("d-block");
                    tabRes.classList.toggle("d-block");
                    tabRes.classList.toggle("d-none");

                }

            }
        }
};
// Прохождение теста
let startTest = function () {
    fetch('http://localhost:3000/words')
        .then(function (response) {
            return response.json()
        })
        .then(function (words) {
            let timer = document.getElementById('timer');
            let count = 60;
            let i = 0;
            let randArr = randomArray(words.length - 1);
            let rus = document.getElementById('rus');
            let eng = document.getElementById('eng');
            let check = document.getElementById('check');
            let pass = document.getElementById('pass');
            eng.value = '';
            let curPoint = 0;
            // -----установка таймера
            let timerId = setInterval(() => {
                count--;
                timer.textContent = count;
                let speaker = document.getElementById('speaker');
                speaker.onmouseenter = function () {
                    this.src = 'speaker-white.jpg';
                }
                speaker.onmouseleave = function () {
                    this.src = 'speaker-black.jpg';
                }
                // ----Нажатие на динамик
                speaker.onclick = function () {
                    if (i == words.length - 1) i = 0;
                    let audio = new Audio(words[randArr[i]].url);
                    audio.play();
                    rus.innerText = words[randArr[i]].rus;
                    // ---Проверка на англ.раскладку
                    eng.onkeypress = function (event) {
                        if (event.key.match(/\w/i) === null) {
                            this.value = '';
                            blinkStrP('Включите английскую раскладку клавиатуры!!!','pause', 5, '40px', 'red');
                        }

                    }
                    // Нажатие на кнопку check
                    check.disabled = false;
                    pass.disabled = false;
                    check.onclick = function () {
                        check.disabled = true;
                        pass.disabled = true;
                        if (strMatch(eng.value, words[randArr[i]].eng)) {
                            blinkStrP('Ура Вы угадали!!!','pause', 5, '40px', 'green');
                            i++;
                            curPoint++;
                            rus.innerText = '';
                            eng.value = '';
                        }
                        else blinkStrP('Неудача, пробуйте еще!!!!!!','pause', 5, '40px', 'red');
                    }
                    // Нажатие на кнопку Пропустить
                    pass.onclick = function() {
                        check.disabled = true;
                        pass.disabled = true;
                        blinkStrP('Попробуйте следующее слово!!!','pause', 5, '40px', 'red');
                        i++;
                        rus.innerText = '';
                        eng.value = '';

                    }
                }
                // Переход на вывод результатов, по условию окончания таймера
                if (count === 0) {
                    clearInterval(timerId);
                    result.classList.toggle("d-none");
                    result.classList.toggle("d-block");
                    main.classList.toggle("d-block");
                    main.classList.toggle("d-none");
                    onePoint.qtyWords = curPoint;
                    writeResult();
                }
            }, 1000);
        })
        .catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
};
// ---Вывод результатов на экран и ввод имени
let writeResult = function () {
    let res = document.getElementById('res');
    let nameUser = document.getElementById('nameUser');
    let saveRes = document.getElementById('saveRes');
    let escape = document.getElementById('escape');
    res.innerText = onePoint.qtyWords;
    nameUser.value = '';
    saveRes.onclick = function () {
        if (nameUser.value === '') { blinkStrP('Введите свое имя!!!','pauseRes', 5, '40px', 'red'); return; }
        onePoint.name = nameUser.value;

        let json = JSON.stringify({ "name": onePoint.name, "qtyWords": onePoint.qtyWords, "date": new Date() })

        fetch('http://localhost:3000/tableWin', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: json
        })
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
            });
        start.classList.toggle("d-none");
        start.classList.toggle("d-block");
        result.classList.toggle("d-block");
        result.classList.toggle("d-none");
        beginScreen();

    }
    escape.onclick = function () {
        start.classList.toggle("d-none");
        start.classList.toggle("d-block");
        result.classList.toggle("d-block");
        result.classList.toggle("d-none");
        beginScreen();
    }
};
// Запуск программы
let beginTest = document.getElementById('beginTest');
let tabRes = document.getElementById('tabRes');
let main = document.getElementById('main');
let start = document.getElementById('start');
let result = document.getElementById('result');
beginScreen();