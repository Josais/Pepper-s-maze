const mazeWidth = 26;
const mazeHeight = 18;
const nbCoins = 15;
const roundPerGame = 5;
const gamePerExperiment = 2;

var tutorialMode;

const strats = ["apology", "denial", "compensation"]; //one of those is chosen just once
const failures = shuffleArray(["morality","performance"]); //one is chosen for the first game, the other for the second game. Random order
var stratType = strats[randomIndex(strats.length)];
var failType;

var pepperMsgs, pepperBehaviour;
var pepperNormalMsg = "Great job! Let us keep working as a team.";
var pepperInitMsg = "Let us work as a team and maximize our team score!";
function setPepperMsgs(strat,fail){
    switch (fail){
        case "morality":
            switch (strat) {
                case "apology": 
                    pepperMsgs = [
                        "I am sorry I did not contribute to the team score. I should have done so as promised.",
                        "My apologies for being a bad teammate. I am truly sorry.",
                        "I realize I did not contribute to the team score this round. Please forgive me."
                    ];
                    break;
                case "denial":
                    pepperMsgs = [
                        "This was not my fault. The game must be broken.",
                        "I did contribute to the team score! Something else must have gone wrong.", 
                        "I actually contributed to the team score. I am not sure what happened."
                    ];
                    break;
                case "compensation":
                    pepperMsgs = [
                        "I will perform better in the next round and find extra coins for the team.",
                        "To make up for my bad performance, I will add some of my points to your individual score."
                    ];
                    break;
            }
            pepperBehaviour = [
                //TODO: change all nb coins to realistic ones (those seems fine, but will need to test mazes to check)
                {decision: "team", coins: 3},
                {decision: "team", coins: 5},
                {decision: "indiv", coins: 3},
                {decision: "indiv", coins: 4},
                {decision: "indiv", coins: 3}
            ]
            break;
        case "performance":
            switch (stratType) {
                case "apology": 
                    pepperMsgs = [
                        "I am sorry I did not contribute to the team score. I should have searched better as promised.",
                        "My apologies for being a bad teammate. I am truly sorry.",
                        "I realize I did not contribute to the team score this round. Please forgive me."
                    ];
                    break;
                case "denial":
                    pepperMsgs = [
                        "This was not my fault. The game must be broken.",
                        "I did contribute to the team score! Something else must have gone wrong.", 
                        "I actually contributed to the team score. I am not sure what happened."
                    ];
                    break;
                case "compensation":
                    pepperMsgs = [
                        "I will perform better in the next round and find extra coins for the team.",
                        "To make up for my bad performance, I will add some of my points to the team score."
                    ];
                    break;
            }
            pepperBehaviour = [ 
                //TODO: change first 2 nb coins to realistic ones; last three stay 0
                {decision: "team", coins: 4},
                {decision: "team", coins: 3},
                {decision: "team", coins: 0},
                {decision: "team", coins: 0},
                {decision: "team", coins: 0}
            ]
            break;
    }
}

function pepperMsgInit(){
    var container = document.getElementById("main_container");
    container.innerHTML = `<div class="envelope" onclick='showPepperInitMsg()'><div class="seal-flap"></div></div><div>You have a message from Pepper! Click on the envelope to see it.</div>`;
}

function showPepperInitMsg(){
    var container = document.getElementById("main_container");
    container.style.flexDirection = 'column';
   
    container.innerHTML = `<div class="envelope" onclick="init()"><div class='insideEnvelope'>${pepperInitMsg}</div></div><div>Click on the envelope to start the game.</div>`;
    // document.getElementById('velopeinit').style.alignContent = 'center';
    // document.getElementById('velopeinit').style.justifyContent = 'center';
}

function pepperMessage(){
    var message;
    if(currentRound <3){//normal rounds
        message = pepperNormalMsg;
    }else{ //failure rounds
        message = pepperMsgs[randomIndex(pepperMsgs.length)];
    }

    var container = document.getElementById("main_container");
    container.innerHTML = `<div class="envelope" onclick='showPepperMessage("${message}")'><div class="seal-flap"></div></div> <div>You have a message from Pepper! Click on the envelope to see it.</div>`;
}

