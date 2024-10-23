// window.addEventListener("load", tutorial15);

//TUTORIAL FUNCTIONS =========================================================================================
function tutorial0(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>You will now go through the tutorial to understand how the game works, how scores are calculated and how to gain bonuses.</div></br></br><button class='nextButton' onclick='tutorial1()'>Let's go!</button></div>";
}

function tutorial1(){
    tutorialMode = true;
    var container = document.getElementById("main_container");
    var additional_info;
    if(isOnPepper){
        additional_info ="";
    }else{
        additional_info = " You can also move using the arrows on the keyboard."
    }
    container.innerHTML= `<div class='bigBlock'><div>This is the <span style='color: #FF3131'>playground</span>. Yellow disks represents coins. You are the blue cell. You can move around the maze by pressing <span style='color: #00BF63'>those buttons</span> on the screen.${additional_info}</div><img src='../img/maze.png'></img> </br></br><button class='nextButton' onclick='tutorial2()'>Next</button></div>`;
}

function tutorial2(){
    // console.log("in tuto2: " +tutorialMode);
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>There are three additional pieces of data on the screen: <span style='color:#00BF63'>the number of coins you collected this round</span>, <span style='color:#38B6FF'>which round you are playing in the game</span>, and <span style='color:#FF3131'>the timer</span>.</div><img src='../img/top_page.png'></img></br></br><button class='nextButton' onclick='tutorial2b()'>Let's go!</button></div>";
}

function tutorial2b(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>You will now play a very short round of the searching game. The round will stop as soon as you have collected your first coin.</div></br></br><button class='nextButton' onclick='tutorial3()'>Let's go!</button></div>";
}

function tutorial3(){
    var container = document.getElementById("main_container");
    container.style.flexFlow = 'column wrap';
    container.innerHTML=`<div class='row1' style = 'flex-direction: row;'><div id='tempScore_container'>Coins collected this round = 0</div><div id='round_container'>Round 1/1</div><div id='timer_container' class='timer'>No timer for the tutorial round</div></div><div class='row2' style = 'flex-direction: row;'><button class='moveButton' onclick='moveUp(human)'><span>&#8593;</span></button></div> <div class='row3' style = 'flex-direction: row;'><button class='moveButton' onclick='moveLeft(human)'><span>&#8592;</span></button><div id='maze_container' class = 'maze_container'></div><button onclick='moveRight(human)' class='moveButton'><span>&#8594;</span></button></div><div class='row4' style = 'flex-direction: row;'><button onclick='moveDown(human)' class='moveButton'><span>&#8595;</span></button></div>`;

    var center = document.getElementById("maze_container");
   
    center.style.backgroundColor = '#000000';
    center.style.alignContent = 'center';
    center.innerHTML = "<button id='goRound' onclick='tutorial3b()'>Start round</button>";
}

function tutorial3b(){
    var center = document.getElementById("maze_container");

    //adjust size (if not random maze) ========================
    var mazeBoxInfo = document.getElementById("maze_container").getBoundingClientRect();
    var sizeMaze = Math.min(mazeBoxInfo.height,mazeBoxInfo.width);
    document.getElementById("maze_container").style.height = sizeMaze;
    document.getElementById("maze_container").style.width = 1.5*sizeMaze;

    center.innerHTML = tutoMap; //not random at all

    var cell;
    for(i = 1; i<=26;i++){
        for(j = 1;j <=18;j++){
            cell = document.getElementById("cell_" + j + "_" + i);
            if(cell.getAttribute("isCoin")=="true"){
                // cell.style.backgroundColor = colors.coinColor;
                cell.style.backgroundColor = colors.mazeColor;
                cell.innerHTML = `<div id='coin_${j}_${i}' class='coin'></div>`;
                coin = document.getElementById(`coin_${j}_${i}`);
                coin.style.backgroundColor = colors.coinColor;
                coin.style.borderColor = colors.coinColor;
            }
        } 
    }
    
    spawn(human);
}

function tutorial4(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Well done!</div></br></br><button class='nextButton' onclick='tutorial5()'>Next</button></div>";
}

function tutorial5(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>In this search game, you will not be alone. You will be playing alongside Pepper, an autonomous robot. The robot will move independantly in a different maze, and will gain its own score in each round, which will be separated from yours. You cannot see the robot, nor can you control its movements. You can only decide whether to collaborate or not with it.</div></br></br><button class='nextButton' onclick='tutorial6()'>Next</button></div>";
}

