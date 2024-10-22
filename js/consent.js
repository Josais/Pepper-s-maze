const consentForm = "Please read the statements below. </br></br>- I confirm that I am 18 years of age or older.</br> - I confirm that the research project on communication in collaborative human-robot teams has been explained to me. I have had the opportunity to ask questions about the project and have had theses answered satisfactorily. I had enough time to consider whether to participate.</br> - I consent to the material I contribute being used to generate insights for the research project.</br> - I understand that all data will be stored anonymously and cannot be traced back to me personally.</br>- I understand that my participation in this research is voluntary and that I can withdraw consent at any point before and during the experiment without providing a reason, and that if I withdraw before the end of the experiment, any collected data already collected from me will be erased. I understand that I cannot ask for my responses to be erased after the end of the experiment, as they will be anonymously stored and thus cannot be traced back to me.</br>- I consent to the fully anonymized data to be used in future publications and other scholarly means of disseminating the findings from the research project. I understand that the data acquired will be securely stored by researchers, but that appropriately anonymized data may in future be made available to others for research purposes. I understand that the University may publish appropriately anonymized data in appropriate data repositories for verification purposes and to make it accessible to researchers and other research users.</br></br>";

function showConsentForm(){
    var container = document.getElementById("main_container");
    container.innerHTML = "";

    var form = document.createElement("div");
    form.setAttribute("id","consentForm");
    form.style.textAlign = "justify";
    form.style.color = "white";
    form.innerHTML = consentForm;
    form.style.width = "60%";

    container.appendChild(form);

    var buttonsconsent = document.createElement("div");
    buttonsconsent.innerHTML = `<button class="consent_button" onclick="consent()">I consent to all of the above</button><button class="consent_button" onclick="dontconsent()">I do not consent</button>`;

    container.appendChild(buttonsconsent);
}

function consent(){
    startExperiment();
}

function dontconsent(){
    document.getElementById("main_container").innerHTML = "You decided to not consent to the statements. You can refresh this page if you misclicked or changed your mind, or you can call the experimenter to finish the experiment.";
}