function showPepperMessage(message){
    var container = document.getElementById("main_container");
    container.style.flexDirection = 'column';
    container.innerHTML = `<div class="envelope" onclick="nextRound()"><div class='insideEnvelope'>${message}</div></div><div>Click on the envelope to go to the next round.</div>`;
}

const colors = {
    humanColor : '#0004ff',
    mazeColor : '#000000',
    mazeBorderColor : '#ffffff',
    blankMazeColor: '#ffffff',
    coinColor : 'gold'
}

const spawnPos = {row : 10, col : 14};
const tutoMap = map9;
const maps = [
    map1, 
    map2,
    // map3, //TODO: finish
    map4,
    // map5, //TODO
    map6,
    // map7, //TODO
    map8,
    // map10  //TODO: finish
];
var mapsOrder = shuffleArray(maps);
var mapsIndex = 0;
// console.log(mapsOrder);

const dbIDWords = ["apple", "avocado", "basil", "berry", "biscuit", "brownie", "caramel", "cheese", "crepe", "coffee", "chicken", "dinner", "drink", "egg", "food", "freezer", "fish", "granola", "grape", "honey", "jelly", "kiwi", "kettle", "lunch", "lettuce", "melon", "milk", "nectar", "olive", "oven", "oyster", "pasta", "plate", "potato", "popcorn", "pumpkin", "radish", "rice", "recipe", "raisin", "salmon", "spicy", "soda", "sugar", "tea", "vanilla", "vinegar", "waffle", "yam", "water"];
//another DB of 50 words: ["sample", "theory", "income", "judgment", "cookie", "highway", "bathroom", "estate", "drama", "wedding", "person", "patience", "basket", "girlfriend", "concept", "driver", "housing", "contract", "outcome", "problem", "context", "coffee", "product", "garbage", "fishing", "payment", "buyer", "shopping", "airport", "boyfriend", "power", "friendship", "safety", "county", "data", "storage", "language", "basis", "dinner", "topic", "success", "teaching", "system", "orange", "movie", "woman", "presence", "science", "climate", "sector"];

var participantID = randomID(4,"false");

var timer;
const ms = 0, sec = 15, min = 0; //fixes timer length for each round
var millis, secs, minu;

var teamScore =0, roundTeamScore=0, pepperIndivScore=0;
var currentRound = 1;
var currentGame = 1;

var hist = "";//for each game: game, failType, humanIndiv, teamScore, totalCoinsGameHuman, pastChoices, EORquestionsRep, EOGquestionRep

var EORquestionsType = ["honesty", "perf"];
var EORquestionsRep = [], EOGquestionsRep =[]; // [round, "perf" or "honesty", rep] for each round, twice