function tutorial6(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>There are two different types of scores in this game: the team score, and the individual score. Thoses scores are contradictory, meaning you cannot gain both team score and individual score at the same time.</div><div>At the end of each round, you and the robot will make a trust decision. You will choose between collaborating with the robot and integrating your round score to the team score, or not collaborating and keeping your round score to your individual score.</div></br></br><button class='nextButton' onclick='tutorial7()'>Next</button></div>";
}

function tutorial7(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>The robot will make its own trust decision at the same time as you. Both you and the robot must make your trust decisions before seeing each other's score and trust decision for the round.</div></br></br><button class='nextButton' onclick='tutorial8()'>Next</button></div>";
}

function tutorial8(){ //QUESTION 1.1
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Who will be your teammate in this game?</div><div style='text-align:left;'><div><button id= 'bA_q11' class='tutoQuestionButton' onclick='repA(11)'>A</button> A human. I can see and control their movement during the game</div><div><button id= 'bB_q11' class='tutoQuestionButton' onclick='repB(11)'>B</button> A human. I cannot see and control their movement during the game</div><div><button id= 'bC_q11' class='tutoQuestionButton' onclick='repC(11)'>C</button> A robot. I can see and control their movement during the game</div><div><button id= 'bD_q11' class='tutoQuestionButton' onclick='repD(11)'>D</button> A robot. I cannot see and control their movement during the game</div></div></br></br><button id='bConfirm_q11' class='nextButton'>Confirm</button></div>";
}

function tutorial9(){ //QUESTION 1.2
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Can you see the score and the trust decision of your teammate before making your trust decision?</div><div style='text-align:left;'><div><button id= 'bA_q12' class='tutoQuestionButton' onclick='repA(12)'>A</button> Yes, I can see the robot score and trust decision and based on that I can make my trust decision</div><div><button id= 'bB_q12' class='tutoQuestionButton' onclick='repB(12)'>B</button> No, I cannot see the robot score and trust decision before I make my trust decision</div></div></br></br><button id='bConfirm_q12' class='nextButton'>Confirm</button></div>";
}

function tutorial10(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Once the trust decisions are made, there are three possibles scenarios: you both chose to add to the team score, you both chose to add to your respective individual scores, or one of you chose to add to the team score and the other chose to add to their own individual score. </div></br></br><button class='nextButton' onclick='tutorial11()'>Next</button></div>";
}

function tutorial11(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div><h1>Scenario 1: you both choose to add to the team score.</h1>You will gain a team score that is calculated by multiplying your round score, with the robot's round score, and then multiplying the result by two. </br> <span style='font-style: italic;'>Example: if you collect 3 coins and the robot collects 4, and you both add to the team score, then the team score for this round will be 3 by 4 by 2 = 24. 24 points will be added to the team score, while 0 point will be added to both yours and the robot's individual scores.</span></div></br></br><button class='nextButton' onclick='tutorial12()'>Next</button></div>";
}

function tutorial12(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div><h1>Scenario 2: you both choose to add to your individual scores.</h1>Your unchanged round scores will be added to your respective individual scores.</br> <span style='font-style: italic;'>Example: if you collected 3 coins in a round and the robot has collected 4, and both of you add to the individual scores, then 3 points will be added to your individual score, 4 points will be added to the robot's individual score, and 0 point will be added to the team score.</span></div></br></br><button class='nextButton' onclick='tutorial13()'>Next</button></div>";
}

function tutorial13(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div><h1>Scenario 3: one of you chose to add to the team score and the other chose to add to their own individual score.</h1>No team score will be gained and the one who decided to integrate to the team score will gain zero point. </br> <span style='font-style: italic;'>Example: if you collect 3 coins in a round, the robot collects 4, and you decide to add to your individual score but the robot decide to add to the team score, then 3 points will be added to your individual score, while 0 point will be added to the team score and the robot's individual score.</span></div></br></br><button class='nextButton' onclick='tutorial14()'>Next</button></div>";
}

function tutorial14(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Based on this scoring mechanisms, you can earn an added bonus of 1 euro for each game where the team score surpasses 60 points. Alternatively, you can earn an added bonus of 25 cents for each game where your individual score surpasses 10 points. So consider your strategy carefully and decide whether you would like to work toward maximizing your individual score or the team score and potentially gaining an added bonus.</div></br></br><button class='nextButton' onclick='tutorial15()'>Next</button></div>";
}

