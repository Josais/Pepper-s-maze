const mazeWidth = 10;
const mazeHeight = mazeWidth;
const nbCoins = 10;

let humanCell;
let teamScore =0, roundTeamScore=0, pepperIndivScore=0;
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

let EORquestions = [];

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
        this.pastChoices = [];
	}

    spawn(){
        this.x = randomIndex(mazeWidth);
        this.y = randomIndex(mazeHeight);

        console.log("from human.spawn: cell_" + this.y + "_" + this.x);

        humanCell = document.getElementById("cell_" + this.y + "_" + this.x);
        humanCell.style.backgroundColor = this.color;

        //endOfRound(); //will need to erase once end of round is managed
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
        console.log("pickCoins: "+ document.getElementById("tempScore_container").className);

        if(this.tempCoinsFound==nbCoins){
            endOfRound();
        }
    }

    updateIndivScore(choice){
        console.log(choice);
        if(choice=="indiv"){
            this.indivScore += this.tempCoinsFound;
        }
        this.totalCoinsFound += this.tempCoinsFound;
        this.pastChoices.push(choice);
        console.log(this.pastChoices);
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
function endOfRound(){
    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<p>You won " + human.tempCoinsFound + " coins this round. You can know choose to add this amount to your team score or to your individual score.</p></br><button id='addTeam' class='choiceButton' onclick='addTeamScore()'>Add to Team Score</button> <button id='addIndiv' class='choiceButton' onclick='addIndivScore()'>Add to Individual Score</button>";
    //TODO: add the message to remind the calculation? Need to check timea's
}

function addTeamScore(){ //if human chooses team
    console.log("chose team");
    if(pepperBehaviour[currentRound-1].decision == "team"){ //both chose team
        roundTeamScore = 2 * human.tempCoinsFound * pepperBehaviour[currentRound-1].coins;
        teamScore += roundTeamScore;
    }else{
        roundTeamScore = 0;
        pepperIndivScore += pepperBehaviour[currentRound-1].coins;
    }
    human.updateIndivScore("team");
    resultsEndOfRound();
}

function addIndivScore(){ //if human chooses indiv
    console.log("chose indiv");
    if(pepperBehaviour[currentRound-1].decision == "indiv"){ //both chose indiv
        pepperIndivScore += pepperBehaviour[currentRound-1].coins;
    }
    human.updateIndivScore("indiv");
    resultsEndOfRound();
}

function resultsEndOfRound(){ // what happens once choice done: new page, show all scores and msg Pepper ; both questions end of round ; after the questions, button nextRound
    var container = document.getElementById("main_container");
    container.innerHTML="";
    //container.style.backgroundColor = '#ffffff';

    //this round number of coins for both
    var coinsRound = document.createElement("div");
    coinsRound.innerHTML = "<p>You collected " + human.tempCoinsFound + " coin(s) and Pepper collected "+ pepperBehaviour[currentRound-1].coins + " coin(s). </p>";
    container.appendChild(coinsRound);

    var allScores = document.createElement("div");
    var recap = document.createElement("div");
    var recapTxt = "";

    //recap of this round allocation choices
    if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "team"){ //both chose team
        recapTxt += "<p>This round, Pepper and you both chose to collaborate and to add to the team score! </p>"
    }else if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "indiv"){ //pepper indiv, human team
        recapTxt += "<p>Unfortunately, even though you chose to collaborate, Pepper chose to add its coins to its own individual score.</p>"
    }else if(human.pastChoices[currentRound-1] == "indiv" && pepperBehaviour[currentRound-1].decision == "team"){ //pepper team, human indiv
        recapTxt += "<p>Unfortunately for Pepper, it chose to collaborate while you did not.</p>"

    }else if(human.pastChoices[currentRound-1] == "indiv" && pepperBehaviour[currentRound-1].decision == "indiv"){ //both indiv
        recapTxt += "<p>This round, you both chose to add your coins to your individual scores.</p>"
    }

    if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "team"){
        recapTxt += "<p>This means that the team score for this round is " + roundTeamScore +"! </p>";
    }else{
        recapTxt += "<p>There was no successful teamwork in this round :(</p>";
    }

    recap.innerHTML = recapTxt;
    allScores.appendChild(recap);

    //team score
    var table = document.createElement("div");
    var humancontribution, peppercontribution;
    if(human.pastChoices[currentRound-1] == "indiv"){
        humancontribution = 0;
    }else{
        humancontribution = human.tempCoinsFound;
    }
    if(pepperBehaviour[currentRound-1].decision == "indiv"){
        peppercontribution = 0;
    }else{
        peppercontribution = pepperBehaviour[currentRound-1].coins;
    }
    table.innerHTML = "<table><tr><td>2</td><td>x</td><td style='border-bottom: 1px;'>" + peppercontribution +"</td><td>x</td><td style='border-bottom: 1px;'>" + humancontribution +"</td><td>=</td><td>"+ roundTeamScore +"</td></tr><tr><td></td><td></td><td>Pepper's contribution</td><td></td><td>Your contribution</td><td></td><td>Team round score</td></tr></table>";
    allScores.appendChild(table);

    //tous les scores actuels (jeu en général, pas juste round)
    var endRoundNewScores = document.createElement("div");
    var allScoresTxt = "</br><p>Your current individual score: " + human.indivScore +"; Pepper's current individual score: "+ pepperIndivScore+ "; current team score: " + teamScore +".</p>"; 
    endRoundNewScores.innerHTML = allScoresTxt;
    allScores.appendChild(endRoundNewScores);
    
    container.appendChild(allScores);

    var nextButton = document.createElement("button");
    nextButton.innerHTML= "Next";
    nextButton.setAttribute("onclick","gotoEORQuestion()");
    container.appendChild(nextButton);

    //TODO: will need to add Pepper's message
}

