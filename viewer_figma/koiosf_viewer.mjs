//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
// https://browserhow.com/how-to-clear-chrome-android-history-cookies-and-cache-data/
 // imports
 
    import {LinkButton,HideButton,DragItem,publish,subscribe,LinkClickButton,LinkToggleButton,CanvasProgressInfoClass,SaveVideoSeen,LoadVideoSeen,ForceButton,getElement} from '../lib/koiosf_util.mjs';
    import {SetupLogWindow} from '../lib/koiosf_log.mjs';    
    import {SetupVideoWindowYouTube,SetVideoTitle} from './koiosf_playvideo.mjs';
    import {SelectLesson,CurrentLesson,LastLesson } from './koiosf_lessons.mjs';    
    import {GetSubTitlesAndSheets} from './koiosf_subtitles.mjs';
    import {currentlang,UpdateTranscript,FoundTranscript,SelectLanguage,SetVideoTranscriptCallbacks} from './koiosf_showtranscript.mjs';
    import {/*FoundSlides,*/UpdateSlide} from './koiosf_slides.mjs';
    import {} from './koiosf_notes.mjs';
    import {InitSpeak,StopSpeak,StartSpeak,EnableSpeech,IsSpeechOn} from './koiosf_speech.mjs';
    import {} from './koiosf_test.mjs';
    import {SelectPopup,InitPopup} from './koiosf_popup.mjs';
    import {DisplayMessageContinous,SwitchDisplayMessageContinous,DisplayMessage} from './koiosf_messages.mjs';
    import {} from './koiosf_music.mjs';
    
    import {} from './koiosf_course.mjs';
    import {Login} from './koiosf_login.mjs';

    import {} from './koiosf_literature.mjs';
    import {} from './koiosf_screenlayout.mjs';
    import {} from './koiosf_comments.mjs';

export var player=0;
//export var currentduration;
export var currentvidinfo;

{ // Global variables
//var currentvideoid;


var position;
var logpos;
var logtext=0;
var logipfs;

var video=0;
var slide;
var ToggleCueVisibilityStatus=true;
var SecondsToSubtitle=[];
var globalyoutubeid; // global for onYouTubeIframeAPIReady
var previous_colour=""
var previous_row=-1;
var table
var tablediv
var fTriedFullScreen=false;
var fFullScreen=false;
var defaultvolume=100;
var vidproginput=0;
var vidprogress=0;
var slider=0; // global
var playerpromise;
var fSoundOn=true;
}    
function GetDuration() {
    if (video) return video.duration;
    if (player && player.getDuration) return  player.getDuration();
    return 0;
}  

var seeninfo;

var GlobalCanvasProgressInfo;

function InitProgress(vidinfo) {
    console.log("InitProgress");
    seeninfo=LoadVideoSeen(vidinfo);
    
    
    
    
    
    GlobalCanvasProgressInfo.Update(seeninfo)
    
}    

async function VideoLocation() { 
    var CurrentPos=0;
    var Duration=GetDuration();
    var PlaybackRate=1;
    var ReallyPlayed=0;  
   // console.log(`In VideoLocation pos=${CurrentPos}`);
    
    if (IsVideoPaused())
        return;  // probably just ended, don't update any more
    
    if (player) {
        if (player.getCurrentTime) {
            CurrentPos=player.getCurrentTime();
            PlaybackRate=player.getPlaybackRate()
        }
    }
    UpdateTranscript(CurrentPos);
    UpdateSlide(CurrentPos);
    SetVideoProgressBar(parseFloat (CurrentPos / Duration ));   
    
    var cursec=Math.floor(CurrentPos)
    if (!seeninfo.seensec[cursec]) {
        seeninfo.seensec[cursec]=1;
        seeninfo.seensum++;
        GlobalCanvasProgressInfo.UpdateItem(seeninfo,cursec)
    }    
    SaveVideoSeen(seeninfo,currentvidinfo)
    
    //CanvasProgressInfo(getElement("videoprogressbar"),true,seeninfo)
     
    
}  
 
 

function SeenVideo() { // every few seconds save the progress
    console.log(`Seen video ${currentvidinfo.txt}`);
    seeninfo.seenend=true;
    SaveVideoSeen(seeninfo,currentvidinfo)
}    

