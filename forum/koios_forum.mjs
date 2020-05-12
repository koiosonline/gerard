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
var GlobalForumentryList;

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
    console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    log(str);    
} 

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  

async function asyncloaded() { 
    SetupLogWindow(false)
    log("Starting")
    const KoiosThread="/orbitdb/zdpuAvoxmpwZxT5bpMiuKSBAucpRzTy8hC2tBU9v2NhDxtCMX/3box.thread.koiosonline.koiosonline"     


    ReadThread(KoiosThread) // start asap

    log("wait for authorize")
    await authorize()

    box = await Box.openBox(getUserAddress(), getWeb3().givenProvider);
    console.log(box);
    FindSender(document.getElementById("myname"),box.DID)  // get and display my own name    
    space = await box.openSpace('koiosonline');
    console.log(space);

    
    
    WriteThread(KoiosThread)
}


var writeThread;
async function WriteThread(threadAddress) {
    
    var foruminput = document.getElementById("foruminput");
    foruminput.contentEditable="true"; // make div editable
    LinkClickButton("send");subscribe("sendclick",Send);   
    //const thread = await box.openThread('koiosonline', 'koiosonline', { ghost: true });
    writeThread = await space.joinThreadByAddress(threadAddress)
    
    async function Send() {
        console.log("Sending");
        var foruminput = document.getElementById("foruminput");
        console.log(foruminput.innerHTML);
        let postId = await writeThread.post(foruminput.innerHTML); // thread inherited from parent function
    } 
    
   
    writeThread.onUpdate(async  () => {
        var uposts = await writeThread.getPosts()
        await ShowPosts(uposts);
    })
    writeThread.onNewCapabilities((event, did) => console.log(did, event, ' the chat'))
    let posts = await writeThread.getPosts()
    console.log(posts)
    await ShowPosts(posts);
    
    
    
}


async function ReadThread(threadAddress) {
    GlobalForumentryList = new DomList("forumentry")
    const posts = await Box.getThreadByAddress(threadAddress)
    await ShowPosts(posts);
}


async function ShowPosts(posts) {
    console.log(posts);
    for (var i=0;i<posts.length;i++) {        
        if (!document.getElementById(posts[i].postId) ){ // check if post is already shown
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

function SetDeleteButton(domid,postid) { // in seperate function to remember state
    var id=`delete-${postid}`
    domid.id=id
    LinkClickButton(id);subscribe(`${id}click`,DeleteForumEntry); 
    
    function DeleteForumEntry() {
        console.log(writeThread);
        if (writeThread) // might not be ready
            writeThread.deletePost(postid)
    }
}    


async function FindSender (target,did) {
    var profile = await Box.getProfile(did);
    target.innerHTML = profile.name ? profile.name : did           
}



// Get all threads
export async function getAllThreads() {
  threads = [];

  // Get thread count from contract
  let threadCount = await contractInstance.methods.getThreadCount().call();

  for (let i = 0; i < threadCount; i++) {
    // Get thread name by index from contract
    let threadName = await contractInstance.methods.threadNames(i).call();

    // Get thread by name from contract
    let thread = await contractInstance.methods.threads(threadName).call();

    Object.assign(thread, {'name': threadName});
    threads.push(thread);
  }

  return threads;
}

// Open 3box
// User is promted to give permission
export async function open3Box() {
  box = await Box.openBox(getUserAddress(), getWeb3().givenProvider);
  
  // Open koiosonline space
  space = await box.openSpace('koiosonline');
  
}

// Get the thread from the space
export async function selectThread(threadName) {
  if (!space) throw error('Space not opened');
  currentThread = await space.joinThread(threadName);
}

// Start a new thread
export async function newThread(threadName) {
  await contractInstance.methods.newThread(threadName, box.DID).send({
    from: getUserAddress()
  })
}

// Get posts of selected thread
export async function getPosts() {
  let posts = await currentThread.getPosts();
  for (post of posts) {
    // Get the score for each post from the contract
    let score = await contractInstance.methods.getPostScore(post.postId).call();
    Object.assign(post, {score: score});
  }
  return posts;
}

// Create new post on selected thread
export async function newPost(post) {
  // Add post to selected thread to get postId
  let postId = await currentThread.post(post);
  try {
    // Try to add the post to the contract
    await contractInstance.methods.newPost(postId, box.DID).send({
      from: getUserAddress()
    });
  } catch {
    // If contract call fails, delete post from selected thread
    await currentThread.deletePost(postId);
  }
}

// Adds or Subtracts score from post
export async function votePost(postId, score) {
  await contractInstance.methods.votePost(box.DID, postId, score).send({from: getUserAddress()});
  getAllThreads();
}

// Adds or Subtracts score from thread
export async function voteThread(threadName, score) {
  await contractInstance.methods.voteThread(box.DID, threadName, score).send({from: getUserAddress()});
  getAllThreads();
}

// TODO: deletePost
// TODO: deleteThread
