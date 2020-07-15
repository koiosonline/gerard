import {DragItem,subscribe,LinkToggleButton,MonitorVisible,sleep,getElement,Toggle} from '../lib/koiosf_util.mjs';
import {player} from './koiosf_viewer.mjs';

console.log("In screenlayout");


console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

export async function SetupSliders() {
    console.log("In SetupSliders");
    var grid=getElement("mainscreen");   
console.log(grid);
    
    //var SetMiddleh=window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ")[1];       
    //var SetM=window.getComputedStyle(grid).getPropertyValue("grid-template-rows").split(" ")    
    //var SetMiddlev1=SetM[1];
   // var SetMiddlev2=SetM[2];
   // var SetMiddlev3=SetM[3];
    
    //if (!SetMiddleh) SetMiddleh="7px";
    
var SetMiddleh="10px"

var SetMiddlev1="10px"

XYUpdate(0.5,0.5);


    async function XYUpdate(percx,percy) {
        //console.log(percx,percy)
        const snap = 0.01;
        
        var delta="5px" // to compensate for the 10 px in the middle
        
        //var left  = (percx      < snap) ? "0px":`${percx*2}fr`;
        //var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*2}fr`;
        //var top   = (percy      < snap) ? "0px":`${percy*2}fr`;
        //var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*2}fr`;        
        
        var left  = (percx      < snap) ? "0px":`${percx*100}%`;
        var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*100}%`;
        
        var top   = (percy      < snap) ? "0px":`${percy*100}%`;
        var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*100}%`;        

        
        
        var c=`calc(${left} - ${delta}) ${SetMiddleh}  calc(${right} - ${delta})`; // extra spaces required
        var r=`calc(${top}  - ${delta}) ${SetMiddlev1} calc(${bot}   - ${delta})`;
        grid.style["gridTemplateColumns"] = c;
        grid.style["gridTemplateRows"]    = r;
        //console.log(c)
        //console.log(r);
        //console.log(player.g.g);
        //console.log(`Player: ${player.g.g.width} ${player.g.g.height}`);
        
        
        var a=window.getComputedStyle(grid).getPropertyValue("grid-template-columns")
        var b=window.getComputedStyle(grid).getPropertyValue("grid-template-rows")
        //console.log(`${a} ///  ${b}`);
        //await sleep(10)
        
    }
console.log("Before    DragItem"); 
    DragItem("move","mainscreen","mainscreen",XYUpdate,ToggleMainLayout);
console.log("After    DragItem"); 
}


//var displaywinbuttons=new Toggle(false)
function ToggleMainLayout() {
    //var newval=displaywinbuttons.Toggle()?"show":"hide"
    /*
     getElement("selectliterature").style.display=newval
     getElement("selectnotes").style.display=newval
     getElement("selectvideo").style.display=newval
     getElement("selectslides").style.display=newval
    */
    
    
    var ev = new CustomEvent("toggledisplay");
        console.log(`Sending toggle`);
    
     getElement("selectliterature").dispatchEvent(ev);   
     getElement("selectnotes").dispatchEvent(ev);   
     getElement("selectvideo").dispatchEvent(ev);   
     getElement("selectslides").dispatchEvent(ev);   
    
    
}


