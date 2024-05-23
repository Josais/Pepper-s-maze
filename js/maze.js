// const mazeWidth = 26;
// const mazeHeight = 18;
// const nbCoins = 15;
const roundPerGame = 2;
const gamePerExperiment = 2;

const strats = ["apology", "denial", "compensation"]; //one of those is chosen just once
let failures = ["morality","performance"]; //one is chosen for the first game, the other for the second game. Random order
let stratType,failType;

const colors = {
    humanColor : '#0004ff',
    mazeColor : '#000000',
    mazeBorderColor : '#ffffff',
    blankMazeColor: '#ffffff',
    coinColor : '#007c00'
}

const maps = [
    map1, 
    map2,
    map3, //TODO: finish
    map4, //TODO
    map5, //TODO
    map6,
    map7, //TODO
    map8, //TODO
    map9,
    map10  //TODO: finish
];
const spawnPos = {"row" : 10, "col" : 14};
let mapsOrder = shuffleArray(maps);
let mapsIndex = 0;
console.log(mapsOrder);


const dbIDWords = ["apple", "avocado", "basil", "berry", "biscuit", "brownie", "caramel", "cheese", "crepe", "coffee", "chicken", "dinner", "drink", "egg", "food", "freezer", "fish", "granola", "grape", "honey", "jelly", "kiwi", "kettle", "lunch", "lettuce", "melon", "milk", "nectar", "olive", "oven", "oyster", "pasta", "plate", "potato", "popcorn", "pumpkin", "radish", "rice", "recipe", "raisin", "salmon", "spicy", "soda", "sugar", "tea", "vanilla", "vinegar", "waffle", "yam", "water"];
//another DB of 50 words: ["sample", "theory", "income", "judgment", "cookie", "highway", "bathroom", "estate", "drama", "wedding", "person", "patience", "basket", "girlfriend", "concept", "driver", "housing", "contract", "outcome", "problem", "context", "coffee", "product", "garbage", "fishing", "payment", "buyer", "shopping", "airport", "boyfriend", "power", "friendship", "safety", "county", "data", "storage", "language", "basis", "dinner", "topic", "success", "teaching", "system", "orange", "movie", "woman", "presence", "science", "climate", "sector"];

let participantID = randomID(4,"false");

const pepperBehaviourPerf=[ 
    //TODO: change first 2 nb coins to realistic ones; last three stay 0
    {decision: "team", coins: 4},
    {decision: "team", coins: 3},
    {decision: "team", coins: 0},
    {decision: "team", coins: 0},
    {decision: "team", coins: 0}
]
const pepperBehaviourMorality=[
    //TODO: change all nb coins to realistic ones (those seems fine, but will need to test mazes to check)
    {decision: "team", coins: 3},
    {decision: "team", coins: 5},
    {decision: "indiv", coins: 3},
    {decision: "indiv", coins: 4},
    {decision: "indiv", coins: 3}
]
let pepperBehaviour;

let timer;
const ms = 0, sec = 30, min = 0; //fixes timer length for each round
let millis, secs, minu;

let humanCell;
let teamScore =0, roundTeamScore=0, pepperIndivScore=0;
let currentRound = 1;
let currentGame = 1;

let history = []; //[game, failType, humanIndiv, teamScore, totalCoinsGameHuman, pastChoices, EORquestionsRep, EOGquestionRep]

let EORquestionsType = ["honesty", "perf"];
let EORquestionsRep = [], EOGquestionsRep =[]; // [round, "perf" or "honesty", rep] for each round twice

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
        //if random maze and random spawn
        // this.x = randomIndex(mazeWidth) +1;
        // this.y = randomIndex(mazeHeight) +1;
        // console.log("from human.spawn: cell_" + this.y + "_" + this.x);

        //if not random spawn
        this.x = spawnPos["col"];
        this.y = spawnPos["row"];

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
window.addEventListener("load", launchRound); //startExperiment
document.addEventListener("keydown", eventKeyHandlers);

