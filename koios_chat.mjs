    var chatlink="https://gitter.im/web3examples/test/~embed";
    
      //SetupChat("chat",chatlink);
      
      
async function SetupChat(windowid,chatlink) {
    
   var chatdom=document.getElementById(windowid);
   console.log("In setupchat");
   console.log(chatdom);
   
   var chat=document.createElement("iframe");
    chat.src=chatlink;
    chat.width="100%"
    chat.height="100%"
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
    LinkButton("chattoclipboard",getChatandCopyToClipboard); 


} 