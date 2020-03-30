console.log(`In ${window.location.href} starting script: ${import.meta.url}`);



import( "https://apis.google.com/js/api.js");


//import "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"; // date time conversion


import {loadScriptAsync,LoadGapi} from './koios_util.mjs';

loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js")


// See https://developers.google.com/youtube/v3/docs/playlists/list?apix=true

export async function GetYouTubePlaylists() {
    
    await LoadGapi();
    var list=await gapi.client.youtube.playlists.list({
      "part": "snippet", // contentDetails
      "channelId": "UCMyWjw6D7eq6swaOljtwJdw" // koios online channel
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
    //console.log("In GetYouTubePlaylists");
    //console.log(resultlist);
    return resultlist;
}

export async function GetYouTubePlayListItems() {  

    const queryString = window.location.search;
    //console.log(`In GetYouTubePlayListItems queryString=${queryString}`);

    const urlParams = new URLSearchParams(queryString);
    //console.log(urlParams);
    
    let playlistId = urlParams.get('playlistId') || "PL_tbH3aD86Kt7mITDw67sJMI6M0fRF2Zx";
    // level 1 "PL_tbH3aD86Kt-vJy4Q-rvZtXDmrLMG1Ef";
    

    console.log(`playlistId=${playlistId}`);


    var nextPageToken="";
    var resultlist=[]
    await LoadGapi();
    do {
        var list=await gapi.client.youtube.playlistItems.list({ 
          "part": "snippet", // contentDetails
          "playlistId": playlistId,
          "maxResults": 50,
          "pageToken" : nextPageToken
        });
        nextPageToken = list.result.nextPageToken;
        //console.log(list);
        //console.log(`GetYouTubePlayListItems: next ${list.result.items.length} records`);
        //console.log(nextPageToken);
        var idlist="";
        
        var resultlistindex=resultlist.length;
        for (var i=0;i<list.result.items.length;i++) {
            var snippet=list.result.items[i].snippet;
            var result={};            
            var deslines = snippet.description.split("\n"); // find ___ChapterTitles___
            if (deslines[0] && deslines[0].includes("___")) {  
               result.title   = deslines[0].replace(/_/g,"");
               result.chapter = true;
               resultlist.push(result)
            }
                    
            result={};
            idlist +=(idlist?",":"")+snippet.resourceId.videoId;
            //result.id    = list.result.items[i].id;
            result.title        = snippet.title;
            result.description  = snippet.description;
            result.thumbnail    = snippet.thumbnails.default.url;
            result.videoid      = snippet.resourceId.videoId
            result.chapter      = false;
            resultlist.push(result);
        }
                
        var list2=await gapi.client.youtube.videos.list({
            "part": "contentDetails",
            "id": idlist
        });
        
        //console.log(resultlistindex);
        for (var i=0;i<list2.result.items.length;i++) {
            while (resultlist[resultlistindex].chapter) // skip the chapters
                resultlistindex++;
            var contentDetails=list2.result.items[i].contentDetails;
            resultlist[resultlistindex].duration = moment.duration(contentDetails.duration).asSeconds();
            resultlistindex++
        }        
    } while (nextPageToken);
    //console.log(resultlist);
    return resultlist;    
}


