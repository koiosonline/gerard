console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
import "https://apis.google.com/js/api.js";

// See https://developers.google.com/youtube/v3/docs/playlists/list?apix=true
async function LoadGapi() {
  console.log('gapi load start');
  await new Promise(function(resolve, reject) {  gapi.load('client:auth2', resolve); });
  gapi.client.setApiKey("AIzaSyAllplvEtr_kYl9Nm_SG23Y2wSwrqPfkN0");
  await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");
  console.log('gapi loaded');
}

var promiseLoadGapi;

export async function GetYouTubePlaylists() {
    if (!promiseLoadGapi)
        promiseLoadGapi = LoadGapi();     
    await promiseLoadGapi;
    var list=await gapi.client.youtube.playlists.list({
      "part": "snippet", // contentDetails
      "channelId": "UCMyWjw6D7eq6swaOljtwJdw"
    });
    
    var resultlist=[]
    for (var i=0;i<list.result.items.length;i++) {
        var result={};
        result.id    = list.result.items[i].id;
        result.title = list.result.items[i].snippet.title;
        result.description = list.result.items[i].snippet.description;
        result.thumbnail = list.result.items[i].snippet.thumbnails.default.url;
        resultlist.push(result)
    }
    return resultlist;
}
