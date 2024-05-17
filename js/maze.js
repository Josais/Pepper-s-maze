const mazeWidth = 10;
const mazeHeight = mazeWidth;
const nbCoins = 10;

let humanCell;
let teamScore;
let currentRound = 1;

const pepperBehaviour=[ //one for performance failure, one for morality failure
    {decision: "indiv", coins: 1},
    {deicison: "indiv", coins: 3}
]

const colors = {
    humanColor : '#0004ff',
    mazeColor : '#ff9b9b',
    blankMazeColor: '#ffffff',
    coinColor : '#007c00'
}

class Player {
	constructor(x, y) {
		this.id = 'human';
		this.x = x;
		this.y = y;
		this.color = colors.humanColor;
		// this.explored = new Set();
		// this.tempExplored = new Set();
		this.tempCoinsFound = 0;
		this.totalCoinsFound = 0;
        this.indivScore = 0;
	}

    spawn(){
        this.x = randomIndex(mazeWidth);
        this.y = randomIndex(mazeHeight);

        console.log("from human.spawn: cell_" + this.y + "_" + this.x);

        humanCell = document.getElementById("cell_" + this.y + "_" + this.x);
        humanCell.style.backgroundColor = this.color;
    }

    moveUp() {
		if (this.y != 1 && humanCell.style["border-top"] == "none") {
			--this.y;
		}
        this.refreshMap();
	}

	moveRight() {
		if (this.x != mazeWidth && humanCell.style["border-right"] == "none") {
			++this.x;
		}
        this.refreshMap();
	}

	moveDown() {
		if (this.y != mazeHeight && humanCell.style["border-bottom"] == "none") {
			++this.y;
		}
        this.refreshMap();
	}

    moveLeft() {
		if (this.x != 1 && humanCell.style["border-left"] == "none") {
			--this.x;
		}
        this.refreshMap();
	}

    refreshMap(){
        humanCell.style.backgroundColor = colors.mazeColor; //previous cell

        humanCell = document.getElementById("cell_" + this.y + "_" + this.x); //get the new cell

        if(humanCell.getAttribute("isCoin") == "true"){ //if coin, collect
            this.pickCoin();
        }

        humanCell.style.backgroundColor = this.color; //actual move, color the cell as the character

        console.log("from refreshMap: cell_" + this.y + "_" + this.x);
    }

    pickCoin(){
        this.tempCoinsFound++;
        humanCell.setAttribute("isCoin", "false");
        console.log("number of coins : " + this.tempCoinsFound);
        document.getElementById("tempScore_container").innerHTML = "tempCoins = " + this.tempCoinsFound.toString();

        if(this.tempCoinsFound==nbCoins){
            endOfRound();
        }
    }

    updateIndivScore(coins){
        this.indivScore += coins;
    }

    // get tempCoinsFound(){ //y a un soucis ici, avec ça fonctionne pas
    //     return this.tempCoinsFound;
    // }

    // set indivScore(x){
    //     this.indivScore = this.indivScore + x;
    // }

    

}

var human = new Player(1,1);


//EVENT LISTENERS ================================================================================
window.addEventListener("load", init);
document.addEventListener("keydown", eventKeyHandlers);

//ROUND FUNCTIONS (SCORES, TIMERS, QUESTIONS) =============================================================
function endOfRound(){ //need to finish
    var center = document.getElementById("maze_container");
    center.innerHTML = "Try";
    center.style.backgroundColor = black;

    //TODO
}

function addTeamScore(){ //if human chooses team
    if(pepperBehaviour[currentRound].decision == "team"){ //both chose team
        decisionTeamTeam(human.tempCoinsFound,pepperBehaviour[currentRound].coins);
    }else{
        decisionIndivTeam(human.tempCoinsFound,pepperBehaviour[currentRound].coins);
    }
    resultsEndOfRound();
}

function addIndivScore(){ //if human chooses indiv
    //TODO
}

function decisionTeamTeam(coinsHuman, coinsPepper){
    teamScore = teamScore + 2 * coinsHuman * coinsPepper;
}

function decisionIndivIndiv(coinsHuman, coinsPepper){
    human.updateIndivScore(coinsHuman); //human score update
    //TODO: pepper score update
}

function decisionIndivTeam(coinsHuman,coinsPepper){//Pepper indiv, human Team
    //TODO
}

function decisionTeamIndiv(coinsHuman,coinsPepper){ //pepper team, human indiv
    //TODO
}

function resultsEndOfRound(){ // what happens once choice done: new page, show all scores and msg Pepper ; both questions end of round ; after the questions, button nextRound
    //TODO

}



//VARIOUS MAZE CREATIONS FUNCTIONS ===============================================================
function init() {
    baseMaze();
    addCells();
    addCoins();
    human.spawn();
}

function addCoins(){
    var x,y;
    var cell;
    for(i=0; i <nbCoins; i++){
        x= randomIndex(mazeWidth-1);
        y = randomIndex(mazeHeight-1);

        cell = document.getElementById("cell_" + y + "_" + x);
        console.log("from addCoins: cell_" + y + "_" + x);

        if (cell.getAttribute("isCoin")=="false"){
            cell.style.backgroundColor = colors.coinColor;
            cell.setAttribute("isCoin", "true");
        } else{
            i--;
        }

    }
}

function addCells() {
	var rowIndex = 1;
	var colIndex = 1;

	var currentCell;
	
    addRoute(rowIndex, colIndex, false);

    for (n = 1; n < (mazeWidth * mazeHeight) - 1; n++) {
        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
        if (currentCell.getAttribute("occupied") == "true") {
            addRoute(rowIndex, colIndex, true);
        }
        if (colIndex == mazeWidth) {
            rowIndex++;
            colIndex = 1;
        } else {
            colIndex++;
        }
    }
}

