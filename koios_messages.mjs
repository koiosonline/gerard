import {sleep} from './koios_util.mjs';  


export async function DisplayMessage(text) {    
    console.log("In DisplayMessage");
    var msg=document.getElementById("message");
    console.log(msg);
    msg.innerText=text;
    msg.style.display="block";
    await sleep(1000);
    msg.style.display="none";    
}

export async function SwitchDisplayMessageContinous(fOn) {
    console.log("In InitDisplayMessageContinous");
    var msg=document.getElementById("message");
    msg.innerText = "";
    msg.style.display=fOn?"block":"none";    
}


export async function DisplayMessageContinous(text) {    
    //console.log("In DisplayMessageContinous");
    var msg=document.getElementById("message");
    //console.log(msg);
    msg.innerText +=text+"\n";
    
        
    msg.scrollTop = msg.scrollHeight; // keep the windows "scrolled down"
    
}

