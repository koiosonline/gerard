console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

import {GetYouTubePlaylists}     from './koios_youtube.mjs';
import {SetupVideoWindowYouTube} from './koios_playvideo.mjs';

/* General comments
https://gpersoon.com/koios/test/koios_video.js

// note: when connected via USB & full screen: playing video is flickering
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
// <script src='https://raw.githubusercontent.com/web3examples/lib/master/koios_video.js'></script>  
// <script src='https://web3examples.com/lib/koios_video.js'></script>  
// <script src='https://gpersoon.com/koios/koios_video.js'></script>  
// https://developer.mozilla.org/en-US/docs/Web/API/VTTCue
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
// http://ronallo.com/demos/webvtt-cue-settings/
// https://developer.mozilla.org/en-US/docs/Web/API/TextTrack 
https://developers.google.com/youtube/iframe_api_reference
https://developers.google.com/youtube/player_parameters
https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25370  (does work)
https://stackoverflow.com/questions/13735783/youtube-api-how-to-use-custom-controls-to-turn-captions-on-off-change-languag/38346968
https://terrillthompson.com/648

player.getOptions() => "captions"
player.getOptions('captions')=>
0: "reload"
1: "fontSize"
2: "track"
3: "tracklist"
4: "translationLanguages"
5: "sampleSubtitle"

player.getOption('captions', 'tracklist');
0: {languageCode: "zh-CN", languageName: "Chinese (China)", displayName: "Chinese (China)", kind: "", name: null, …}
1: {languageCode: "nl", languageName: "Dutch", displayName: "Dutch", kind: "", name: null, …}
2: {languageCode: "en", languageName: "English", displayName: "English", kind: "", name: null, …}
3: {languageCode: "fr-FR", languageName: "French (France)", displayName: "French (France)", kind: "", name: null, …}
4: {languageCode: "de", languageName: "German", displayName: "German", kind: "", name: null, …}
5: {languageCode: "ru", languageName: "Russian", displayName: "Russian", kind: "", name: null, …}
6: {languageCode: "es", languageName: "Spanish", displayName: "Spanish", kind: "", name: null, …}

player.getOption('captions', 'track');
{languageCode: "nl", languageName: "Dutch", displayName: "Dutch", kind: "", name: null, …}

layer.getOption('captions', 'translationLanguages')
(104) [{…}, {…},

player.setOption('captions', 'track', {'languageCode': 'nl'});
player.setOption('captions', 'track', {});



 player.setOption("captions", "displaySettings", {"background": "#fff"}); // doesnt work



*/  

