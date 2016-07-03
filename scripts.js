var mute = false;
var customSeconds = 1500;
var customBreak = 300;
var seconds = customSeconds;
var output = "";
var on = false;
var breakTime = false;
var timerID;
var moveDrop;


$(function() {
    $("#drop").css("left", Math.floor(Math.random() * 101).toString() + "vw");

    $("#settings").hide();

    $(".fa-bars").click(function() {
        $("#settings").fadeIn("fast");
        if (customSeconds % 60 < 10)
            $("input[id=input1]").val(Math.floor(customSeconds / 60) + ":0" + customSeconds % 60);
        else
            $("input[id=input1]").val(Math.floor(customSeconds / 60) + ":" + customSeconds % 60);

        if (customBreak % 60 < 10)
            $("input[id=input2]").val(Math.floor(customBreak / 60) + ":0" + customBreak % 60);
        else
            $("input[id=input2]").val(Math.floor(customBreak / 60) + ":" + customBreak % 60);
    });
    $(".fa-times").click(function() {
        $("#settings").fadeOut("fast");

        if ($("input[id=input1]").val().length === 0) {
            if (customSeconds % 60 < 10)
                $("input[id=input1]").val(Math.floor(customSeconds / 60) + ":0" + customSeconds % 60);
            else
                $("input[id=input1]").val(Math.floor(customSeconds / 60) + ":" + customSeconds % 60);
        }
        if ($("input[id=input2]").val().length === 0) {
            if (customBreak % 60 < 10)
                $("input[id=input2]").val(Math.floor(customBreak / 60) + ":0" + customBreak % 60);
            else
                $("input[id=input2]").val(Math.floor(customBreak / 60) + ":" + customBreak % 60);
        }

        if (!/:/g.test($("input[id=input1]").val())) {
            $("input[id=input1]").val($("input[id=input1]").val() + ":00");
        }
        if (!/:/g.test($("input[id=input2]").val())) {
            $("input[id=input2]").val($("input[id=input2]").val() + ":00");
        }

        var arr1 = $("input[id=input1]").val().split(":");
        var arr2 = $("input[id=input2]").val().split(":");
        if ((+arr1[0] * 60 + +arr1[1] === customSeconds) && (+arr2[0] * 60 + +arr2[1] === customBreak)) {
            return;
        } else {
            if (+arr1[1].length === 1)
                arr1[1] += "0";
            if (+arr2[1].length === 1)
                arr2[1] += "0";
            customSeconds = +arr1[0] * 60 + +arr1[1];
            customBreak = +arr2[0] * 60 + +arr2[1];
            reset();
        }

    });

    $(".flex > i").click(function() {
        if (!mute) {
            $(".flex >  i").addClass("fa-volume-off");
            $(".flex > i").removeClass("fa-volume-up");
            mute = true;
        } else {
            $(".flex > i").addClass("fa-volume-up");
            $(".flex > i").removeClass("fa-volume-off");
            mute = false;
        }
    });

    $(".controls button:first-child").click(function() {
        updateScreen();
        if (!on) {
            moveDrop = window.setInterval(function() {
                if ($("#drop").offset().top > $(window).height())
                    $("#drop").css("left", Math.floor(Math.random() * 101).toString() + "vw");
            }, 200);
            timerID = window.setInterval(function() {
                seconds--;
                updateScreen();
            }, 1000);
            $(this).text("Pause");
            on = true;
            $("#drop").addClass("playing");
        } else {
            window.clearInterval(moveDrop);
            window.clearInterval(timerID);
            $(this).text("Start");
            on = false;
            $("#drop").removeClass("playing");
        }
    });

    $(".controls button:last-child").click(reset);

    $("#work button").click(function() {
        $("input[id=input1]").val($(this).text());
    });
    $("#break button").click(function() {
        $("input[id=input2]").val($(this).text());
    });
});

function updateScreen() {
    var perecentage;
    if (breakTime)
        percentage = seconds / customBreak * 100;
    else {
        percentage = 100 - seconds / customSeconds * 100;
    }

    $("#flood").height(percentage.toString() + "vh");

    if (seconds < 0) {
        var notif = document.createElement('audio');
        notif.src = "notif.mp3";
        notif.volume = 0.30;
        notif.autoPlay = false;
        notif.preLoad = true;

        if (!mute)
            notif.play();

        if (breakTime) {
            $("#drop").addClass("playing");
            seconds = customSeconds;
            breakTime = false;
        } else if (!breakTime) {
            seconds = customBreak;
            breakTime = true;
            $("#drop").removeClass("playing");
            $('#drop').removeClass('anim').animate({
                'nothing': null
            }, 1, function() {
                $(this).addClass('anim');
            });
        } else {
            alert("error");
        }
    }


    if (seconds % 60 < 10)
        output = Math.floor(seconds / 60) + ":0" + seconds % 60;
    else
        output = Math.floor(seconds / 60) + ":" + seconds % 60;
    $("h1").text(output);
}

function reset() {
    if (timerID)
        window.clearInterval(timerID);
    seconds = customSeconds;
    breakTime = false;
    updateScreen();
    on = false;
    $("#flood").height("50vh");
    $("#drop").removeClass("playing");
    $('#drop').removeClass('anim').animate({
        'nothing': null
    }, 1, function() {
        $(this).addClass('anim');
    });
    $(".controls button:first-child").text("Start");
}
