
import {DragItem,subscribe,LinkToggleButton,MonitorVisible,sleep,getElement,Toggle} from '../lib/koiosf_util.mjs';



 

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
        //await sleep(10)
        
    }
console.log("Before    DragItem"); 
    DragItem("move","mainscreen","mainscreen",XYUpdate,ToggleMainLayout);
console.log("After    DragItem"); 
}


var displaywinbuttons=new Toggle(false)
function ToggleMainLayout() {
    var newval=displaywinbuttons.Toggle()?"block":"none"
     getElement("selectliterature").style.display=newval
     getElement("selectnotes").style.display=newval
     getElement("selectvideo").style.display=newval
     getElement("selectslides").style.display=newval
    
}

function loaded() {
      console.log("load in koiosf_move.mjs");
      SetupSliders()
      
      
      var tb=getElement("testbutton");
      console.log(tb);
      
      
}    
document.addEventListener("DOMContentLoaded", loaded )
      



// export function DragItem(draggable,dragarea,mousearea,XYCB,ClickCB) { 



 