//WELCOME PAGE ETC =========================================================================================
function startExperiment(){ 
    //TODO: need to add tutorial
    console.log(participantID);

    var container = document.getElementById("main_container");
    container.innerHTML="<div class='row2'><h1>Welcome!</h1></div><div class='row3'>You are going to play two short games with Pepper. They consist in exploring a maze and collecting coins. Although you will not be able to see what Pepper is doing, and Pepper will not have accessed to what you are doing, you will be working towards a same goal: maximizing your team score. <br> Before starting the tutorial, please insert the four-word anonymized ID in the survey.</br></br><div id='participantID'></div></div><div style='grid-area: 4 / 2 / 5 / 3;'><button id='tutorial'>Tutorial</button></div><div style='grid-area: 4 / 4 / 5 / 5;'><button id='launchGame' onclick='init()'>Launch Game</button></div>"; //init function for launchgame

    var participant = document.getElementById("participantID");
    participant.innerHTML = participantID;
    participant.style.border = "1px #FFFFFF solid";
}

function init() {
    if(currentGame==1 && currentRound==1){
        stratType = strats[randomIndex(strats.length)];
    }
    if(currentRound==1){
        let f = randomIndex(failures.length);
        failType = failures[f];
        failures.splice(f,1);
        if(failType == "performance"){
            pepperBehaviour = pepperBehaviourPerf;
        }else{
            pepperBehaviour = pepperBehaviourMorality;
        }

        console.log("stratType= " +stratType + "; failtype= " + failType + "; failures= " + failures);
    }

    var container = document.getElementById("main_container");
    container.innerHTML=`<div id='tempScore_container' class='tempScore'>Coins collected this round = 0</div><div id='round' class='round'>Round ${currentRound}/${roundPerGame}</div><div id='timer_container' class='timer'>${min}:${sec}:${ms}</div><div id='timer_c'></div><button id='goUpButton' onclick='human.moveUp()' class='upButton'><span>&#8593;</span></button> </br><button id='goLeftButton' onclick='human.moveLeft()' class='leftButton'><span>&#8592;</span></button><div id='maze_container' class = 'maze_container'></div><button id='goRightButton' onclick='human.moveRight()' class='rightButton'><span>&#8594;</span></button></br><button id='goDownButton' onclick='human.moveDown()' class='downButton'><span>&#8595;</span></button>`;

    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<button id='goRound' class='goRound' onclick='launchRound()' class='smallButton'>Start round</button>";
}

function launchRound(){
    var container = document.getElementById("main_container");
    container.innerHTML=`<div id='tempScore_container' class='tempScore'>Coins collected this round = 0</div><div id='round' class='round'>Round ${currentRound}/${roundPerGame}</div><div id='timer_container' class='timer'>${min}:${sec}:${ms}</div><div id='timer_c'></div><button id='goUpButton' onclick='human.moveUp()' class='upButton'><span>&#8593;</span></button> </br><button id='goLeftButton' onclick='human.moveLeft()' class='leftButton'><span>&#8592;</span></button><div id='maze_container' class = 'maze_container'></div><button id='goRightButton' onclick='human.moveRight()' class='rightButton'><span>&#8594;</span></button></br><button id='goDownButton' onclick='human.moveDown()' class='downButton'><span>&#8595;</span></button>`;

    //when not random maze ===================================
    var center = document.getElementById("maze_container");
    center.innerHTML = maps[8]; //not random at all
    // center.innerHTML = mapsOrder[mapsIndex]; //random within a set

    //adjust size (if not random maze) ========================
    let mazeBoxInfo = document.getElementById("maze_container").getBoundingClientRect();
    //console.log(mazeBoxInfo);
    let sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width);
    document.getElementById("maze_container").style.height = sizeMaze;
    document.getElementById("maze_container").style.width = 1.5*sizeMaze;

    //when random maze ===================================
    // baseMaze();
    // addCells();
    // addCoins();
    
    human.spawn();
    // startTimer();
}

