

var logtext;
export async function SetupLogWindow() {  
    logtext=document.createElement("pre"); // already create to be able to log
    logtext.style.width = "100%";
    logtext.style.height = "100%";   
    logtext.style.fontSize="10px"
    logtext.style.lineHeight="10px";
  
    var position=document.getElementById("log"); 
    position.appendChild(logtext);    
    log("Test logwindow")
    console.log("Switching to HTML logging");
    console.log=log;
    console.error=log;
    
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
}