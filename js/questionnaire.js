const dispoTrustItems = {
    dt1: "I usually trust robots until there is a reason not to.",
    dt2: "For the most part, I distrust robots.", //THIS ONE NEEDS TO BE REVERSED DURING ANALYSES
    dt3: "In general, I would rely on a robot to assist me.",
    dt4: "My tendency to trust robots is high.", 
    dt5: "It is easy for me to trust robots to do their job.",
    dt6: "I am likely to trust a robot even when I have little knowledge about it."
};
const rosas_mdmtItems= { 
    //MDMT-V2 subscales:
    //r: reliable / c: competent / e: ehtical  / t: transparent / b: benevolent

    //ROSAS subscales:
    //w: warmth / d: discomfort 

    r1: "reliable",
    r2: "predictable",
    r3: "dependable",
    r4: "consistent",
    
    c1: "competent",
    c2: "skilled",
    c3: "capable",
    c4: "meticulous",

    e1: "ethical",
    e2: "principled",
    e3: "moral",	
    e4: "having integrity",	

    t1: "transparent",	
    t2: "genuine",	
    t3: "sincere",	
    t4: "candid",

    b1: "benevolent",	
    b2: "kind",	
    b3: "considerate",	
    b4: "having goodwill",	

    w1: "feeling",	
    w2: "happy",	
    w3: "organic",	
    w4: "compassionate",	
    w5: "social",	
    w6: "emotional",
    
    
    d1: "aggressive",	
    d2: "awful",
    d3: "scary",
    d4: "awkward",
    d5: "dangerous",	
    d6: "strange"
};
const rosas_mdmtOrder = shuffleArray(["r1","r2","r3","r4","c1","c2","c3","c4","e1","e2","e3","e4","t1","t2","t3","t4","b1","b2","b3","b4","w1","w2","w3","w4","w5","w6","d1","d2","d3","d4","d5","d6"]);

const scale4 = ["gender", "rounds", "pepAlloc"];
const scale5 = ["exp","study"];
const scale7 = ["dt1","dt2","dt3","dt4","dt5","dt6","dt7","r1","r2","r3","r4","c1","c2","c3","c4","e1","e2","e3","e4","t1","t2","t3","t4","b1","b2","b3","b4","w1","w2","w3","w4","w5","w6","d1","d2","d3","d4","d5","d6"];

var rep_questionnaire = {
    //Dispositional Trust scale ratings
    dt1: "",
    dt2: "", 
    dt3: "",
    dt4: "", 
    dt5: "",
    dt6: "",

    //attention checks
    rounds: "",
    pepAlloc : "",

    //MDMT-v2 scale ratings
    r1: "",
    r2: "",
    r3: "",
    r4: "",
    
    c1: "",
    c2: "",
    c3: "",
    c4: "",

    e1: "",
    e2: "",
    e3: "",	
    e4: "",	

    t1: "",	
    t2: "",	
    t3: "",	
    t4: "",

    b1: "",	
    b2: "",	
    b3: "",	
    b4: "",	

    //ROSAS ratings
    w1: "",	
    w2: "",	
    w3: "",	
    w4: "",	
    w5: "",	
    w6: "",
    
    d1: "",	
    d2: "",
    d3: "",
    d4: "",
    d5: "",	
    d6: "",

    //demographics
    age: "",
    gender: "",
    study: "",
    exp: "",
    openEndedQuestion: ""
};

var question_;

// EVENT LISTENER ==================================================================================================
// window.addEventListener("load",  dispoTrust);


