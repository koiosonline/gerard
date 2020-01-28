/*
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
var position;
var logpos;
var logtext=0;
var logipfs;

async function CreateHeader(windowid) {
    var domid=document.getElementById(windowid); 
    var arrchildren=domid.children;    
        for (var i=0;i<arrchildren.length;i++) 
            domid.removeChild(arrchildren[i]);
        
            arrchildren=domid.children;    
        for (var i=0;i<arrchildren.length;i++) 
            domid.removeChild(arrchildren[i]);
        
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
    
    position=await CreateHeader(windowid);
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
 console.log("In videlocation");
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
    
    SetVideoProgressBar(CurrentPos / Duration);
    
    logpos.innerText=`Position: ${CurrentPos.toFixed(1)}`;      
    logpos.innerText+=` Played: ${ReallyPlayed.toFixed(0)}`;
    logpos.innerText+=` (of ${Duration.toFixed(0)} seconds)`;
    logpos.innerText+=` speed=${PlaybackRate.toFixed(1)}`;
    logpos.innerText+=` lang=${currentlang}`;
    
    
    function check  (x) { 
       return parseFloat(x.start) > parseFloat(CurrentPos);
    } 
    if (currentSubtitle) {
        var y= currentSubtitle.findIndex(check )  ; 
        logpos.innerText+=` subtitle#=${y>0?y-1:""}`;
        HighlightTransscript(`sub-${currentlang}-${y-1}`);
    }
  logpos.innerText+=` volume=${GetVolume()}`;
  logpos.innerText+=` speech=${fspeechon}`;
  logpos.innerText+=` subtitle=${ToggleCueVisibilityStatus}`;
    
}  

var player=0;
var video=0;
var slide;

var ToggleCueVisibilityStatus=true;
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
var currenttrack=0;
var currentlang=0;
var subtitles; // global storage of subtitles
var currentSubtitle=0;

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

var previous_span=0;
var previous_color=0;
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
        
        console.log(sub_span.innerHTML);
        StartSpeak(sub_span.innerHTML);
    }
    
    
   
}


 

function SubTitleClicked(event) { 
    var x=event.target.id.split("-");
    var newpos=currentSubtitle[Number(x[2])].start;
    SetVideoSeconds(newpos);
}    

var langbtns; // array of all language buttons;
var langbtns_index=0;

function AddSubtitleLang(lang_translated, lang_code,subtitle,translocation) { 
    log(`Adding language ${lang_code}`);
    
    var currentlangbtn=langbtns[langbtns_index++];
    currentlangbtn.id="lang_"+lang_code; // assign id's
    currentlangbtn.style.display = "block"; // make visible again
    currentlangbtn.innerHTML=lang_translated;
    //console.log(currentlangbtn);
    
    
    LinkButton("lang_"+lang_code,x => selectLanguage(lang_code));
    var languagespan=document.createElement("span");
    languagespan.style.display = "none";
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
    for (var j=0;j < subtitle.length;j++) {
        if (video) {
            var cue = new VTTCue(subtitle[j].start, parseFloat(subtitle[j].start)+parseFloat(subtitle[j].dur), subtitle[j].text);
            cue.id=`sub-${lang_code}-${j}`;
            track.addCue(cue);
        }
        var span=document.createElement("span");
        let txtstr=subtitle[j].text;
        txtstr = txtstr.replace(/\.[\.]+/, ''); // replace multiple dots with empty string
        txtstr = txtstr.replace(/\.[\.]+/, ''); // repeat for the situation where ... is added twice
        span.innerHTML=txtstr+" ";
        span.id=`sub-${lang_code}-${j}`;
        languagespan.appendChild(span);
        span.addEventListener("click",SubTitleClicked);
    }
}  


async function SetupSubtitlesStruct(windowid,_subtitles,lang) {
    subtitles = _subtitles; // store in global var.
    var transcripts=await CreateHeader(windowid);   
    var innertrans=document.createElement("div");
    transcripts.appendChild(innertrans);
    innertrans.style.fontSize="14px";
    
    langbtns=document.getElementsByClassName("langbtn")
    for (var i=0;i<langbtns.length;i++) {
        //console.log(langbtns[i]);
        langbtns[i].style.display = "none"; // hide all language buttons
    }
    
    for (var i=0;i<subtitles.length;i++) 
        AddSubtitleLang(subtitles[i].lang_translated, subtitles[i].lang_code, subtitles[i].subtitle,innertrans);
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
   
    var sf=await CreateHeader(windowid); 
    
    
    function CleanOldChildren() {
        var windowidchildren=sf.children;
        if (windowidchildren)
            for (var i=0;i<windowidchildren.length;i++)
                sf.removeChild(windowidchildren[i])            
    }
   
    async function SetupPDFWindowGoogle() {  
        console.log("In SetupPDFWindowGoogle");
        CleanOldChildren();
        
        var ifrm=document.createElement("iframe");
        ifrm.style.width = "100%";
        ifrm.style.height = "90%";   
        sf.appendChild(ifrm);
        ifrm.setAttribute("src", `https://docs.google.com/viewerng/viewer?url=${pdfurl}&embedded=true`);    
    }
    async function SetupPDFWindowChrome() {
        console.log("In SetupPDFWindowChrome");
        CleanOldChildren();

        var slide=document.createElement("embed");  
        slide.type="application/pdf"     
        slide.style.width="100%";
        slide.style.height="90%";
        sf.appendChild(slide);
        slide.src=pdfurl+"#page=1&view=Fit&scrollbar=0";
    } 

  LinkButton("pdfchrome",SetupPDFWindowChrome);
  LinkButton("pdfgoogle",SetupPDFWindowGoogle);
  //LinkButton("pptx
  //LinkButton("tbd
   SetupPDFWindowChrome();
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

 function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            playerVars: { 
                noCookie: true,  // testje
                modestbranding: true, 
                controls: 0,
                origin:"https://koios.online",
                rel:0, 
                cc_lang_pref:"nl",
                cc_load_policy:1,
                playsinline:1    // for IOS
            },     
            height: '100%',
            width: '100%',
            videoId: youtubeid,
            //events: {
            //  'onReady': onPlayerReady,
            //  'onStateChange': onPlayerStateChange
            // }          
        });
        
      //  player.getIframe().style.zIndex="-1"; // behind "blockconent" ==> easier to make drag work
      //  player.getIframe().position="relative";

//player.getIframe().parentNode.style.zIndex="-1";

        console.log("player iframe=");
        console.log(player.getIframe());

}  
    

async function tcallback() {
  // disable  setTimeout( tcallback, 1000); // 400
    VideoLocation();
}    
    
      
async function SetupVideoWindowYouTube(windowid,youtubeid) {  
    var vp=await CreateHeader(windowid);
    const videodiv=document.createElement("div"); // will be replaced with <iframe>
    videodiv.id="player";
    
    vp.appendChild(videodiv);     

    loadScriptAsync("https://www.youtube.com/iframe_api").then(x=>console.log("After https://www.youtube.com/iframe_api"))

    tcallback()
}    


async function SetupVideoWindowIPFS(windowid,hash) {   
    var node= await SetupIPFS();
    var vp=await CreateHeader(windowid);
    video=document.createElement("video");
    video.controls=false;
    video.style.height="100%";
    video.style.width="100%";
    video.addEventListener('error', videoerror, true);   
    vp.appendChild(video);
    video.addEventListener('timeupdate', (event) => {  // about 4x/second
      VideoLocation();
    });    
    LoadHlsVideo(video,node,hash);
    var surl=document.getElementById("subtitle-collection").innerHTML;    
    SetupSubtitles("transcripts",surl,"nl");
}


//var newline=document.createElement("br");
//document.body.appendChild(newline);
var voices = [];
var synth = window.speechSynthesis;




var currentVoice=0;


      function DisplayCurrentFunctionName(args) {
            var ownName = args.callee.toString();
            ownName = ownName.substr('function '.length);        // trim off "function "
            ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
            console.log(`In function ${ownName}`);
            log(`In function ${ownName}`);
        }

  //LinkButton("lang_"+lang_code,x => selectLanguage(lang_code));
  //target.removeEventListener(type, listener[, options]);
  
  
function SetSpeechLang (lang) {
    console.log("In SetSpeechLang");
    DisplayCurrentFunctionName(arguments);
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
async function populateVoiceList() {
    console.log("In populateVoiceList");
    voices = synth.getVoices();
 //   console.log(voices);
//    sleep(1000)
    //voices = synth.getVoices();
    //console.log(voices);
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
  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // responsiveVoice.setDefaultVoice("Dutch Female");
  
  
      spsynthbtns=document.getElementsByClassName("spsynthbtn")
    for (var i=0;i<spsynthbtns.length;i++) {
        var buttonid="spsynth-"+i;

         if (voices[i]) {
            spsynthbtns[i].id=buttonid; // assign id's
            var name = voices[i].name;
            name = name.replace(/Google /g, "");
            name = name.replace(/Microsoft /g, "");
            name = name.replace(/Desktop /g, "");
            
            spsynthbtns[i].innerHTML=name;
            LinkButton(buttonid,SelectSpeachSynth);
         }
        spsynthbtns[i].style.display = "none"; // hide all spsynth buttons
    }
  
}

var fspeechon=0;
var ffirst=1;

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
    

var previous_colour=""
var previous_row=-1;
var table
var tablediv
//var alldata=""
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
// note: when connected via USB & full screen: playing video is flickering
var fTriedFullScreen=false;

var fFullScreen=false;

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




var defaultvolume=100;


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

fSoundOn=true;

function ToggleSound() {
   fSoundOn = !fSoundOn;
   EnableSound(fSoundOn);

    
   document.getElementById("sound").style.color=fSoundOn?"red":"white"
}
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement


function SetVideoSeconds(seconds) {
    if (video) {
        video.currentTime=seconds;
        video.play();
    }
    if (player)
        player.seekTo(seconds, true);
    
        //console.log(`New position=${video.currentTime}`);
}

function SetVideoProgress(newper) {
    console.log(`In SetVideoProgress ${newper}`);
     SetVideoSeconds(parseFloat (GetDuration()*newper / 100));
}
var vidproginput=0;

function CreateVideoSlider() {
    
    let s = document.createElement("style");
    s.type = "text/css";
    s.innerHTML=`
    .slider {
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 5px;  
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 2s; // .2s;
  transition:  2s; // opacity 0.2s
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%; 
  background: #13c4a3; // #4CAF50;
  cursor: pointer;
  transition:  2s;
  -webkit-transition: 2s;
}

.slider::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #13c4a3; // #4CAF50;
  cursor: pointer;
}
`
    document.body.appendChild(s);
    
    let divvideoslider=document.getElementById("videoslider"); 
    vidproginput=document.createElement("input");
    vidproginput.type="range"
    vidproginput.min="0"
    vidproginput.value="0";
    vidproginput.max="100"
    vidproginput.step="1"
    
    vidproginput.classList.add("slider");
    
    vidproginput.addEventListener("change", obj => SetVideoProgress(obj.target.value))
    divvideoslider.appendChild(vidproginput);
}   

function SetVideoProgressBar(perc) {
    //console.log(`SetVideoProgressBar ${perc}`);
    vidproginput.value=perc*100;
}



function IsVideoPaused(){
    var fpaused;
    if (video)  fpaused=video.paused
    if (player) { 
        console.log(`getPlayerState ${player.getPlayerState()}`);
        fpaused=( player.getPlayerState() == 2); // 2 – paused 
    }
    console.log(`In IsVideoPaused paused=${fpaused}`);
    return fpaused;
}
var orgcolor=0;
function UpdateVideoIndicator(fpaused) { 
    if (!orgcolor)
        orgcolor=document.getElementById("pause").style.color;
    
    if (fpaused) {
       document.getElementById("pause").style.color="DeepSkyBlue";
    } else {
       document.getElementById("pause").style.color=orgcolor;
    } 
}
function startVideo() {
    console.log("In startVideo");
            console.log(player.getDebugText());
        console.log(player.getVideoData());
    
    if (video) {
        video.play();
        video.autoplay=true; // so after location change the video continues to play
    }
    if (player) {    
        player.playVideo();
    }
    UpdateVideoIndicator(false);
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



async function SetupNotes(windowid) {
    var NotesArea=await CreateHeader(windowid);
    NotesArea.contentEditable="true"; // make div editable
    console.log("NotesArea");
    console.log(NotesArea);
    //var NotesArea=document.getElementById('notesarea')    
    NotesArea.innerHTML=localStorage.getItem("notes");   
    NotesArea.addEventListener('input', x => { localStorage.setItem("notes", x.target.innerHTML);console.log("input");console.log(x.target.innerHTML); }, true); // save the notes    
    //var email=document.getElementById('emailaddress')
    //email.value=localStorage.getItem("emailaddress");       
    //email.addEventListener('input', x => {localStorage.setItem("emailaddress", x.target.value);console.log(x);}, true); // save the emailaddress
    LinkButton("sendemail",sendMail);
    LinkButton("copytoclipboard",x => writeToClipboard(document.getElementById("notesarea").value)  ); 
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
    
    await Promise.all( [
       loadScriptAsync("https://unpkg.com/ipfs/dist/index.js"),
       loadScriptAsync("https://unpkg.com/hlsjs-ipfs-loader@0.1.4/dist/index.js"),
       loadScriptAsync("https://cdn.jsdelivr.net/npm/hls.js@latest"),
       loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/9.0.0/bignumber.min.js")
       ]
   );
   log("Ipfs libraries loaded");
    const node = await window.Ipfs.create();
   
    const stream = node.stats.bwReadableStream({ poll: true })
    var prevtotin=0;
    stream.on('data', (data) => {
        var totin=data.totalIn.dividedBy(1000000).toFixed(1);
        if (totin !=prevtotin) {
            logipfs.innerText=`IPFS Total in: ${totin} mb`;
            prevtotin = totin;
        }          
    });
    return node;
}

var parser = new DOMParser(); 

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
    
   var chatdom=await CreateHeader("chat");
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

    console.log("setoption");
    
    player.setOption('captions', 'track', {'languageCode': 'es'});
    player.setOption('captions', 'track', {});

}
 
async function Slider(id,fVertical) {  
    var sep=document.getElementById(id); 
    var sepparent=sep.parentElement;    
    var fMouse;
    var SetMiddle="1px";
    //var grid=document.querySelector('.video-and-slidesouter');
    
    var grid=document.getElementById("mainscreen");
    
    var style_loc_index="gridTemplate"+(fVertical?"Columns":"Rows");
    var style_loc_string="grid-template-"+(fVertical?"columns":"rows");
    var colstyle=window.getComputedStyle(grid).getPropertyValue(style_loc_string);
    
    
    
    var res = colstyle.split(" ");
    SetMiddle=res[1];
    console.log(`SetMiddle=${SetMiddle}`);
   
    function SetSizes(size1) {   
        if (size1 < 0) return; // no usefull value yet
        var left=`${size1*2}fr`;     if ( size1<=   0.01) left="0px";
        var right=`${(1-size1)*2}fr`;  if ( size1>= (1-0.01)) right="0px";
        var value = `${left} ${SetMiddle} ${right}`;
        
       // console.log(`Old size: ${window.getComputedStyle(grid).getPropertyValue(style_loc_string)}`);        
        grid.style[style_loc_index]=value;
        //console.log(`Setting size: ${value}`);
        //console.log(`New size: ${window.getComputedStyle(grid).getPropertyValue(style_loc_string)}`);        
    }
    
    function GetPosition(ev) {
        var parentrect=sepparent.getBoundingClientRect();   
        var domRect = sep.getBoundingClientRect();
        var pos=0; // no position
        var perc=-1;
        if (fVertical) {
            if (ev.touches && ev.touches[0] && ev.touches[0].clientX) pos=ev.touches[0].clientX;
            else if (ev.clientX) pos=ev.clientX; 
            else return -1;
            perc = (pos - parentrect.left) / parentrect.width               
        } else {
            if (ev.touches && ev.touches[0] && ev.touches[0].clientY) pos=ev.touches[0].clientY;
            else if (ev.clientY) pos=ev.clientY; 
            else return -1;
            perc = (pos - parentrect.top) / parentrect.height               
        }    
        return perc;         
    }
    
    function setCursor(domel,fSet) {
        domel.style.cursor = fSet? ( fVertical? "col-resize": "row-resize") : "default"     
    }
    
    function SetzIndexChildren(domid,zindex) {     
        var arrchildren=domid.children;    
        for (var i=0;i<arrchildren.length;i++) 
            arrchildren[i].style.zIndex=zindex;
    }
    
    async function SliderStart(ev) {
        fDragging=true;
        setCursor(sepparent,true);
        console.log("Start dragging");
        SetzIndexChildren(sepparent,"-1"); // set all childeren to lower z-index, so the mouse works well        
        SetSizes(GetPosition(ev));     
        if (fMouse) {
            sepparent.addEventListener("mousemove",  SliderDrag);   
            sepparent.addEventListener("mouseup",    SliderStop);  
            sepparent.addEventListener("mouseleave", SliderStop);
        } else {
            sepparent.addEventListener("touchmove",  SliderDrag);
            sepparent.addEventListener("touchend",   SliderStop);
            sepparent.addEventListener("touchcancel",SliderStop);
        }
    }    
        
    async function SliderDrag(ev) {     
        if (!fMouse)ev.preventDefault()    
        SetSizes(GetPosition(ev));
    }    
    
    async function SliderStop(ev) {
        console.log("Stop dragging");
        SetzIndexChildren(sepparent,""); // back to normal
        setCursor(sepparent,false);
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
    sep.addEventListener('touchstart', ev=>{ fMouse=false;SliderStart(ev);} ); 
    setCursor(sep,true);    
}


function SetupSliders() {
    Slider("separator_vertical",true);
    Slider("separator_horizonal",false);
}    


async function asyncloaded() {    
    SetupLogWindow("log");
    console.log("Start koios_video.js");
    vid_url=document.getElementById("video").innerHTML;
    document.getElementById("video").hidden=true;
    
    youtubeid=document.getElementById("youtubeid").innerHTML;
    document.getElementById("youtubeid").hidden=true;
  
  document.getElementById("subtitle-collection").hidden=true;   

    var chatlink=document.getElementById("chatlink").innerHTML;
    document.getElementById("chatlink").hidden=true;

    
    vid_url='QmXVnrbjf4xGGhUpAJp6LTj3fDoWo9VqtpepkWGPCWotq8';
    log(`Video url=${vid_url}`);
    
    // SetupVideoWindowIPFS("videoplayer_outter",vid_url)
    SetupVideoWindowYouTube("videoplayer_outter",youtubeid);
    
    GetYouTubeSubTitles(youtubeid).then(subtitles => SetupSubtitlesStruct("transcripts",subtitles,"nl"));
   
    
    var pdfurl=document.getElementById("pdf").innerHTML;
    document.getElementById("pdf").hidden=true;   
    console.log(`PDF url=${pdfurl}`);
    
    SetupPDFWindow("slidefield","https://ipfs.io/ipfs/QmawzPTovb1LUPGLd7LxKRpynzA6VsqnkCa16EZmkGvjGV"); // infura doens't work well here   
    SetupNotes("notes");
    CreateHeader("content");
    SetupChat("chat",chatlink);
    LinkButton("start",startVideo);    
    LinkButton("stop",stopVideo);
    LinkButton("pause",TogglePauseVideo);
    LinkButton("sound",ToggleSound);
    LinkButton("speech",ToggleSpeech);
    LinkButton("subtitle",ToggleCueVisibility);
    
    LinkButton("fullscreen",ToggleFullScreen);
    
    CreateVideoSlider();   
  //ff uit  CreateSoundSlider();
    InitSpeak();
    // CreateButton("test",TestCall,document.body);
    //CreateButton("start",startVideo,document.body);
    //CreateButton("stop",stopVideo,document.body);
    //CreateButton("pause",TogglePauseVideo,document.body);
    
    
    // CreateButton("closekeyboard",x=>document.blur(),document.getElementById('notes'));
    
    //const metaDom=document.getElementsByTagName("meta");
    var metaDom = document.getElementsByName("viewport");
    //console.log("getting meta tag");
    metaDom[0].content=metaDom[0].content+", user-scalable=no"; //maximum-scale=1.0, minimum-scale=1.0"; // fix zoom
    
   // <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=3.0, minimum-scale=0.86">
    
    
    var newmeta=document.createElement("meta");
    newmeta.name="viewport";
    newmeta.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0";
    //newmeta.insertAdjacentElement("afterend", metaDom);
    
    console.log(metaDom);
    console.log(newmeta);
    
    //document.head.appendChild(newmeta);
    // android chrome override via: open the Accessibility section, and find the option labeled "Force enable zoom."
    
    SetupSliders();

    
}
window.addEventListener('load', asyncloaded);  
console.log("start");
