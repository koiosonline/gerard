import {LinkButton,InsertIFrame} from './koios_util.mjs';    


    

      
      
export async function SetupChat(windowid,chatlink) {
    
   console.log("In setupchat");
   InsertIFrame(windowid,chatlink);

/* can't access iframe
    function getChatandCopyToClipboard() {
        console.log("getChatandCopyToClipboard");        
        var text=chat.textContent;
        console.log(text);
        console.log(chat.contentWindow);
        console.log(chat.contentWindow.document);
        writeToClipboard(text);    
    }
    LinkButton("sharechat",getChatandCopyToClipboard); 
*/
// <div class="iframe-holder"><iframe src="https://www.koios.online/course-overview" seamless frameborder="0"></iframe></div>
} 