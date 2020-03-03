
// could also use the youtube api
var parser = new DOMParser(); 




export async function GetSubTitlesAndSheets(vidinfo,SubtitleCB,SheetsCB) {

    
    async function GetYouTubeSubTitle(language) {
       var array = [];
       var url=`https://video.google.com/timedtext?v=${vidinfo.videoid}&lang=${language}`;
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
       if (language == "vor") // sheets
            SheetsCB(array,vidinfo.duration); 
       else
            SubtitleCB(array,language);
    }
        
 
    
  // var array = new Array();
   
   var url=`https://video.google.com/timedtext?type=list&v=${vidinfo.videoid}`;
   var data=await fetch(url).catch(console.log);
   var t=await data.text(); 
   var captions  = parser.parseFromString(t, "text/xml").getElementsByTagName('track');
   for (var i=0;i< captions.length;i++)
       GetYouTubeSubTitle(captions[i].getAttribute('lang_code'));
}


//              lang_code:        lc,
//              lang_original:    captions[i].getAttribute('lang_original'),
//              lang_translated:  captions[i].getAttribute('lang_translated'),
//              subtitle:         subtitle

// *** get subtiles from IPFS / check
//    var surl=document.getElementById("subtitle-collection").innerHTML;    
//    SetupSubtitles("transcripts",surl,"nl");
    
    
async function SetupSubtitles(windowid,surl,lang) {
    log(`Get subtitles from ${surl}`);
    console.log(surl);

    document.getElementById("subtitle-collection").hidden=true;      
    var data=await fetch(surl);
    var t=await data.text();
    subtitles=JSON.parse(t);  

    SetupSubtitlesStruct(windowid,subtitles,lang);
}