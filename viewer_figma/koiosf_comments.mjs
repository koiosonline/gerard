import { } from "../lib/3box.js"; // from "https://unpkg.com/3box/dist/3box.js"; // prevent rate errors

import { getUserAddress, getWeb3Provider,authorize } from "./koiosf_login.mjs";
import {DomList,getElement,FitOneLine,LinkVisible,subscribe,GetImageIPFS} from '../lib/koiosf_util.mjs';
import {log} from '../lib/koiosf_log.mjs'; 

let box;
let space;
let currentThread;
var GlobalCommentList = new DomList("commententry");
const FirstModerator="0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2"; //For making the initial thread 
const Moderators = [
    "0x8e2A89fF2F45ed7f8C8506f846200D671e2f176f"
]
const KoiosSpace = "koiostestspace2";

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
    console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    log(str);    
} 

window.addEventListener('DOMContentLoaded', asyncloaded);

async function asyncloaded() {  
    LinkVisible("scr_comment" ,ScrCommentMadeVisible)   
    getElement("posttext").addEventListener('animatedclick',PostComment)    
    var target=getElement("commenttext")    
    target.contentEditable="true"; // make div editable
    target.style.whiteSpace ="pre";  
}

async function ScrCommentMadeVisible() {
    console.log("In ScrCommentMadeVisible");
    
    await authorize()
    console.log(init3boxpromise);
    await init3boxpromise;
    if (space) { // else no connection to 3box
        WriteThread(currentvideo)       
    }
}    

subscribe("web3providerfound",NextStep)

var init3boxpromise;

async function NextStep() {
    init3boxpromise=Init3box();  
    console.log(init3boxpromise);
}     

async function Init3box() {
    console.log("Init3box");
    var ga=getUserAddress()
    var pr=getWeb3Provider()
    console.log(ga)
    console.log(pr);
    console.log("Start openbox")
    console.log(Box);
    box = await Box.openBox(ga,pr);    
    console.log("after openbox");
   // await box.syncDone
    console.log("after syncdone");
    console.log(box);
    space = await box.openSpace(KoiosSpace);
    console.log("after openspace");  
}

subscribe("loadvideo",NewVideo) 

var currentvideo;

async function NewVideo(vidinfo) {
    console.log(`new video ${vidinfo.videoid}`)        
    currentvideo=vidinfo
    if (!space) return; //  no connection to 3box yet; fixed elsewhere
    WriteThread(currentvideo)
}

async function WriteThread(vidinfo) {
    getElement("titletext").innerHTML=vidinfo.txt   
    GlobalCommentList.EmptyList();
    
   // remove previous onUpdate & onNewCapabilities ??   
    currentThread = await space.joinThread(vidinfo.videoid, {
        firstModerator: FirstModerator
    });
    for(var i = 0; i < Moderators.length; i++) {
        currentThread.addModerator(Moderators[i]);
    }
    
    console.log("currentThread");
    console.log(currentThread);
    
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
            console.log(`${i} ${posts[i].message} ${did}`)
            
            var target = GlobalCommentList.AddListItem() // make new entry
            target.getElementsByClassName("commentmessagetext")[0].innerHTML = posts[i].message            
            target.getElementsByClassName("commenttimetext")[0].innerHTML = await SetTime(posts[i].timestamp * 1000);
            
            target.id = posts[i].postId                                        // remember which postId's we've shown
            FindSender (target.getElementsByClassName("commentsendertext")[0],did,target.getElementsByClassName("userphoto")[0]);  // show then profilename (asynchronous)  
            FitOneLine(target.getElementsByClassName("commentsendertext")[0])
            var deletebutton=target.getElementsByClassName("commentdelete")[0]
            SetDeleteButton(deletebutton,posts[i].postId)
            var votecounter=target.getElementsByClassName("commentupvotecounter")[0]    
            votecounter.innerHTML = await space.public.get(posts[i].postId)
            if (votecounter.innerHTML === 'undefined') {
                await space.public.set(posts[i].postId, 0)
                votecounter.innerHTML = 0
            }  
            var upvotebutton=target.getElementsByClassName("commentupvote")[0]
            SetUpVoteButton(upvotebutton,posts[i],votecounter.innerHTML);
            var downvotebutton=target.getElementsByClassName("commentdownvote")[0]
            SetDownVoteButton(downvotebutton,posts[i],votecounter.innerHTML);
        }
    }
    
    var postdomids=document.getElementsByClassName("commententry");
    console.log("domids: ", postdomids)
    for (var i=0;i<postdomids.length;i++) {
        
        console.log("domid: ", postdomids[i])
        
        var checkpostid=postdomids[i].id;
        console.log(`checkpostid=${checkpostid}`);
        var found=false;
        for (var j=0;j<posts.length;j++) {
            if (posts[j].postId == checkpostid) 
            {
                postdomids[i].children.commentupvotecounter.innerHTML=await space.public.get(posts[j].postId) 
                found=true;break; 
            }
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

async function FindSender (target,did,profilepicture) {
    var profile = await Box.getProfile(did);
    target.innerHTML = profile.name ? profile.name : did
    if (profile.image) {
        var imagecid=profile.image[0].contentUrl
        imagecid=imagecid[`\/`]
        console.log(imagecid);
        profilepicture.src=await GetImageIPFS(imagecid)
    }           
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

async function SetUpVoteButton(domid,post,votecounter) { 
    domid.addEventListener('animatedclick',UpVoteMessage)
    console.log("before: ", votecounter)
    async function UpVoteMessage() {
        try {
            votecounter = parseInt(votecounter) + 1
            console.log("after: ", votecounter)
            await space.public.set(post.postId, votecounter)
            ShowPosts(post);
        } catch (error) {
            console.log(error);
        }
    }
}

async function SetDownVoteButton(domid,post,votecounter) { 
    domid.addEventListener('animatedclick',DownVoteMessage)
    console.log("before: ", votecounter)
    async function DownVoteMessage() {
        try {
            votecounter = parseInt(votecounter) - 1
            console.log("after: ", votecounter)
            await space.public.set(post.postId, votecounter)
            ShowPosts(post);
        } catch (error) {
            console.log(error);
        }
    }
}

async function SetTime(timesettings) {
    var dateobject = new Date(timesettings);
    var hours = dateobject.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'});
    var day = dateobject.toLocaleDateString('en-GB');
    return hours.concat('\n', day);
}