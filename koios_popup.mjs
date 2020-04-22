import {sleep,publish,subscribe,MonitorDomid,MonitorVisible,SelectTabBasedOnName} from './koios_util.mjs';

var oldtarget;
var oldbackgroundColor;
var oldfontSize;

function ChildChanged(childdomid,childnr) {
    console.log(`In function ChildChanged ${childnr}`);
    if (childdomid !== oldtarget) {
        if (oldtarget) {
            oldtarget.style.backgroundColor = oldbackgroundColor;
            oldtarget.innerHTML=""
            oldtarget.style.fontSize=oldfontSize;
        }
        oldbackgroundColor = childdomid.style.backgroundColor;
        oldfontSize = childdomid.style.fontSize;
        
        var domid=document.getElementById("popup");
        var tabheadings=domid.getElementsByClassName("tab-heading");
        var target2=tabheadings[childnr];
        var name=target2.getElementsByTagName("h2")[0].innerHTML;
        var icon=target2.getElementsByClassName("large-icon")[0];
        childdomid.id=name.toLowerCase().trim();
        childdomid.innerHTML=icon.innerHTML;
        childdomid.style.fontFamily=window.getComputedStyle(icon).getPropertyValue("font-family")
        childdomid.style.fontSize=window.getComputedStyle(icon).getPropertyValue("font-size")        
        childdomid.style.backgroundColor="transparent"   // hide circle
        oldtarget=childdomid;
    }
}    


export function InitPopup() { 
    MonitorDomid("popup","w-slider-nav","w-slider-dot","w-active",ChildChanged)    
    MonitorVisible("popup") // publishes when object changes vibility
}    

// Later, you can stop observing
// observer.disconnect();


/*
    margin: 20px;
    margin-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
*/



subscribe('popupdisplayblock',x=> {
      window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again 
});   



var RelaxTime=5000;

export async function Relax() {
    console.log("Relax");
    publish ("startrelax");
    var style = window.getComputedStyle(document.getElementById("popup"))
    if (style.display.includes("none")) { // then popup not visible    
        document.getElementById('bottle').click();    
        sleep(1000);
    }
    console.log(document.getElementById("popup").style.cssText);
    
   
   SelectTabBasedOnName("popup","relax");
    
   
    await sleep(RelaxTime);
    
    var style = window.getComputedStyle(document.getElementById("popup"))
    if (style.display.includes("block")) { // then popup not visible    
        document.getElementById('bottle').click();    
    }
    publish ("stoprelax");
}
   
