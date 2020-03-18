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

