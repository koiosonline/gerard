//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);



import( "https://apis.google.com/js/api.js");


//import "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"; // date time conversion


import {loadScriptAsync} from '../lib/koios_util.mjs';

loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js")


// See https://developers.google.com/youtube/v3/docs/playlists/list?apix=true



//import "https://apis.google.com/js/api.js";


export async function LoadGapi() {
  //console.log('gapi load start');
  await new Promise(function(resolve, reject) {  gapi.load('client:auth2', resolve); });
  gapi.client.setApiKey("AIzaSyBPDSeL1rNL9ILyN2rX11FnHeBePld7HOQ");
  await Promise.all( [ 
        gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"),
        gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"),
        //   gapi.client.load("https://content.googleapis.com/discovery/v1/apis/slides/v1/rest");  doesn't work because of authorization issues
       ]
    );  
  //console.log('gapi loaded');  
  LoadGapi=function(){} // next time: do nothing
}



// https://www.koios.online/test/upload?playlistId=PL_tbH3aD86KvzJPzAQp6TomZetpBpApZB
// http://gpersoon.com/koios/gerard/upload/upload.html?playlistId=PL_tbH3aD86KvzJPzAQp6TomZetpBpApZB


export async function GetYouTubePlaylists() {
    
    await LoadGapi();
    var list=await gapi.client.youtube.playlists.list({
      "part": "snippet", // contentDetails
      "maxResults": 50,
      "channelId": "UCMyWjw6D7eq6swaOljtwJdw" // koios online channel
    });
    //console.log(list);
    var resultlist=[]
	
	const queryString = window.location.search;       // add an extra playlistid for hidden playlists
    const urlParams = new URLSearchParams(queryString);	
	let playlistId = urlParams.get('playlistId') 
	if (playlistId) {
		var result={};
		result.id    = playlistId
        result.title = playlistId
        result.description = playlistId
        result.thumbnail = ""
        resultlist.push(result)
	}
	else 	
		for (var i=0;i<list.result.items.length;i++) {
			var result={};
			result.id    = list.result.items[i].id;
			result.title = list.result.items[i].snippet.title;
			result.description = list.result.items[i].snippet.description;
			result.thumbnail = list.result.items[i].snippet.thumbnails.high.url; // default.url;
			resultlist.push(result)
		}
    //console.log(`In GetYouTubePlaylists ${resultlist.length}`);
    //console.log(resultlist);
    return resultlist;
	
	
	
	
	
	
}

export async function GetYouTubePlayListItems(_playlistId) {
console.log("In GetYouTubePlayListItems");
    

//if (!_playlistId) _playlistId = "PL_tbH3aD86KvXkp5y0eB85_GEze1gBsKD"
    
    
    // koios intro PL_tbH3aD86KvXkp5y0eB85_GEze1gBsKD
    // level 2 "PL_tbH3aD86Kt7mITDw67sJMI6M0fRF2Zx";
    // level 1 "PL_tbH3aD86Kt-vJy4Q-rvZtXDmrLMG1Ef";
    

    console.log(`playlistId=${_playlistId}`);


    var nextPageToken="";
    var resultlist=[]
	var literaturelist=[]
    await LoadGapi();
    do {
        var list=await gapi.client.youtube.playlistItems.list({ 
          "part": "snippet", // contentDetails
          "playlistId": _playlistId,
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
            
            
            if (snippet.description== "This video is unavailable.") continue; // GP 28-4-2020 support deleted videos
            
            var result={};            
            var deslines = snippet.description.split("\n"); // find ___ChapterTitles___
			//console.log(deslines)
            if (deslines[0] && deslines[0].includes("___")) {  
               result.title   = deslines[0].replace(/_/g,"");
               result.chapter = true;
               resultlist.push(result)
            }
			for (var j=0;j<deslines.length;j++) {
				var str=deslines[j]
				// str=str.toLowerCase() ==> this interferes with the youtube name
				str=str.replace("http://","https://") // don't want http anyway
				var start=str.indexOf("https://");
				if (start > 0) {
					str=str.substring(start)
					console.log(`Found ${str}`);
					var lit={}
					lit.chapter=snippet.title.split(" ")[0] // take first part
					lit.title=str;
					lit.url=str;
					literaturelist.push(lit)
					console.log(lit);
				}
					
			}
			
			
                    
            result={};
            idlist +=(idlist?",":"")+snippet.resourceId.videoId;
            //result.id    = list.result.items[i].id;
            result.title        = snippet.title;
            result.description  = snippet.description;
            
            //console.log(i);
            //console.log(list.result.items[i])
            
            //console.log(snippet.thumbnails);
            
            result.thumbnail    = snippet.thumbnails.maxres? snippet.thumbnails.maxres.url : snippet.thumbnails.high.url; // default.url;
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
    return {resultlist:resultlist,literaturelist:literaturelist};    
}


export async function forIPFSexport()     //creates an array of objects in the right format for IPFS export.
{
  var totalYoutubeInfo = await GetYouTubePlaylists();
  for(var i=0;i<totalYoutubeInfo.length;i++)
  { var result=await GetYouTubePlayListItems(totalYoutubeInfo[i].id);
    totalYoutubeInfo[i].videos = result.resultlist
	totalYoutubeInfo[i].literature = result.literaturelist
  }
  console.log(totalYoutubeInfo);
  return totalYoutubeInfo;
}



