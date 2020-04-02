import {sleep} from './koios_util.mjs';  


export async function DisplayMessage(text) {    
    console.log("In DisplayMessage");
    var msg=document.getElementById("message");
    var msgtext=document.getElementById("msg-text");
    console.log(msg);
    msgtext.innerText=text;
    
    msg.style.display="block";
    await sleep(1000);
    msg.style.display="none";    
}

export async function SwitchDisplayMessageContinous(fOn) {
    console.log("In InitDisplayMessageContinous");
    var msg=document.getElementById("message");
    msg.style.display=fOn?"block":"none";    
    
    var msgtext=document.getElementById("msg-text");
    msgtext.innerText = "";
    
}


export async function DisplayMessageContinous(text) {    
    //console.log("In DisplayMessageContinous");
    var msg=document.getElementById("message");
    var msgtext=document.getElementById("msg-text");
    //console.log(msg);
    msgtext.innerText +=text+"\n";
    
        
    msgtext.scrollTop = msgtext.scrollHeight; // keep the windows "scrolled down"
    
}