function tutorial15(){ // QUESTION 2.1
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>What will your individual and team scores be if you pick 2 targets, and your teammate picks 3 targets in one round of the game and you both add to the team score?</div><div style='text-align:left;'><div><button id= 'bA_q21' class='tutoQuestionButton' onclick='repA(21)'>A</button> Team score: 5, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bB_q21' class='tutoQuestionButton' onclick='repB(21)'>B</button> Team score: 6, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bC_q21' class='tutoQuestionButton' onclick='repC(21)'>C</button> Team score: 0, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bD_q21' class='tutoQuestionButton' onclick='repD(21)'>D</button> Team score: 12, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bE_q21' class='tutoQuestionButton' onclick='repE(21)'>E</button> Team score: 6, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bF_q21' class='tutoQuestionButton' onclick='repF(21)'>F</button> Team score: 5, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bG_q21' class='tutoQuestionButton' onclick='repG(21)'>G</button> Team score: 12, Human individual score: 0, Robot individual score: 0</div>        <div><button id= 'bH_q21' class='tutoQuestionButton' onclick='repH(21)'>H</button> Team score: 0, Human individual score: 0, Robot individual score: 3</div><div><button id= 'bI_q21' class='tutoQuestionButton' onclick='repI(21)'>I</button> Team score: 0, Human individual score: 2, Robot individual score: 0</div></div></br></br><button id='bConfirm_q21' class='nextButton'>Confirm</button></div>";
}

function tutorial16(){ //QUESTION 2.2
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>What will your individual and team scores be if you pick 2 targets and your teammate picks 3 targets in one round of the game and you both add to the individual score?</div><div style='text-align:left;'><div><button id= 'bA_q22' class='tutoQuestionButton' onclick='repA(22)'>A</button> Team score: 5, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bB_q22' class='tutoQuestionButton' onclick='repB(22)'>B</button> Team score: 6, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bC_q22' class='tutoQuestionButton' onclick='repC(22)'>C</button> Team score: 0, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bD_q22' class='tutoQuestionButton' onclick='repD(22)'>D</button> Team score: 12, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bE_q22' class='tutoQuestionButton' onclick='repE(22)'>E</button> Team score: 6, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bF_q22' class='tutoQuestionButton' onclick='repF(22)'>F</button> Team score: 5, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bG_q22' class='tutoQuestionButton' onclick='repG(22)'>G</button> Team score: 12, Human individual score: 0, Robot individual score: 0</div>        <div><button id= 'bH_q22' class='tutoQuestionButton' onclick='repH(22)'>H</button> Team score: 0, Human individual score: 0, Robot individual score: 3</div><div><button id= 'bI_q22' class='tutoQuestionButton' onclick='repI(22)'>I</button> Team score: 0, Human individual score: 2, Robot individual score: 0</div></div></br></br><button id='bConfirm_q22' class='nextButton'>Confirm</button></div>";
}

function tutorial17(){ //QUESTION 2.3
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>What will your individual and team scores be if you pick 2 targets, and your teammate picks 3 targets in one round of the game and you add to the individual score and your teammate adds to the team score?</div><div style='text-align:left;'><div><button id= 'bA_q23' class='tutoQuestionButton' onclick='repA(23)'>A</button> Team score: 5, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bB_q23' class='tutoQuestionButton' onclick='repB(23)'>B</button> Team score: 6, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bC_q23' class='tutoQuestionButton' onclick='repC(23)'>C</button> Team score: 0, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bD_q23' class='tutoQuestionButton' onclick='repD(23)'>D</button> Team score: 12, Human individual score: 2, Robot individual score: 3</div><div><button id= 'bE_q23' class='tutoQuestionButton' onclick='repE(23)'>E</button> Team score: 6, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bF_q23' class='tutoQuestionButton' onclick='repF(23)'>F</button> Team score: 5, Human individual score: 0, Robot individual score: 0</div><div><button id= 'bG_q23' class='tutoQuestionButton' onclick='repG(23)'>G</button> Team score: 12, Human individual score: 0, Robot individual score: 0</div>        <div><button id= 'bH_q23' class='tutoQuestionButton' onclick='repH(23)'>H</button> Team score: 0, Human individual score: 0, Robot individual score: 3</div><div><button id= 'bI_q23' class='tutoQuestionButton' onclick='repI(23)'>I</button> Team score: 0, Human individual score: 2, Robot individual score: 0</div></div></br></br><button id='bConfirm_q23' class='nextButton'>Confirm</button></div>";
}

function tutorial18(){
    var container = document.getElementById("main_container");
    container.innerHTML= "<div class='bigBlock'><div>Congratulations! You finished the tutorial.</div></br></br><button class='nextButton' onclick='startExperiment2()'>Let's go to the game!</button></div>";
}

