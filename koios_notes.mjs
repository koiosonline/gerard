import {LinkButton,LinkClickButton,subscribe,DomList,GetCidViaIpfsProvider} from './koios_util.mjs';    
import {DisplayMessage} from './koios_messages.mjs';  




subscribe("playerloading",  InitNotes);

var GlobalSlideNotesBlockList;
function InitNotes() {
    console.log("In InitNotes");      
    GlobalSlideNotesBlockList = new DomList("slide-notes-block")  
}

subscribe("foundslides",ShowSlidesInNotes) // called when sheets are found via json file

var CleanprevSlides=[]

function ShowSlidesInNotes(slidesarray) {
    GlobalSlideNotesBlockList.EmptyList()
  
    for (var i=0;i<CleanprevSlides.length;i++) 
        CleanprevSlides[i](); // call clean function for previous slides

    for (var i=0;i<slidesarray.length;i++) {
        if (slidesarray[i].png) {
            var target = GlobalSlideNotesBlockList.AddListItem() 
            if (target) {            
                var t1=target.getElementsByClassName("slide-notes-header")[0]
                SetupHeader(t1,`#${i+1}: ${slidesarray[i].title}`);
                var t2=target.getElementsByClassName("slide-notes-text")[0]            
                CleanprevSlides.push(SetupTextArea(t2,slidesarray[i].png))
                var t3=target.getElementsByClassName("mini-slide")[0]    
                t3.src=GetCidViaIpfsProvider(slidesarray[i].png,0);
            }
        }
    }
} // note combined witn breaking=pre in webflow for headings & pre-wrap for text


subscribe("loadvideo",ShowVideoInfoInNotes) 

function SetupHeader(target,txt) {
    target.innerHTML=txt
    target.style.overflow="hidden"
    target.style.textOverflow="ellipsis"  
}    

function SetupTextArea(target,uniqueid) {
    target.contentEditable="true"; // make div editable
    target.style.whiteSpace = "pre"; //werkt goed in combi met innerText
    target.innerHTML=localStorage.getItem(uniqueid); 
    if (!target.innerHTML) 
            target.innerHTML = "..."
        
        
    console.log(`In SetupTextArea ${uniqueid}`);
    
    target.addEventListener('input',SaveTxt , true); // save the notes    
    
     
    function Clean() {
        console.log(`removing listener for ${uniqueid}`);
       target.removeEventListener('input',SaveTxt , true); // save the notes    
    }

    function SaveTxt(txt) { 
        localStorage.setItem(uniqueid, txt.target.innerText);
        console.log("input");
        console.log(txt.target.innerText); 
    }
    return Clean;
}     
    
var CleanprevN;    
var CleanprevQ;    
function ShowVideoInfoInNotes(vidinfo) {
    var target=document.getElementById("video-notes")    
    SetupHeader(target,`${vidinfo.txt}`)    
    var notes=document.getElementById("notes")
    if (CleanprevN)
        CleanprevN();  
    CleanprevN=SetupTextArea(notes,vidinfo.videoid,true)    

    target=document.getElementById("video-questions")    
    SetupHeader(target,"Questions")    
    var questions=document.getElementById("questions")
    if (CleanprevQ)
        CleanprevQ();  
    CleanprevQ=SetupTextArea(questions,`questions-${vidinfo.videoid}`,true)    


    
}    


subscribe("slideselected",ShowNotesOfSelectedSlide);


function ShowNotesOfSelectedSlide(n) { // n starts at 0   
    console.log(`ShowNotesOfSelectedSlide ${n}`)
    var target1=document.getElementsByClassName("slide-notes-header")
    var target2=document.getElementsByClassName("slide-notes-text")    
    for (var i=0;i<target1.length;i++) {
        
        target1[i].style.fontSize =i==n?"12px":"9px"
        target2[i].style.fontSize =i==n?"12px":"9px"
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
    
    
SetupNotes("notes");
       
async function SetupNotes(windowid) {
    LinkClickButton("share");subscribe("shareclick",ShareNotes);
}


/*
    //var email=document.getElementById('emailaddress')
    //email.value=localStorage.getItem("emailaddress");       
    //email.addEventListener('input', x => {localStorage.setItem("emailaddress", x.target.value);console.log(x);}, true); // save the emailaddress
    //LinkButton("sendemail",sendMail);
    //LinkButton("copytoclipboard",x => writeToClipboard(document.getElementById("notesarea").value)  ); 
    
    //LinkButton("share",ShareNotes);

    
   // console.log("SetupNotes");
   // console.log(NotesArea); 
    //NotesArea.style.height=notesform.getBoundingClientRect().height+"px"; // hack to make field larger
   // console.log(NotesArea); 
*/  



async function writeToClipboard(text) {

    try {
        await navigator.clipboard.writeText(text);
        var msg=`Copied to clipboard (${text.length} characters)`;
        console.log(msg);
        DisplayMessage(msg);
    } catch (error) {
        console.error(error);
    }
}
async function ShareNotes() {
    console.log("In ShareNotes");
    var toShare=NotesArea.innerText    
    let err;
    if (navigator && navigator.share) {
        await navigator.share({ title: "Sharing notes", text: toShare }).catch( x=>err=x);
        if (err) writeToClipboard(toShare);
    }
     else 
         writeToClipboard(toShare);     
} 


function sendMail() {
     var href = "mailto:";
     //href+=document.getElementById('emailaddress').value;    
     href += "?SUBJECT=Notes from: "+encodeURI(window.location.href);
     href += "&BODY="+encodeURI(document.getElementById("notesarea").value);;
     console.log(href);
    window.open(href,"_blank"); 
}
  
  
  