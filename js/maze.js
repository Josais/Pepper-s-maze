const mazeWidth = 10;
const mazeHeight = mazeWidth;
const nbCoins = 10;
const roundPerGame = 2;
const gamePerExperiment = 2;

const strats = ["apology", "denial", "compensation"]; //one of those is chosen just once
let failures = ["morality","performance"]; //one is chosen for the first game, the other for the second game
let stratType,failType;

const colors = {
    humanColor : '#0004ff',
    mazeColor : '#ff9b9b',
    blankMazeColor: '#ffffff',
    coinColor : '#007c00'
}

const dbIDWords = ["sample", "theory", "income", "judgment", "cookie", "highway", "bathroom", "estate", "drama", "wedding", "person", "patience", "basket", "girlfriend", "concept", "driver", "housing", "contract", "outcome", "problem", "context", "coffee", "product", "garbage", "fishing", "payment", "buyer", "shopping", "airport", "boyfriend", "power", "friendship", "safety", "county", "data", "storage", "language", "basis", "dinner", "topic", "success", "teaching", "system", "orange", "movie", "woman", "presence", "science", "climate", "sector"]; //TODO: besoin de former une meilleure base, les mots sont nuls
let participantID = randomID(4,"false");

const pepperBehaviour=[ 
    //TODO: one for performance failure, one for morality failure
    {decision: "indiv", coins: 1},
    {decision: "indiv", coins: 3}
]

let timer;
let ms, sec, min;

let humanCell;
let teamScore =0, roundTeamScore=0, pepperIndivScore=0;
let currentRound = 1;
let currentGame = 1;

let history = []; //{humanIndiv, teamScore, totalCoinsGameHuman, pastChoices, EORquestions, EOGquestion [game]}

let EORquestions = [], EOGquestions =[];

class Player {
	constructor(x, y) {
		this.id = 'human';
		this.x = x;
		this.y = y;
		this.color = colors.humanColor;
		this.tempCoinsFound = 0;
		this.totalCoinsFound = 0;
        this.indivScore = 0;
        this.pastChoices = [];
	}

    spawn(){
        this.x = randomIndex(mazeWidth) +1;
        this.y = randomIndex(mazeHeight) +1;

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
    }

    pickCoin(){
        this.tempCoinsFound++;
        humanCell.setAttribute("isCoin", "false");
        //console.log("number of coins : " + this.tempCoinsFound);
        document.getElementById("tempScore_container").innerHTML = "Coins collected this round = " + this.tempCoinsFound.toString();
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
}

var human = new Player(1,1);


//EVENT LISTENERS ================================================================================
window.addEventListener("load", startExperiment);
document.addEventListener("keydown", eventKeyHandlers);

//WELCOME PAGE ETC =========================================================================================
function startExperiment(){ 
    //TODO: add short explanation of ID and instruction to put it in the questionnaire
    //TODO: add instruction to fill in first part of questionnaire (dispo trust)
    //TODO: say that once that is done, click on next

    //TODO: need to check the tutorial, but will wait on meeting with Maartje on Tuesday
    console.log(participantID);

    var container = document.getElementById("main_container");
    container.innerHTML="<h1>Welcome!</h1><p>Short explanation for the game and the random id thingy</p><br><div id='participantID'></div><button id='tutorial'>Tutorial</button><button id='launchGame' onclick='init()'>Launch Experiment</button>";

    var participant = document.getElementById("participantID");
    participant.innerHTML = participantID;
}

function init() {
    if(currentGame==1 && currentRound==1){
        stratType = strats[randomIndex(strats.length)];
    }
    if(currentRound==1){
        let f = randomIndex(failures.length);
        failType = failures[f];
        failures.splice(f,1);

        console.log("stratType= " +stratType + "; failtype= " + failType + "; failures= " + failures);
    }

    var container = document.getElementById("main_container");
    container.innerHTML=`<div id='tempScore_container' class='tempScore'>Coins collected this round = 0</div><div id='round' class='round'>Round ${currentRound}/${roundPerGame}</div><div id='timer_container' class='timer'></div><div id='timer_c'></div><button id='goUpButton' onclick='human.moveUp()' class='upButton'>Up</button> </br><button id='goLeftButton' onclick='human.moveLeft()' class='leftButton'>Left</button><div id='maze_container' class = 'maze_container'></div><button id='goRightButton' onclick='human.moveRight()' class='rightButton'>Right</button></br><button id='goDownButton' onclick='human.moveDown()' class='downButton'>Down</button>`;

    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<button id='goRound' class='goRound' onclick='launchRound()'>Start round</button>";
}

function launchRound(){
    baseMaze();
    addCells();
    addCoins();
    human.spawn();

    startTimer();
}

//VARIOUS MAZE CREATIONS FUNCTIONS ===============================================================
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

