
$(document).ready(function () {

    $(document).keyup(function() {
        var event = window.event;
        var digit = parseInt(event.which || event.keyCode)-48;
	    if (digit>=0 && digit<=9) {
 	        digitClicked(digit);
        } else if (digit===-40) {
            backspaceClicked();
        }

     });

     startGame();
});

function testObj (param) {
    this.pubVar = param;
    this.priVar = function() {
        return (privateVar);
    };
    var privateVar = 100;
}



// Show Speech Bubble with text of context

function displayAnswer(uAnswer) {

    var display="";

    if (!(uAnswer===0))
        display = uAnswer.toString();
//    $('#results').text(display);

    var $bubble = $('div.speech');
    var content = ($bubble.text()).split("=");

    $bubble.text(content[0]+"= "+display);
}

function showCountdown(counter, hash) {
    if (cellHash !== hash || counter === 0) {
        updateBar(0);
        return;
    }
    if (counter > 0) {
        counter -= 0.25;
        setTimeout("showCountdown("+counter+","+hash+")",250);
    }
    updateBar(100*(startTimeout-counter)/startTimeout);
}

function updateBar(percentage) {
    var $bar = $('#bar');
    $bar.attr("style","width:"+(609*percentage/100)+"px" );
    $bar.removeClass('hidden');
 }



function showBubble(content, size) {

     var $bubble = $('div.speech');
     $bubble.removeClass('hidden');
     $bubble.text(content);
     $bubble.css("font-size", size);
    showStats();
}

function showStats() {

    var $level = $('#level');
    var $round = $('#round');
    var $failed = $('#failed');

    $level.text("Level: "+ levelNum);
    $round.text("Round: "+roundNum + " of " + roundsPerLevel);
    if (badRounds>=0) {
        $failed.text("Failed: "+badRounds);
    }

    $level.removeClass('hidden');
    $round.removeClass('hidden');
    $failed.removeClass('hidden');
}

// Make the table show up

function showTable(call_back) {

    $('table td').text("\xa0");
    $('table td').attr("style","background-image:none;");
    $('table').removeClass('hidden');
    call_back();
}

function showBadges (current, badgeList) {
    var $badge;
    var l = badgeList.concat();
    l.splice(0,0,current);

    for (var i=0 ; i<5 ; i++) {
        $badge = $('div.badge-ribbon:eq('+i+')');
        if (l[i]>=0) {
            $badge.removeClass("hidden");
            $badge.css("left",""+(245+(i*90))+"px");
            $badge.css("top","365px");
            $badge.text([]+l[i]);
        } else {
            $badge.addClass("hidden");
        }
    }
}


function playSound(soundName) {

  var thisSound=document.getElementById(soundName);
  thisSound.play();
}

function getCell(cellNum) {
    var row=  1 + Math.floor((cellNum-1) / 4)   ;
    var col=  1 + (cellNum-1) % 4;

    return ($('table tr:nth-child('+row+')'+' td:nth-child('+col+')'));
}

function setCellText(cellNum, content) {

       var row=  1 + Math.floor((cellNum-1) / 4)   ;
       var col=  1 + (cellNum-1) % 4;

//       var $obj = $('table tr:nth-child('+row+')'+' td:nth-child('+col+')');
       var $obj = getCell(cellNum);

       $obj.text(content);
       $obj.attr("style","color: #FFFFBB;");

}


function setCellImg(cellNum, img) {
       var row=  1 + Math.floor((cellNum-1) / 4)   ;
       var col=  1 + (cellNum-1) % 4;

       var $obj = getCell(cellNum);



        $obj.attr("style","background-image:url(img/"+img+");");
}