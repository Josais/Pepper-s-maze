var mazeWidth = 40;
var mazeHeight = mazeWidth;

window.addEventListener("load", init);

function init() {
    baseMaze();
    paint();
}

function paint() {
	var startAtRow = 1;
	var startAtCol = 1;
	var currentCell;
	
    addRoute(startAtRow, startAtCol, false);

    for (n = 1; n < (mazeWidth * mazeHeight) - 1; n++) {
        var currentCell = document.getElementById("cell_" + startAtRow + "_" + startAtCol);
        if (currentCell.getAttribute("occupied") == "true") {
            addRoute(startAtRow, startAtCol, true);
        }
        if (startAtCol == mazeWidth) {
            startAtRow++;
            startAtCol = 1;
        } else {
            startAtCol++;
        }

    }

}

function addRoute(startAtRow, startAtCol, createDetour, backgroundColorRoute = "rgb(240, 0, 0)") {
    var validExits = ["right", "bottom", "left", "top"];
    var remainingExits = {"right": mazeWidth, "bottom": mazeHeight, "left": 0, "top": 0};
    var nextExits = [];
	var lastCells= [];
    var rowIndex = startAtRow;
	var colIndex = startAtCol;
    var currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
    var exit;
    var lastExit;
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

        exitIndex = Math.floor(Math.random() * Math.floor(nextExits.length));
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
                col.style.backgroundColor = "rgb(244,0,0)";
                col.setAttribute("type", "start");
            }
            // else if (rowIndex == mazeHeight && colIndex == mazeWidth) {                
            //     col.style.backgroundColor = "rgb(0,244,0)";
            //     col.setAttribute("type", "finish");
            // } 
            else {
                col.style.backgroundColor = "rgb(255,255,255)";
            }
            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);  
            console.log(col);          
            row.appendChild(col);
        }
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    document.getElementById("maze_container").appendChild(table);
}