function ToggleLiterature(event) {
  console.log("In ToggleLiterature");
  var fOn=GetToggleState(this,"displayactive")
  
  if (fOn) {
    getElement("9BottomRight").style.gridArea="1 /3 / span 3 / span 1"
    getElement("3NotesArea").style.display="none"
  }
else {
    getElement("9BottomRight").style.gridArea="3 /3 / span 1 / span 1"
    getElement("3NotesArea").style.display="flex"
    }
  
}    
function ToggleNotes(event) {
  console.log("In ToggleNotes");
  
  
  var fOn=GetToggleState(this,"displayactive")
  
  if (fOn) {
    getElement("3NotesArea").style.gridArea="1 /3 / span 3 / span 1"
    getElement("9BottomRight").style.display="none"
  }
else {
    getElement("3NotesArea").style.gridArea="1 /3 / span 1 / span 1"
    getElement("9BottomRight").style.display="flex"
    }

  
  
}  
function ToggleVideo(event) {
  console.log("In ToggleVideo");
  
  var fOn=GetToggleState(this,"displayactive")
  
    
  if (fOn) {
    getElement("1VideoPlayerContainer").style.gridArea="1 /1 / span 1 / span 3"
    getElement("3NotesArea").style.display="none"
  }
else {
    getElement("1VideoPlayerContainer").style.gridArea="1 /1 / span 1 / span 1"
    getElement("3NotesArea").style.display="flex"
    }

  
}  
function ToggleSlides(event) {   // row / column  / rowsspan / columnspan
  console.log("In ToggleSlides");
  
  var fOn=GetToggleState(this,"displayactive")
  
    
  if (fOn) {
    getElement("7ContentArea").style.gridArea="3 /1 / span 1 / span 3"
    getElement("9BottomRight").style.display="none"
  }
else {
    getElement("7ContentArea").style.gridArea="3 /1 / span 1 / span 1"
    getElement("9BottomRight").style.display="flex"
    }

  
  
}  

//7ContentArea 3NotesArea 1VideoPlayerContainer 

export async function SwitchIntroScreen(fOn) {
    console.log("In SwitchIntroScreen");
    var intro=getElement("scr_intro");
    intro.style.display=fOn?"flex":"none";    
}

export async function SwitchStartScreen(fOn) {
    console.log("In SwitchStartScreen");
    var intro=getElement("scr_start");
    intro.style.display=fOn?"flex":"none";    
}


    
console.log("Subscribe to playerloading and playerloaded");
subscribe('playerloading',  InitScreenlayout1);
subscribe('playerloaded',   InitScreenlayout2); 
           

function InitScreenlayout1() { // when page is loaded
    SwitchIntroScreen(true);
    
    
    async function ToggleMenuVisible() {
      //  await sleep(100);
       console.log("In ToggleMenuVisible");
    //   window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again 
    }    
    //MonitorVisible("menuleft") // publishes when object changes visibility
   // subscribe('menuleftdisplayflex',ToggleMenuVisible);
   // subscribe('menuleftdisplaynone',ToggleMenuVisible);

    
}    

function InitScreenlayout2() { // after everything has been loaded
     //SwitchMainLayout(true);
  
    
    SwitchPage("scr_profile");
    
}    

 
var fGlobalLargeNotes=true;
function qToggleMainLayout() {
    fGlobalLargeNotes = !fGlobalLargeNotes;
    SwitchMainLayout(fGlobalLargeNotes)
}
    

export async function SwitchMainLayout(fLargeNotes) {
    console.log(`In fLargeNotes ${fLargeNotes}`);
    
    var notesfieldlarge=getElement("notesfieldlarge");
    notesfieldlarge.style.display=fLargeNotes?"flex":"none";    
    
    var notesfieldsmall=getElement("notesfieldsmall");
    notesfieldsmall.style.display=!fLargeNotes?"flex":"none";    
    
    var slideplayersmall=getElement("slideplayersmall");
    slideplayersmall.style.display=fLargeNotes?"flex":"none";    
    
    var slideplayerlarge=getElement("slideplayerlarge");
    slideplayerlarge.style.display=!fLargeNotes?"flex":"none";    
    
    var notes=getElement("notescontainer");
    var slideplayer=getElement("slideplayer");

    
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
    
    
    
function loaded() {
      console.log("load in koiosf_screenlayout.mjs");
      SetupSliders()
      

    var ev = new CustomEvent("show"); // set initial state
    getElement("selectliterature").dispatchEvent(ev);   
    getElement("selectnotes").dispatchEvent(ev);   
    getElement("selectvideo").dispatchEvent(ev);   
    getElement("selectslides").dispatchEvent(ev);   



    getElement("selectliterature").addEventListener('animatedtoggle',ToggleLiterature)
    getElement("selectnotes").addEventListener('animatedtoggle',ToggleNotes)
    getElement("selectvideo").addEventListener('animatedtoggle',ToggleVideo)
    getElement("selectslides").addEventListener('animatedtoggle',ToggleSlides)

}    

document.addEventListener("DOMContentLoaded", loaded )
      


