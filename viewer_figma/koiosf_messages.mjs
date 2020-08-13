import {sleep,subscribe,publish,getElement} from '../lib/koiosf_util.mjs'; 


export async function DisplayMessage(text) {    

    console.log("In DisplayMessage");
     getElement("ov_message").dispatchEvent(new CustomEvent("show"));  
    
   // var msg=getElement("message");
    var msgtext=getElement("msg-text");
    //console.log(msg);
    msgtext.innerText=text;
    
   // msg.style.display="flex";
    await sleep(1000);
   // msg.style.display="none";    
   getElement("ov_message").dispatchEvent(new CustomEvent("hide"));  
   SwitchPage("close") // close message overlay
}

export async function SwitchDisplayMessageContinous(fOn) {
    console.log("In InitDisplayMessageContinous");
  
    if (!fOn) 
      SwitchPage("close") // close message overlay
    
    var msgtext=getElement("msg-text");
    msgtext.innerText = "";
    
}


export async function DisplayMessageContinous(text) {    
    //console.log("In DisplayMessageContinous");
   // var msg=getElement("message");
    var msgtext=getElement("msg-text");
    //console.log(msg);
    msgtext.innerText +=text+"\n";
    msgtext.scrollTop = msgtext.scrollHeight; // keep the windows "scrolled down"
    
}

 
