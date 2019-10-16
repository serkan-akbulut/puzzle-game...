    /* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {
    var display = [];
    $(".slide").each(function(i){
        var x = {};
        x= $(this).html();
        display.push(x);
    });
    
    var current=0;
    
   $("#display").html(display[current]);
   
    setInterval(function() {
	   current++;
	   if ( current === display.length) current = 0 ;
            $("#display").animate( {opacity:0.1},400, function(){ 
                                   $(this).html(display[current]);
                                           
            }).animate({opacity:1.0},400); 
    }, 2000) ;
   
   
   $("#start").click(function(){
        $(this).off("click");
        $("#first").animate({opacity:0},400,function(){
            $(this).hide();
        });
        
        $("#second").animate({opacity:1.0},400,function(){
            $(this).fadeIn(1000);
        });
    });
    
    var isLeftSelected=false;
    var isMiddleSelected=false;
    var isRightSelected=false;
    var index=-1;
    
    var checkSelected= function(x){
        if(x===1){
            $("#left").children().css("opacity","1");
        }
        else{
           $("#left").children().css("opacity","0.6"); 
       }
       if(x===2){
            $("#middle").children().css("opacity","1");
        }
        else{
           $("#middle").children().css("opacity","0.6"); 
       }
       if(x===3){
            $("#right").children().css("opacity","1");
        }
        else{
           $("#right").children().css("opacity","0.6"); 
       }
    };
    $("#left").click(function(){
        $("#continue").show();
        $("#continue").animate({opacity:1},100);
        index=1;
        checkSelected(index);
    });
    $("#middle").click(function(){
        $("#continue").show();
        $("#continue").animate({opacity:1},100);
        index=2;
        checkSelected(index);
    });
    $("#right").click(function(){
        $("#continue").show();
        $("#continue").animate({opacity:1},100);
        index=3;
        checkSelected(index);
    });
    
    $("#continue").click(function(){
        $(this).off("click");
        $("#second").animate({left: 1600},400,function(){
            $(this).hide();
        });
        
        var a=150;
        var b=0;
        $("#third").delay(500).slideDown(1500);
        
        for(var i=1; i<9; i++)
        {
            var img;
            if(i%3 ===0){
                a=0;
                b+=150;
            }
            if(index === 1 || index === 2)
            {
                img="url(img/img";
                img+=index;
                img+=".jpg) ";
               
            }
            else
            {
                img="url(https://unsplash.it/450/450/?random)" ;
            }
            img+="no-repeat -"+a+"px -"+b+"px";
            var str="box"+i;
            $("#"+str).css("background",img);
            a+=150;
        }    
    });
    
    var shuffleCount;       
        $("#shuffleSelector").change(function(){
            shuffleCount=$(this).val();
            if(shuffleCount>0)
            {
                $("#shuffleButton").show();
                $("#shuffleButton").animate({opacity:1},200);
            }
            else{
                $("#shuffleButton").animate({opacity:0},200);
                $("#shuffleButton").hide();
            }
        });
        
    //Necessary variables for the puzzle    
    var gameStart=false; // variable to check if game has started
    var isMoving=false; // variable to check if the clicked box is moving
    var movability = []; //checks the boxes that are movable(compare to the empty box) and stores the movability status
    var animationSpeed; //swap speed
    var previousMove; //stores the previous object while shuffling
    var random; //random number to swap while shuffling
    var isShuffleStart=false; //checks if the shuffle has started
    var possibleMoves=[]; //stores the possible moves
        
    for(var i=0; i<9; i++)
        movability.push(false);
    
    var defaultPositions = []; //default positions of the boxes
    var newPositions=[]; //updated position of boxes after swap operation
    
    for(var i=0; i<9; i++){
        defaultPositions[i]=i;
        newPositions[i]=i;
    }
        
    //Shuffles the puzzle given the number of moves
    var i = 0;
    function shufflePuzzle(howManyTimes) {
        for (let i=0; i<howManyTimes; i++) {
            setTimeout( function timer(){
                randomSwap();
              
                if(i===howManyTimes-1){
                    gameStart=true;
                    animationSpeed=400;
                    $("#solve").show(500);
                }
            }, i*(animationSpeed+25) );
        }     
    };
        
    $("#shuffleButton").click(function(){
        $(this).off("click");
        $(this).hide();
        $("#shuffleSelector").hide();
        $("#info").children(1).hide();
           
        checkMovable();
        if(shuffleCount==="1"){
            animationSpeed=100;
            shufflePuzzle(3); 
        }
        else if(shuffleCount==="2"){
            animationSpeed=150;
            shufflePuzzle(30);
        }    
    });
        
    //updates the current position of the boxes
    var posSwap= function(arr,x1,x2){
        var temp=arr[x2];
        arr[x2]=arr[x1];
        arr[x1]=temp;
        return arr;
    };
        
    //Checks the default and current positions of boxes
    var isFinished= function(){
        var count=0;
        for(var a=0; a<9; a++)
            if(newPositions[a] ===defaultPositions[a])
                count++;
            
        if(count===9){
            gameStart=false;
            $("#thirdContainer").css("opacity","0.3");
            $("#solve").html("");
            $("#congrats").show(0).delay(500).animate({top:275},600,function(){
                $("#congrats").children().css("margin-top","60px").animate({'font-size':'70px'},500).delay(300).animate({'font-size':'48px'},300).delay(300).animate({'font-size':'70px'},300,function(){
                           $("#solve").html("F5 to Restart")
                    .css("font-size","15px").css("left","42%").css("margin-top","30px")
                       .delay(900).animate({'font-size': '25px'},300).delay(300).animate({'font-size': '15px'},300);
                });
            });
           
            return true;
        }
        return false;
    };
        
    /*to randomly swap when shuffle button pressed(Checks the previous 
    moved object and prevents swap of the same objects*/
    var randomSwap=function(){
        if(isShuffleStart){
            do{
                random = Math.floor(Math.random()*(possibleMoves.length));
            }while(possibleMoves[random] === previousMove);
        }
        else{
            random=Math.floor(Math.random()*(possibleMoves.length));
            isShuffleStart=true;
        }
        previousMove=possibleMoves[random];
        swap($("#box"+possibleMoves[random]),possibleMoves[random]);
    };
        
    //to swap clicked box and empty box
    var swap = function(x, num){         
        var emptyLeft= parseInt($("#box0").css("left"));
        var emptyTop= parseInt($("#box0").css("top"));
        var xLeft= parseInt($(x).css("left"));
        var xTop= parseInt($(x).css("top"));
        
        if(movability[num]){
            if(xTop-emptyTop===0){
                $("#box0").animate({left: xLeft},animationSpeed);
                $(x).animate({left: emptyLeft},animationSpeed,function(){
                    isMoving=false; 
                    checkMovable();
                    isFinished();
                });
            }
            else if(xLeft-emptyLeft===0){
                $("#box0").animate({top: xTop},animationSpeed);
                $(x).animate({top: emptyTop},animationSpeed,function(){
                    isMoving=false; 
                    checkMovable();
                    isFinished();
                });
            }
            newPositions=posSwap(newPositions,num,0);
        }
            
    };
        
    //make the swap operation on click if the box is not moving currently
    $("#box1").click(function(){
        if(gameStart){
            if(isMoving===false && movability[1]){
                isMoving=true;
                swap(this,1);
            }        
        }
    });
    $("#box2").click(function(){
        if(gameStart){
            if(isMoving===false && movability[2]){
                isMoving=true;
                swap(this,2);
            }      
        }
    });
    $("#box3").click(function(){
        if(gameStart){
           if(isMoving===false && movability[3]){
                isMoving=true;
                swap(this,3);
            }        
        }
    });
    $("#box4").click(function(){
        if(gameStart){
            if(isMoving===false && movability[4]){
                isMoving=true;
                swap(this,4);
            }        
        }
    });
    $("#box5").click(function(){
        if(gameStart){
            if(isMoving===false && movability[5]){
                isMoving=true;
                swap(this,5);
            }      
        }
    });
    $("#box6").click(function(){
        if(gameStart){
            if(isMoving===false && movability[6]){
                isMoving=true;
                swap(this,6);
            }        
        }
    });
    $("#box7").click(function(){
        if(gameStart){
            if(isMoving===false && movability[7]){
                isMoving=true;
                swap(this,7);
            }        
        }
    });
    $("#box8").click(function(){
        if(gameStart){
            if(isMoving===false && movability[8]){
                isMoving=true;
                swap(this,8);
            }       
        }
    });
    $("#box9").click(function(){
        if(gameStart){
            if(isMoving===false && movability[9]){
                isMoving=true;
                swap(this,9);
            }        
        }
    });
        
    //Change the opacity of the box that are movable when mouse enters the puzzle container
    $("#thirdContainer").mouseenter(function(){
        if(gameStart){
            checkMovable();
        }
    }).mouseleave(function(){
        if(gameStart){
            for(var i=1; i<9; i++){
                $("#box"+i).css("opacity","0.6"); 
            }
        }
    });
        
    //Checks the movable boxes
    var checkMovable=function(){
        possibleMoves=[];
        var emptyLeft= parseInt($("#box0").css("left"));
        var emptyTop= parseInt($("#box0").css("top"));
        for(var i=1; i<9; i++){
            var x= parseInt($("#box"+i).css("left"));
            var y= parseInt($("#box"+i).css("top"));
               
            var checkLeft=Math.abs(x-emptyLeft);
            var checkTop=Math.abs(y-emptyTop);
            if((checkTop===0 && checkLeft===153) || (checkLeft===0 && checkTop===153)){
                $("#box"+i).css("opacity","1.0");
                movability[i]=true;
                possibleMoves.push(i);
            }
            else{
                $("#box"+i).css("opacity","0.6");
                movability[i]=false;
            }
        }
    };
    
    
    var previousMovedBox;
    var autoStart=false;
    var distances = [];
    var findShortestPath = function(arr){
        var min = arr[0];
        var returnVal= 0;
        for(var i = 1; i<arr.length; i++)
            if(arr[i] < min)
            {
                min=arr[i];
                returnVal = i;
            }
        
        return returnVal;
    };
    
    var newPossibleMoves = [];
    var newDistances = [];
    var autoSolve = function(){
       distances = [];
       newDistances = [];
       newPossibleMoves = [];
       var min;
       for(var i=0 ; i<possibleMoves.length; i++){
            if(Math.abs(defaultPositions[possibleMoves[i]]-newPositions[possibleMoves[i]]) !== 0)
            {
                distances.push(Math.abs(defaultPositions[possibleMoves[i]]-newPositions[possibleMoves[i]]));
                newPossibleMoves.push(possibleMoves[i]);
            }
        }
        if(autoStart){
            min = findShortestPath(distances);
            if(previousMovedBox === newPossibleMoves[min]){
                var newPossibleMoves2=[];
                for(var a =0; a<newPossibleMoves.length; a++)
                    if(a !== min){
                        newDistances.push(a);
                        newPossibleMoves2.push(newPossibleMoves[a]);
                    }
                    
                min = findShortestPath(newDistances);
                swap($("#box"+newPossibleMoves2[min]),newPossibleMoves2[min]);
                
            }
            else
            {
                swap($("#box"+newPossibleMoves[min]),newPossibleMoves[min]);
            }
        }
        else{
            min=findShortestPath(distances);
            autoStart=true;
            swap($("#box"+newPossibleMoves[min]),newPossibleMoves[min]);
        }
        previousMovedBox = newPossibleMoves[min];
    };
    
    $(window).keydown(function(e){
       if(e.which === 27){
           if(gameStart)
               setInterval(function(){
                   autoSolve(); 
               },600);
                 
       }
    });
});
