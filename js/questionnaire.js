const dispoTrustItems = {
    dt1: "I usually trust robots until there is a reason not to.",
    dt2: "For the most part, I distrust robots.", 
    dt3: "In general, I would rely on a robot to assist me.",
    dt4: "My tendency to trust robots is high.", 
    dt5: "My tendency to trust robots is high.",
    dt6: "It is easy for me to trust robots to do their job.",
    dt8: "I am likely to trust a robot even when I have little knowledge about it."
}
const rosas_mdmtItems= { 
    //MDMT-V2 scale:
    //r: reliable subscale / c: competent subscale / e: ethical subscale / t: transparent subscale / b: benevolent subscale

    //ROSAS:
    //w: warmth subscale / d: discomfort subscale

    r1: "reliable",
    r2: "predictable",
    r3: "dependable",
    r4: "consistent",
    
    c1: "competent",
    c2: "skilled",
    c3:"capable",
    c4:"meticulous",

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
}

var question;


function dispoTrust(){
    var dtOrder = shuffleArray([dt1,dt2,dt3,dt4,dt5,dt6,dt7,dt8]);
    question = "";

}

function questionnaire(){

}


function howManyRounds(){
    question = "How many rounds were played in the game?";
}

function pepperAlloc(){
    question = "What were Pepper's allocation decisions in the last two rounds of the game?";
}

function rosas_mdmt(){
    var rosas_mdmtOrder = shuffleArray([r1,r2,r3,r4,c1,c2,c3,c4,e1,e2,e3,e4,t1,t2,t3,t4,b1,b2,b3,b4,w1,w2,w3,w4,w5,w6,d1,d2,d3,d4,d5,d6]);
    question = "How much do you find Pepper to be [word]?";
}

//question = "How old are you?" (open); question = "How do you identify?" (man/woman/nonbinary/prefer not to say)



// How much of your education and/or occupation is related to technology?
// Not at all related	
// A little bit related	
// Moderately related	
// Related	
// Completely related


// How much previous experience with robots do you have?
// Nothing at all	
// I've seen some, but no interaction	
// I've interacted with one under supervision (at an event, for example)	
// I've worked with robots once



//Do you have anything else that you want to add? You can write it down here.
