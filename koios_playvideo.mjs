console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
import {loadScriptAsync} from './koios_util.mjs';

export async function SetupVideoWindowYouTube(id,youtubeid,onStateChange) { 
    var player;
    await new Promise(async function(resolve, reject) {        // promise to be able to wait until ready
        window.onYouTubeIframeAPIReady = resolve;              // resolve the promise when iframe is ready    
        loadScriptAsync("https://www.youtube.com/iframe_api"); // load this way to prevent a cors message   
    });
    await new Promise(async function(resolve, reject) {
       player = new YT.Player(id, {
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
            events: {
                'onReady': resolve, // resolve the promise
                'onStateChange': onStateChange  // callback                   
            }          
        });  
    });
   console.log("In SetupVideoWindowYouTube, video is loaded");
   return player; 
}
