import {}  from "https://unpkg.com/3box/dist/3box.js"; // Box

import { initializeContract, getUserAddress, getWeb3,authorize } from "./koios_web3.mjs";
import { abi, address } from "./constants/forum_contract";
//import { getMaxListeners } from "cluster";


import {SetupLogWindow,log} from '../lib/koios_log.mjs'; 
    

window.onerror = async function(message, source, lineno, colno, error) {   // especially for ios
console.log("In onerror");
    var str=`Error: ${message} ${source}, ${lineno}, ${colno}  `;
    if (error && error.stack) str = str.concat('\n').concat(error.stack);
    log(str);    
} 

window.addEventListener('DOMContentLoaded', asyncloaded);  // load  

async function asyncloaded() { 
    SetupLogWindow(true)
    log("Starting")
    log("wait for authorize")
    await authorize()
    
    
    var gp=getWeb3().givenProvider;
    
   // const contractInstance = await initializeContract(abi, address);
open3Box()

var threads=getAllThreads()
console.log(threads);
}


let threads = [];
let box;
let space;
let currentThread;

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
