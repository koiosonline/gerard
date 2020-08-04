import {LinkButton,LinkClickButton,subscribe,DomList,GetCidViaIpfsProvider,getElement,setElementVal,FitOneLine} from '../lib/koiosf_util.mjs';   
import {DisplayMessage} from './koiosf_messages.mjs';  
import {CurrentCourseTitle} from './koiosf_lessons.mjs'

console.log("Start notes");


subscribe("loadvideo",ShowVideoInfoInNotes) 


window.addEventListener('DOMContentLoaded', asyncloaded);  // load  


var GlobalNotesArea

async function asyncloaded() {    
     GlobalNotesArea=new NotesAreaClass(getElement("notes"))
     FitOneLine(getElement("videotitle"))
     LinkClickButton("share",ShareNotes);
}

       
function ShowVideoInfoInNotes(vidinfo) {
    GlobalNotesArea.UpdateId(vidinfo.videoid);
    setElementVal("videotitle","Notes for: "+vidinfo.txt);
}  
 
    
 
class NotesAreaClass {    
    constructor (target) {
        console.log("Constructor of NotesAreaClass");
        this.target=target;        
        this.target.contentEditable="true"; // make div editable
        this.target.style.whiteSpace = "pre"; //werkt goed in combi met innerText                
        this.target.innerHTML = "..."
        this.target.addEventListener('input',this.SaveTxt , true); // save the notes    
    }   // this.target.removeEventListener('input',this.SaveTxt , true); // save the notes       
    
    UpdateId(uniqueid) {
        console.log(`Update id ${uniqueid}`)
        this.uniqueid=uniqueid
        this.target.innerHTML = "..."
        var cached=localStorage.getItem("notes-"+this.uniqueid);     
        if (cached) 
            this.target.innerHTML = cached;        
        console.log(this.uniqueid);        
    }    
    GetId() {
        return this.uniqueid
    }    
    
    GetText() {       
        return this.target.innerText;
    }
    
    SaveTxt(txt) { // this is different now(eventlistener related)
        var uniqueid=GlobalNotesArea.GetId();
        console.log(uniqueid);
        localStorage.setItem("notes-"+uniqueid, txt.target.innerText);
        console.log("input");
        console.log(txt.target.innerText); 
    }

}     
    


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
    
    


async function writeToClipboard(text) {
    console.log(`writeToClipboard ${text}`)
    
       await navigator.permissions.request({name: 'clipboard-write'});
    
    var perm=await navigator.permissions.query({name:'clipboard-write'})
    console.log(perm)
    
    try {
        await navigator.clipboard.writeText(text);
        var msg=`Copied to clipboard (${text.length} characters)`;
        console.log(msg);
        DisplayMessage(msg);
    } catch (error) {
        DisplayMessage(error.message);
        console.error(error);
    }
}

async function ShareNotes() {
    console.log("In ShareNotes");
    
    var toShare=GlobalNotesArea.GetText()
    console.log(toShare)
    let err;
    console.log(navigator)
    console.log(navigator.share);
    console.log(navigator.share.length);
    
    if (navigator && navigator.share && navigator.share.length > 0) {
        console.log("Sharing");
        await navigator.share({ title: "Sharing notes", text: toShare }).catch( x=>err=x);
        if (err) writeToClipboard(toShare);
    }
     else 
         writeToClipboard(toShare);     
     
     
} 


function sendMail() {
     var href = "mailto:";
     //href+=getElement('emailaddress').value;    
     href += "?SUBJECT=Notes from: "+encodeURI(window.location.href);
     href += "&BODY="+encodeURI(getElement("notesarea").value);;
     console.log(href);
    window.open(href,"_blank"); 
}
  
  
  