// Force VAR for variables - to prevent typos
"use strict";

// Global Variables (for all functions)

var cellHash
var badRounds ;
var userAnswer;
var expectedAnswer;
var x;
var y;
var cellNum;
var cell;
var gameLevel;
var cellDoneCounter;
var gameState;
var roundNum=1;
var debug = true;
var cellDone;
var levelNum=0;
var rangeBottom=0, rangeTop=0 ;
var timeout= 0, startTimeout = 0 ;
var roundsPerLevel=0;
var userName;
var userStats={};

var problem=[];
var operations = ["died", "joined" ,"retired"]  ;
var CURRENT_USER =   "CURRENT_USER";

// Here's where the game starts

function startGame() {
 // Object stores data for current user
    userStats = localStorage[CURRENT_USER];
    if (!userStats) {                             // Creates new userStats if this is a new user. No stored record for current user
        userStats = {};
        userStats.userName = CURRENT_USER;
        userStats.gameAward = 0;
        userStats.completedLevel = 0;
        userStats.awardHistory =[];
    } else {                                      // Get current user data
        userStats = JSON.parse(userStats);        //Gets stats if this is a returning user
    }


    // If the user is swapped

    if (((userName = prompt("Type your name (or leave empty)")) !== "") && (userName !== userStats.userName)) {
       var obj = localStorage[userName];           //Gets localStorage if there is record for user
        if (!obj) {                                //if no record found, creates one
            userStats = {};
            userStats.userName = userName;
            userStats.gameAward = 0;
            userStats.completedLevel = 0;
            userStats.awardHistory =[];
        }
        else {
            userStats = JSON.parse(obj);                       // Get the stored record for that user
        }
    }
    levelNum = userStats.completedLevel;
    //This section takes the users name, and checks to see if it has userStats with that name.
    storeUserStats();
    newRound();
}

function storeUserStats() {
    localStorage[userStats.userName] = JSON.stringify(userStats);      //Saves userStats in local storage as a string
    localStorage[CURRENT_USER] = localStorage[userStats.userName];     // Saves userName as a string under current user
}
 //stores user stats

function afterShowTable() {
   // shows fixed cells in beginning
    var fixedCells=[1,3,10,11,12];

//This displays the fixed cells and then marks them done

    for (var idx in fixedCells) {
        var cellIdx = fixedCells[idx];
        setCellText(cellIdx,problem [cellIdx]);
        cellDone[cellIdx]=1;
    }
    showBadges(userStats.gameAward, userStats.awardHistory);
}   //shows badges

function newRound(){
  //  alert("New Level Bottom" +rangeBottom+ "Top:" + rangeTop + "Timeout:" +timeout) ;
    // This stops the level if you fail to many rounds

    if (badRounds > 1 + Math.floor(roundsPerLevel*0.15))  {
        showBubble("Sorry, you failed level" + levelNum + ". Level" + levelNum + "is restarting. ");
        roundsPerLevel = 0;;
        levelNum--;
        userStats.gameAward++;
    }
   // This moves you to the next level
    if (roundNum > roundsPerLevel) {
        if (roundsPerLevel !== 0) {
            userStats.completedLevel = levelNum;
            userStats.gameAward++;
            storeUserStats();
        }
        levelNum++;
        badRounds =0;



        timeout = 15-Math.floor(5*Math.log(levelNum/2));          //sets the number of seconds before to late
        if (timeout <= 2) {
            timeout = 2;
        }
        startTimeout = timeout;
        //this sets the different variables per level
        roundsPerLevel = 5 + Math.floor(levelNum/5);
        rangeTop = 3+levelNum*2;
        if (rangeTop>12) {
            rangeTop=12;
            if (++rangeBottom > 8){
                rangeBottom=8;
            }

        }
            if (debug) {
                roundNum = roundsPerLevel-1;
            } else  {
                roundNum = 1;
    }

    }
    showStats();
    //shows different text with instructions and starting level
    if(roundNum ===  1 || (debug && roundNum !== roundsPerLevel)) {
        if (levelNum === 1) {
            setTimeout("showBubble('Welcome Agent "+userName+"!  Click on a cell in the table and answer the questions. At the end, read the message that is displayed in the table to find your final answer. ','125%')", 150);
        }  else  {
            showBubble('Congatulations Agent, you completed a level! Starting level' + ' ' + levelNum + '.','125%') ;
        }

    }


    if (roundNum)
    setTimeout("showTable(afterShowTable)", 500);
    expectedAnswer=0;
    cellDoneCounter = 0;
    gameState= "cellInactive";
    cellDone = [];
    cellNum=0;
    cell=0;
    userAnswer=0;
    cellHash = -1;
    // initializes variables and shows the table
//    displayAnswer(userAnswer);

    problem[2] = 20+Math.round(Math.random ()*5)  ;         //sets initial number of agents
    for( var idx=4 ; idx<9 ; idx+=2)  {                         // sets numbers for died, retired, joined
        problem[idx] = Math.round(Math.random ()*5)  ;
    }
    var computed=parseInt(problem[2]);

    for(idx=5 ; idx<10 ; idx+=2)  {
        var opType = Math.floor(Math.random ()*2.99);      // computes the answer to the problem
        if (opType === 1)
            computed += parseInt(problem[idx-1]);
        else
            computed -= parseInt(problem[idx-1]);
        problem[idx] = operations [opType];
        // randomizes questions
    }
    problem[0] =computed ;
    problem[1] = "Started";
    problem[3] = "agents" ;
    problem[10] = "how" ;
    problem[11]   = "many" ;
    problem[12]   = "remained?" ;
    //shows fixed cells
}