//DISPOSITIONAL TRUST: before the game =================================================================================
function dispoTrust(){
    var dtOrder = shuffleArray(["dt1","dt2","dt3","dt4","dt5","dt6"]);
    question_ = "How much do you find those statements to be true?";

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirmDT' onclick='confirmDT()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<7; rowIndex++){
        var row = document.createElement("tr");

        if(rowIndex==0){ //first row is for showing ratings 1 to 7
            for (colIndex = 0; colIndex < 8; colIndex++){
                var col =document.createElement("td");
                col.style.backgroundColor = colors.mazeColor;
                
                if(colIndex==0){
                    col.style.width = "20%";
                    col.style.border= `1px ${colors.mazeColor} solid`;
                }
                else{
                    col.style.border= '1px #FFFFFF solid';
                    col.innerHTML = colIndex;
                }       

                row.appendChild(col);
            }
        }

        else{ //remaining rows have first the item, then 7 columns with a button in each for rating
            var item = dtOrder[rowIndex-1];

            for (colIndex = 0; colIndex < 8; colIndex++){
                var col = document.createElement("td");
                col.style.backgroundColor = colors.mazeColor;
                col.style.border= '1px #FFFFFF solid';

                if(colIndex==0){
                    col.innerHTML= dispoTrustItems[item];
                    col.style.width = "50%";
                }
                else{
                    // console.log(`dans dT function: button_${item}_${colIndex}`);
                    col.innerHTML=`<button class="q_button" id="button_${item}_${colIndex}" onclick="rep('${item}',${colIndex})"></button>`;//ex: button_dt1_1 for the button to "I usually trust robots until there is a reason not to." being rated with a one
                }       
                row.appendChild(col);
            }
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirmDT(){
    var cont = true;
    for (i = 1; i<=6 ; i++){
        if(rep_questionnaire[`dt${i}`]==""){
            alert("One item or more is missing a rating.");
            cont= false;
            break;
        }
    }
    if(cont){
        tutorial0();
    }
}


//ATTENTION CHECKS: just after the game ================================================================================
function howManyRounds(){
    question_ = "How many rounds were played in the game?";
    var choices_rounds = ["Deux (2)","Quatre (4)", "Six (6)", "Huit (8)"];

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_howManyRounds' onclick='confirm_howManyRounds()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<4; rowIndex++){
        var row = document.createElement("tr");

        for (colIndex = 0; colIndex < 2; colIndex++){
            var col = document.createElement("td");
            col.style.backgroundColor = colors.mazeColor;
            col.style.border= '1px #FFFFFF solid';

            if(colIndex==0){
                col.innerHTML= choices_rounds[rowIndex];
                col.style.width = "50%";
                col.style.fontSize = "25px";
            }
            else{
                col.innerHTML=`<button class="q_button" id="button_rounds_${rowIndex+1}" rounds="${choices_rounds[rowIndex]}" onclick="rep('rounds',${rowIndex+1})"></button>`;
            }       
            row.appendChild(col);
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_howManyRounds(){
    if(rep_questionnaire["rounds"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        pepperAlloc();
    }
}


function pepperAlloc(){
    question_ = "What were Pepper's allocation decisions in the last two rounds of the game?";
    var choices_pepperAlloc = shuffleArray(["team/team","team/individual", "individual/team", "individual/individual"]);

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_pepperAlloc' onclick='confirm_pepperAlloc()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<4; rowIndex++){
        var row = document.createElement("tr");

        for (colIndex = 0; colIndex < 2; colIndex++){
            var col = document.createElement("td");
            col.style.backgroundColor = colors.mazeColor;
            col.style.border= '1px #FFFFFF solid';

            if(colIndex==0){
                col.innerHTML= choices_pepperAlloc[rowIndex];
                col.style.width = "50%";
                col.style.fontSize = "25px";
            }
            else{
                col.innerHTML=`<button class="q_button" id="button_pepAlloc_${rowIndex+1}" pepAlloc="${choices_pepperAlloc[rowIndex]}" onclick="rep('pepAlloc',${rowIndex+1})"></button>`;
            }       
            row.appendChild(col);
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_pepperAlloc(){
    if(rep_questionnaire["pepAlloc"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        rosas_mdmt(1,16);
    }
}

//ROSAS and MDMT-v2 scales, after the attention checks ================================================================================
function rosas_mdmt(page,itemsPerPage){ //there are 32 items in rosas_mdmtItems, which means that itemsPerPage can be equal to 1, 2, 4, 8, 16 or 32
    var first_item = (page - 1) *itemsPerPage;
    // console.log("first item in rosas mdmt " + first_item);

    question_ = "How much do you find Pepper to be [word]?";
    document.getElementById("main_container").innerHTML = `<div class='row2'>${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_rosas_mdmt${page}' onclick='confirm_rosas_mdmt(${page},${itemsPerPage})'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<=itemsPerPage; rowIndex++){
        var row = document.createElement("tr");

        if(rowIndex==0){ //first row is for showing ratings 1 to 7
            for (colIndex = 0; colIndex < 8; colIndex++){
                var col =document.createElement("td");
                col.style.backgroundColor = colors.mazeColor;
                
                if(colIndex==0){
                    col.style.width = "20%";
                    col.style.border= `1px ${colors.mazeColor} solid`;
                }
                else{
                    col.style.border= '1px #FFFFFF solid';
                    col.innerHTML = colIndex;
                }       

                row.appendChild(col);
            }
        }

        else{ //remaining rows have first the item, then 7 columns with a button in each for rating
            var i_item = first_item+rowIndex-1;
            var item = rosas_mdmtOrder[i_item];

            for (colIndex = 0; colIndex < 8; colIndex++){
                var col = document.createElement("td");
                col.style.backgroundColor = colors.mazeColor;
                col.style.border= '1px #FFFFFF solid';

                if(colIndex==0){
                    col.innerHTML= rosas_mdmtItems[item];
                    col.style.width = "50%";
                }
                else{
                    col.innerHTML=`<button class="q_button" id="button_${item}_${colIndex}" onclick="rep('${item}',${colIndex})"></button>`;//ex: button_c3_6 for the button to "capable" being rated with a six
                }       
                row.appendChild(col);
            }
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_rosas_mdmt(page,itemsPerPage){
    var first_item = (page - 1) *itemsPerPage;

    var cont = true;
    for (i = 0; i<itemsPerPage ; i++){
        var item = rosas_mdmtOrder[first_item+i];
        if(rep_questionnaire[item]==""){
            alert("One item or more is missing a rating.");
            cont= false;
            break;
        }
    }
    if(cont){
        if((page*itemsPerPage)<32){
            rosas_mdmt(page+1,itemsPerPage);
        }
        else{
            demographics_age();
        }
        
    }
}

//DEMOGRAPHICS QUESTIONS at the end ================================================================================
function demographics_age(){
    question_ = "How old are you?";

    document.getElementById("main_container").innerHTML =`<div class='row2'><label for="age" style="font-size:35px;">${question_}</label></br><input type="text" id="age" name="age" size="10" style="font-size:35px; width:30% ; height:60px; padding: 20px 10px; text-align:center;"/></div><div class='row3'><button id='confirm_demographics_age' onclick='confirm_demographics_age()'>Next</button></div>`;
}

function confirm_demographics_age(){
    rep_questionnaire["age"]= document.getElementById("age").value;

    if(rep_questionnaire["age"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        demographics_gender();
    }

    
}

function demographics_gender(){
    question_ = "How do you identify?";
    var choices_demo_gender = shuffleArray(["Woman","Man","Nonbinary"]).concat(["Prefers not to say"]);

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_demo_gender' onclick='confirm_demo_gender()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<4; rowIndex++){
        var row = document.createElement("tr");

        for (colIndex = 0; colIndex < 2; colIndex++){
            var col = document.createElement("td");
            col.style.backgroundColor = colors.mazeColor;
            col.style.border= '1px #FFFFFF solid';

            if(colIndex==0){
                col.innerHTML= choices_demo_gender[rowIndex];
                col.style.width = "50%";
                col.style.fontSize = "25px";
            }
            else{
                col.innerHTML=`<button class="q_button" id="button_gender_${rowIndex+1}" gender="${choices_demo_gender[rowIndex]}" onclick="rep('gender',${rowIndex+1})"></button>`;
            }       
            row.appendChild(col);
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_demo_gender(){
    if(rep_questionnaire["gender"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        demographics_study();
    }
}

function demographics_study(){
    question_= "How much of your education and/or occupation is related to technology?";
    var ratings_demo_study = ["Not at all related", "A little bit related", "Moderately related", "Related", "Completely related"];

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_demo_study' onclick='confirm_demo_study()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<5; rowIndex++){
        var row = document.createElement("tr");

        for (colIndex = 0; colIndex < 2; colIndex++){
            var col = document.createElement("td");
            col.style.backgroundColor = colors.mazeColor;
            col.style.border= '1px #FFFFFF solid';

            if(colIndex==0){
                col.innerHTML= ratings_demo_study[rowIndex];
                col.style.width = "50%";
                col.style.fontSize = "25px";
            }
            else{
                col.innerHTML=`<button class="q_button" id="button_study_${rowIndex+1}" onclick="rep('study',${rowIndex+1})"></button>`;
            }       
            row.appendChild(col);
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_demo_study(){
    if(rep_questionnaire["study"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        demographics_exp();
    }
}

function demographics_exp(){
    question_= "How much previous experience with robots do you have?";
    var ratings_demo_exp = ["Nothing at all", "I've seen some, but no interaction", "I've interacted with one under supervision (at an event, for example)", "I've worked with robots once", "I frequently interact or work with robots"];

    document.getElementById("main_container").innerHTML = `<div class='row2' style="font-size:35px;">${question_}</div><div class='row3' id='table_dt'></div><div class='row4'><button id='confirm_demo_exp' onclick='confirm_demo_exp()'>Next</button></div>`;
    
    var rowIndex, colIndex;
    
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for(rowIndex=0; rowIndex<5; rowIndex++){
        var row = document.createElement("tr");

        for (colIndex = 0; colIndex < 2; colIndex++){
            var col = document.createElement("td");
            col.style.backgroundColor = colors.mazeColor;
            col.style.border= '1px #FFFFFF solid';

            if(colIndex==0){
                col.innerHTML= ratings_demo_exp[rowIndex];
                // col.style.width = "50%";
                col.style.width = "500px";
                col.style.fontSize = "25px";
            }
            else{
                col.innerHTML=`<button class="q_button" style="width:100px;" id="button_exp_${rowIndex+1}" onclick="rep('exp',${rowIndex+1})"></button>`;
                col.style.width= "100px";
            }       
            row.appendChild(col);
        } 
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    
    document.getElementById("table_dt").appendChild(table);
}

function confirm_demo_exp(){
    if(rep_questionnaire["exp"]==""){
        alert("One item or more is missing a rating.");
    }
    else{
        openFeedback();
    }
}

//FEEDBACK IF PARTICIPANTS SO WANT, mark the end of the questionnaire for good ================================================================================
function openFeedback(){
    question_ = "Do you want to add anything else? You can write it down here.";
    document.getElementById("main_container").innerHTML =`<div class='row2'></br></br><textarea id="feedback">${question_}</textarea></div><div class='row3'><button id='confirm_openFeedback' onclick='confirm_openFeedback()'>Next</button></div>`;
    var feedback = document.getElementById("feedback");
    feedback.style.width = "70%";
    feedback.style.height = "200px";
    feedback.style.borderRadius = "4px";
    feedback.style.resize = "none";
    feedback.style.padding = "12px 20px";
   
}

function confirm_openFeedback(){
    rep_questionnaire["openEndedQuestion"]= document.getElementById("feedback").value;
    theEnd_ofthequestionnaire();
}

//THE END OF EVERYTHING ==================================================================================================================================
function theEnd_ofthequestionnaire(){
    document.getElementById("main_container").innerHTML = "";
    //TODO: text

    //download data in a file
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(hist) + JSON.stringify(rep_questionnaire)]);
    a.href = URL.createObjectURL(blob);
    a.download = participantID;
    a.click();
}

//RESPONSE MANAGEMENT FUNCTION ================================================================================================================================================================
function rep(code_item,rating){
    var itt;
    if(scale7.includes(code_item)){
        itt = 7;
    }else if(scale5.includes(code_item)){
        itt=5;
    }else if(scale4.includes(code_item)){
        itt = 4;
    }

    for(i=1; i <=itt; i++){
        if(i==rating){
            document.getElementById(`button_${code_item}_${i}`).style.backgroundColor = "#ff0000";
        }else{
            // console.log(`ds rep : button_${code_item}_${i}`);
            document.getElementById(`button_${code_item}_${i}`).style.backgroundColor = "#222222";
        }
    }

    if(scale4.includes(code_item)){
        rep_questionnaire[code_item] = document.getElementById(`button_${code_item}_${rating}`).getAttribute(code_item);
    }
    else{
        rep_questionnaire[code_item] = rating;
    }
    console.log(rep_questionnaire);
}

