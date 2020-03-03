import {LinkButton} from './koios_util.mjs';    
    
    var NotesArea;
    function getVisibleTranscriptandCopyToClipboard() {
        console.log("getVisibleTranscriptandCopyToClipboard");
        var text="";
        var arrchildren=innertrans.children;
        for (var i=0;i<arrchildren.length;i++) {
            if (arrchildren[i].style.display == "block") // then it's visible
                text +=arrchildren[i].textContent;
        }
        console.log(text);
        writeToClipboard(text);    
    }
    LinkButton("transcripttoclipboard",getVisibleTranscriptandCopyToClipboard);  
    
    
    SetupNotes("notes");
    
    
    
async function SetupNotes(windowid) {
    NotesArea=document.getElementById(windowid);
    NotesArea.contentEditable="true"; // make div editable
     NotesArea.style.whiteSpace = "pre"; //werkt goed in combi met innerText
   // console.log("NotesArea");
   // console.log(NotesArea);
    //var NotesArea=document.getElementById('notesarea')    
    NotesArea.innerHTML=localStorage.getItem("notes");   
    NotesArea.addEventListener('input', x => { localStorage.setItem("notes", x.target.innerText);console.log("input");console.log(x.target.innerText); }, true); // save the notes    
    //var email=document.getElementById('emailaddress')
    //email.value=localStorage.getItem("emailaddress");       
    //email.addEventListener('input', x => {localStorage.setItem("emailaddress", x.target.value);console.log(x);}, true); // save the emailaddress
    //LinkButton("sendemail",sendMail);
    //LinkButton("copytoclipboard",x => writeToClipboard(document.getElementById("notesarea").value)  ); 
    
    LinkButton("share",ShareNotes);
    
   // console.log("SetupNotes");
   // console.log(NotesArea); 
    //NotesArea.style.height=notesform.getBoundingClientRect().height+"px"; // hack to make field larger
   // console.log(NotesArea); 
}   



async function writeToClipboard(text) {

    try {
        await navigator.clipboard.writeText(text);
        var msg=`Copied to clipboard (${text.length} characters)`;
        console.log(msg);        
    } catch (error) {
        console.error(error);
    }
}
async function ShareNotes() {
    var toShare=NotesArea.innerText    
    let err;   
    await navigator.share({ title: "Sharing notes", text: toShare }).catch( x=>err=x);
    if (err) {
        writeToClipboard(toShare); 
        DisplayMessage(`Copied to clipboard: ${toShare.slice(0,50)}`);
     }
} 


function sendMail() {
     var href = "mailto:";
     //href+=document.getElementById('emailaddress').value;    
     href += "?SUBJECT=Notes from: "+encodeURI(window.location.href);
     href += "&BODY="+encodeURI(document.getElementById("notesarea").value);;
     console.log(href);
    window.open(href,"_blank"); 
}
  
  
  