    document.getElementById("maze_container").innerHTML ="";
    document.getElementById("maze_container").appendChild(table);
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

function addCoins(){
    var x,y;
    var cell;
    for(i=0; i <nbCoins; i++){
        x= randomIndex(mazeWidth)+1;
        y = randomIndex(mazeHeight)+1;

        console.log(x + " : " + y);

        cell = document.getElementById("cell_" + y + "_" + x);
        //console.log("from addCoins: cell_" + y + "_" + x);

        if (cell.getAttribute("isCoin")=="false"){
            cell.style.backgroundColor = colors.coinColor;
            cell.setAttribute("isCoin", "true");
        } else{
            i--;
        }

    }
}


//TIMER =========================================================================================================
function timerManager() {
    ms--;
    if(min == 0 && sec == 0 && ms == 0){
        stopTimer();
        endOfRound();
    }
    if(ms == 0 && sec != 0){
        sec--;
        ms = 100;
    }
    if(sec == 0 && min != 0){
        min--;
        sec = 60;
    }

    //Doing some string interpolation
    let milli = ms < 10 ? "0"+ ms : ms;
    let seconds = sec < 10 ? "0"+ sec : sec;
    let minute = min < 10 ? "0" + min : min;

    let txt= `${minute}:${seconds}:${milli}`;
    timer.innerHTML =txt;
};

function startTimer(){
    timer =  document.getElementById("timer_container");
    
    ms = 99;
    sec = 15;
    min = 0;

    timer.innerHTML = `${min}:${sec}:${ms}`;
    console.log(timer);

    time = setInterval(timerManager,10);
}

function stopTimer(){
    clearInterval(time);
}

//EOR (SCORES, QUESTIONS...) =============================================================
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

function resultsEndOfRound(){ //TODO: correct all texts, improve
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

    console.log("pepper choice " +pepperBehaviour[currentRound-1].decision);

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
        console.log("in pepper indiv");
        peppercontribution = 0;
    }else{
        console.log("in pepper not indiv else");
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

    var question = document.createElement("div");
    question.innerHTML = "<p>How much trust do you have in Pepper's performance and honesty?</p></br><button class='EORbutton' onclick='submitEORQuestion1()'>1 - Not at all</button><button class='EORbutton' onclick='submitEORQuestion2()'>2</button><button class='EORbutton' onclick='submitEORQuestion3()'>3</button><button class='EORbutton' onclick='submitEORQuestion4()'>4 - Moderately</button><button class='EORbutton' onclick='submitEORQuestion5()'>5</button><button class='EORbutton' onclick='submitEORQuestion6()'>6</button><button class='EORbutton' onclick='submitEORQuestion7()'>7 - Completely</button>";
    container.appendChild(question);
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
    if(currentRound==roundPerGame){
        gotoEOGQuestion();
    }else{
        //reset for next round
        human.tempCoinsFound = 0;
        currentRound++;
        console.log(human.indivScore +"; "+ pepperIndivScore+ "; " + teamScore);
        init();
    }
}

//EOG ===========================================================================================================
function gotoEOGQuestion(){
    var container = document.getElementById("main_container");
    container.innerHTML="";

    var question = document.createElement("div");
    question.innerHTML = "<p>How willing are you to collaborate with Pepper again?</p></br><button class='EOGbutton' onclick='submitEOGQuestion1()'>1 - Not at all</button><button class='EOGbutton' onclick='submitEOGQuestion2()'>2</button><button class='EOGbutton' onclick='submitEOGQuestion3()'>3</button><button class='EOGbutton' onclick='submitEOGQuestion4()'>4 - Moderately</button><button class='EOGbutton' onclick='submitEOGQuestion5()'>5</button><button class='EOGbutton' onclick='submitEOGQuestion6()'>6</button><button class='EOGbutton' onclick='submitEOGQuestion7()'>7 - Completely</button>";
    container.appendChild(question);
}

function submitEOGQuestion1(){
    EOGquestions.push(1);
    console.log("one");
    endGame();
}
function submitEOGQuestion2(){
    EOGquestions.push(2);
    console.log("two");
    endGame();
}
function submitEOGQuestion3(){
    EOGquestions.push(3);
    console.log("three");
    endGame();
}
function submitEOGQuestion4(){
    EOGquestions.push(4);
    console.log("four");
    endGame();
}
function submitEOGQuestion5(){
    EOGquestions.push(5);
    console.log("five");
    endGame();
}
function submitEOGQuestion6(){
    EOGquestions.push(6);
    console.log("six");
    endGame();
}
function submitEOGQuestion7(){
    EOGquestions.push(7);
    console.log("seven");
    endGame();
}

function endGame(){
    history.push([human.indivScore,teamScore,human.totalCoinsFound,human.pastChoices,EORquestions,EOGquestions[currentGame-1]]); //keeping everything in memory, will need to add type of Pepper failure

    if(currentGame==gamePerExperiment){
        theEnd();
    }else{
        //TODO: text saying need to go answer the questionnaire on the other computer, with a next button
        var container = document.getElementById("main_container");
        container.innerHTML="<div id='endGameTxt'>You finished the first game. Before pursuing to the second and last game, please move to the other computer and fill in the corresponding questionnaire. Once done, you can click on the button below.</div><button id='nextroundButton' onclick='nextGame()'>Next game</button>";
    }
}

function nextGame(){
    //reset everything for the next game
    currentRound=1;
    currentGame++;
    human.tempCoinsFound = 0;
    human.totalCoinsFound = 0;
    human.pastChoices = [];
    EORquestions = [];
    teamScore = 0;
    pepperIndivScore = 0;
    human.indivScore = 0;

    //next game started
    init();
}

function theEnd(){
    //TODO: keeping all the data somewhere
    //TODO: final txt ; add instruction to go back to questionnaire + remind everything that happened?
    var container = document.getElementById("main_container");
    container.innerHTML="the end";
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
function randomIndex(max){//returns an int between zero and max included
    return Math.floor(Math.random() * max);
}

function randomID(x, repeatWord){
    //generate a random id formed by x random words within dbIDWords
    let randId = "";
    let index;

    for(i=0; i<x; i++){
        index = randomIndex(dbIDWords.length);
        randId += dbIDWords[index] + " ";

        if(repeatWord == "false"){
            dbIDWords.splice(index,1);
        }
    }

    return randId;
}