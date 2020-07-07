import {LinkButton,LinkClickButton,subscribe,DomList,GetCidViaIpfsProvider,getElement} from '../lib/koiosf_util.mjs';   
import {DisplayMessage} from './koiosf_messages.mjs';  
import {CurrentCourseTitle} from './koiosf_lessons.mjs'



subscribe("playerloading",  InitNotes);

var GlobalSlideNotesBlockList;
function InitNotes() {
    console.log("In InitNotes");      
   // GlobalSlideNotesBlockList = new DomList("slide-notes-block")  
    
    
    SetupNotes("notes");
    
}

// subscribe("foundslides",ShowSlidesInNotes) // called when sheets are found via json file

var CleanprevSlides=[]

function ShowSlidesInNotes(slidesarray) {
    GlobalSlideNotesBlockList.EmptyList()
  
    for (var i=0;i<CleanprevSlides.length;i++) 
        CleanprevSlides[i](); // call clean function for previous slides
    
    CleanprevSlides=[]

    for (var i=0;i<slidesarray.length;i++) {
        if (slidesarray[i].png) {
            var target = GlobalSlideNotesBlockList.AddListItem() 
            if (target) {            
                var t1=getElement("slide-notes-header",target)
                SetupHeader(t1,`#${i+1}: ${slidesarray[i].title}`);
                var t2=getElement("slide-notes-text",target)
                CleanprevSlides.push(SetupTextArea(t2,slidesarray[i].png))
                var t3=getElement("mini-slide",target)
                t3.src=GetCidViaIpfsProvider(slidesarray[i].png,0);
            }
        }
    }
} // note combined witn breaking=pre in webflow for headings & pre-wrap for text


//subscribe("loadvideo",ShowVideoInfoInNotes) 

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
        
        
   // console.log(`In SetupTextArea ${uniqueid}`);
    
    target.addEventListener('input',SaveTxt , true); // save the notes    
    
     
    function Clean() {
  //      console.log(`removing listener for ${uniqueid}`);
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
    var target=getElement("video-notes")    
    if (vidinfo)
        SetupHeader(target,`${vidinfo.txt}`)    
    var notes=getElement("notes")
    if (CleanprevN)
        CleanprevN();  
    if (vidinfo)
        CleanprevN=SetupTextArea(notes,vidinfo.videoid,true)    

/*
    target=getElement("video-questions")    
    SetupHeader(target,"Repetition questions")    
    var questions=getElement("questions")
    if (CleanprevQ)
        CleanprevQ();  
    CleanprevQ=SetupTextArea(questions,`questions-${vidinfo.videoid}`,true)    
*/

    
}    


subscribe("slideselected",ShowNotesOfSelectedSlide);


function ShowNotesOfSelectedSlide(n) { // n starts at 0   
    console.log(`ShowNotesOfSelectedSlide ${n}`)
    var target1=getElement("slide-notes-header")
    var target2=getElement("slide-notes-text")    
    for (var i=0;i<target1.length;i++) {
        
      //  target1[i].style.fontSize =i==n?"12px":"9px"
      //  target2[i].style.fontSize =i==n?"12px":"9px"
      
        target1[i].style.color =i==n?"black":"gray"
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
    
    

       
async function SetupNotes(windowid) {
//    LinkClickButton("share");subscribe("shareclick",ShareNotes);
}


/*
    //var email=getElement('emailaddress')
    //email.value=localStorage.getItem("emailaddress");       
    //email.addEventListener('input', x => {localStorage.setItem("emailaddress", x.target.value);console.log(x);}, true); // save the emailaddress
    //LinkButton("sendemail",sendMail);
    //LinkButton("copytoclipboard",x => writeToClipboard(getElement("notesarea").value)  ); 
    
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
    NotesArea = getElement("notescontainer")
    console.log(NotesArea);
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
     //href+=getElement('emailaddress').value;    
     href += "?SUBJECT=Notes from: "+encodeURI(window.location.href);
     href += "&BODY="+encodeURI(getElement("notesarea").value);;
     console.log(href);
    window.open(href,"_blank"); 
}
  
  
  