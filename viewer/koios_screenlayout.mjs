import {DragItem,subscribe,LinkToggleButton,MonitorVisible,sleep} from '../lib/koios_util.mjs';
import {player} from './koios_viewer.mjs';

export async function SetupSliders() {
    var grid=document.getElementById("mainscreen");    
    var SetMiddleh=window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ")[1];       
    var SetM=window.getComputedStyle(grid).getPropertyValue("grid-template-rows").split(" ")    
    var SetMiddlev1=SetM[1];
   // var SetMiddlev2=SetM[2];
   // var SetMiddlev3=SetM[3];
    
    if (!SetMiddleh) SetMiddleh="7px";
    

    function XYUpdate(percx,percy) {
        //console.log(percx,percy)
        const snap = 0.01;
        //var left  = (percx      < snap) ? "0px":`${percx*2}fr`;
        //var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*2}fr`;
        //var top   = (percy      < snap) ? "0px":`${percy*2}fr`;
        //var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*2}fr`;        
        
        var left  = (percx      < snap) ? "0px":`${percx*100}%`;
        var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*100}%`;
        
        var top   = (percy      < snap) ? "0px":`${percy*100}%`;
        var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*100}%`;        

        
        
        var c=`${left} ${SetMiddleh} ${right}`;
        var r=`${top} ${SetMiddlev1}  ${bot}`;
        grid.style["gridTemplateColumns"] = c;
        grid.style["gridTemplateRows"]    = r;
        //console.log(c)
        //console.log(r);
        //console.log(player.g.g);
        //console.log(`Player: ${player.g.g.width} ${player.g.g.height}`);
        
        
        var a=window.getComputedStyle(grid).getPropertyValue("grid-template-columns")
        var b=window.getComputedStyle(grid).getPropertyValue("grid-template-rows")
        //console.log(`${a} ///  ${b}`);
        
        
    }      
    DragItem("move","mainscreen","mainscreen",XYUpdate,ToggleMainLayout);
}

export async function SwitchIntroScreen(fOn) {
    console.log("In SwitchIntroScreen");
    var intro=document.getElementById("introscreen");
    intro.style.display=fOn?"flex":"none";    
}

    
    
subscribe('playerloading',  InitScreenlayout1);
subscribe('playerloaded',   InitScreenlayout2); 
           

function InitScreenlayout1() { // when page is loaded
    SwitchIntroScreen(true);
    
    let dotstyle = document.createElement("style"); // w-slider-dot  doesn't work from webflow
    dotstyle.type = "text/css";    
    dotstyle.innerHTML=`
    .w-slider-dot           {   box-shadow: 1px 1px 3px 0  rgba(0,0,0,0.4); } 
    
     .w-active {   box-shadow: 1px 1px 3px 0  rgba(0,255,0,0.4); } 
    
    .video_field .w-slider-dot           {           
        width: .2em;
        height: .2em;
        margin: 0 1px .5em;        
        } 
     .video_field .w-slider-nav {
        padding-top: 0px;
        height: 7px;
    `
    // #000
    // .w-slider-dot.w-active { background-color: green; }     
    //  .w-icon-slider-right    {   text-shadow:  1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue; } 
    document.body.appendChild(dotstyle); 
    
    
    async function ToggleMenuVisible() {
        await sleep(100);
       console.log("In ToggleMenuVisible");
       window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again 
    }    
    MonitorVisible("menuleft") // publishes when object changes visibility
    subscribe('menuleftdisplayflex',ToggleMenuVisible);
    subscribe('menuleftdisplaynone',ToggleMenuVisible);

    
}    

function InitScreenlayout2() { // after everything has been loaded
     SwitchMainLayout(true);
     
     
    //var slidewindow=document.getElementById("move"); // connect to "move" circle    
    //slidewindow.addEventListener("mouseenter",   MouseOverSlides);    
    //slidewindow.addEventListener("mouseleave",   MouseOverSlides); 
    //window.addEventListener("deviceorientation", handleOrientation, true);
    SwitchIntroScreen(false); 
}    

/*
function handleOrientation(event) {
    if (event.beta && event.gamma) { // prevent triggering on a desktop
        var x= event.beta
        var y= event.gamma
        var sum = Math.abs(x+y)
        ShowTitles(sum < 3) // only show extra info when sum is small, e.g. phone is flat
    }
}

export function ShowTitles(fOn) {
    var videoinfo=document.getElementById("videoinfo");
    videoinfo.style.display=fOn?"flex":"none"
      
     var list = document.getElementsByClassName("slideinfo"); 
     for (var i=0;i<list.length;i++) {
         list[i].style.display=fOn?"block":"none"
         
    }    
}

function MouseOverSlides(ev) {
    
    console.log("In MouseOverSlides");
    switch (ev.type) {       
        case "mouseleave": ShowTitles(false);break; 
        case "mouseenter": ShowTitles(true);break;
    }
}
*/


var fGlobalLargeNotes=true;
function ToggleMainLayout() {
    fGlobalLargeNotes = !fGlobalLargeNotes;
    SwitchMainLayout(fGlobalLargeNotes)
}
    

export async function SwitchMainLayout(fLargeNotes) {
    console.log(`In fLargeNotes ${fLargeNotes}`);
    
    var notesfieldlarge=document.getElementById("notesfieldlarge");
    notesfieldlarge.style.display=fLargeNotes?"flex":"none";    
    
    var notesfieldsmall=document.getElementById("notesfieldsmall");
    notesfieldsmall.style.display=!fLargeNotes?"flex":"none";    
    
    var slideplayersmall=document.getElementById("slideplayersmall");
    slideplayersmall.style.display=fLargeNotes?"flex":"none";    
    
    var slideplayerlarge=document.getElementById("slideplayerlarge");
    slideplayerlarge.style.display=!fLargeNotes?"flex":"none";    
    
    var notes=document.getElementById("notescontainer");
    var slideplayer=document.getElementById("slideplayer");

    
    if (fLargeNotes) {
        notesfieldlarge.appendChild(notes);
        slideplayersmall.appendChild(slideplayer);
    }
    else {
        notesfieldsmall.appendChild(notes);
        slideplayerlarge.appendChild(slideplayer);
    }
    fGlobalLargeNotes = fLargeNotes
}
    


