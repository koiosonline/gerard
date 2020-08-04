//import { } from "../forum/3box.js"; 

import { } from "../lib/3box.js"; // from "https://unpkg.com/3box/dist/3box.js"; // prevent rate errors

import { getUserAddress, getWeb3Provider,authorize } from "./koiosf_login.mjs";
import {DomList,getElement,FitOneLine,LinkVisible,subscribe} from '../lib/koiosf_util.mjs';
import {log} from '../lib/koiosf_log.mjs'; 

let box;
let space;
let currentThread;
let index = 0;
var GlobalCommentList = new DomList("commententry");
const Moderator="0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2";
const KoiosSpace = "koiostestspace2";
var dummyvideos = new Array("1.1 Testvideo", "1.2 Testvideo2", "1.3 Testvideo3");

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
    console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    log(str);    
} 

window.addEventListener('DOMContentLoaded', asyncloaded);

async function ScrCommentMadeVisible() {
    console.log("In ScrCommentMadeVisible");
    
    await authorize()
    
    await init3boxpromise;
    
    
    var titletext="test thread"
    
    if (space) { // else no connection to 3box
        WriteThread(titletext);
        getElement("titletext").innerHTML=titletext   
        getElement("posttext").addEventListener('animatedclick',PostComment)    
        var target=getElement("commenttext")    
        target.contentEditable="true"; // make div editable
        target.style.whiteSpace ="pre";  
    }
}    


subscribe("web3providerfound",NextStep)

var init3boxpromise;

async function NextStep() {
    init3boxpromise=Init3box();    
}   


async function Init3box() {
    console.log("Init3box");
    var ga=getUserAddress()
    var pr=getWeb3Provider()
    console.log(ga)
    console.log(pr);
    console.log("Start openbox")
    box = await Box.openBox(ga,pr);    
    console.log("after openbox");
    await box.syncDone
    console.log("after syncdone");
    space = await box.openSpace(KoiosSpace);
    console.log("after openspace");

}


async function asyncloaded() {  
    LinkVisible("scr_comment" ,ScrCommentMadeVisible)   
}
    
async function SetVideoTitle(target, index) {
    target.innerHTML = dummyvideos[index];
    WriteThread(target.innerHTML);
}

async function WriteThread(threadName) {
    GlobalCommentList.EmptyList();
    currentThread = await space.joinThread(threadName, {
        firstModerator: Moderator
    });

    currentThread.onUpdate(async () => {
        var uposts = await currentThread.getPosts()
        await ShowPosts(uposts);
    })
    currentThread.onNewCapabilities((event, did) => console.log(did, event, ' the chat'))
    const posts = await currentThread.getPosts()
    console.log("posts: ", posts);
    await ShowPosts(posts);
}

/*
 * Show the posts in the interface
 */
async function ShowPosts(posts) {
    for (var i=0;i<posts.length;i++) {        
        if (!document.getElementById(posts[i].postId) ){ // check if post is already shown
            console.log(posts[i]);
            var did=posts[i].author;           
            var date = new Date(posts[i].timestamp * 1000);
            console.log(`${i} ${posts[i].message} ${did} ${date.toString() }`)
            
            var target = GlobalCommentList.AddListItem() // make new entry
            target.getElementsByClassName("commentmessagetext")[0].innerHTML = posts[i].message            
            FitOneLine(target.getElementsByClassName("commentmessagetext")[0])
            target.getElementsByClassName("commenttimetext")[0].innerHTML = date
            FitOneLine(target.getElementsByClassName("commenttimetext")[0])
            
            target.id = posts[i].postId                                        // remember which postId's we've shown
            FindSender (target.getElementsByClassName("commentsendertext")[0],did);  // show then profilename (asynchronous)  
            FitOneLine(target.getElementsByClassName("commentsendertext")[0])
            var deletebutton=target.getElementsByClassName("commentdelete")[0]
            SetDeleteButton(deletebutton,posts[i].postId)
            var votecounter=target.getElementsByClassName("commentupvotecounter")[0]
            votecounter.innerHTML = 0;            
            var upvotebutton=target.getElementsByClassName("commentupvote")[0]
            SetVoteButton(upvotebutton,posts[i].postId,true,votecounter);
            var downvotebutton=target.getElementsByClassName("commentdownvote")[0]
            SetVoteButton(downvotebutton,posts[i].postId,true,votecounter);
        }
    }
    
    var postdomids=document.getElementsByClassName("commententry");
    //console.log(postdomids);
    for (var i=0;i<postdomids.length;i++) {
        
        var checkpostid=postdomids[i].id;
        console.log(`checkpostid=${checkpostid}`);
        var found=false;
        for (var j=0;j<posts.length;j++) {
            if (posts[j].postId == checkpostid) { found=true;break; }
        }
        if (!found)
            postdomids[i].style.textDecoration="line-through";   
    }   
}

async function SetDeleteButton(domid,postid) { 
    domid.addEventListener('animatedclick',DeleteForumEntry)
    
    
    async function DeleteForumEntry() {
        console.log(currentThread);
        try {
          await currentThread.deletePost(postid);
        } catch (error) {
          console.log(error);
        }
    }
}

async function FindSender (target,did) {
    var profile = await Box.getProfile(did);
    target.innerHTML = profile.name ? profile.name : did           
}

async function PostComment() {
    var target=getElement("commenttext")    
    try {
        if (currentThread)
            await currentThread.post(target.innerHTML); 
      } catch (error) {
        console.log(error);
      }
}  

async function SetVoteButton(domid,postid,upordownvote,votecounter) { 
    domid.addEventListener('animatedclick',VoteMessage)
    
    async function VoteMessage() {
        if(upordownvote) {
            try {
                votecounter.innerHTML = votecounter.innerHTML + 1;
                
              } catch (error) {
                console.log(error);
              }
        }
        else {
            try {
                votecounter.innerHTML = votecounter.innerHTML - 1;
            } catch (error) {
            console.log(error);
            }
        }
    }
}