{ // Global variables
var position;
var logpos;
var logtext=0;
var logipfs;
var player=0;
var playerpromise;
var video=0;
var slide;
var ToggleCueVisibilityStatus=true;
var currenttrack=0;
var currentlang=0;
var subtitles; // global storage of subtitles
var currentSubtitle=0;
var previous_span=0;
var previous_color=0;
var langbtns; // array of all language buttons;
var langbtns_index=0;
var SecondsToSubtitle=[];
var setofsheets;
var globalyoutubeid; // global for onYouTubeIframeAPIReady
var voices = [];
var synth = window.speechSynthesis;
var currentVoice=0;
var fspeechon=0;
var ffirst=1;
var previous_colour=""
var previous_row=-1;
var table
var tablediv
var fTriedFullScreen=false;
var fFullScreen=false;
var fSoundOn=true;
var defaultvolume=100;
var vidproginput=0;
var vidprogress=0;
var slider=0; // global
var NotesArea;
var parser = new DOMParser(); 
var font=0;
var slideimage;
var slides= [];
var preferredslide=0;
var SlideIndicatorTemplate;
var SlideIndicatorParent;
var spsynthbtns;
}    
function videoerror(event){ 
  let error = event;
    if (event.path && event.path[0]) {     // Chrome v60
      error = event.path[0].error;
    }    
    if (event.originalTarget) { // Firefox v55
      error = error.originalTarget.error;
    }
    alert(`Video error: ${error.message}`);     // Here comes the error message
}
async function CreateHeader(windowid) {
    var domid=document.getElementById(windowid); 
    if (domid) {
        var arrchildren=domid.children;    
            for (var i=0;i<arrchildren.length;i++) 
                domid.removeChild(arrchildren[i]);
            
                arrchildren=domid.children;    
            for (var i=0;i<arrchildren.length;i++) 
                domid.removeChild(arrchildren[i]);
    }   
        //console.log(windowid);
//console.log(domid);        
    return domid;
/*    
    var headerrow=0;
    var blockcontent=0;

    var arrchildren=domid.children;
    for (var i=0;i<arrchildren.length;i++) {
        switch(arrchildren[i].className) {
            case 'headerrow': headerrow = arrchildren[i];break;
            case 'blockcontent':blockcontent= arrchildren[i]; break;

        }
    }  
    function MoveToEnd() {
        console.log("In MoveToEnd");
        event.preventDefault();
        domid.parentNode.appendChild(domid);
    }
    headerrow.addEventListener("contextmenu", MoveToEnd); // rightclick
    headerrow.draggable="true"
    domid.addEventListener('drop', ev=>{ 
          ev.preventDefault();
          var data = ev.dataTransfer.getData("text");
          SwapObjects(ev.currentTarget,document.getElementById(data));
        }
    );
    headerrow.addEventListener('dragstart',ev => {
            ev.dataTransfer.setData("text", ev.target.parentNode.id)
        }    
    );
    domid.addEventListener('dragover', ev => {
            ev.preventDefault();
        }
    );
    log(`CreateHeader Creating window ${windowid}`);    
    return blockcontent;
*/
}
async function SetupLogWindow(windowid) {  
    logtext=document.createElement("pre"); // already create to be able to log
    logtext.style.width = "100%";
    logtext.style.height = "70%";   
    logtext.style.fontSize="10px"
    logtext.style.lineHeight="10px";
    
    logpos=document.createElement("div");
    logipfs=document.createElement("div");
    
  
    position=document.getElementById(windowid); 
    position.appendChild(logtext);    
    position.appendChild(logpos);
    position.appendChild(logipfs);
}
function log(s) {
    //console.log(s);
    //console.log(typeof s);  
    if ((typeof s) !="string")  {
        console.log("converting to string");
        s = JSON.stringify(s);
    }   
        
    if (logtext)
        logtext.innerHTML +=s+"\r";
}
function GetDuration() {
    if (video) return video.duration;
    if (player && player.getDuration) return  player.getDuration();
    return 0;
}  
async function VideoLocation() { 
    var CurrentPos=0;
    var Duration=GetDuration();
    var PlaybackRate=1;
    var ReallyPlayed=0;
    
    if (video) {
        CurrentPos=video.currentTime
        for (let i=0;i< video.played.length;i++) { // check amount of really played
           ReallyPlayed += video.played.end(i) - video.played.start(i);
        } 
        PlaybackRate = video.playbackRate;

    }
    if (player) {
        if (player.getCurrentTime) {
            CurrentPos=player.getCurrentTime();
            PlaybackRate=player.getPlaybackRate()
        }
    }
    //console.log(`In VideoLocation pos=${CurrentPos}`);
    SetVideoProgressBar(parseFloat (CurrentPos / Duration ));
    
    if (logpos) {
        logpos.innerText=`Position: ${CurrentPos.toFixed(1)}`;      
        logpos.innerText+=` Played: ${ReallyPlayed.toFixed(0)}`;
        logpos.innerText+=` (of ${Duration.toFixed(0)} seconds)`;
        logpos.innerText+=` speed=${PlaybackRate.toFixed(1)}`;
        logpos.innerText+=` lang=${currentlang}`;
    }
    
    function check  (x) { 
       return parseFloat(x.start) > parseFloat(CurrentPos);
    } 
    if (currentSubtitle) {
        var y= currentSubtitle.findIndex(check ); 
        if (logpos)
            logpos.innerText+=` subtitle#=${y>0?y-1:""}`;
        HighlightTransscript(`sub-${currentlang}-${y-1}`);
    }
    if (logpos) {
          logpos.innerText+=` volume=${GetVolume()}`;
          logpos.innerText+=` speech=${fspeechon}`;
          logpos.innerText+=` subtitle=${ToggleCueVisibilityStatus}`;
    }
}  
/*
function StyleCues() {
    let s = document.createElement("style");
    s.type = "text/css";
    s.id="cuestyle";
    document.body.appendChild(s);
    CueVisible(ToggleCueVisibilityStatus);
}
*/ 
function SetPlayerSubtitle(lang) {
   if (player &&  player.setOption) 
        player.setOption('captions', 'track', lang==""?{}:{'languageCode': lang}); 
}
function CueVisible(on) {
    // document.getElementById("cuestyle").innerHTML=on?"::cue {visibility: visible;}" : "::cue {visibility: hidden;}";
    if (video)
        currenttrack.mode=on?"showing":"hidden"; // while hidden, events are still triggered
    if (player)
        SetPlayerSubtitle(on?currentlang:"")
}    
function ToggleCueVisibility() { 
   ToggleCueVisibilityStatus = !ToggleCueVisibilityStatus;
   CueVisible(ToggleCueVisibilityStatus);
} 
function selectLanguage(lang_code) {    
    if (video) { // only if we control the video object
        let ttList=video.textTracks;
        let wanted=0;
        for (let i=0;i<ttList.length;i++) {
            if (ttList[i].language == lang_code) {
                wanted=ttList[i];
                break;
            }    
        }
        if (wanted) {
            if (currenttrack) currenttrack.mode="disabled"; // disable previous
            currenttrack = wanted;    
            wanted.mode="showing";
        }
    }
 
    
    if (currentlang) document.getElementById("languagespan_"+currentlang).style.display = "none";
    currentlang=lang_code;
    
       if (player) SetPlayerSubtitle(lang_code);
    
    
    document.getElementById("languagespan_"+currentlang).style.display = "block";
    
     for (var i=0;i<subtitles.length;i++) 
        if (subtitles[i].lang_code == lang_code)
            currentSubtitle=subtitles[i].subtitle;
    if (currentSubtitle) {
        console.log('Selected subtitle');
        console.log(currentSubtitle[0].text);
    }
    SetSpeechLang(lang_code);    
} 
function HighlightTransscript(id) {
    //console.log(`HighlightTransscript ${id}`);
    var sub_span=document.getElementById(id);    
    if (sub_span) {
        if (previous_span == sub_span) return;
        previous_color = sub_span.style.color; // remember color
    }
    if (previous_span) previous_span.style.color = previous_color; 
    if (sub_span) {
        sub_span.style.color = 'green'; 
        previous_span = sub_span;
        
        //console.log(sub_span.innerHTML);
        StartSpeak(sub_span.innerHTML);
    }
    
    
   
}
function SubTitleClicked(event) { 
console.log("SubTitleClicked");
    var x=event.target.id.split("-");
    var newpos=currentSubtitle[Number(x[2])].start;
    SetVideoSeconds(newpos);
}    
function AddSubtitleLang(lang_translated, lang_code,subtitle,translocation,setofsheets) { 
    if (lang_code == "vor") // special case: for sheets
       return;
    if (lang_code !== "nl") // testing for nl
       return;
    console.log(`Adding language ${lang_code}`);       
       
       
    
    var currentlangbtn=langbtns[langbtns_index++];
    currentlangbtn.id="lang_"+lang_code; // assign id's
    currentlangbtn.style.display = "block"; // make visible again
    currentlangbtn.innerHTML=lang_translated;
    //console.log(currentlangbtn);
    
    
    LinkButton("lang_"+lang_code,x => selectLanguage(lang_code));
    var languagespan=document.createElement("div");
    languagespan.style.display = "none";
    //languagespan.style.overflowY = "scroll";
    languagespan.id="languagespan_"+lang_code;
    translocation.appendChild(languagespan);
    
    if (video) {
        console.log(video);
        let track = video.addTextTrack('subtitles',  lang_translated,  lang_code);    
        track.mode = "disabled"; // default disabled           
        track.oncuechange= ( x => { // every change of subtitles    // checkout GetCueAsHTML      
            if (x.currentTarget.activeCues.length != 0) {                
                HighlightTransscript(x.currentTarget.activeCues[0].id)                                
            } 
        }); 
    }
    var slidenr=0;
    var slideinfo;
    if (setofsheets ) {// not allways present    
        console.log(setofsheets.lang_code );
        for (var i=0;i<setofsheets.subtitle.length;i++) {
            slideinfo = setofsheets.subtitle[i];
            console.log(`Start: ${Math.round(parseFloat(slideinfo.start))} ${slideinfo.text}<br>`);
        }
        
    }
    for (var j=0;j < subtitle.length;j++) {
        if (video) {
            var cue = new VTTCue(subtitle[j].start, parseFloat(subtitle[j].start)+parseFloat(subtitle[j].dur), subtitle[j].text);
            cue.id=`sub-${lang_code}-${j}`;
            track.addCue(cue);
        }
        if (setofsheets) { 
            if (slidenr < setofsheets.subtitle.length) {
                slideinfo = setofsheets.subtitle[slidenr];   
                if (parseFloat(slideinfo.start) >= (j> 0?parseFloat(subtitle[j-1].start):0) && (parseFloat(slideinfo.start) <= parseFloat(subtitle[j].start))) { // should be here
                    var spanslide=document.createElement("span");
                    var nums = slideinfo.text.replace(/[^0-9]/g,'');
                    var num = parseInt(nums);
                    spanslide.innerHTML=`Slide: ${Math.round(parseFloat(slideinfo.start))} ${slideinfo.text} j=${j} ${Math.round(parseFloat(subtitle[j].start))} ${slides[num]}<br>`;
                    
                    
                    
                    languagespan.appendChild(spanslide);
                    slidenr++;
                }
                
            }
        }
        
        var span=document.createElement("span");
    let txtstr=`Start: ${Math.round(parseFloat(subtitle[j].start))} ${subtitle[j].text}<br>`;
        txtstr = txtstr.replace(/\.[\.]+/, ''); // replace multiple dots with empty string
        txtstr = txtstr.replace(/\.[\.]+/, ''); // repeat for the situation where ... is added twice
        span.innerHTML=txtstr+" ";
        span.id=`sub-${lang_code}-${j}`;
        languagespan.appendChild(span);
        span.addEventListener("click",SubTitleClicked);
    }
}  
function SubtitleToSeconds(subtitles) {
    var Seconds=[];
     console.log('In SubtitleToSeconds');

    for (var i=0;i<subtitles.length;i++) {        
        Seconds=[];
        var subtitle = subtitles[i].subtitle;
        //console.log(subtitles[i].lang_code);
        //if (subtitles[i].lang_code !== "vor") continue; // testing
        //console.log(subtitle);
        
        
       // console.log(Seconds);
         for (var j=0;j < subtitle.length;j++) {
             var subline=subtitle[j];
             
             var s=parseInt(subline.start);
             var e=parseInt(parseFloat(subline.start)+parseFloat(subline.dur));
             //console.log(`${s} ${e} ${subline.text} `);
             for (var k=s; k< e;k++)
                 Seconds[k]=j;
         }
       //  console.log(Seconds);
    }
    
}         
async function SetupSubtitlesStruct(windowid,_subtitles,lang) {
    subtitles = _subtitles; // store in global var.
    
    SubtitleToSeconds(subtitles)
    
    
    var transcripts=document.getElementById(windowid); 
    
    //var innertrans=document.createElement("div");
    //transcripts.appendChild(innertrans);
    //innertrans.style.fontSize="14px";
    
    langbtns=document.getElementsByClassName("langbtn")
    for (var i=0;i<langbtns.length;i++) {
        //console.log(langbtns[i]);
        langbtns[i].style.display = "none"; // hide all language buttons
    }
    
    for (var i=0;i<subtitles.length;i++) {
       // console.log(subtitles[i].lang_code );
        if (subtitles[i].lang_code == "vor") // sheets
            setofsheets=subtitles[i];
    }
    if (setofsheets)
       SetupSlideIndicators();
    
    for (var i=0;i<subtitles.length;i++) 
        AddSubtitleLang(subtitles[i].lang_translated, subtitles[i].lang_code, subtitles[i].subtitle,transcripts,setofsheets);
    CueVisible(ToggleCueVisibilityStatus);
    
    selectLanguage(lang);
    
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
}
async function SetupSubtitles(windowid,surl,lang) {
    log(`Get subtitles from ${surl}`);
    console.log(surl);

    document.getElementById("subtitle-collection").hidden=true;      
    var data=await fetch(surl);
    var t=await data.text();
    subtitles=JSON.parse(t);  

    SetupSubtitlesStruct(windowid,subtitles,lang);
}
async function SetupPDFWindow(windowid,pdfurl) { 
    var sf=document.getElementById(windowid);
    //console.log(sf);
     
    async function SetupPDFWindowGoogle() {  // laadt soms niet, zeker als er al een tweede windows openstaat
        console.log("In SetupPDFWindowGoogle");
        var ifrm=document.createElement("iframe");
        var fLoaded=false;
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";   
        sf.appendChild(ifrm);
        var url=`https://docs.google.com/viewerng/viewer?url=${pdfurl}&embedded=true`;
        ifrm.src=url;        
        ifrm.addEventListener('load', e => { fLoaded=true } );
        
        for (var i=0;i<5;i++) { // try 5 times
            await sleep (5000);
            if (!fLoaded) {
                console.log(`Retry loading ${url}`);
                ifrm.src=null;
                ifrm.src=url;
            }
        } 
    }
    async function SetupPDFWindowChrome() {
        console.log("In SetupPDFWindowChrome");
        var slide=document.createElement("embed");  
        slide.type="application/pdf"     
        slide.style.width="100%";
        slide.style.height="100%";
        sf.appendChild(slide);
        slide.src=pdfurl+"#page=1&view=Fit&scrollbar=0";
    } 

  //LinkButton("pdfchrome",SetupPDFWindowChrome);
  //LinkButton("pdfgoogle",SetupPDFWindowGoogle);
  //LinkButton("pptx
  //LinkButton("tbd
   //SetupPDFWindowChrome();
   SetupPDFWindowGoogle();
}    
function LoadHlsVideo(video,node,hash) {
    Hls.DefaultConfig.loader = HlsjsIpfsLoader
    Hls.DefaultConfig.debug = false
    if (Hls.isSupported()) {
        const hls = new Hls()
        hls.config.ipfs = node
        hls.config.ipfsHash = hash
        hls.loadSource('master.m3u8'); // contains link to rest of content
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => log("Video ready to play"))
    }
}
async function onStateChange(event) {
    console.log("In onStateChange");
     switch (event.data) {
         case 1: startVideo();break;
         case 0:                     // ended      
         case 2: stopVideo();break;  // pause
     }
}    

