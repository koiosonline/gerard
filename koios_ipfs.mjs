//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
import {
  forIPFSexport
} from './koios_youtube.mjs';
import {
  loadScriptAsync
} from './koios_util.mjs';


export async function setupIPFS()
{
  console.log("In SetupIPFS");
  await Promise.all([ // see https://www.npmjs.com/package/ipfs
    loadScriptAsync("https://bundle.run/buffer"), // https://packd.now.sh/buffer
    loadScriptAsync("https://unpkg.com/ipfs/dist/index.js"),
  ]);
  console.log("Ipfs & buffer libraries loaded");
  var ipfs = await window.Ipfs.create(); //await??
  return ipfs;
}

/*
export async function setupBuffer()
{
  console.log("Setup buffer");
  await Promise.all([
    
  ]);
  console.log("buffer libraries loaded");
}
*/

export async function uploadYtDataToIpfs()        //Puts the object on ipfs
{
    var ipfs = await setupIPFS();
    var list=await includeSubtitlesforIpfsExport()
    var res=[]

    for (var i=0;i<list.length;i++) { 
        console.log(`Storing ${list[i].id}`)
        var hash; //IPFS hash
        for await (const result of ipfs.add(JSON.stringify(list[i])))
        {
            console.log(result);
            hash = result.path;
        }
        res.push({playlist:list[i].id,title:list[i].title,hash:hash});
    }      
    return {res:res,list:list} // GP 28-4 also export list
}


export async function getYtInfoIpfs(hash)           //Gets the json string from ipfs and parses it into an object
{
 // await setupBuffer();
  
  var ipfs = await setupIPFS();
  var Buf = window.buffer.Buffer;
  var videoAndPlaylistInfo;
  var chunks = [];
  for await (const chunk of ipfs.cat(hash))
  {
    chunks.push(chunk);
  }
  videoAndPlaylistInfo = JSON.parse(Buf.concat(chunks).toString());
  //console.log(videoAndPlaylistInfo);
  return videoAndPlaylistInfo;
}


export async function includeSubtitlesforIpfsExport()   //Adds the subtitle object to the specific video in the youtube info json file
{
  var data = await forIPFSexport();
  for(var i = 0; i<data.length;i++)
  { 
    console.log(`Playlist ${data[i].id}`);
    for(var x = 0; x<data[i].videos.length;x++)
    { 
      data[i].videos[x].subtitles = await getSubTitles(data[i].videos[x].videoid);
      
      var lan=data[i].videos[x].subtitles.length;
      var subs=lan?data[i].videos[x].subtitles[0].subtitle.length:0
    console.log(`Video: ${data[i].videos[x].videoid} languages: ${lan} subtitles: ${subs} `);
    console.log(data[i].videos[x].subtitles);
    }
  }
  console.log(data);
  return data;
}


var parser = new DOMParser();

export async function getYouTubeSubTitle(language, videoId)   //Gets one specific subtitle
{
  var array = [];
  var subtitleUrl = `https://video.google.com/timedtext?v=${videoId}&lang=${language}`;
  var data = await fetch(subtitleUrl).catch(console.log);
  var t = await data.text();
  var captions = parser.parseFromString(t, "text/html").getElementsByTagName('text');
  for (var i = 0; i < captions.length; i++)
  {
    var s = captions[i].innerHTML;
    s = s.replace(/&amp;/g, "&");
    s = s.replace(/&quot;/g, "'");
    s = s.replace(/&#39;/g, "'");
    array.push({
      start: captions[i].getAttribute('start'),
      dur: captions[i].getAttribute('dur'),
      text: s
    });
  }
  return array;
}


export async function getSubtitleList(videoId)    //Gets a list of all subtitles languages available for a specific video(ID)
{
  var subtitleUrl = `https://video.google.com/timedtext?type=list&v=${videoId}`;
  var data = await fetch(subtitleUrl).catch(console.log);
  var t = await data.text();
  var subtitleList = parser.parseFromString(t, "text/xml").getElementsByTagName('track');
  //console.log(subtitleList);
  return subtitleList;
}


export async function getSubTitles(videoId)       //Gets all subtitles associated with one specific video(ID)
{
  var captions = await getSubtitleList(videoId);
  var allVidSubs = [];
  
  //console.log(`Video: ${videoId} #Captions: ${captions.length}`);
  
  for (var i=0; i<captions.length; i++){
      
    var language = captions[i].getAttribute('lang_code');
    //console.log(`Found language: ${language}`);
    allVidSubs.push({
      lang: language,
      subtitle: await getYouTubeSubTitle(language, videoId)
    });
    /*if (language != "vor")
    { // reserved for slide info
      var arraypromise = getYouTubeSubTitle();
    }
    */
  }
  //console.log(allVidSubs);
  return allVidSubs;
}