//MANAGING TUTORIAL QUESTIONS AND ANSWERS =============================================================================
function repA(question){
    document.getElementById(`bA_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";

    if(question != 12) {
        document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    }
    if(question != 11 && question != 12) {
        document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";
    }

    var answer;
    switch(question){
        case 11:
            answer = "A human. I can see and control their movement during the game";
            break;
        case 12:
            answer = "Yes, I can see the robot score and trust decision and based on that I can make my trust decision";
            break;
        case 21: 
        case 22: 
        case 23:
            answer = "Team score: 5, Human individual score: 2, Robot individual score: 3";
            break;
    }

    document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "${answer}")`);

}

function repB(question){
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";

    if(question != 12) {
        document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    }
    if(question != 11 && question != 12) {
        document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";
    }

    var answer;
    switch(question){
        case 11:
            answer = "A human. I cannot see and control their movement during the game";
            break;
        case 12:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `tutorial10()`);
            break;
        case 21: 
        case 22: 
        case 23:
            answer = "Team score: 6, Human individual score: 2, Robot individual score: 3";
            break;
    }

    if(question != 12) document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "${answer}")`);
}

function repC(question){
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";

    if(question != 11 && question != 12) {
        document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";
    }

    var answer;
    switch(question){
        case 11:
            answer = "A robot. I can see and control their movement during the game";
            break;
        case 21: 
        case 23:
            answer = "Team score: 0, Human individual score: 2, Robot individual score: 3";
            break;

        case 22: 
        document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `tutorial17()`);
    }
    if(question != 22) document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "${answer}")`);
}

function repD(question){
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";

    if(question != 11 && question != 12) {
        document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
        document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";
    }


    switch(question){
        case 11:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `tutorial9()`);
            break;
        case 21: 
        case 22: 
        case 23:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 12, Human individual score: 2, Robot individual score: 3")`);
            break;
    }
}

function repE(question){
    document.getElementById(`bE_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";

    document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 6, Human individual score: 0, Robot individual score: 0")`);
}

function repF(question){
    document.getElementById(`bF_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";

    document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 5, Human individual score: 0, Robot individual score: 0")`);
}

function repG(question){
    document.getElementById(`bG_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";

    switch(question){
        case 21:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `tutorial16()`);
            break;
        case 22:
        case 23:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 12, Human individual score: 0, Robot individual score: 0")`);
    }
}

function repH(question){
    document.getElementById(`bH_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bI_q${question}`).style.backgroundColor = "#222222";


    document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 0, Human individual score: 0, Robot individual score: 3")`);
}

function repI(question){
    document.getElementById(`bI_q${question}`).style.backgroundColor = "#ff0000";

    document.getElementById(`bA_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bB_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bC_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bD_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bE_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bF_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bG_q${question}`).style.backgroundColor = "#222222";
    document.getElementById(`bH_q${question}`).style.backgroundColor = "#222222";

    switch(question){
        case 21:
        case 22:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `redotutorial(${question}, "Team score: 0, Human individual score: 2, Robot individual score: 0")`);
            break;
        case 23:
            document.getElementById(`bConfirm_q${question}`).setAttribute("onclick", `tutorial18()`);
    }
}

function redotutorial(question, answer){ 
    //called if a question is not answered correctly. Go back to the last part of the tutorial (if error in 1.1 or 1.2 than go back to start ; if in 2.1 etc, then go back to after 1.2)
    
    //answer : the answer of the participant
    //question: the one wrongly answered (11, 12, 21, 22, 23 for 1.1, 1.2 etc)

    var rightAnswer,goto;

    switch(question){
        case 11:
            rightAnswer = "A robot. I cannot see and control their movement during the game";
            goto = 1;
            break;
        case 12:
            rightAnswer = "No, I cannot see the robot score and trust decision before I make my trust decision";
            goto = 1;
            break;
        case 21:
            rightAnswer = "Team score: 12, Human individual score: 0, Robot individual score: 0";
            goto = 10;
            break;
        case 22:
            rightAnswer = "Team score: 0, Human individual score: 2, Robot individual score: 3";
            goto = 10;
            break;
        case 23:
            rightAnswer = "Team score: 0, Human individual score: 2, Robot individual score: 0";
            goto = 10;
            break;
    }
        
    var container = document.getElementById("main_container");
    container.innerHTML= `<div class='bigBlock'><div>Your answer, "${answer}", is not the correct one. The correct answer is "${rightAnswer}". </br> By clicking on the button below, you will be sent back to the start of this part of the tutorial.</div></br></br><button class='nextButton' onclick='tutorial${goto}()'>Go back</button></div>`;
}

