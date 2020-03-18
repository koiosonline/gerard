console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
import {LinkButton,loadScriptAsync} from './koios_util.mjs';



export async function SetVideoTitle(title) {

    document.getElementById("videotitle").innerHTML = title;

}

export async function ShowVideoTitle(fShow) {
    document.getElementById("videotitle").style.display=fShow?"flex":"none"; // flex is used to center the text
    
}



   
   
export async function SetupVideoWindowYouTube(id,onStateChange) { 
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
            videoId: "z9nux3Kt7Tk", //"unknown",
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
  
  
  
  
    
