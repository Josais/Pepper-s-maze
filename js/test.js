window.addEventListener("load", startExperiment1);

        function startExperiment1(){
            alert("in startExperiment1 of index.html");
            try {
                startExperiment();
            }catch(err) {
                document.getElementById("main_container").innerHTML = err.message;
            }
            
            // tutorialMode = true;
        
            // var container = document.getElementById("main_container");
            // container.innerHTML="<div><h1>Welcome!</h1></div><div style='margin: 0 50px;'>Meet Pepper, your teammate for the experiment.</br></br><div>Before starting playing, you will go through a tutorial to understand how the game works, how scores are calculated and how to gain bonuses.</div></div><div><button id='tutorial' onclick='startExperiment2()'>Let's go!</button></div>"; //tutorial1()
        }