//VARIOUS MAZE CREATIONS FUNCTIONS (only used if random maze) ===============================================================
function baseMaze() {
    let mazeBoxInfo = document.getElementById("maze_container").getBoundingClientRect();
    //console.log(mazeBoxInfo);
    let sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width);

    document.getElementById("maze_container").style.height = sizeMaze;
    document.getElementById("maze_container").style.width = 1.5*sizeMaze;

    //console.log(`height= ${sizeMaze} and width= ${1.5 * sizeMaze}`);

    document.getElementById("maze_container").innerHTML ="";
    var rowIndex, colIndex;

    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
        var row = document.createElement("tr");
        for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {
            var col = document.createElement("td");
            col.style.backgroundColor = colors.blankMazeColor;
            col.style.border= '1px #FFFFFF solid';
            col.setAttribute("id", 'cell_' + rowIndex + '_' + colIndex);  
            col.setAttribute("isCoin", 'false');
            //console.log(col);          
            row.appendChild(col);
        }
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    
    document.getElementById("maze_container").appendChild(table);
}

function addCells() {
	var rowIndex = 1;
	var colIndex = 1;

	var currentCell;
	
    addRoute(rowIndex, colIndex, false);

    for (n = 1; n < (mazeWidth * mazeHeight) - 1; n++) {
        currentCell = document.getElementById('cell_' + rowIndex + '_' + colIndex);
        if (currentCell.getAttribute("occupied") == 'true') {
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
    var currentCell = document.getElementById('cell_' + rowIndex + '_' + colIndex);
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
                    nextPossibleCell = document.getElementById('cell_' + rowIndex + '_' + (colIndex + 1));
                    break;
                case "left":
                    nextPossibleCell = document.getElementById('cell_' + rowIndex + '_' + (colIndex - 1));
                    break;
                case "bottom":
                    nextPossibleCell = document.getElementById('cell_' + (rowIndex + 1) + '_' + colIndex);
                    break;
                case "top":
                    nextPossibleCell = document.getElementById('cell_' + (rowIndex - 1) + '_' + colIndex);
                    break;
            }            
            if (nextPossibleCell != null) {
                if (nextPossibleCell.getAttribute("occupied") != 'true') {                    
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
            currentCell.style["border-"+exit] = 'none';
        } else {
            if (!(exit == "right" && colIndex == mazeWidth - 1 && rowIndex == mazeHeight) &&
                !(exit == "bottom" && colIndex == mazeWidth && rowIndex == mazeHeight - 1) ) {
                currentCell.style["border-"+exit] = 'none';
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
                currentCell.style["border-left"] = 'none';
                break;
            case "bottom":
                currentCell.style["border-top"] = 'none';
                break;
            case "left":
                currentCell.style["border-right"] = 'none';
                break;
            case "top":
                currentCell.style["border-bottom"] = 'none';
                break;
        }

        if (rowIndex == mazeHeight && colIndex == mazeWidth) {
            break;
        }

        currentCell.style.backgroundColor = backgroundColorRoute;
        currentCell.setAttribute("occupied", 'true');
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

        if (cell.getAttribute("isCoin")== 'false'){
            cell.style.backgroundColor = colors.coinColor;
            cell.setAttribute("isCoin", 'true');
        } else{
            i--;
        }
    }
}


//TIMER =========================================================================================================
function timerManager() {
    if(millis!=0){
         millis--;
    }
   
    if(minu == 0 && secs == 0 && millis == 0){
        stopTimer();
        endOfRound();
    }
    if(millis == 0 && secs != 0){
        secs--;
        millis = 100;
    }
    if(secs == 0 && minu != 0){
        minu--;
        secs = 60;
    }

    //Doing some string interpolation
    let milli = millis < 10 ? "0"+ millis : millis;
    let seconds = secs < 10 ? "0"+ secs : secs;
    let minute = minu < 10 ? "0" + minu : minu;

    let txt= `${minute}:${seconds}:${milli}`;
    timer.innerHTML =txt;
};

function startTimer(){
    timer =  document.getElementById("timer_container");

    millis = ms;
    secs = sec;
    minu = min;
    
    // millis = ms < 10 ? "0"+ ms : ms;
    // secs = sec < 10 ? "0"+ sec : sec;
    // minu = min < 10 ? "0"+ min : min;

    timer.innerHTML = `${minu}:${secs}:${millis}`;
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
    center.innerHTML = "<div style='color:white;font-size: 20px; line-height: 30px; letter-spacing: 0px; padding: 0 10px;'><p>You won " + human.tempCoinsFound + " coin(s) this round. You can now choose to add this amount to your team score or to your individual score.<p></br><button id='addTeam' class='choiceButton' onclick='addTeamScore()' class='smallButton'>Add to Team Score</button> <button id='addIndiv' class='choiceButton' onclick='addIndivScore()' class='smallButton'>Add to Individual Score</button></div>";
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

function resultsEndOfRound(){
    var container = document.getElementById("main_container");
    container.innerHTML="";

    //recap of this round allocation choices
    var recap = document.createElement("div");
    var recapTxt = "";

    console.log("pepper choice " +pepperBehaviour[currentRound-1].decision);

    if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "team"){ //both chose team
        recapTxt += `<p>This round, you chose to collaborate and to add your ${human.tempCoinsFound} coin(s) to the team score; Pepper also chose to collaborate and to add its ${pepperBehaviour[currentRound-1].coins} coin(s) to the team score!</p>`;
    }else if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "indiv"){ //pepper indiv, human team
        recapTxt += `<p>This round, you chose to collaborate and to add your ${human.tempCoinsFound} coin(s) to the team score; Pepper chose not to collaborate and is adding its ${pepperBehaviour[currentRound-1].coins} coin(s) to its individual score.</p>`;
    }else if(human.pastChoices[currentRound-1] == "indiv" && pepperBehaviour[currentRound-1].decision == "team"){ //pepper team, human indiv
        recapTxt += `<p>This round, you chose not to collaborate and you are adding your ${human.tempCoinsFound} coin(s) to your individual score; Pepper chose to collaborate and to add its ${pepperBehaviour[currentRound-1].coins} coin(s) to the team score.</p>`;
    }else if(human.pastChoices[currentRound-1] == "indiv" && pepperBehaviour[currentRound-1].decision == "indiv"){ //both indiv
        recapTxt += `<p>This round, you chose not to collaborate and you are adding your ${human.tempCoinsFound} coin(s) to your individual score; Pepper also chose not to collaborate and is adding its ${pepperBehaviour[currentRound-1].coins} coin(s) to its individual score. </p>`;
    }

    if(human.pastChoices[currentRound-1] == "team" && pepperBehaviour[currentRound-1].decision == "team"){
        recapTxt += "<p>This means that the team score for this round is " + roundTeamScore +"! </p>";
    }else{
        recapTxt += "<p>There was no successful teamwork in this round :(</p>";
    }

    recap.innerHTML = recapTxt;
    recap.className = "row2";
    container.appendChild(recap);

    //team score row3
    var table = document.createElement("div");
    table.className = "row3";

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
    table.innerHTML = "<table class='tableTeam'><tr><td style='border-bottom: 1px;'>" + peppercontribution +"</td><td>x</td><td style='border-bottom: 1px;'>" + humancontribution +"</td><td>x</td><td>2</td><td>=</td><td>"+ roundTeamScore +"</td></tr><tr><td>Pepper's contribution</td><td></td><td>Your contribution</td><td></td><td></td><td></td><td>Team round score</td></tr></table>";
    container.appendChild(table);

    //tous les scores actuels (jeu en général, pas juste round) row4
    var endRoundNewScores = document.createElement("div");
    endRoundNewScores.className = "row4";
    endRoundNewScores.innerHTML = "<p>Your current individual score: " + human.indivScore +"</p><p>Pepper's current individual score: "+ pepperIndivScore+ "</p><p>Current team score: " + teamScore +"</p>";
    container.appendChild(endRoundNewScores);

    //TODO: add honesty questionHonesty and random order
    
    var nextButton = document.createElement("button");
    nextButton.innerHTML= "Next";
    nextButton.setAttribute("onclick","gotoEORQuestions1()");
    container.appendChild(nextButton);
    nextButton.style.gridArea = '5 / 3 / 6 / 4';

    //TODO: will need to add Pepper's message AFTER both questions
}

function gotoEORQuestions1(){
    let f = randomIndex(2);
    let g = EORquestionsType[f]
    EORquestionsType.splice(f,1);
    if(g == "honesty"){
        gotoEORQuestionHonesty();
    }else{
        gotoEORQuestionPerf();
    }
}

function gotoEORQuestions2(){
    if(EORquestionsType.length == 0){
        nextRound();
    }else{
        let f = EORquestionsType[0];
        EORquestionsType.splice(0,1);
        if(f == "honesty"){
            gotoEORQuestionHonesty();
        }else{
            gotoEORQuestionPerf();
        }
    }
}

function gotoEORQuestionPerf(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='row2'>How much trust do you have in Pepper's performance?</div><div style='grid-area:3/1/4/6; text-align: center;'>Not at all  <button class='EORbutton' onclick='submitEORQuestionPerf1()'>1</button><button class='EORbutton' onclick='submitEORQuestionPerf2()'>2</button><button class='EORbutton' onclick='submitEORQuestionPerf3()'>3</button><button class='EORbutton' onclick='submitEORQuestionPerf4()'>4</button><button class='EORbutton' onclick='submitEORQuestionPerf5()'>5</button><button class='EORbutton' onclick='submitEORQuestionPerf6()'>6</button><button class='EORbutton' onclick='submitEORQuestionPerf7()'>7</button> Completely</div> <div class='row4' id='perfRepConfirm'>You chose <span id='perfRep'>.</span></br></br> <button class='sendRepButton' onclick='submitEORQuestionPerf()'>Confirm</button></div>";
}

function submitEORQuestionPerf(){
    let rep = document.getElementById("perfRep").innerHTML;
    if(rep == "."){
        alert("You need to give an answer.");
    }else{
        EORquestionsRep.push([currentRound, "perf", rep]);
        console.log(rep);
        gotoEORQuestions2();
    }
}

function submitEORQuestionPerf1(){
    document.getElementById("perfRep").innerHTML = "1";
}
function submitEORQuestionPerf2(){
    document.getElementById("perfRep").innerHTML = "2";
}
function submitEORQuestionPerf3(){
    document.getElementById("perfRep").innerHTML = "3";
}
function submitEORQuestionPerf4(){
    document.getElementById("perfRep").innerHTML = "4";
}
function submitEORQuestionPerf5(){
    document.getElementById("perfRep").innerHTML = "5";
}
function submitEORQuestionPerf6(){
    document.getElementById("perfRep").innerHTML = "6";
}
function submitEORQuestionPerf7(){
    document.getElementById("perfRep").innerHTML = "7";
}

function gotoEORQuestionHonesty(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='row2'>How much trust do you have in Pepper's honesty?</div><div style='grid-area:3/1/4/6; text-align: center;'>Not at all  <button class='EORbutton' onclick='submitEORQuestionHonesty1()'>1</button><button class='EORbutton' onclick='submitEORQuestionHonesty2()'>2</button><button class='EORbutton' onclick='submitEORQuestionHonesty3()'>3</button><button class='EORbutton' onclick='submitEORQuestionHonesty4()'>4</button><button class='EORbutton' onclick='submitEORQuestionHonesty5()'>5</button><button class='EORbutton' onclick='submitEORQuestionHonesty6()'>6</button><button class='EORbutton' onclick='submitEORQuestionHonesty7()'>7</button> Completely</div> <div class='row4' id='honestyRepConfirm'>You chose <span id='honestyRep'>.</span></br></br> <button class='sendRepButton' onclick='submitEORQuestionHonesty()'>Confirm</button></div>";
}

function submitEORQuestionHonesty(){
    let rep = document.getElementById("honestyRep").innerHTML;
    if(rep == "."){
        alert("You need to give an answer.");
    }else{
        EORquestionsRep.push([currentRound, "honesty", rep]);
        console.log(rep);
        gotoEORQuestions2();
    }
}

function submitEORQuestionHonesty1(){
    document.getElementById("honestyRep").innerHTML = "1";
}
function submitEORQuestionHonesty2(){
    document.getElementById("honestyRep").innerHTML = "2";
}
function submitEORQuestionHonesty3(){
    document.getElementById("honestyRep").innerHTML = "3";
}
function submitEORQuestionHonesty4(){
    document.getElementById("honestyRep").innerHTML = "4";
}
function submitEORQuestionHonesty5(){
    document.getElementById("honestyRep").innerHTML = "5";
}
function submitEORQuestionHonesty6(){
    document.getElementById("honestyRep").innerHTML = "6";
}
function submitEORQuestionHonesty7(){
    document.getElementById("honestyRep").innerHTML = "7";
}

function nextRound(){
    EORquestionsType = ["honesty", "perf"]; //reset for next round

    if(currentRound==roundPerGame){
        gotoEOGQuestion();
    }else{
        //reset for next round
        human.tempCoinsFound = 0;
        currentRound++;
        mapsIndex++; //if not random map
        console.log(human.indivScore +"; "+ pepperIndivScore+ "; " + teamScore);
        init();
    }
}

//EOG ===========================================================================================================
function gotoEOGQuestion(){
    var container = document.getElementById("main_container");
    container.innerHTML = "<div class='row2'>How willing are you to collaborate with Pepper again?</div><div style='grid-area:3/1/4/6; text-align: center;'>Not at all  <button class='EOGbutton' onclick='submitEOGQuestion1()'>1</button><button class='EOGbutton' onclick='submitEOGQuestion2()'>2</button><button class='EOGbutton' onclick='submitEOGQuestion3()'>3</button><button class='EOGbutton' onclick='submitEOGQuestion4()'>4</button><button class='EOGbutton' onclick='submitEOGQuestion5()'>5</button><button class='EOGbutton' onclick='submitEOGQuestion6()'>6</button><button class='EOGbutton' onclick='submitEOGQuestion7()'>7</button> Completely</div><div class='row4' id='EOGquestionConfirm'>You chose <span id='EOGRep'>.</span></br></br> <button class='sendRepButton' onclick='submitEOGQuestion()'>Confirm</button></div>";
}

function submitEOGQuestion(){
    let rep = document.getElementById("EOGRep").innerHTML;
    if(rep == "."){
        alert("You need to give an answer.");
    }else{
        EOGquestionsRep.push([currentRound, rep]);
        console.log(rep);
        endGame();
    }
}

function submitEOGQuestion1(){
    document.getElementById("EOGRep").innerHTML = "1";
}
function submitEOGQuestion2(){
    document.getElementById("EOGRep").innerHTML = "2";
}
function submitEOGQuestion3(){
    document.getElementById("EOGRep").innerHTML = "3";
}
function submitEOGQuestion4(){
    document.getElementById("EOGRep").innerHTML = "4";
}
function submitEOGQuestion5(){
    document.getElementById("EOGRep").innerHTML = "5";
}
function submitEOGQuestion6(){
    document.getElementById("EOGRep").innerHTML = "6";
}
function submitEOGQuestion7(){
    document.getElementById("EOGRep").innerHTML = "7";
}

function endGame(){
    history.push([currentGame, failType, human.indivScore,teamScore,human.totalCoinsFound,human.pastChoices,EORquestionsRep,EOGquestionsRep[currentGame-1]]); //keeping everything in memory

    if(currentGame==gamePerExperiment){
        theEnd();
    }else{
        var container = document.getElementById("main_container");
        container.innerHTML=`<div id='endGameTxt' class='row2'>You finished the first game. The scores are as followed: <p>Your individual score: ${human.indivScore}</p><p>Pepper's individual score: ${pepperIndivScore}</p><p>Team score: ${teamScore} </p> </div> <div class = 'row3'>Before going to the second and last game, please move to the other computer and fill in the corresponding questionnaire. Once done, you can start the next game by clicking on the button below. </div><div class='row4'><button id='nextRoundButton' onclick='nextGame()' class='choiceButton'>Next game</button></div>`;
    }
}

function nextGame(){
    //reset everything for the next game
    currentRound=1;
    currentGame++;
    human.tempCoinsFound = 0;
    human.totalCoinsFound = 0;
    human.pastChoices = [];
    EORquestionsRep = [];
    EORquestionsType = ["honesty", "perf"];
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
    container.innerHTML="<div class='bigBlock'>the end</div>";
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

function shuffleArray(array) {
    //Randomize array in-place using Durstenfeld shuffle algorithm
    let shuffledArray = array.slice(0);
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = randomIndex(i + 1);
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    return shuffledArray;
}