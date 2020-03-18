import {LinkButton} from './koios_util.mjs';    


    

      
      
export async function SetupChat(windowid,chatlink) {
    
   var chatdom=document.getElementById(windowid);
   console.log("In setupchat");
   console.log(chatdom);
   
   
   
   var chat=document.createElement("iframe");
    chat.src=chatlink;
    chat.width="100%"
    chat.height="100%"
    chat.style.height="100%"
    chat.style.minHeight="100%"
    
    
 
    chat.style.position="absolute";
    chat.style.top="0";
    chat.style.left="0";


    
    
   // chat.style.outline="1px";
   // chat.style.outlineStyle="solid";
    chatdom.appendChild(chat);

    function getChatandCopyToClipboard() {
        console.log("getChatandCopyToClipboard");        
        var text=chat.textContent;
        console.log(text);
        console.log(chat.contentWindow);
        console.log(chat.contentWindow.document);
        writeToClipboard(text);    
    }
    LinkButton("sharechat",getChatandCopyToClipboard); 

// <div class="iframe-holder"><iframe src="https://www.koios.online/course-overview" seamless frameborder="0"></iframe></div>
} 