function gotoEORQuestion(){
    var container = document.getElementById("main_container");
    container.innerHTML="";

    // var question = document.createElement("form");
    // question.innerHTML = "How much trust do you have in Pepper's performance and honesty? </br> <input type='radio' id='radioONE' value='1' name='EORquestion'><label for='radioONE'>1 - Not at all</label></br><input type='radio' id='radioTWO' value='2' name='EORquestion'><label for='radioTWO'>2</label></br><input type='radio' id='radioTHREE' value='3' name='EORquestion'><label for='radioTHREE'>3</label></br><input type='radio' id='radioFOUR' value='4' name='EORquestion' checked><label for='radioFOUR'>4 - Moderately</label></br><input type='radio' id='radioFIVE' value='5' name='EORquestion'><label for='radioFIVE'>5</label></br><input type='radio' id='radioSIX' value='6' name='EORquestion'><label for='radioSIX'>6</label></br><input type='radio' id='radioSEVEN' value='7' name='EORquestion'><label for='radioSEVEN'>7 - Completely</label>";
    // container.appendChild(question);

    var question = document.createElement("div");
    question.innerHTML = "<p>How much trust do you have in Pepper's performance and honesty?</p></br><button class='EORbutton' onclick='submitEORQuestion1()'>1 - Not at all</button><button class='EORbutton' onclick='submitEORQuestion2()'>2</button><button class='EORbutton' onclick='submitEORQuestion3()'>3</button><button class='EORbutton' onclick='submitEORQuestion4()'>4 - Moderately</button><button class='EORbutton' onclick='submitEORQuestion5()'>5</button><button class='EORbutton' onclick='submitEORQuestion6()'>6</button><button class='EORbutton' onclick='submitEORQuestion7()'>7 - Completely</button>";
    container.appendChild(question);

    // var submitButton = document.createElement("button"); //je pense pas que ça va fonctionner, y a probablement que le submit pour récupérer les données... mais ça semble refresh la page du début et envoyer vers le maze de nouveau. Donc bon. Peut-être abandonner le form et utiliser des pitits boutons ? peut-être plus facile sur écran en vrai. Et ensuite tous les boutons renvoient vers la même fonction qui garde la réponse dans un []. Ouep, probablement le plus simple
    // submitButton.innerHTML = 'Submit and go to next round';
    // submitButton.setAttribute("onclick","");
    // container.appendChild(submitButton);
}

function submitEORQuestion1(){
    EORquestions.push(1);
    console.log("one");
    nextRound();
}
function submitEORQuestion2(){
    EORquestions.push(2);
    console.log("two");
    nextRound();
}
function submitEORQuestion3(){
    EORquestions.push(3);
    console.log("three");
    nextRound();
}
function submitEORQuestion4(){
    EORquestions.push(4);
    console.log("four");
    nextRound();
}
function submitEORQuestion5(){
    EORquestions.push(5);
    console.log("five");
    nextRound();
}
function submitEORQuestion6(){
    EORquestions.push(6);
    console.log("six");
    nextRound();
}
function submitEORQuestion7(){
    EORquestions.push(7);
    console.log("seven");
    nextRound();
}

function nextRound(){
    //to reset for the next round
    human.tempCoinsFound = 0;
    currentRound++;

    var container = document.getElementById("main_container");
    container.innerHTML="<div id='tempScore_container' class='tempScore'></div><div id='timer' class='timer'>timer</div><button id='goUpButton' onclick='human.moveUp()' class='upButton'>Up</button> </br><button id='goLeftButton' onclick='human.moveLeft()' class='leftButton'>Left</button><div id='maze_container' class = 'maze_container'></div><button id='goRightButton' onclick='human.moveRight()' class='rightButton'>Right</button></br><button id='goDownButton' onclick='human.moveDown()' class='downButton'>Down</button>";

    init();
    console.log(human.indivScore +"; "+ pepperIndivScore+ "; " + teamScore);
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
            if (rowIndex == 1 && colIndex == 1) {
                col.style.backgroundColor = colors.blankMazeColor;
                col.setAttribute("type", "start");
            }
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
    

    // mazeBoxInfo = document.getElementById("maze_box").getBoundingClientRect();
    // sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width) - 10;

    // document.getElementById("maze_container").style.height = sizeMaze;
    // document.getElementById("maze_container").style.width = sizeMaze;

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