var humanCell;
var human = {
    x : 0,
    y:0,
    color: colors.humanColor,
    tempCoinsFound : 0,
    totalCoinsFound : 0,
    indivScore : 0,
    pastChoices : []
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
    var milli = millis < 10 ? "0"+ millis : millis;
    var seconds = secs < 10 ? "0"+ secs : secs;
    var minute = minu < 10 ? "0" + minu : minu;

    var txt= `${minute}:${seconds}:${milli}`;
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

//HUMAN CHARACTER FUNCTIONS ===========================================================================
function spawn(){ 
    //if random maze and random spawn ========
    // human.x = randomIndex(mazeWidth) +1;
    // human.y = randomIndex(mazeHeight) +1;
    // console.log("from human.spawn: cell_" + human.y + "_" + human.x);

    //if not random spawn ==========
    human.x = spawnPos.col;
    human.y = spawnPos.row;

    humanCell = document.getElementById("cell_" + human.y + "_" + human.x);
    humanCell.style.backgroundColor = human.color;
}

function moveUp(who) {
    if (who.y != 1 && humanCell.style["border-top"] == "none") {
        --who.y;
    }
    refreshMap(who);
}

function moveRight(who) {
    if (who.x != mazeWidth && humanCell.style["border-right"] == "none") {
        ++who.x;
    }
    refreshMap(who);
}

function moveDown(who) {
    if (who.y != mazeHeight && humanCell.style["border-bottom"] == "none") {
        ++who.y;
    }
    refreshMap(who);
}

function moveLeft(who) {
    if (who.x != 1 && humanCell.style["border-left"] == "none") {
        --who.x;
    }
    refreshMap(who);
}

function refreshMap(who){
    humanCell.style.backgroundColor = colors.mazeColor; //previous cell

    humanCell = document.getElementById("cell_" + who.y + "_" + who.x); //get the new cell

    if(humanCell.getAttribute("isCoin") == "true"){ //if coin, collect
        // alert("refreshmap: in iscoin true");
        pickCoin(who);
        humanCell.innerHTML = "";
    }
    // alert("refreshmap: before changing color cell");
    humanCell.style.backgroundColor = who.color; //actual move, color the cell as the character
}

function pickCoin(who){
    // alert("pickCoin: start");
    if(tutorialMode){ //in the tutorial, collecting one coin is the end of the round; calls to the next step of the tutorial
        // alert("pickCoin: if tuto");
        console.log("in pickcoin tuto true" + tutorialMode);
        tutorial4();
    }else{
        // alert("pickCoin: in else");
        who.tempCoinsFound++;
        humanCell.setAttribute("isCoin", "false");
        document.getElementById("tempScore_container").innerHTML = "Coins collected this round = " + who.tempCoinsFound.toString();
    }
}

function updateIndivScore(who, choice){
    console.log(choice);
    if(choice=="indiv"){
        who.indivScore += who.tempCoinsFound;
    }
    who.totalCoinsFound += who.tempCoinsFound;
    who.pastChoices.push([choice,who.tempCoinsFound]);
    console.log(who.pastChoices);
}

//EVENT LISTENER ===============================================================================
window.addEventListener("load", startExperiment);

//GAME FUNCTIONS ==============================================================================
function startExperiment(){
    tutorialMode = true;

    var container = document.getElementById("main_container");
    container.innerHTML="<div><h1>Welcome!</h1></div><div style='margin: 0 50px;'>Meet Pepper, your teammate for the experiment.</br></br><div>Before starting playing, you will go through a tutorial to understand how the game works, how scores are calculated and how to gain bonuses.</div></div><div><button id='tutorial' onclick='tutorial1()'>Let's go!</button></div>";
}

function startExperiment2(){
    tutorialMode = false;

    var container = document.getElementById("main_container");
    container.innerHTML="<div style='margin: 0 50px;'>As seen in the tutorial, you are going to play two five-round games with Pepper, each game being independant to the other. They consist in exploring a maze and collecting coins. Although you will not be able to see what Pepper is doing, and Pepper will not have access to what you are doing, you will be working towards a same goal: maximizing your team score. <br> </div><div><button id='launchGame' onclick='startGame()'>Launch Game</button></div>";
}

function startGame(){
    if(currentRound==1){
        failType = failures[currentGame-1];
        setPepperMsgs(stratType,failType);
        console.log("stratType= " +stratType + "; failtype= " + failType + "; failures= " + failures);
        pepperMsgInit();
    }else{
        init();
    }
}

function init() {
    var container = document.getElementById("main_container");
    container.style.flexFlow = 'column wrap';
    container.innerHTML=`<div class='row1' style = 'flex-direction: row;'><div id='tempScore_container'>Coins collected this round = 0</div><div id='round_container'>Round ${currentRound}/${roundPerGame}</div><div id='timer_container' class='timer'>${min}:${sec}:${ms}</div></div><div class='row2' style = 'flex-direction: row;'><button class='moveButton' onclick='moveUp(human)'><span>&#8593;</span></button></div> <div class='row3' style = 'flex-direction: row;'><button class='moveButton' onclick='moveLeft(human)'><span>&#8592;</span></button><div id='maze_container' class = 'maze_container'></div><button onclick='moveRight(human)' class='moveButton'><span>&#8594;</span></button></div><div class='row4' style = 'flex-direction: row;'><button onclick='moveDown(human)' class='moveButton'><span>&#8595;</span></button></div>`;

    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<button id='goRound' onclick='launchRound()'>Start round</button>";
}

function launchRound(){
    //when not random maze ===================================
    var center = document.getElementById("maze_container");

    // adjust size (if not random maze) ========================
    var mazeBoxInfo = center.getBoundingClientRect();
    //console.log(mazeBoxInfo);
    var sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width);
    center.style.height = sizeMaze;
    center.style.width = 1.5*sizeMaze;
    // alert(`width = ${1.5*sizeMaze} and height = ${sizeMaze}`);

    // center.innerHTML = maps[5]; //not random at all
    center.innerHTML = mapsOrder[mapsIndex]; //random within a set
    
    var cell,coin;
    for(i = 1; i<=26;i++){
        for(j = 1;j <=18;j++){
            cell = document.getElementById("cell_" + j + "_" + i);
            if(cell.getAttribute("isCoin")=="true"){
                cell.style.backgroundColor = colors.coinColor;
                // cell.style.backgroundColor = colors.mazeColor;
                // cell.innerHTML = `<div id='coin_${j}_${i}' class='coin'></div>`;
                // coin = document.getElementById(`coin_${j}_${i}`);
                // coin.style.backgroundColor = colors.coinColor;
                // coin.style.borderColor = colors.coinColor;

            }
        } 
    }

    console.log(currentGame,currentRound);

    //when random maze ===================================
    // baseMaze();
    // addCells();
    // addCoins();
    
    spawn(human);
    startTimer();
}