// Gets called when user clicks on a specific cell in table (see HTML definition of table).
// Stab code for testing graphics only - must be replaced with real code.

function cellClicked(tabCell, tabNum) {
   // makes sure the cell is still active, to prevent double clicking for a new problem
    if (gameState != "cellInactive" || cellDone[tabNum]===1)  {
        return ;

    }
    gameState = "cellActive";


    // Pick a math problem and show it
    x = Math.round(Math.random() * (rangeTop-rangeBottom)+rangeBottom);
    y = Math.round(Math.random() * (rangeTop-rangeBottom)+rangeBottom);
    showBubble(x+" x "+y+" = ?", "250%");

    //Record the cell that was clicked (for other functions - in a global variable).
    cell = tabCell;
    cellNum = tabNum;
    //reset the user Answer and wipe the display
    userAnswer=0;
    cellHash = Math.random();
//    displayAnswer(userAnswer);
    // Give the user a timeout (in sec) to answer, and then declare the cell too late
    showCountdown(timeout, cellHash);
    setTimeout("tooLate("+cellHash+")", timeout * 1000);

}

function tooLate(hash) {
    if (cellHash === hash &&  cellDone[cellNum] != 1)
    {
        checkCell(false);

    }
}  // also prevents bugs and double clicking

// Gets called when user types any digit (see graphics.js file)


function digitClicked(digit) {

    if (cellDone[cellNum]===1)
        return;

    userAnswer= userAnswer*10+digit;
//    playSound("keyPressed");
    displayAnswer(userAnswer);

    if ((userAnswer.toString()).length == ((x*y).toString()).length) {
        checkCell(true);
    }
}   //displays user answer and checks the cell if the answer is long enough

function backspaceClicked(){

    userAnswer = Math.floor(userAnswer/10);
//    playSound("keyPressed");
    displayAnswer(userAnswer);       //added backspace button
}

function checkCell(notLate) {
   if (notLate)     {
       if (userAnswer===x*y){
           showBubble("Correct Answer! Great job agent!","125%");
           setCellText(cellNum,problem [cellNum]);
         // what you do if the cell is correct and not late
       } else {
           return;
           //what you do is the cell is not late but incorrect
       }
   } else {
       // what you do if the cell is late, doesn't matter if correct or incorrect
       setCellImg(cellNum,"x.png");
       showBubble("Sorry Agent, that is incorrect.","125%");
   }
    cellDone[cellNum]=1;       //says that this cell is done
    cellHash = -1;       //resets the cell hash
    gameState="cellInactive" ;              //says that the cell is inactive
    cellDoneCounter++;                       //increases the cells you've done
    if(cellDoneCounter === 7) {
        showBubble("");     //if you've done all 7 cells, you go to final answer
        finalAnswer();
    }
}

function finalAnswer() {
    showBubble("Agent, you're now ready to solve the final question. Read the decoded message and type in your answer.","125%");
    showCountdown(0, -1);  //resets countdown
    var finalAnswer=prompt("Please enter your final answer");               // gives you final question

    //if final answer is correct

    if(finalAnswer === problem[0].toString()) {
        showBubble("Congratulations Agent! You decoded the message and can continue to the next round of training.", "125%");
    } else  {
        showBubble("Sorry Agent. You weren't able to correctly decode the message. Please try again.","125%");
        badRounds++; // increases badrounds if incorrect
        // User failed, we need to record their game award (consecutive good levels) before resetting it back to 0
        if (userStats.gameAward > 0) {
            userStats.awardHistory.push(userStats.gameAward);        //saves user stats for completing a level
            userStats.gameAward = 0;
            roundsPerLevel = 0;        // This indicat
            // es a new level - a bit messy, should have been an explicit indication.
            storeUserStats();
        }
    }

    roundNum++; // increases round number and starts a new answer
    newRound();


}


// Stab for when all cells in table are answered.     
 // an old function that I don't use

function checkAnswer(answer) {
    console.log(answer);

}