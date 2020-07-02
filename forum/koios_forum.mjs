// Test via: https://koios-final.webflow.io/test/forum

import { } from "./3box.js"; // from "https://unpkg.com/3box/dist/3box.js"; // prevent rate errors
import { Resolver} from  "https://unpkg.com/did-resolver/lib/resolver.esm.js" 
import { initializeContract, getUserAddress, getWeb3,authorize } from "./koios_web3.mjs";
import { abi, address } from "./constants/forum_contract.js";
import {DomList,LinkClickButton,subscribe,FitOneLine} from '../lib/koios_util.mjs';
import {SetupLogWindow,log} from '../lib/koios_log.mjs'; 

let threads = [];
let box;
let space;
let currentThread;
var GlobalForumentryList = new DomList("forumentry");
var GlobalThreadList = new DomList("threadentry");  
const Moderator="0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2";

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
    console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    log(str);    
} 


console.log("Start script forum");

//setTimeout(asyncloaded,1000);

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  

async function asyncloaded() { 
console.log("In asyncloaded");
    SetupLogWindow(false)
    log("Starting")
    /*const KoiosThread="/orbitdb/zdpuAvoxmpwZxT5bpMiuKSBAucpRzTy8hC2tBU9v2NhDxtCMX/3box.thread.koiosonline.corwintest"     
    //const KoiosThread="TestThread";
    const SpaceAddress = "/orbitdb/zdpuAvoxmpwZxT5bpMiuKSBAucpRzTy8hC2tBU9v2NhDxtCMX/3box.thread.koiosonline";

    //ReadThread(KoiosThread);
    log("wait for authorize")*/
    
    
    
    
    
    const KoiosSpace="koiosonline";
    await authorize();
    box = await Box.openBox(getUserAddress(), getWeb3().givenProvider);    
    space = await box.openSpace(KoiosSpace);
      // get and display my own name
    ReadSpace();
    WriteThread("corwintest", Moderator);
}

async function CreateOpenThread(threadName, firstModerator) {
  const newThread = await space.joinThread(threadName, {
    firstModerator: firstModerator,
    members: false
  });
}

//var currentThread;
async function WriteThread(threadAddress) {
    console.log("in WriteThread");
    FindSender(document.getElementById("myname") || document.getElementsByClassName("myname")[0] ,box.DID)
    var foruminput = document.getElementById("foruminput") || document.getElementsByClassName("foruminput")[0];
    foruminput.contentEditable="true"; // make div editable
    LinkClickButton("send");subscribe("sendclick",Send);   
    //const thread = await box.openThread('koiosonline', 'koiosonline', { ghost: true });
    currentThread = await space.joinThreadByAddress(threadAddress);

    async function Send() {
        console.log("Sending");
        var foruminput = document.getElementById("foruminput") ||  document.getElementsByClassName("foruminput")[0];
        console.log(foruminput.innerHTML);
        try {
          await currentThread.post(foruminput.innerHTML); // thread inherited from parent function
        } catch (error) {
          console.log(error);
        }
    } 

    currentThread.onUpdate(async () => {
      var uposts = await currentThread.getPosts()
      await ShowPosts(uposts);
    })
    currentThread.onNewCapabilities((event, did) => console.log(did, event, ' the chat'))
    const posts = await currentThread.getPosts()
    //console.log(posts)
    await ShowPosts(posts);
}

async function ReadSpace() {
  /*var createnewthread = document.getElementById("threadaddinfo");
  createnewthread.contentEditable="true"; // make div editable
  LinkClickButton("threadadd");subscribe("sendclick",OpenThread);   

  async function OpenThread() {
      var foruminput = document.getElementById("threadaddinfo");
      console.log(foruminput.innerHTML);
      try {
        await CreateOpenThread(createnewthread.innerHTML, Moderator); // thread inherited from parent function
      } catch (error) {
        console.log(error);
      }
  }*/
  const threads = await space.subscribedThreads();
  await ShowThreads(threads);
}


async function ShowPosts(posts) {
  
  console.log(posts);
    for (var i=0;i<posts.length;i++) {        
        if (! (document.getElementById(posts[i].postId) ||  document.getElementsByClassName(posts[i].postId)[0]) ){ // check if post is already shown
            var did=posts[i].author;           
            var date = new Date(posts[i].timestamp * 1000);
            console.log(`${i} ${posts[i].message} ${did} ${date.toString() }`)
            
            var target = GlobalForumentryList.AddListItem() // make new entry
            target.getElementsByClassName("forummessage")[0].innerHTML = posts[i].message            
            FitOneLine(target.getElementsByClassName("forummessage")[0])
            target.getElementsByClassName("forumtime")[0].innerHTML = date
            FitOneLine(target.getElementsByClassName("forumtime")[0])
            
            target.id = posts[i].postId                                        // remember which postId's we've shown
            FindSender (target.getElementsByClassName("forumsender")[0],did);  // show then profilename (asynchronous)  
            FitOneLine(target.getElementsByClassName("forumsender")[0])
            var deletebutton=target.getElementsByClassName("forumdelete")[0]
            SetDeleteButton(deletebutton,posts[i].postId)            
        }
    }
    
    var postdomids=document.getElementsByClassName("forumentry");
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

async function ShowThreads(threads) {
  for (var i=0;i<threads.length;i++) { 
console.log(`ShowThreads ${i} ${threads[i].name}`);
    var target = GlobalThreadList.AddListItem() // make new entry
    target.getElementsByClassName("threadname")[0].innerHTML = threads[i].name.substr(24);
    target.getElementsByClassName("firstmoderator")[0].innerHTML = threads[i].firstModerator;
    var deletebutton=target.getElementsByClassName("threaddelete")[0]
    var gotobutton=target.getElementsByClassName("threadgoto")[0]
    SetThreadDeleteButton(deletebutton, threads[i].address)
    SetGoToThreadButton(gotobutton, threads[i].address)      
  }
}    

function SetThreadDeleteButton(domid,threadid) { // in seperate function to remember state
    var id=`delete-${threadid}`
    domid.id=id
    LinkClickButton(id);subscribe(`${id}click`,DeleteThread); 
    
    function DeleteThread() {
      try {
        console.log(`Deleting thread ${threadid}`);
        space.unsubscribeThread(threadid);
      } catch (error) {
        console.log(error);
      }
    }
}

function SetGoToThreadButton(domid,threadid) { // in seperate function to remember state
  var id=`goto-${threadid}`
  domid.id=id
  LinkClickButton(id);subscribe(`${id}click`,GoToThread); 
  
  function GoToThread() {
    try {
      GlobalThreadList.EmptyList();
      WriteThread(threadid);
    } catch (error) {
      console.log(error);
    }
  }
}

function SetDeleteButton(domid,postid) { // in seperate function to remember state
    var id=`delete-${postid}`
    domid.id=id
    LinkClickButton(id);subscribe(`${id}click`,DeleteForumEntry); 
    
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