import {DragItem,subscribe,LinkToggleButton} from './koios_util.mjs';

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
        var left  = (percx      < snap) ? "0px":`${percx*2}fr`;
        var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*2}fr`;
        var top   = (percy      < snap) ? "0px":`${percy*2}fr`;
        var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*2}fr`;        
        var c=`${left} ${SetMiddleh} ${right}`;
        var r=`${top} ${SetMiddlev1}  ${bot}`;
        grid.style["gridTemplateColumns"] = c;
        grid.style["gridTemplateRows"]    = r;
       // console.log(c)
       // console.log(r);
        
        
        
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

    
    
subscribe('playerloading',    x=>SwitchIntroScreen(true));
subscribe('playerloaded',   x=>{  
            SwitchMainLayout(true);
            SwitchIntroScreen(false); 
        });



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
    
    var notes=document.getElementById("notes");
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
    
