console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


/* General comments

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

import {LinkButton,loadScriptAsync,publish} from './koios_util.mjs';


export async function SetVideoTitle(title) {

    document.getElementById("videotitle").innerHTML = title;

}

export async function ShowVideoTitle(fShow) {
    document.getElementById("videotitle").style.display=fShow?"flex":"none"; // flex is used to center the text
    
}



async function onStateChange(event) {
    //console.log(`In onStateChange ${event.data}`);
  
     switch (event.data) {
         case -1: publish ("videounstarted"); break;
         case  0: publish ("videoend");       break;
         case  1: publish ("videostart");     break;
         case  2: publish ("videopause");     break;
         case  3: publish ("videobuffering"); break;
         case  5: publish ("videocued");      break;
         
     }
}    // YT.PlayerState.PLAYING
//-1 – unstarted
//0 – ended
//1 – playing
//2 – paused
//3 – buffering
//5 – video cued
    //;A("YT.PlayerState.UNSTARTED", -1);
    //A("YT.PlayerState.ENDED", 0);
    //A("YT.PlayerState.PLAYING", 1);
    //A("YT.PlayerState.PAUSED", 2);
    //A("YT.PlayerState.BUFFERING", 3);
    //A("YT.PlayerState.CUED", 5);
   
   
export async function SetupVideoWindowYouTube(id) { 
    var font=0;
    
    function FontResize() {
        //player.setOption('captions', 'track', {'languageCode': 'es'});
        //player.setOption('captions', 'track', {});

        font++;
        if (font > 3) font= -1;
        console.log(`Setting font to: ${font}`);
        player.setOption('captions', 'fontSize', font);
    }
   


    var player;
    await new Promise(async function(resolve, reject) {        // promise to be able to wait until ready
        window.onYouTubeIframeAPIReady = resolve;              // resolve the promise when iframe is ready    
        loadScriptAsync("https://www.youtube.com/iframe_api"); // load this way to prevent a cors message   
    });
    await new Promise(async function(resolve, reject) {
       player = new YT.Player(id, {      // store in a div below the grid, otherwise IOS/safari makes is full heigth
            playerVars: { 
                noCookie: true,  // testje
                modestbranding: true, 
                controls: "0", // misschien nodig voor niet fullscreen
                autoplay: 0,
                origin:"https://koios.online",
                rel:0, 
                cc_lang_pref:"nl",
                cc_load_policy:1,
                playsinline:"1"    // for IOS
            },     
            height: '100%',
            width: '100%',
            videoId:  "unknown",// "z9nux3Kt7Tk",
            events: {
                'onReady': x=>{ console.log("onReady");resolve(); }, // resolve the promise
                'onStateChange': onStateChange  // callback                   
            }          
        });  
    });
   console.log("In SetupVideoWindowYouTube, video is loaded");  
   
   
   LinkButton("font_resize",FontResize);


   
   
   return player; 
}


// ** IPFS version // check

   
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


       //loadScriptAsync("https://unpkg.com/hlsjs-ipfs-loader@0.1.4/dist/index.js"),  // not needed now
       //loadScriptAsync("https://cdn.jsdelivr.net/npm/hls.js@latest"),
       //loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/bignumber.js/9.0.0/bignumber.min.js")
       
       
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

/*

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
    
      if (video) {
            var cue = new VTTCue(subtitle[j].start, parseFloat(subtitle[j].start)+parseFloat(subtitle[j].dur), subtitle[j].text);
            cue.id=`sub-${lang_code}-${j}`;
            track.addCue(cue);
        }
    
    
    function CueVisible(on) {
        if (video)
        currenttrack.mode=on?"showing":"hidden"; // while hidden, events are still triggered
    
    
    
    function selectLanguage(lang_code)
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
    
    VideoLocation() 
     if (video) {
        CurrentPos=video.currentTime
        for (let i=0;i< video.played.length;i++) { // check amount of really played
           ReallyPlayed += video.played.end(i) - video.played.start(i);
        } 
        PlaybackRate = video.playbackRate;

    }
  /*
function StyleCues() {
    let s = document.createElement("style");
    s.type = "text/css";
    s.id="cuestyle";
    document.body.appendChild(s);
    CueVisible(ToggleCueVisibilityStatus);
}

SetVideoSeconds
    if (video) {
        video.currentTime=seconds;
        //video.play();
    }
    
        var vid_url='QmXVnrbjf4xGGhUpAJp6LTj3fDoWo9VqtpepkWGPCWotq8';
   console.log(`Video url=${vid_url}`); 
    // SetupVideoWindowIPFS("videoplayer",vid_url)
    
*/ 
  
  
  
  
    