function addRoute(startAtRow, startAtCol, createDetour, backgroundColorRoute = colors.mazeColor) {
    var validExits = ["right", "bottom", "left", "top"];
    var remainingExits = {"right": mazeWidth, "bottom": mazeHeight, "left": 0, "top": 0};
    var nextExits = [];
	var lastCells= [];
    var rowIndex = startAtRow;
	var colIndex = startAtCol;
    var currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
    var exit;
    var exitIndex;
    var loop = 0;
    var loopFuse = 0;
    var maxLoops = 3 * mazeWidth * mazeHeight;
    var nextPossibleCell;

    while (loop < ((mazeWidth * mazeHeight) - 1)) {
        loopFuse++;
        if (loopFuse >= maxLoops) {break;}
        nextExits = [];
        for (i = 0; i < validExits.length; i++) {
            switch(validExits[i]) {
                case "right":
                    nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1));
                    break;
                case "left":
                    nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex - 1));
                    break;
                case "bottom":
                    nextPossibleCell = document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex);
                    break;
                case "top":
                    nextPossibleCell = document.getElementById("cell_" + (rowIndex - 1) + "_" + colIndex);
                    break;
            }            
            if (nextPossibleCell != null) {
                if (nextPossibleCell.getAttribute("occupied") != "true") {                    
                    for (t = 0; t < remainingExits[validExits[i]]; t++) {
                        nextExits.push(validExits[i]);
                    }
                }
            } 
        }

        if (nextExits.length == 0) {
            if (createDetour == true) {
                return false;
            } else {                
                lastCells.splice(lastCells.length - 1, 1);
                rowIndex = lastCells[lastCells.length - 1][0];
                colIndex = lastCells[lastCells.length - 1][1];
                currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
                continue;            
            }
        } 

        exitIndex = randomIndex(nextExits.length);
        exit = nextExits[exitIndex];
        if (createDetour == false) {
            currentCell.style["border-"+exit] = "none";
        } else {
            if (!(exit == "right" && colIndex == mazeWidth - 1 && rowIndex == mazeHeight) &&
                !(exit == "bottom" && colIndex == mazeWidth && rowIndex == mazeHeight - 1) ) {
                currentCell.style["border-"+exit] = "none";
            }
        }
        
        switch(exit) {
            case "right":
                colIndex = colIndex + 1;
                remainingExits.left++;
                remainingExits.right--;
                break;
            case "bottom":
                rowIndex = rowIndex + 1;
                remainingExits.top++;
                remainingExits.bottom--;
                break;
            case "left":
                colIndex = colIndex - 1;
                remainingExits.left--;
                remainingExits.right++;
                break;
            case "top":
                rowIndex = rowIndex - 1;
                remainingExits.top--;
                remainingExits.bottom++;
                break;                
        }

        lastCells.push([rowIndex, colIndex]);
        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

        switch(exit) {
            case "right":
                currentCell.style["border-left"] = "none";
                break;
            case "bottom":
                currentCell.style["border-top"] = "none";
                break;
            case "left":
                currentCell.style["border-right"] = "none";
                break;
            case "top":
                currentCell.style["border-bottom"] = "none";
                break;
        }

        if (rowIndex == mazeHeight && colIndex == mazeWidth) {
            break;
        }

        currentCell.style.backgroundColor = backgroundColorRoute;
        currentCell.setAttribute("occupied", "true");
        lastExit = exit;
        loop++;
    }

}

function baseMaze() {
    var rowIndex, colIndex;

    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
        var row = document.createElement("tr");
        for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {
            var col = document.createElement("td");
            if (rowIndex == 1 && colIndex == 1 ) {
                col.style.backgroundColor = colors.blankMazeColor;
                col.setAttribute("type", "start");
            }
            // else if (rowIndex == mazeHeight && colIndex == mazeWidth) {                
            //     col.style.backgroundColor = "rgb(0,244,0)";
            //     col.setAttribute("type", "finish");
            // } 
            else {
                col.style.backgroundColor = colors.blankMazeColor;
            }
            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);  
            col.setAttribute("isCoin", "false");
            //console.log(col);          
            row.appendChild(col);
        }
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    

    mazeBoxInfo = document.getElementById("maze_box").getBoundingClientRect();
    sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width) - 10;

    document.getElementById("maze_container").style.height = sizeMaze;
    document.getElementById("maze_container").style.width = sizeMaze;

    document.getElementById("maze_container").appendChild(table);
}



//HUMAN CONTROLS ON KEYBOARD ===================================================================================
function eventKeyHandlers(e) {
	switch (e.keyCode) {
			case 65: // a
			case 37: // left arrow
			case 72: // h
				e.preventDefault();
				human.moveLeft();
				break;
			case 87: // w
			case 38: // up arrow
			case 75: // k
				e.preventDefault();
				human.moveUp();
				break;
			case 68: // d
			case 39: // right arrow
			case 76: // l
				e.preventDefault();
				human.moveRight();
				break;
			case 83: // s
			case 40: // down arrow
			case 74: // j
				e.preventDefault();
				human.moveDown();
				break;
			case 32: // space bar
				e.preventDefault();
				human.pickTarget();
				break;
			default: // nothing
				break;
		}
		throttle = setTimeout(() => {
			throttle = null;
		}, 50);
}


//TOOLBOX ==================================================================================
function randomIndex(max){//returns an int between one and max included
    return Math.floor(Math.random() * max) + 1;
}