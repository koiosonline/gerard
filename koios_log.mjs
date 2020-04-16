import {DisplayMessageContinous,SwitchDisplayMessageContinous,DisplayMessage} from './koios_messages.mjs';

var logtext;
export function SetupLogWindow() {  // not async to
    console.log("In SetupLogWindow");
    logtext=document.createElement("pre"); // already create to be able to log
    logtext.style.width = "100%";
    logtext.style.height = "100%";   
    logtext.style.fontSize="10px"
    logtext.style.lineHeight="10px";
  
    var position=document.getElementById("log"); 
    position.appendChild(logtext);    
    log("Test logwindow")
  
 // logtext=document.getElementById("notes");
 // console.log(logtext);
  
  /*
    console.log("Switching to HTML logging");
    console.log=log;
    console.error=log;
    console.warn=log;
*/    
    
    
    
}
export function log(s) {
    //console.log(s);
    //console.log(typeof s);  
    if ((typeof s) !="string")  {
        console.log("converting to string");
        s = JSON.stringify(s);
    }   
        
    if (logtext)
        logtext.innerHTML +=s+"\r";
    
    logtext.scrollTop = logtext.scrollHeight; // keep the windows "scrolled down"
    
    
    
}