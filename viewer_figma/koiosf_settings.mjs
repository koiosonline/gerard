import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal,publish,GetJson,LinkClickButton,LinkVisible,sleep} from '../lib/koiosf_util.mjs';
import {DisplayMessage,SwitchDisplayMessageContinous,DisplayMessageContinous} from './koiosf_messages.mjs';  

var globalplayer=0;
var globalVideospeed=0;
var fTriedFullScreen=false;
var fFullScreen=false;

async function asyncloaded() {    
    console.log(`In asyncloaded of script: ${import.meta.url}`); 
    LinkVisible("scr_settings"  ,ScrSettingsMadeVisible)    
    LinkClickButton("videospeed",RotateVideoSpeed);
    subscribe("videoplayerready",VideoPlayerReady);
    LinkClickButton("fontsize",FontSize);
    LinkToggleButton("audioonoff",AudioOnOff)
	
    LinkToggleButton("fullscreen",FullScreenOnOff,"scr_profile") // multiple copies of the fullscreen button // use clickbutton (otherwise state is confusing)
    LinkToggleButton("fullscreen",FullScreenOnOff,"scr_my")
    LinkToggleButton("fullscreen",FullScreenOnOff,"scr_other")
	LinkToggleButton("fullscreen",FullScreenOnOff,"scr_viewer")
      
}

async function ScrSettingsMadeVisible() {
  console.log("In ScrSettingsMadeVisible");
  
}
    
    

async function VideoPlayerReady(playerobject) {
    globalplayer = playerobject;
    
    await sleep(500);
    FontSize(); // can use the player object now // to show the initial value
}        
    
    
window.addEventListener('DOMContentLoaded', asyncloaded);  // load      




async function RotateVideoSpeed() {
    console.log("In RotateVideoSpeed");
    globalVideospeed++
    if (globalVideospeed >=3) globalVideospeed=0;

    if (globalplayer)
        switch (globalVideospeed) {
          case 0: globalplayer.setPlaybackRate(1);console.log("Speed 1");break;
          case 1: globalplayer.setPlaybackRate(1.5);console.log("Speed 1.5");break;
          case 2: globalplayer.setPlaybackRate(2);console.log("Speed 2");break;
      }
      await sleep(100); // wait until speed is processed          
      setElementVal("__label",globalplayer.getPlaybackRate(),"videospeed")
      //  DisplayMessage(`Video speed set to ${globalplayer.getPlaybackRate()}x`);
}
 

var font=0;

function FontSize() {
    //player.setOption('captions', 'track', {'languageCode': 'es'});
    //player.setOption('captions', 'track', {});

    font++;
    if (font > 3) font= -1;
    console.log(`Setting font to: ${font}`);
    globalplayer.setOption('captions', 'fontSize', font);

    setElementVal("__label",parseInt(font)+2,"fontsize")
}


function AudioOnOff(event) {  

    var fOn=GetToggleState(this,"displayactive")    
    console.log(`In AudioOnOff ${fOn}`);    
    if (!globalplayer) return;
    if (!fOn) 
        globalplayer.unMute(); 
    else 
        globalplayer.mute(); 
}   

function FullScreenOnOff(event) {
    console.log("In FullScreenOnOff");
 
    
	var fOn=GetToggleState(this,"displayactive")    
	
	
    fFullScreen =  fOn; // !fFullScreen
 
    
    console.log(`Making fullscreen ${fFullScreen}`);
    let elem = document.body; // let elem = document.documentElement;
    if (fFullScreen) {                
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
 
   console.log(`Making fullscreen at end ${fFullScreen}`);
}    