subscribe('videoend',    SeenVideo);



async function NextVideo() {
    stopVideo();
    
    //await Relax();
/*
    var RelaxTime=5000;
    await SelectPopup("relax")
    await sleep(RelaxTime);
    await SelectPopup("literature")
*/    
    /*
    if (CurrentLesson == LastLesson) 
        publish ("lessonsend") 
    else      
        SelectLesson(CurrentLesson +1);
    */
}    


async function tcallback() {
    
   // console.log("In tcallback");
    VideoLocation();
   if (!IsVideoPaused())
        setTimeout( tcallback, 400); // 400
}    
/*
function DisplayCurrentFunctionName(args) {
            var ownName = args.callee.toString();
            ownName = ownName.substr('function '.length);        // trim off "function "
            ownName = ownName.substr(0, ownName.indexOf('('));        // trim off everything after the function name
            console.log(`In function ${ownName}`);
           console.log(`In function ${ownName}`);
        }
*/
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
    console.log(`Making fullscreen ${fSetFullScreen}`);
    let elem = document.body; // let elem = document.documentElement;
    if (fSetFullScreen) {                
        if (elem.requestFullScreen)       console.log("elem.requestFullScreen")  
        if (elem.mozRequestFullScreen)    console.log("elem.mozRequestFullScreen") 
        if (elem.webkitRequestFullScreen) console.log("elem.webkitRequestFullScreen")
        
        if (elem.requestFullScreen) {
            elem.requestFullScreen({ navigationUI: "hide" });
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen({ navigationUI: "hide" });
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen({ navigationUI: "hide" });
        }   
    } else {
        if (document.exitFullscreen)       console.log("document.exitFullscreen")  
        if (document.mozExitFullscreen)    console.log("document.mozExitFullscreen") 
        if (document.webkitExitFullscreen) console.log("document.webkitExitFullscreen")
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozExitFullscreen) {
            document.mozExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }          
   fFullScreen = fSetFullScreen;
   console.log(`Making fullscreen at end ${fSetFullScreen}`);
}    
function ToggleFullScreen() {
    console.log(`In ToggleFullScreen current value=${fFullScreen}`);
    SetFullScreen(!fFullScreen);
}    

