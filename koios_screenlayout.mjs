import {DragItem} from './koios_util.mjs';

export async function SetupSliders() {
    var grid=document.getElementById("mainscreen");    
    var SetMiddleh=window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ")[1];       
    var SetM=window.getComputedStyle(grid).getPropertyValue("grid-template-rows").split(" ")    
    var SetMiddlev1=SetM[1];
    var SetMiddlev2=SetM[2]
    
    if (!SetMiddleh) SetMiddleh="7px";
    

    function XYUpdate(percx,percy) {
        console.log(percx,percy)
        const snap = 0.01;
        var left  = (percx      < snap) ? "0px":`${percx*2}fr`;
        var right = ( (1-percx) < snap) ? "0px":`${(1-percx)*2}fr`;
        var top   = (percy      < snap) ? "0px":`${percy*2}fr`;
        var bot   = ( (1-percy) < snap) ? "0px":`${(1-percy)*2}fr`;        
        var c=`${left} ${SetMiddleh} ${right}`;
        var r=`${top} ${SetMiddlev1} ${SetMiddlev2} ${bot}`;
        grid.style["gridTemplateColumns"] = c;
        grid.style["gridTemplateRows"]    = r;
        console.log(c)
        console.log(r);
        
        
        
        var a=window.getComputedStyle(grid).getPropertyValue("grid-template-columns")
        var b=window.getComputedStyle(grid).getPropertyValue("grid-template-rows")
        console.log(`${a} ///  ${b}`);
        
        
    }      
    DragItem("move","mainscreen","mainscreen",XYUpdate);
}
