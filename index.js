alert("Выберите сложность и нажмите на Go touchmove v3");
let tableSizeX = 30;
let tableSizeY = 16;
nomberOfBombs = 99;
const v1 = new Date();
let fi, fj;
cellId = 1;
rowId = 1;
function createLine(className){
    var div = document.createElement('div');
    div.className = "row";
    div.id = "row" + String(rowId++);
    return div;
}

function createDiv(className){
    var div = document.createElement('div');
    div.className = "cell noselect";
    div.id = cellId++;
    div.style.width = '45px';
    div.style.height = '45px';
    div.style.backgroundColor = 'grey'
    div.innerHTML = 0;
    div.style.color = 'grey';
    div.style.border = '1px solid black'

    return div;
}

function createTable() {
    for (var i = 0; i < tableSizeX; i++) {
        document.body.appendChild(createLine('main'));
            for (var j = 0; j < tableSizeY; j++) {
            document.body.appendChild(createDiv("row" + String(rowId)));
           }  
    }
}

let arrOfValue = [], visited = [],flagBackupValue = [];;
cellId = 1;
function createArrays() {
    for (let i = 1; i < tableSizeX + 1; i++) {
        arrOfValue[i] = [];
        visited[i] = [];
        for (let j = 1; j < tableSizeY + 1; j++) {
            arrOfValue[i][j] = 0;
            visited[i][j] = false;
        }
    }
    for (i = 1; i < tableSizeX * tableSizeY + 1; i++){
        flagBackupValue[i] = -1;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

BombsAlreadyPlased = 0;
function generateBombs() {
    let randomI, randomJ;
    while (BombsAlreadyPlased != nomberOfBombs){
        randomI = getRandomInt(tableSizeX);
        randomJ = getRandomInt(tableSizeY); 
        if (randomI > 0 && randomJ > 0) {
            arrOfValue[randomI][randomJ] = "x";
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if ( randomI + dx == fi && randomJ + dy == fj) { 
                        arrOfValue[randomI][randomJ] = 0;
                        BombsAlreadyPlased -= 1;
                    }
                }
            }
            BombsAlreadyPlased += 1;
        }
    }
}

function surrondBombs() {
    for (let i = 1; i < tableSizeX + 1; i++) {
        for (let j = 1; j < tableSizeY + 1; j++) {
            if (arrOfValue[i][j] == "x") {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (
                            i + dx > 0 &&
                            j + dy > 0 &&
                            i + dx < tableSizeX + 1 &&
                            j + dy < tableSizeY + 1 &&
                            arrOfValue[i + dx][j + dy] != "x"
                        ) { 
                            arrOfValue[i + dx][j + dy] += 1;
                        }
                    }
                } 
            }
        }
    }
}

function applyBombMap() {
    for (let i = 1; i < tableSizeX + 1; i++) {
        for (let j = 1; j < tableSizeY + 1; j++) {
            document.getElementById(getId(i, j)).innerHTML = arrOfValue[i][j];
        }
    }
}

console.log(arrOfValue);

const colorMap = new Map(
    [[0, "#a2a2a2"],
    [1, "blue"],
    [2, "green"],
    [3, "red"],
    [4, "#5f3dc5"],
    [5, "#2b1669"],
    ["x", "black"]]
);
function getColor() {
    for (let i = 1; i < tableSizeX + 1; i++) {
        for (let j = 1; j < tableSizeY + 1; j++) {
            document.getElementById(getId(i, j)).style.color = colorMap.get(arrOfValue[i][j]);
            if (arrOfValue[i][j] != "x")
                document.getElementById(getId(i, j)).style.backgroundColor = "#a2a2a2";          
        }
    }

    
}



function setColor() {
    for (let i = 1; i < tableSizeX * tableSizeY + 1; i++){
        document.getElementById(i).style.color = "grey";
        document.getElementById(i).style.backgroundColor = "grey";
    }
}

function openCell(x, y) {
    document.getElementById(getId(x, y)).style.color = colorMap.get(arrOfValue[x][y]);
    document.getElementById(getId(x, y)).style.backgroundColor = "#a2a2a2";
}

function dfs(x, y) {
    if (x < 1 || x > tableSizeX || y < 1 || y > tableSizeY || visited[x][y] == true) {
        return;
    }
    if (arrOfValue[x][y] != 0 ) {
        openCell(x, y);
        return;
    }
    visited[x][y] = true;
    openCell(x, y);
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            dfs(x + dx, y + dy);
        }
    }   
}


function getX(id) {
    return Math.floor((id - 1)/tableSizeY + 1);
}
function getY(id) {
    return(id - 1) % tableSizeY + 1;
}
function getId(x, y) {
    return((x - 1) * tableSizeY + y);
}