//subscribe("shaking",x=>{if (fFullScreen) SetFullScreen(false)});
//document.addEventListener("keydown", x=>{publish(`keypressed${x.key}`)}); // connect actions to keypresses, not implemented yet

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
    let divsoundslider=getElement("soundslider"); 
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
function ToggleSound() {
   fSoundOn = !fSoundOn;
   EnableSound(fSoundOn);

    
 //  getElement("audio").style.color=fSoundOn?"red":"white"
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
export async function SetVideoSeconds(seconds) {
    //console.log(`In SetVideoSeconds, moving to ${seconds}`);

    if (player)
        player.seekTo(seconds, true);
    
    
    UpdateTranscript(seconds)
    UpdateSlide(seconds);
    
        //console.log(`New position=${video.currentTime}`);
    //startVideo(); // be sure to start again ==> not starting, to irritating
        
}
async function SetVideoProgressBar(perc) {
     console.log(`SetVideoProgressBar ${perc}`); 
    if (slider)    
        slider.style.left =  (perc*100)+"%";   

}
export async function CreateVideoSlider() {
    slider=getElement("videodrag");//.parentElement; 

    function XYUpdate(percx,percy) {
        if (percx >1) percx=1;
        if (percx <=0) percx=0;
        SetVideoProgressBar(percx);
        SetVideoSeconds(parseFloat (GetDuration()*percx ));
    }   
    SetVideoProgressBar(0);
    DragItem("videodrag","videoprogressbar","mainscreen",XYUpdate);
}
function IsVideoPaused(){
    var fpaused=true;
    if (video)  fpaused=video.paused
    if (player && player.getPlayerState) 
        fpaused=( player.getPlayerState() !== 1); // 1 – playing 
    return fpaused;
}
//async function UpdateVideoIndicator(fpaused) { 
//    HideButton("start",!fpaused);
//    HideButton("pause",fpaused);
//}
export async function startVideo() {
    console.log("In startVideo");
   //         console.log(player.getDebugText());
   //     console.log(player.getVideoData());
    
    var ev = new CustomEvent("hide");
    getElement("StartButton").dispatchEvent(ev);
    
      
    
    
//    ShowTitles(false)
   // ForceButton("start",true);
  //  HideButton("largestart",true)
    
    if (video) {
        video.play();
        video.autoplay=true; // so after location change the video continues to play
    }
    if (player) {  
        if (IsVideoPaused()) // maybe already started via youtube interface
            player.playVideo();
    }
 //   UpdateVideoIndicator(false);


    publish("videostarted"); 

    tcallback(); // callbacks for the progress
}
function TranscriptShownCB(txt) {
    console.log(`In TranscriptShownCB ${txt}`);
      StartSpeak(txt);
}
function stopVideo() {
    console.log("In stopVideo");
    ForceButton("start",false);
    HideButton("largestart",false)
    //ShowTitles(true);
    if (video) video.pause();
    if (player) player.pauseVideo();
   // UpdateVideoIndicator(true);
    StopSpeak();
    publish("videostopped"); 

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
export async function ToggleSpeech(){
    var fspeechon = !IsSpeechOn(); 
    EnableSpeech(fspeechon);
    EnableSound(!fspeechon); // disable video sound when speech is on        
} 
function SetPlayerSubtitle(lang) {
   if (player &&  player.setOption) 
        player.setOption('captions', 'track', lang==""?{}:{'languageCode': lang}); 
}
function CueVisible(lang) { // if lang="" then cue invisible
    if (player)
        SetPlayerSubtitle(lang)
}  
function ToggleCueVisibility() { 
    ToggleCueVisibilityStatus = !ToggleCueVisibilityStatus;
    CueVisible(ToggleCueVisibilityStatus?currentlang:"");
} 

var signs=0;
async function PlayerLoaded() {
    console.log("In PlayerLoaded");
    signs++;
    if (signs ==2) // only at exactly 2
        publish("playerloaded");
}    


subscribe('videostart',  startVideo);
subscribe('videocued',   PlayerLoaded ); // do nothing, wait for user to start
subscribe('videopause',  stopVideo);
subscribe('videostop',   stopVideo);
subscribe('videoend',    NextVideo);


subscribe('slidesloaded',    PlayerLoaded);


var fVideoRunning=false;

subscribe('popupdisplayblock',x=> { fVideoRunning=!IsVideoPaused();stopVideo();} );
subscribe('popupdisplaynone', x=> { if (fVideoRunning) startVideo(); } ); // if running before, start again



subscribe("loadvideo",LoadVideo);

async function LoadVideo(vidinfo) { // call when first video is loaded or a diffent video is selected
    
    //console.log(`Loading video ${vidinfo.videoid} ${vidinfo.txt}`);
    //console.log(vidinfo);
    
    //publish("loadvideo",vidinfo); // note: with parameter
    

    
    player=await playerpromise;
    if (player)
        player.cueVideoById(vidinfo.videoid,0); // start at beginning   
    
    
    currentvidinfo = vidinfo;
    //currentduration = vidinfo.duration
    //currentvideoid = vidinfo.videoid;
    console.log(`In Loadvideo`);
    SetVideoTitle(vidinfo.txt);
   SetVideoProgressBar(0)
    
  //  console.log(vidinfo)
   // GetSubTitlesAndSheets(vidinfo,FoundTranscript,FoundSlides);
   // for (var i=0;i< vidinfo.subtitles.length;i++) 
       //if (vidinfo.subtitles[i].lang == "vor")
            //FoundSlides(vidinfo.subtitles[i].subtitle,vidinfo);
    //GetSetupLitAndAssInfo(vidinfo.txt);
    InitProgress(vidinfo);
    
}


var globalVideospeed=0;
async function RotateVideoSpeed() {
        globalVideospeed++
        if (globalVideospeed >=3) globalVideospeed=0;

  switch (globalVideospeed) {
      case 0: player.setPlaybackRate(1);console.log("Speed 1");break;
      case 1: player.setPlaybackRate(1.5);console.log("Speed 1.5");break;
      case 2: player.setPlaybackRate(2);console.log("Speed 2");break;
  }
      
  await sleep(100); // wait until speed is processed      
        DisplayMessage(`Video speed set to ${player.getPlaybackRate()}x`);
}

    


async function asyncloaded() {    
    //console.log(`In asyncloaded of script: ${import.meta.url}`);   
    publish("playerstart");
   
    

    
    playerpromise =SetupVideoWindowYouTube("realvideoplayer");   
    //LinkButton("start",startVideo);
    
    
getElement("StartButton").addEventListener('animatedclick',startVideo)    
    
    
//    LinkClickButton("largestart");subscribe("largestartclick",startVideo);
    subscribe('videocued', x=>{HideButton("largestart",false);})
    
    var videofield=getElement("videofield");
videofield.addEventListener('click', x=>{console.log("videofield click");if (!IsVideoPaused()) stopVideo();}); 
    
   // LinkToggleButton("start",false);subscribe("starton",startVideo);subscribe("startoff",stopVideo);
    
    
    //LinkButton("stop",stopVideo);    
    //LinkButton("pause",TogglePauseVideo);
   // HideButton("pause",true);
    //LinkButton("audio",ToggleSound);
    
 // LinkToggleButton("audio",true);subscribe("audioon",ToggleSound);subscribe("audiooff",ToggleSound);
    
    //LinkButton("speech",ToggleSpeech);    
 // LinkToggleButton("speech",false);subscribe("speechon",ToggleSpeech);subscribe("speechoff",ToggleSpeech);
    
    //LinkButton("subtitle",ToggleCueVisibility);     
 // LinkToggleButton("subtitle",false);subscribe("subtitleon",ToggleCueVisibility);subscribe("subtitleoff",ToggleCueVisibility);
    
 //   LinkButton("fullscreen",ToggleFullScreen);        
// LinkToggleButton("fullscreen",false);subscribe("fullscreenon",ToggleFullScreen);subscribe("fullscreenoff",ToggleFullScreen);
     
     
     LinkToggleButton("fullscreen",ToggleFullScreen)
console.log("Init ready1");     
     
 //    LinkClickButton("videospeed",false);subscribe("videospeedclick",RotateVideoSpeed);
       
    
    
  CreateVideoSlider();  //ff uitgezet
 GlobalCanvasProgressInfo=new CanvasProgressInfoClass(getElement("videoprogressbar"),true,"green")  
  
  
    // CreateSoundSlider();
    InitSpeak();
console.log("Init ready2");    
    var chatlink="https://gitter.im/web3examples/test/~embed";    
    //SetupChat("chat",chatlink);
    //SetupLitAndAss();
    // CreateButton("closekeyboard",x=>document.blur(),getElement('notes'));
    var metaDom = getElement("viewport");
    if (metaDom) {
        metaDom.content=metaDom[0].content+", user-scalable=no"; //maximum-scale=1.0, minimum-scale=1.0"; // fix zoom    
    }
    var newmeta=document.createElement("meta");
    //newmeta.name="viewport";
//    newmeta.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0";   // not inserted??   
  //  newmeta=document.createElement("meta");
    newmeta.name="theme-color" 
    newmeta.content="#EBEBD3" //#20FFB1"
    getElement("head").appendChild(newmeta);
console.log("Init ready3");     
    //SetupSliders(); now done via move.mjs
    //NavigateLessons();   
    
    
    InitPopup();
    console.log("Init ready4");
    player=await playerpromise;    
    console.log("Init ready5");
    SetVideoTranscriptCallbacks(SetVideoSeconds,TranscriptShownCB);
    console.log("Init ready6");
    SelectLanguage("nl");    
console.log("Init ready7");    
    
    console.log("Init ready");
}


publish("playerloading");
SetupLogWindow();
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
//console.log(filename);
//console.log(`In ${window.location.href} starting script: ${document.currentScript.src}`);
window.addEventListener('DOMContentLoaded', asyncloaded);  // load  
/*  https://gist.github.com/kvyb/3b370c40696ffc222563c8a70276af15
//window.addEventListener('load', (event) => {
//  console.log('page is fully loaded');
   //console.log(Webflow);
//}); */

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    
    //console.log(error.stack);
    
    DisplayMessage(str)
    
} 