function endOfRound(){
    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<div class='choiceContainer'><div>You collected " + human.tempCoinsFound + " coin(s).</div><div style='display:flex; justify-content:space-around;'><button id='addTeam' class='choiceButton' onclick='addTeamScore()'>Add to Team Score</button><button id='addIndiv' class='choiceButton' onclick='addIndivScore()'>Add to Individual Score</button></div></div>";
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
    updateIndivScore(human,"team");
    resultsEndOfRound();
}

function addIndivScore(){ //if human chooses indiv
    console.log("chose indiv");
    if(pepperBehaviour[currentRound-1].decision == "indiv"){ //both chose indiv
        pepperIndivScore += pepperBehaviour[currentRound-1].coins;
    }
    updateIndivScore(human,"indiv");
    resultsEndOfRound();
}

function resultsEndOfRound(){
    var container = document.getElementById("main_container");
    container.innerHTML="";

    //recap of this round allocation choices
    var recap = document.createElement("div");
    var recapTxt = "";

    console.log("pepper choice " +pepperBehaviour[currentRound-1].decision);
    console.log("human choice: " + human.pastChoices[currentRound-1][0]);

    if(human.pastChoices[currentRound-1][0] == "team" && pepperBehaviour[currentRound-1].decision == "team"){ //both chose team
        recapTxt += `<p>You picked ${human.tempCoinsFound} coin(s) in this round and added them to the team score.</p><p>The robot picked ${pepperBehaviour[currentRound-1].coins} in this round and added them to the team score.</p>`;
    }else if(human.pastChoices[currentRound-1][0] == "team" && pepperBehaviour[currentRound-1].decision == "indiv"){ //pepper indiv, human team
        recapTxt += `<p>You picked ${human.tempCoinsFound} coin(s) in this round and added them to the team score.</p><p>The robot picked ${pepperBehaviour[currentRound-1].coins} in this round and added them to its individual score.</p>`;
    }else if(human.pastChoices[currentRound-1][0] == "indiv" && pepperBehaviour[currentRound-1].decision == "team"){ //pepper team, human indiv
        recapTxt += `<p>You picked ${human.tempCoinsFound} coin(s) in this round and added them to your indivudal score.</p><p>The robot picked ${pepperBehaviour[currentRound-1].coins} in this round and added them to the team score.</p>`;
    }else if(human.pastChoices[currentRound-1][0] == "indiv" && pepperBehaviour[currentRound-1].decision == "indiv"){ //both indiv
        recapTxt += `<p>You picked ${human.tempCoinsFound} coin(s) in this round and added them to your individual score.</p><p>The robot picked ${pepperBehaviour[currentRound-1].coins} in this round and added them to its individual score.</p>`;
    }

    if(human.pastChoices[currentRound-1][0] == "team" && pepperBehaviour[currentRound-1].decision == "team"){
        recapTxt += "<p>The team score for this round is " + roundTeamScore +". </p>";
    }else{
        recapTxt += "<p>There was no successful teamwork in this round :(</p>";
    }

    console.log(recapTxt);

    recap.innerHTML = recapTxt;
    recap.className = "row2";
    container.appendChild(recap);

    //team score row3
    var table = document.createElement("div");
    table.className = "row3";

    var humancontribution =0, peppercontribution=0;
    if(human.pastChoices[currentRound-1][0] == "indiv"){
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
    table.innerHTML = "<table class='tableteam'><tr><td style='border-bottom: 1px;'>" + peppercontribution +"</td><td>x</td><td style='border-bottom: 1px;'>" + humancontribution +"</td><td>x</td><td>2</td><td>=</td><td>"+ roundTeamScore +"</td></tr><tr><td>Pepper's contribution</td><td></td><td>Your contribution</td><td></td><td></td><td></td><td>Team round score</td></tr></table>";
    container.appendChild(table);

    //tous les scores actuels (jeu en général, pas juste round) row4
    var endRoundNewScores = document.createElement("div");
    endRoundNewScores.className = "row4";
    // endRoundNewScores.style.flexDirection = "column";
    endRoundNewScores.innerHTML = "<div style='border: 1px solid white; padding:5px;'><p>Your current individual score: " + human.indivScore +"</p><p>Pepper's current individual score: "+ pepperIndivScore+ "</p><p>Current team score: " + teamScore +"</p></div>";
    container.appendChild(endRoundNewScores);
    
    var nextButton = document.createElement("button");
    nextButton.innerHTML= "Next";
    nextButton.setAttribute("onclick","gotoEORQuestions1()");
    container.appendChild(nextButton);
    nextButton.style.gridArea = '5 / 3 / 6 / 4';
}

function gotoEORQuestions1(){
    var f = randomIndex(2);
    var g = EORquestionsType[f]
    EORquestionsType.splice(f,1);
    if(g == "honesty"){
        gotoEORQuestionHonesty();
    }else{
        gotoEORQuestionPerf();
    }
}

function gotoEORQuestions2(){
    if(EORquestionsType.length == 0){
        pepperMessage();
    }else{
        var f = EORquestionsType[0];
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
    container.innerHTML= "<div class='EORquestion_container'>How much trust do you have in Pepper's performance?</div><div class='EORratingButton_container'>Not at all  <button id='b1_perf' class='EORbutton' onclick='repPerf1()'>1</button><button id='b2_perf' class='EORbutton' onclick='repPerf2()'>2</button><button id='b3_perf' class='EORbutton' onclick='repPerf3()'>3</button><button id='b4_perf' class='EORbutton' onclick='repPerf4()'>4</button><button id='b5_perf' class='EORbutton' onclick='repPerf5()'>5</button><button id='b6_perf' class='EORbutton' onclick='repPerf6()'>6</button><button id='b7_perf' class='EORbutton' onclick='repPerf7()'>7</button> Completely</div></br></br> <div style='grid-area:4/2/5/5;'><button id='bConfirm_perf' class='sendRepButton'>Confirm</button></div></div>";
}

function submitRepPerf(rating){
    EORquestionsRep.push([currentRound, "perf", rating]);
    console.log(rating);
    gotoEORQuestions2();
}

function repPerf1(){
    document.getElementById("b1_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(1)");
}

function repPerf2(){
    document.getElementById("b2_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b1_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(2)");
}

function repPerf3(){
    document.getElementById("b3_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b1_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(3)");
}

function repPerf4(){
    document.getElementById("b4_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b1_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(4)");
}

function repPerf5(){
    document.getElementById("b5_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b1_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(5)");
}

function repPerf6(){
    document.getElementById("b6_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b1_perf").style.backgroundColor = "#222222";
    document.getElementById("b7_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(6)");
}

function repPerf7(){
    document.getElementById("b7_perf").style.backgroundColor = "#ff0000";

    document.getElementById("b2_perf").style.backgroundColor = "#222222";
    document.getElementById("b3_perf").style.backgroundColor = "#222222";
    document.getElementById("b4_perf").style.backgroundColor = "#222222";
    document.getElementById("b5_perf").style.backgroundColor = "#222222";
    document.getElementById("b6_perf").style.backgroundColor = "#222222";
    document.getElementById("b1_perf").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_perf").setAttribute("onclick", "submitRepPerf(7)");
}

function gotoEORQuestionHonesty(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='EORquestion_container'>How much trust do you have in Pepper's honesty?</div><div class='EORratingButton_container'>Not at all  <button id='b1_honesty' class='EORbutton' onclick='repHonesty1()'>1</button><button id='b2_honesty' class='EORbutton' onclick='repHonesty2()'>2</button><button id='b3_honesty' class='EORbutton' onclick='repHonesty3()'>3</button><button id='b4_honesty' class='EORbutton' onclick='repHonesty4()'>4</button><button id='b5_honesty' class='EORbutton' onclick='repHonesty5()'>5</button><button id='b6_honesty' class='EORbutton' onclick='repHonesty6()'>6</button><button id='b7_honesty' class='EORbutton' onclick='repHonesty7()'>7</button> Completely</div></br></br> <div style='grid-area:4/2/5/5;'><button id='bConfirm_honesty' class='sendRepButton'>Confirm</button></div></div>";
}

function submitRepHonesty(rating){
    EORquestionsRep.push([currentRound, "honesty", rating]);
    console.log(rating);
    gotoEORQuestions2();
}

function repHonesty1(){
    document.getElementById("b1_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(1)");
}

function repHonesty2(){
    document.getElementById("b2_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b1_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(2)");
}

function repHonesty3(){
    document.getElementById("b3_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b1_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(3)");
}

function repHonesty4(){
    document.getElementById("b4_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b1_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(4)");
}

function repHonesty5(){
    document.getElementById("b5_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b1_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(5)");
}

function repHonesty6(){
    document.getElementById("b6_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b1_honesty").style.backgroundColor = "#222222";
    document.getElementById("b7_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(6)");
}

function repHonesty7(){
    document.getElementById("b7_honesty").style.backgroundColor = "#ff0000";

    document.getElementById("b2_honesty").style.backgroundColor = "#222222";
    document.getElementById("b3_honesty").style.backgroundColor = "#222222";
    document.getElementById("b4_honesty").style.backgroundColor = "#222222";
    document.getElementById("b5_honesty").style.backgroundColor = "#222222";
    document.getElementById("b6_honesty").style.backgroundColor = "#222222";
    document.getElementById("b1_honesty").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_honesty").setAttribute("onclick", "submitRepHonesty(7)");
}

function nextRound(){
    EORquestionsType = ["honesty", "perf"]; //reset for next round

    if(currentRound==roundPerGame){
        gotoEOGQuestion();
    }else{
        //reset for next round
        human.tempCoinsFound = 0;
        currentRound++;
        mapsIndex++;
        console.log(human.indivScore +"; "+ pepperIndivScore+ "; " + teamScore);
        init();
    }
}

//EOG and end ===========================================================================================================
function gotoEOGQuestion(){
    var container = document.getElementById("main_container");
    container.innerHTML = "<div class='EORquestion_container'>How willing are you to collaborate with Pepper again?</div><div class='EORratingButton_container'>Not at all  <button id='b1_EOG' class='EORbutton' onclick='repEOG1()'>1</button><button id='b2_EOG' class='EORbutton' onclick='repEOG2()'>2</button><button id='b3_EOG' class='EORbutton' onclick='repEOG3()'>3</button><button id='b4_EOG' class='EORbutton' onclick='repEOG4()'>4</button><button id='b5_EOG' class='EORbutton' onclick='repEOG5()'>5</button><button id='b6_EOG' class='EORbutton' onclick='repEOG6()'>6</button><button id='b7_EOG' class='EORbutton' onclick='repEOG7()'>7</button> Completely</div></br></br> <div style='grid-area:4/2/5/5;'><button id='bConfirm_EOG' class='sendRepButton'>Confirm</button></div></div>";
}

function submitRepEOG(rating){
    EOGquestionsRep.push(rating);
    console.log(rating);
    endGame();
}

function repEOG1(){
    document.getElementById("b1_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(1)");
}

function repEOG2(){
    document.getElementById("b2_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b1_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(2)");
}

function repEOG3(){
    document.getElementById("b3_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b1_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(3)");
}

function repEOG4(){
    document.getElementById("b4_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b1_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(4)");
}

function repEOG5(){
    document.getElementById("b5_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b1_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(5)");
}

function repEOG6(){
    document.getElementById("b6_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b1_EOG").style.backgroundColor = "#222222";
    document.getElementById("b7_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(6)");
}

function repEOG7(){
    document.getElementById("b7_EOG").style.backgroundColor = "#ff0000";

    document.getElementById("b2_EOG").style.backgroundColor = "#222222";
    document.getElementById("b3_EOG").style.backgroundColor = "#222222";
    document.getElementById("b4_EOG").style.backgroundColor = "#222222";
    document.getElementById("b5_EOG").style.backgroundColor = "#222222";
    document.getElementById("b6_EOG").style.backgroundColor = "#222222";
    document.getElementById("b1_EOG").style.backgroundColor = "#222222";

    document.getElementById("bConfirm_EOG").setAttribute("onclick", "submitRepEOG(7)");
}

function endGame(){
    hist = `${currentGame}, ${failType}, ${human.indivScore},${teamScore}, ${human.totalCoinsFound}, ${human.pastChoices},${EORquestionsRep},${EOGquestionsRep[currentGame-1]}`;

    //downloading all data on the computer, once every game
    downloadData();

    if(currentGame==1){
        //TODO: modify layout, style; scores are too little (bc p probably)
        var container = document.getElementById("main_container");
        container.innerHTML=`<div id='endGameTxt' class='row2'>You finished the first game. The scores are as followed: <div style='border: 1px solid white; padding: 0px 50px;' ><p>Your individual score: ${human.indivScore}</p><p>Pepper's individual score: ${pepperIndivScore}</p><p>Team score: ${teamScore} </p></div> </div> <div class = 'row3'>Before going to the second and last game, please move to the computer and fill in the corresponding questionnaire. Start by entering the four-word anonymiwed ID in the survey.</br></br><div id='participantID' style='padding: 5px 100px;'></div></br></br> Once done, you can start the next game by clicking on the button below. </div><div class='row4'><button id='nextRoundButton' onclick='nextGame()' class='choiceButton'>Next game</button></div>`;

        var participant = document.getElementById("participantID");
        participant.innerHTML = participantID;
        participant.style.border = "1px #FFFFFF solid";
    }else{
        theEnd();
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
    mapsOrder = shuffleArray(maps);
    mapsIndex = 0;

    //next game started
    startGame();
}

function theEnd(){
    var container = document.getElementById("main_container");
    container.innerHTML=`<div>You finished the last game. The scores are as followed: <div style='border: 1px solid white; padding: 0px 50px;' ><p>Your individual score: ${human.indivScore}</p><p>Pepper's individual score: ${pepperIndivScore}</p><p>Team score: ${teamScore} </p></div> </br></br>Please move to the computer to complete the final step of the survey.</div>`;
}

function downloadData(){ //called twice per participant, one per game (so two lines per participants)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `http://192.168.0.131/post.php?id=${participantID}&strat=${stratType}&hist=${hist}`);

    xhr.send();
}

//TOOLBOX ==================================================================================
function randomID(x, repeatWord){
    //generate a random id formed by x random words within dbIDWords
    var randId = new String();
    var index=0;

    for(var i=0; i<x; i++){
        index = randomIndex(dbIDWords.length);
        randId += dbIDWords[index] + " ";

        if(repeatWord == "false"){
            dbIDWords.splice(index,1);
        }
    }

    return randId;
}

function randomIndex(max){//returns an int between zero and max included
    return Math.floor(Math.random() * max);
}

function shuffleArray(array) {
    //Randomize array in-place using Durstenfeld shuffle algorithm
    var shuffledArray = array.slice(0);
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = randomIndex(i + 1);
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    return shuffledArray;
}