function wincheck() {
    let markedCels = 0;
    for (let i = 1; i <= tableSizeX * tableSizeY; i++) {
        if (document.getElementById(i).style.backgroundColor == "rgb(162, 162, 162)" || document.getElementById(i).innerHTML == "🚩")
        markedCels += 1;
    } 
    if (markedCels == tableSizeX * tableSizeY) alert("Вы выиграли!!!");
    markedCels = 0;
}

let isFirstClick = true;
let clickedCellId;
let isTouchmove = false;
addEventListener("touchmove",event=>{
    isTouchmove = true;
    console.log("touchmove");
});
    let d1, d2;
    addEventListener("mousedown",event=>{
        d1 = new Date();
        clickedCellId = event.target.id;
    })
    addEventListener("touchstart",event=>{
        d1 = new Date();
        clickedCellId = event.target.id;
        console.log("touchstart id =", clickedCellId);
    })
    addEventListener("mouseup",event=>{
        console.log("mouseup event");
        d2 = new Date();
        
        let id = event.target.id;
        let innerHTML = event.target.innerHTML;
        let x = getX(id);
        let y = getY(id);

        let clickTime = (d2 - d1) / 1000;
        console.log(clickTime);
        if (event.target.className != "cell noselect" || clickedCellId != event.target.id) {
            return;
        }
        if (isFirstClick == true) {
            fi = x;
            fj = y;
            createArrays()
            generateBombs();
            surrondBombs();
            applyBombMap();
            isFirstClick = false;
            
        }
        
        if (clickTime < (1 / 3)){ 
            console.log("clocktime > 0.33");
            if (innerHTML != "🚩") event.target.style.backgroundColor = "#a2a2a2";
            if (innerHTML > 0) {
                document.getElementById(id).style.color = colorMap.get(Number(innerHTML));
            }
            if (innerHTML == 0){
                dfs(x, y);
                event.target.style.color = "#a2a2a2"
            } 
            if (innerHTML == "x") {
                event.target.style.color = "black";
                event.target.style.backgroundColor = "red";
                alert("К сожалению, вы проиграли(((");
            }   
        }
        if (clickTime > (1 / 3)){
            if (flagBackupValue[id] != -1) {
                event.target.innerHTML = flagBackupValue[id];
                event.target.style.color = "grey";
                flagBackupValue[id] = -1;
            }
            else {
                flagBackupValue[id] = event.target.innerHTML;
                event.target.innerHTML = "&#128681";
                console.log("first change", flagBackupValue[id], " was changed to ", "🔎");
            }
        }
        wincheck();
    });

    addEventListener("touchend",event=>{
        d2 = new Date();
        
        let id = event.target.id;
        let innerHTML = event.target.innerHTML;
        let x = getX(id);
        let y = getY(id);

        let clickTime = (d2 - d1) / 1000;
        console.log(clickTime);
        console.log("touchend id =", clickedCellId);
        if (event.target.className != "cell noselect" || isTouchmove == true) {
            isTouchmove = false;
            return;
        }
        
        if (isFirstClick == true) {
            fi = x;
            fj = y;
            createArrays()
            generateBombs();
            surrondBombs();
            applyBombMap();
            isFirstClick = false;
            
        }
        
        if (clickTime < (1 / 3)){ 
            if (innerHTML != "🚩") event.target.style.backgroundColor = "#a2a2a2";
            if (innerHTML > 0) {
                document.getElementById(id).style.color = colorMap.get(Number(innerHTML));
            }
            if (innerHTML == 0){
                dfs(x, y);
                event.target.style.color = "#a2a2a2"
            } 
            if (innerHTML == "x") {
                event.target.style.color = "black";
                event.target.style.backgroundColor = "red";
                alert("К сожалению, вы проиграли(((");
            }   
        }
        if (clickTime > (1 / 3)){
            if (flagBackupValue[id] != -1) {
                event.target.innerHTML = flagBackupValue[id];
                event.target.style.color = "grey";
                flagBackupValue[id] = -1;
            }
            else {
                flagBackupValue[id] = event.target.innerHTML;
                event.target.innerHTML = "&#128681";
                console.log("first change", flagBackupValue[id], " was changed to ", "🔎");
            }
        }
        wincheck();
    });

    




go.onclick = function() {
    createTable();
    block.style.display = "none";
};

now.onclick = function() {
    now.style.backgroundColor = "rgb(193 193 193)";
    lub.style.backgroundColor = "white";
    pro.style.backgroundColor = "white";
    tableSizeX = 8;
    tableSizeY = 8;
    nomberOfBombs = 10;
}
lub.onclick = function() {
    now.style.backgroundColor = "white";
    lub.style.backgroundColor = "rgb(193 193 193)";
    pro.style.backgroundColor = "white";
    tableSizeX = 16;
    tableSizeY = 16;
    nomberOfBombs = 40;
}
pro.onclick = function() {
    now.style.backgroundColor = "white";
    lub.style.backgroundColor = "white";
    pro.style.backgroundColor = "rgb(193 193 193)";
    tableSizeX = 30;
    tableSizeY = 16;
    nomberOfBombs = 99;
}