async function tcallback() {
    
   // console.log("In tcallback");
    VideoLocation();
   if (!IsVideoPaused())
        setTimeout( tcallback, 1000); // 400
}    
   
async function SetupVideoWindowIPFS(ipfs,windowid,hash) {       
    var vp=document.getElementById(windowid);
    video=document.createElement("video");
    video.controls=false;
    video.style.height="100%";
    video.style.width="100%";
    video.addEventListener('error', videoerror, true);   
    vp.appendChild(video);
    video.addEventListener('timeupdate', (event) => {  // about 4x/second
      VideoLocation();
    });    
    LoadHlsVideo(video,ipfs,hash);
    var surl=document.getElementById("subtitle-collection").innerHTML;    
    SetupSubtitles("transcripts",surl,"nl");
}
/*
function DisplayCurrentFunctionName(args) {
            var ownName = args.callee.toString();
            ownName = ownName.substr('function '.length);        // trim off "function "
            ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
            console.log(`In function ${ownName}`);
            log(`In function ${ownName}`);
        }
*/
function SetSpeechLang (lang) {
    console.log("In SetSpeechLang");
    //DisplayCurrentFunctionName(arguments);
    var mainlang= lang.split("-")[0]; // take first characters before "-"
    
    for (var i=0;i<voices.length;i++) {
        var matchlang = voices[i].lang.split("-")[0]        
        if (matchlang == mainlang) {            
            console.log(voices[i].name);
            spsynthbtns[i].style.display = "block"; 
            currentVoice = voices[i]; // use the last language
        }
        else
            spsynthbtns[i].style.display = "none"; 
        
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
}    
function StartSpeak(text) {
    StopSpeak(); // stop preview texts
    if (fspeechon) {
        var utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = currentVoice;
      
        synth.speak(utterThis);
      // responsiveVoice.speak(text) } 
    }  
}
function StopSpeak() {  
    if (fspeechon)
        synth.cancel();
   //  responsiveVoice.cancel()
}

function populateVoiceList() {
    console.log("In populateVoiceList callback");
    voices = synth.getVoices();    
    spsynthbtns=document.getElementsByClassName("spsynthbtn") // link voices to buttons, cycle trough all buttons to hide them
    for (var i=0;i<spsynthbtns.length;i++) {
        var buttonid="spsynth-"+i;
         if (voices[i]) {
            spsynthbtns[i].id=buttonid; // assign id's
            var name = voices[i].name;
            name = name.replace(/Google/g, "");
            name = name.replace(/Microsoft /g, "");
            name = name.replace(/Desktop /g, "");
            name = name.replace(/English /g, "");
            spsynthbtns[i].innerHTML=name;
            LinkButton(buttonid,SelectSpeachSynth);
         }
        spsynthbtns[i].style.display = "none"; // hide all spsynth buttons
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
function InitSpeak() { // called once
    console.log("In InitSpeak");
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
     }
    // responsiveVoice.setDefaultVoice("Dutch Female");
}
function EnableSpeech(on) {
    StopSpeak();
    fspeechon=on;
    EnableSound(!fspeechon); // disable video sound when speech is on
}
async function ToggleSpeech(){
    if (ffirst) {
        console.log("First ToggleSpeech");
        ffirst=false;
    }
    fspeechon = !fspeechon; 
    EnableSpeech(fspeechon);
    
}    
function SwapObjects(obj1,obj2) {
    var temp = document.createElement("div"); // create marker element     
    console.log('swapping');
    console.log(obj1);
    console.log(obj2);
    obj1.parentNode.insertBefore(temp, obj1); // and insert it where obj1 is   
    obj2.parentNode.insertBefore(obj1, obj2); // move obj1 to right before obj2
    temp.parentNode.insertBefore(obj2, temp); // move obj2 to right before where obj1 used to be    
    temp.parentNode.removeChild(temp); // remove temporary marker node
    // temp should be carbage collected
}    
function swapElements(obj1, obj2) {  // not used now
    var temp = document.createElement("div"); // create marker element     
    var c1 = obj1.childNodes;    
    var c2 = obj2.childNodes;
    while (obj1.childNodes.length > 0) temp.appendChild(obj1.childNodes[0]);
    while (obj2.childNodes.length > 0) obj1.appendChild(obj2.childNodes[0]);
    while (temp.childNodes.length > 0) obj2.appendChild(temp.childNodes[0]);
    
    
}
function CreateButton(name,funct,place) {
    console.log(`CreateButton ${name}`);
    var buttonback=document.createElement("button");
    buttonback.innerHTML = name;
    
    // buttonback.style.float="right";
    
    buttonback.addEventListener("click", funct);
    place.appendChild(buttonback);
}      
function SetFullScreen(fSetFullScreen) {
    console.log("Making fullscreen");
    let elem = document.body; // let elem = document.documentElement;
    if (fSetFullScreen) {        
        elem.requestFullscreen({ navigationUI: "hide" }).then({}).catch(err => {
            console.log(`An error occurred while trying to switch into full-screen mode: ${err.message} (${err.name})`);
        });
    } else 
       document.exitFullscreen(); 
   fFullScreen = fSetFullScreen;
}    
function ToggleFullScreen() {
    SetFullScreen(!fFullScreen);
}    
function HideButton(nameButton,fHide) {
    var button=document.getElementById(nameButton);
    if (button) {  
        button.style.display=fHide?"none":"flex"; // flex is used to center the icons in the button
    }
}    
function LinkButton(nameButton,funct) {  
    //console.log(`Linking button ${nameButton}`);
    
    var button=document.getElementById(nameButton);
    if (button)
        button.title=nameButton; // add hoover text
    
    if (button) 
            button.addEventListener("click", ButtonClick);           
    
    async function ButtonClick(event) {
        console.log(`Button pressed: ${nameButton}`);
        //MakeFullScreen(); // do this for every button
        event.preventDefault();
        var orgcolor=button.style.color;
        button.style.color="#13c4a3";
        //console.log(button);
        await Promise.all( [
                sleep(1000), // show color for at least 1 sec.
                funct(button)
            ]
            );          
        button.style.color=orgcolor;   
    }
}
function GetVolume() {
    if (video) return video.volume;
    if (player && player.getVolume) return player.getVolume();
    return 0;
}    
function SetVolume(newvol) {
    console.log(`In SetVolume newvol=${newvol}`);
    if (video) {
        const newvolint=parseFloat( newvol/ 100);
        video.volume = newvolint;            
    }
    if (player && player.setVolume) player.setVolume(newvol);
    console.log(`New volume=${GetVolume()}`);
}
function CreateSoundSlider() {
    let divsoundslider=document.getElementById("soundslider"); 
    var input=document.createElement("input");
    input.type="range"
    input.min="0"
    input.value=defaultvolume;
    input.max="100"
    input.step="1"
    input.addEventListener("change", obj => SetVolume(obj.target.value))
    divsoundslider.appendChild(input);
    SetVolume(defaultvolume);
}   
function EnableSound(fOn) {
    fSoundOn = fOn;// store state
       if (video)
        video.muted= !fOn;
    
    if (player)
        if (fOn) 
            player.unMute(); 
        else 
            player.mute();
    
}    
function ToggleSound() {
   fSoundOn = !fSoundOn;
   EnableSound(fSoundOn);

    
   document.getElementById("sound").style.color=fSoundOn?"red":"white"
}
async function SetVideoSeconds(seconds) {
    if (video) {
        video.currentTime=seconds;
        //video.play();
    }
    if (player)
        player.seekTo(seconds, true);
    
        //console.log(`New position=${video.currentTime}`);
    //startVideo(); // be sure to start again ==> not starting, to irritating
        
}
async function SetVideoProgressBar(perc) {
    // console.log(`SetVideoProgressBar ${perc}`); 
    if (slider)    
        slider.style.width =  (perc*100)+"%";   

}
async function CreateVideoSlider() {
    var sep=document.getElementById("videodrag"); 
    var sepparent=document.getElementById("mainscreen");
    slider=document.getElementById("videodrag").parentElement; 
    SetVideoProgressBar(0);
    var fMouse;

    
    function GetPositionAndSetSize(ev) {
        var parentrect=sep.parentElement.parentElement.getBoundingClientRect();   
        
        var pos=-1; // no position
        var percv=-1;
        var perch=-1;
        { // horizontal
            if (ev.touches && ev.touches[0] && ev.touches[0].clientX) pos=ev.touches[0].clientX;
            if (ev.clientX) pos=ev.clientX; 
            if (pos >= 0) {
                percv = (pos - parentrect.left) / parentrect.width             
                var left=`${percv*2}fr`;     if ( percv<=   0.01) percv=0;
                var right=`${(1-percv)*2}fr`;  if ( percv>= (1-0.01)) percv=1;
//console.log(  percv);    

SetVideoProgressBar(percv);
SetVideoSeconds(parseFloat (GetDuration()*percv ));
             
            }
        }         

    }
    
    
    function SetzIndexChildren(domid,zindex) {  
//console.log(domid);    
        var arrchildren=domid.children;    
        for (var i=0;i<arrchildren.length;i++) 
            arrchildren[i].style.zIndex=zindex;
    }
    
    async function VideoSliderStart(ev) {
        fDragging=true;
        
        console.log(`Start dragging CreateVideoSlider fMouse:${fMouse}`);
        
        SetzIndexChildren(sepparent,"-1"); // set all childeren to lower z-index, so the mouse works well        
        GetPositionAndSetSize(ev);
        
        sepparent.addEventListener("dragover",  VideoSliderDrag);           
        sepparent.addEventListener("drop", VideoSliderStop);            
        sepparent.addEventListener("dragend", VideoSliderStop);  
        sepparent.addEventListener("dragleave", VideoSliderStop);  
        sepparent.addEventListener("dragexit", VideoSliderStop);  
                   
        if (fMouse) {
            sepparent.addEventListener("mousemove",  VideoSliderDrag);
            sepparent.addEventListener("mouseup",    VideoSliderStop);  
       //     sepparent.addEventListener("mouseleave", VideoSliderStop);          
        } else {
            sepparent.addEventListener("touchmove",  VideoSliderDrag);
            sepparent.addEventListener("touchend",   VideoSliderStop);
            sepparent.addEventListener("touchcancel",VideoSliderStop);
        }
    }    
        
    async function VideoSliderDrag(ev) {     
        if (!fMouse)ev.preventDefault()    
        GetPositionAndSetSize(ev);
    }    
    
    async function VideoSliderStop(ev) {
        console.log("Stop dragging");
        SetzIndexChildren(sepparent,""); // back to normal

        sepparent.removeEventListener("dragover",   VideoSliderDrag);           
        sepparent.removeEventListener("drop",       VideoSliderStop);            
        sepparent.removeEventListener("dragend",    VideoSliderStop);  
        sepparent.removeEventListener("dragleave",  VideoSliderStop);  
        sepparent.removeEventListener("dragexit",   VideoSliderStop);          
        if (fMouse) {
            sepparent.removeEventListener("mousemove",  VideoSliderDrag);   
            sepparent.removeEventListener("mouseup",    VideoSliderStop);  
            sepparent.removeEventListener("mouseleave", VideoSliderStop);
        } else {
            sepparent.removeEventListener("touchmove",  VideoSliderDrag);
            sepparent.removeEventListener("touchend",   VideoSliderStop);
            sepparent.removeEventListener("touchcancel",VideoSliderStop);
        }
    }      
    sep.addEventListener('mousedown',  ev=>{ fMouse=true; VideoSliderStart(ev);} );
    sep.addEventListener('touchstart', ev=>{ fMouse=false;VideoSliderStart(ev);} , {passive:true} );     
  //  sep.addEventListener('dragstart', ev=>{ fMouse=true; VideoSliderStart(ev);} );
    
}
/*


    
    let s = document.createElement("style");
    s.type = "text/css";
    
    //background: #d3d3d3;
    //  border-radius: 5px;  
    // opacity: 0.7;
    
    // <!-- top: -9pxoverlay with green horizontal bar -->
    s.innerHTML=`
    .videoslider {
  -webkit-appearance: none;
  width: 100%;
  height: 0px;
  border-width:0px;
  outline: none;  
  background: blue; 
  -webkit-transition: 2s; 
  transition:  2s;   
}

.videoslider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  
  width: 10px;
  height: 10px;  
  border-radius: 50%; 
  background: 9CC4BD; 
  cursor: pointer;
  transition:  2s;
  -webkit-transition: 2s;
}

.videoslider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: MidnightBlue; 
  cursor: pointer;
}

.videoprogress {
  -webkit-appearance: none;
  -moz-appearance: none;
   appearance: none;
  border: none;
  background-color: transparent;
} 


.videoprogress::-webkit-progress-bar {
  background-color: transparent;
}

.videoprogress::-webkit-progress-value {
  background-color: #9CC4BD ;
   
}  

`
// https://convertingcolors.com/hex-color-13C4A3.html

    async function EventNewPos(obj) {
        let newval=obj.target.value;
        // console.log(`Dragged to value: ${newval}`);
        SetVideoProgressBar(newval);
        SetVideoSeconds(parseFloat (GetDuration()*newval / 100));
    }

    document.body.appendChild(s); 
    let divvideoslider=document.getElementById("separator_horizonal");     
    vidproginput=document.createElement("input");
    vidproginput.style.position="relative";
    vidproginput.style.top="-10px";
    vidproginput.type="range"
    vidproginput.min="0"
    vidproginput.value="0";
    vidproginput.max="100"
    vidproginput.step="1"    
    vidproginput.classList.add("videoslider");    
    vidproginput.addEventListener("input", EventNewPos);
    divvideoslider.appendChild(vidproginput);
    
    vidprogress=document.createElement("progress");
    vidprogress.min="0";
    vidprogress.style.position="relative";
    vidprogress.style.top="-24px";
    vidprogress.style.height="100%";
    vidprogress.style.width="100%";   
    vidprogress.style.backgroundColor="transparent";
    vidprogress.value="0";
    vidprogress.max="100"
    vidprogress.classList.add("videoprogress");   

    divvideoslider.appendChild(vidprogress); 
    vidproginput.style.zIndex=4;    
    
}  


*/
function IsVideoPaused(){
    var fpaused=true;
    if (video)  fpaused=video.paused
    if (player && player.getPlayerState) 
        fpaused=( player.getPlayerState() !== 1); // 1 – playing 
    return fpaused;
}
async function UpdateVideoIndicator(fpaused) { 
    HideButton("start",!fpaused);
    HideButton("pause",fpaused);
}
async function startVideo() {
   // console.log("In startVideo");
   //         console.log(player.getDebugText());
   //     console.log(player.getVideoData());
    
    if (video) {
        video.play();
        video.autoplay=true; // so after location change the video continues to play
    }
    if (player) {  
        if (IsVideoPaused()) // maybe already started via youtube interface
            player.playVideo();
    }
    UpdateVideoIndicator(false);

    tcallback(); // callbacks for the progress
}
function stopVideo() {
    console.log("In stopVideo");
    if (video) video.pause();
    if (player) player.pauseVideo();
    UpdateVideoIndicator(true);
    StopSpeak();


}
function TogglePauseVideo() {
    console.log("In TogglePauseVideo");
    var fpaused=IsVideoPaused()
    if (fpaused) {
        if (video)  video.play(); 
        if (player) player.playVideo();
    } else {
        if (video) video.pause();
        if (player)  player.pauseVideo();
    }
    UpdateVideoIndicator(!fpaused);
    StopSpeak();    
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function writeToClipboard(text) {

    try {
        await navigator.clipboard.writeText(text);
        var msg=`Copied to clipboard (${text.length} characters)`;
        log(msg);        
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
/*
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/
async function DisplayMessage(text) {    
    var msg=document.getElementById("message");
    console.log(msg);
    msg.innerText=text;
    msg.style.display="block";
    await sleep(1000);
    msg.style.display="none";    
}
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
function sendMail() {
     var href = "mailto:";
     //href+=document.getElementById('emailaddress').value;    
     href += "?SUBJECT=Notes from: "+encodeURI(window.location.href);
     href += "&BODY="+encodeURI(document.getElementById("notesarea").value);;
     console.log(href);
    window.open(href,"_blank"); 
}
var loadScriptAsync = function(uri){
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = uri;
    tag.async = true;
    tag.onload = () => {
      resolve();
    };
  //var firstScriptTag = document.getElementsByTagName('script')[0];
  //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);  
  document.head.appendChild(tag);  
});
}   
async function SetupIPFS() {
    
    await Promise.all( [ // see https://www.npmjs.com/package/ipfs
       loadScriptAsync("https://unpkg.com/ipfs/dist/index.js"),
       //loadScriptAsync("https://unpkg.com/hlsjs-ipfs-loader@0.1.4/dist/index.js"),  // not needed now
       //loadScriptAsync("https://cdn.jsdelivr.net/npm/hls.js@latest"),
       //loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/9.0.0/bignumber.min.js")
       ]
   );
   log("Ipfs libraries loaded");
    const ipfs = await window.Ipfs.create();
   
/*   get stream info, only for video
    const stream = ipfs.stats.bwReadableStream({ poll: true })
    var prevtotin=0;
    stream.on('data', (data) => {
        var totin=data.totalIn.dividedBy(1000000).toFixed(1);
        if (totin !=prevtotin) {
            console.log(`IPFS Total in: ${totin} mb`);
            prevtotin = totin;
        }          
    });
*/    
    return ipfs;
}
async function GetYouTubeSubTitle(youtubeid,language) {
   var array = new Array();
   var url=`https://video.google.com/timedtext?v=${youtubeid}&lang=${language}`;
   var data=await fetch(url).catch(console.log);
   var t=await data.text();   
   var captions  = parser.parseFromString(t, "text/html").getElementsByTagName('text');
   for (var i=0;i< captions.length;i++) {  
      var s= captions[i].innerHTML;
      var s = s.replace(/&amp;/g, "&");
      var s = s.replace(/&quot;/g, "'");
      var s = s.replace(/&#39;/g, "'");
      array.push({ 
          start:        captions[i].getAttribute('start'),
          dur:          captions[i].getAttribute('dur'),
          text:         s
        });
   }
   return array;
}
async function GetYouTubeSubTitles(youtubeid) {
   var array = new Array();
   var url=`https://video.google.com/timedtext?type=list&v=${youtubeid}`;
   var data=await fetch(url).catch(console.log);
   var t=await data.text(); 
   var captions  = parser.parseFromString(t, "text/xml").getElementsByTagName('track');
   for (var i=0;i< captions.length;i++) {    
       var lc=captions[i].getAttribute('lang_code')
       
     //   if ( ! ((lc=="zh-CN") || (lc=="ru" ))) {  // confused by  zh-CN" lang_original="中文（简体）" lang_translated="Chinese (Simplified)"
           var subtitle=await GetYouTubeSubTitle(youtubeid,lc);
           //console.log(lc);
           //console.log(subtitle);  
           array.push({ 
              lang_code:        lc,
              lang_original:    captions[i].getAttribute('lang_original'),
              lang_translated:  captions[i].getAttribute('lang_translated'),
              subtitle:         subtitle
            });
     //   }
   }
   return array;
}
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
function TestCall() {
    //player.setOption('captions', 'track', {'languageCode': 'es'});
    //player.setOption('captions', 'track', {});

    font++;
    if (font > 3) font= -1;
    console.log(`Setting font to: ${font}`);
    player.setOption('captions', 'fontSize', font);
}
async function SetupSliders() {
    var sep=document.getElementById("move"); 
    var grid=document.getElementById("mainscreen");
    var sepparent=document.getElementById("mainscreen");    
    var fMouse;
    var SetMiddleh=window.getComputedStyle(grid).getPropertyValue("grid-template-columns").split(" ")[1];       
    var SetMiddlev=window.getComputedStyle(grid).getPropertyValue("grid-template-rows").split(" ")[1];
    
    
      

    
    function GetPositionAndSetSize(ev) {
        var parentrect=sepparent.getBoundingClientRect();   
        
        var pos=-1; // no position
        var percv=-1;
        var perch=-1;
        { // horizontal
            if (ev.touches && ev.touches[0] && ev.touches[0].clientX) pos=ev.touches[0].clientX;
            if (ev.clientX) pos=ev.clientX; 
            if (pos >= 0) {
                percv = (pos - parentrect.left) / parentrect.width             
                var left=`${percv*2}fr`;     if ( percv<=   0.01) left="0px";
                var right=`${(1-percv)*2}fr`;  if ( percv>= (1-0.01)) right="0px";
                grid.style["gridTemplateColumns"] = `${left} ${SetMiddleh} ${right}`;
            }
        }         
        {  // vertical
            pos=-1;
            if (ev.touches && ev.touches[0] && ev.touches[0].clientY) pos=ev.touches[0].clientY;
            if (ev.clientY) pos=ev.clientY; 
            if (pos >= 0) {
                perch = (pos - parentrect.top) / parentrect.height               
                var left=`${perch*2}fr`;     if ( perch<=   0.01) left="0px";
                var right=`${(1-perch)*2}fr`;  if ( perch>= (1-0.01)) right="0px";
                var value = `${left} ${SetMiddlev} ${right}`;
                grid.style["gridTemplateRows"]=value;
            } 
        }   
//console.log(  percv,perch);      
    }
    
    
    function SetzIndexChildren(domid,zindex) {  
//console.log(domid);    
        var arrchildren=domid.children;    
        for (var i=0;i<arrchildren.length;i++) 
            arrchildren[i].style.zIndex=zindex;
    }
    
    async function SliderStart(ev) {
        fDragging=true;
        
        console.log(`Start dragging fMouse:${fMouse}`);
        SetzIndexChildren(sepparent,"-1"); // set all childeren to lower z-index, so the mouse works well        
        GetPositionAndSetSize(ev);
        
        sepparent.addEventListener("dragover",  SliderDrag);           
        sepparent.addEventListener("drop", SliderStop);            
        sepparent.addEventListener("dragend", SliderStop);  
        sepparent.addEventListener("dragleave", SliderStop);  
        sepparent.addEventListener("dragexit", SliderStop);  
                   
        if (fMouse) {
            sepparent.addEventListener("mousemove",  SliderDrag);
            sepparent.addEventListener("mouseup",    SliderStop);  
       //     sepparent.addEventListener("mouseleave", SliderStop);          
        } else {
            sepparent.addEventListener("touchmove",  SliderDrag);
            sepparent.addEventListener("touchend",   SliderStop);
            sepparent.addEventListener("touchcancel",SliderStop);
        }
    }    
        
    async function SliderDrag(ev) {     
        if (!fMouse)ev.preventDefault()    
        GetPositionAndSetSize(ev);
    }    
    
    async function SliderStop(ev) {
        console.log("Stop dragging");
        SetzIndexChildren(sepparent,""); // back to normal

        sepparent.removeEventListener("dragover",   SliderDrag);           
        sepparent.removeEventListener("drop",       SliderStop);            
        sepparent.removeEventListener("dragend",    SliderStop);  
        sepparent.removeEventListener("dragleave",  SliderStop);  
        sepparent.removeEventListener("dragexit",   SliderStop);          
        if (fMouse) {
            sepparent.removeEventListener("mousemove",  SliderDrag);   
            sepparent.removeEventListener("mouseup",    SliderStop);  
            sepparent.removeEventListener("mouseleave", SliderStop);
        } else {
            sepparent.removeEventListener("touchmove",  SliderDrag);
            sepparent.removeEventListener("touchend",   SliderStop);
            sepparent.removeEventListener("touchcancel",SliderStop);
        }
    }      
    sep.addEventListener('mousedown',  ev=>{ fMouse=true; SliderStart(ev);} );
    sep.addEventListener('touchstart', ev=>{ fMouse=false;SliderStart(ev);} , {passive:true} );     
    sep.addEventListener('dragstart', ev=>{ fMouse=true; SliderStart(ev);} );
    
}
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
console.log(filename);
var currentlesson=-1;
var lesson_items;
function NavigateButton(nameButton,url) {
    
    if (!url) 
        HideButton(nameButton,true)
    else {        
        var button=document.getElementById(nameButton);
        if (button) {
            button.title=nameButton; // add hoover text            
            var links=button.getElementsByTagName("a");
            for (var i=0;i<links.length;i++)
                 links[i].href=url;
        }
    }
}
async function NavigateLessons() {  
    function FindChapter(chapter) {
        //console.log(`Checking chapter items for ${chapter}`);
        var chapter_items=document.getElementsByClassName("chapter_items");     
        for (var i=0; i< chapter_items.length; i++) {
            //console.log(chapter_items[i].getAttribute("chapter"));
            //console.log(chapter);
            if ( chapter_items[i].getAttribute("chapter")  == chapter) {
                //console.log("Found");
                //console.log(chapter_items[i]);
                return chapter_items[i];
            }
        }   
        return undefined;
    }   
    
    function ProcessLessonAndFindCurrent(lesson_domid,filename) {
        var lesson=lesson_domid.getAttribute("lesson");
        var chapter=lesson_domid.getAttribute("chapter");
        var chap=FindChapter(chapter);
        if (chap)
            chap.parentNode.parentNode.appendChild(lesson_domid.parentNode.parentNode);             
        var youtubeid=lesson_domid.getAttribute("youtubeid");
        //console.log(`Lesson: ${lesson} Chapter: ${chapter}  yt: ${youtubeid}`);       
        var imgs=lesson_domid.parentNode.parentNode.getElementsByTagName("img");
        //console.log(imgs);
        if (imgs[0] && youtubeid)
             imgs[0].src=`https://img.youtube.com/vi/${youtubeid}/default.jpg`
        return (lesson == filename) 
    }     
    
    lesson_items=document.getElementsByClassName("lesson_items"); 
    for (var i=0;i<lesson_items.length;i++) {
        if (ProcessLessonAndFindCurrent(lesson_items[i],filename))
            currentlesson=i;
    }
    
    //console.log(`currentlesson ${currentlesson}`);
    //console.log(lesson_items[currentlesson].parentNode.parentNode);
        
    if (currentlesson >= 0)   FindAllLinksWith(  lesson_items[currentlesson].getAttribute("lesson"),"red");
    NavigateButton("back",    (currentlesson >= 1                     ? lesson_items[currentlesson-1].getAttribute("lesson") : undefined));
    NavigateButton("forward", (currentlesson < lesson_items.length -1 ? lesson_items[currentlesson+1].getAttribute("lesson") : undefined));
   
        
    function FindAllLinksWith(filename,color) {
        var links=document.getElementsByTagName("a");
        for (var i=0;i<links.length;i++) {  
             if (links[i].href.indexOf("#") < 0)  // ignore all internal links of webflow
                 if (links[i].href.indexOf(filename) >=0) {
                       //console.log(links[i]);
                      links[i].style.color=color;
                 }     
        }
    }    
    
        
}
async function asyncloaded() {    
    var youtubeid=document.getElementById("youtubeid").innerHTML;
    console.log(`Found videoid ${youtubeid}`);
    var chatlink="https://gitter.im/web3examples/test/~embed";
    //document.getElementById("chatlink").innerHTML;
    //document.getElementById("chatlink").hidden=true;    
    var vid_url='QmXVnrbjf4xGGhUpAJp6LTj3fDoWo9VqtpepkWGPCWotq8';
    log(`Video url=${vid_url}`); 

    
    playerpromise =SetupVideoWindowYouTube("videoplayer",youtubeid,onStateChange);

   
    
    
    
    
    var ipfspromise= SetupIPFS();
    
    // SetupVideoWindowIPFS("videoplayer",vid_url)
    
    GetYouTubeSubTitles(youtubeid).then(subtitles => SetupSubtitlesStruct("transcripts",subtitles,"nl"));      
    var pdfurl="https://gateway.ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV";
    //document.getElementById("pdf").innerHTML;
    //document.getElementById("pdf").hidden=true;   
    console.log(`PDF url=${pdfurl}`);    
    //SetupPDFWindow("slideplayer","https://ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV"); // infura doens't work well here   
    
    
    
    
    SetupNotes("notes");
    //CreateHeader("content");
    //SetupChat("chat",chatlink);
    LinkButton("start",startVideo);    
    LinkButton("stop",stopVideo);    
    LinkButton("pause",TogglePauseVideo);
    HideButton("pause",true);
    LinkButton("audio",ToggleSound);
    LinkButton("speech",ToggleSpeech);
    LinkButton("subtitle",ToggleCueVisibility);    
    LinkButton("fullscreen",ToggleFullScreen);    
    CreateVideoSlider();   //==> let op, verstoort scherm
    // CreateSoundSlider();
    InitSpeak();
    LinkButton("test",TestCall);
    // CreateButton("closekeyboard",x=>document.blur(),document.getElementById('notes'));
    var metaDom = document.getElementsByName("viewport");
    metaDom[0].content=metaDom[0].content+", user-scalable=no"; //maximum-scale=1.0, minimum-scale=1.0"; // fix zoom    
    var newmeta=document.createElement("meta");
    newmeta.name="viewport";
    newmeta.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0";   
    SetupSliders();
    NavigateLessons();
    
    PrepareSlideIndicators();
    SetupSlideWindow("slideplayer");
    GetAllSlides(ipfspromise,'QmbZx57KgrMj1GfDr1XE9WnFMjJTNJFWZxsgbogBNYhrMW'); 
    
      console.log(`In asyncloaded of script: ${import.meta.url}`);
    var x=await GetYouTubePlaylists()
    player=await playerpromise;
console.log(player); 
}
//console.log(`In ${window.location.href} starting script: ${document.currentScript.src}`);
window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
/*  https://gist.github.com/kvyb/3b370c40696ffc222563c8a70276af15
//window.addEventListener('load', (event) => {
//  console.log('page is fully loaded');
   //console.log(Webflow);
//}); */
async function SetupSlideWindow(windowid,slidesurl) {
    var slidewindow=document.getElementById(windowid);
    slideimage=document.createElement("img");
    slideimage.src=slidesurl;
    slideimage.style.width = "100%";
    slideimage.style.height = "100%"; 
    slidewindow.appendChild(slideimage);
    SetSlide(1);
}
async function SetSlide(n) {
    preferredslide=n;
    if (slides[n])
        slideimage.src=slides[n];
}    
async function GetAllSlides(ipfspromise,cid) {
    console.log("In GetAllSlides");
    var ipfs = await ipfspromise;    
    var list = document.getElementsByClassName("w-slide");
    for await (const file of ipfs.ls(cid)) {
        var res = file.path.split("/");
        var nums = res[1].replace(/[^0-9]/g,'');
        var num = parseInt(nums);
        slides[num]=`http://ipfs.io/ipfs/${file.path}`;
        if (preferredslide && slideimage && slides[preferredslide]) {
            slideimage.src=slides[preferredslide]; // in case SetSlide is called before retieving the list is ready
            preferredslide = 0;
        }
    }
}
function PrepareSlideIndicators() {
    console.log("In GetSlideIndicators");
    var list = document.getElementsByClassName("slideposition");
    SlideIndicatorTemplate =  list[0];
    SlideIndicatorParent=list[0].parentNode
    list[0].remove();
}
function SetSlideIndicator(slidenr,xposperc,lengthperc) {
    console.log(`In SetSlideIndicator ${xposperc} ${lengthperc}`);
    var cln = SlideIndicatorTemplate.cloneNode(true);
    SlideIndicatorParent.appendChild(cln);
    cln.style.left= (xposperc*100)+"%";
    cln.style.width= (lengthperc*100)+"%";
    
    cln.title=`Slide: ${slidenr}`;
    
}    
function SetupSlideIndicators() {  // called when video is setup & when slides have been read
console.log(`In SetupSlideIndicators`);
  var dur=GetDuration();
  if (dur && setofsheets) {
      
     console.log(`In SetupSlideIndicators dur=${dur}`);  
     console.log(setofsheets);
     for (var i=0;i<setofsheets.subtitle.length;i++) {
         SetSlideIndicator(i,parseFloat(setofsheets.subtitle[i].start) / dur,parseFloat(setofsheets.subtitle[i].dur) / dur)
     }   
  }
}


