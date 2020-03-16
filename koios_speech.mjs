import {LinkButton} from './koios_util.mjs';

var voices = [];
var synth = window.speechSynthesis;
var currentVoice=0;

var spsynthbtns;
var PrepareSpeechIconsTemplate;
var PrepareSpeechIconsParent;
var fspeechon=false;

export function SetSpeechLang (lang) {
    console.log("In SetSpeechLang");
    //DisplayCurrentFunctionName(arguments);
    var mainlang= lang.split("-")[0]; // take first characters before "-"
    
    for (var i=0;i<voices.length;i++) {
        var matchlang = voices[i].lang.split("-")[0]
        
        var domid=document.getElementById("spsynth-"+i);
        
        if (matchlang == mainlang) {            
            console.log(voices[i].name);
            domid.style.display = "block"; 
            currentVoice = voices[i]; // use the last language
        }
        else
            domid.style.display = "none"; 
        
    }
}    
   
    
    /*
    function FindLang(voice) { 
        var matchlang = voice.lang.split("-")[0]; // take first characters before "-"
            return matchlang === mainlang;
    }
    currentVoice=voices.find(FindLang); 
    console.log("In currentVoice");
    console.log(voices);
    console.log(currentVoice);
    */
    
export function StartSpeak(text) {
    StopSpeak(); // stop preview texts
    if (fspeechon) {
        var utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = currentVoice;
      
        synth.speak(utterThis);
      // responsiveVoice.speak(text) } 
    }  
}
export function StopSpeak() {  
    if (fspeechon)
        synth.cancel();
   //  responsiveVoice.cancel()
}

function populateVoiceList() {
    console.log("In populateVoiceList callback");
    voices = synth.getVoices();  
    console.log(voices);
    PrepareSpeechIcons()   
    for (var i=0;i<voices.length;i++) {
        var cln = PrepareSpeechIconsTemplate.cloneNode(true);
        PrepareSpeechIconsParent.appendChild(cln);        
        var buttonid="spsynth-"+i;
        cln.id=buttonid; // assign id's
        var name = voices[i].name;
        name = name.replace(/Google/g, "");
        name = name.replace(/Microsoft /g, "");
        name = name.replace(/Desktop /g, "");
        name = name.replace(/English /g, "");
        cln.innerHTML=name;
        LinkButton(buttonid,SelectSpeachSynth);
        cln.style.display = "none"; // hide all spsynth buttons
    }    
    
    
    
}


function SelectSpeachSynth(event) {
     DisplayCurrentFunctionName(arguments);     
     var id=event.id.split("-")[1];
     console.log(id); 
     currentVoice=voices[id];
     console.log(`Selected voice ${currentVoice.name}`);
     EnableSpeech(true);
}    


function PrepareSpeechIcons() {
    console.log("In PrepareSpeechIcons");
    var list = document.getElementsByClassName("spsynthbtn");
    //console.log(list)    
    if (list && list[0]) {
        PrepareSpeechIconsTemplate = list[0];        
        PrepareSpeechIconsParent   = list[0].parentNode
        list[0].remove();
    } else
        console.error("spsynthbtn not found");
    
    PrepareSpeechIcons = function(){} // next time do nothing
}    




export function InitSpeak() { // called once
    console.log("In InitSpeak");
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
     }
    // responsiveVoice.setDefaultVoice("Dutch Female");
}
export function EnableSpeech(on) {
    StopSpeak();
    fspeechon=on;

}

export function IsSpeechOn() {
    return fspeechon;
}
