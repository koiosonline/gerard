//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


import "https://apis.google.com/js/api.js";


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



export var loadScriptAsync = function(uri){
  return new Promise((resolve, reject) => {
    var tag = document.createElement('script');
    tag.src = uri;
    tag.async = true;
    tag.onload = () => {
      resolve();
    };
  //var firstScriptTag = document.getElementsByTagName('script')[0];
  //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);  
  document.head.appendChild(tag);  
});
}



export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



export function LinkButton(nameButton,funct) {  
    //console.log(`Linking button ${nameButton}`);
    
    var button=document.getElementById(nameButton);
    if (button)
        button.title=nameButton; // add hoover text
    
    if (button) 
            button.addEventListener("click", ButtonClick);           
    
    async function ButtonClick(event) {
        console.log(`Button pressed: ${nameButton}`);
        //MakeFullScreen(); // do this for every button
        event.preventDefault();
        var orgcolor=button.style.color;
        
        var buttonchildren=button.getElementsByClassName("w-button")
        for (const element of buttonchildren) 
            element.style.color="white" //"#13c4a3";
        //console.log(button);
        await Promise.all( [
                sleep(1000), // show color for at least 1 sec.
                funct(button)
            ]
            );          
  //      button.style.color=orgcolor;   
    }
}

function ShowButton(button,fFirst) {    

//console.log(`In ShowButton fFirst = ${fFirst}`);
    //var altcolor="white";
    var buttonchildren=button.getElementsByClassName("w-button")
    
    buttonchildren[0].style.display=fFirst?"block":"none"
    buttonchildren[1].style.display=!fFirst?"block":"none"
    
    /*
    for (const element of buttonchildren) {
        if (!button.orgcolor)
            button.orgcolor = window.getComputedStyle(element).getPropertyValue("color")
        var orgcolor=button.orgcolor;
        
        
        element.style.color=fAltColor ? altcolor : orgcolor;
    }

//    button.style.color=fAltColor ? altcolor : orgcolor;
*/
}    

export function HideButton(nameButton,fHide) {
    console.log(`In HideButton ${nameButton} fHide=${fHide}`);
    
    var button=document.getElementById(nameButton);
    if (button) {  
        button.style.display=fHide?"none":"flex"; // flex is used to center the icons in the button
    }
}    

export function LinkClickButton(nameButton) {
    var button=document.getElementById(nameButton);
    if (button) {
        ShowButton(button,true)
        button.title=nameButton; // add hoover text
        button.addEventListener("click", async x=>{ 
            publish(`${nameButton}click`);
            
            ShowButton(button,false)
            await sleep(500), // show color for 1 sec.
            
            ShowButton(button,true)
        } );
    }
    return button;
}

export function LinkToggleButton(nameButton,fInitial) {
    ForceButton(nameButton,fInitial);    
    var button=document.getElementById(nameButton);
    if (button) {
        button.title=nameButton; // add hoover text
        button.addEventListener("click", x=>{            
            
            ForceButton(nameButton,!button.fOn);
            publish(`${nameButton}${button.fOn?"on":"off"}`);
        });
    }
    return button;
}

export function ForceButton(nameButton,fValue) {
    var button=document.getElementById(nameButton);
     if (button) {
        button.fOn = fValue;
        ShowButton(button,fValue)
     }        
}

 export function DragItem(draggable,dragarea,mousearea,XYCB,ClickCB) { 
    var domiddraggable=document.getElementById(draggable); 
    var domidmousearea=document.getElementById(mousearea); 
    var domiddragarea=document.getElementById(dragarea); 

             
   function SliderDrag(ev) {     
        var arearect=domiddragarea.getBoundingClientRect();   // recalc every time
        ev.preventDefault()            
        var x=undefined;
        var y=undefined;
        var percx=-1;
        var percy=-1;
        if (ev.touches && ev.touches[0] && ev.touches[0].clientX) x=ev.touches[0].clientX;
        if (ev.clientX) x=ev.clientX; 
        if (x) percx = (x - arearect.left) / arearect.width             
        if (ev.touches && ev.touches[0] && ev.touches[0].clientY) y=ev.touches[0].clientY;
        if (ev.clientY) y=ev.clientY; 
        if (y) percy = (y - arearect.top) / arearect.height     
        XYCB(percx,percy);
        //console.log(`SliderDrag ${percx.toFixed(2)} ${percy.toFixed(2)}`);   

window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again   
        
    }
    
var touchstart;    
    async function SliderStartTouch(ev) {
        console.log(`Start touch`);   
        touchstart=new Date();        
        SliderDrag(ev);               
        domidmousearea.addEventListener("touchmove",  SliderDrag);
        domidmousearea.addEventListener("touchend",   SliderStopTouch);
    }       
    
    async function SliderStopTouch(ev) {
        console.log(`Stop touch`);    
        var touchend=new Date();
        
        domidmousearea.removeEventListener("touchmove",  SliderDrag);
        domidmousearea.removeEventListener("touchend",   SliderStopTouch);
        console.log("Triggering resize");
        window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again        
        
        
          console.log(touchend.getTime()-touchstart.getTime()); 
        
        if (ClickCB && (touchend.getTime()-touchstart.getTime() < 200 ) ) { // then just a click
            console.log("Short touch");
            ClickCB();
        }
        
        
    }            
    

var mouse;    
var clickstart;
    async function SliderStartMouse(ev) {
        console.log(`Start mouse`);
        clickstart=new Date();
        
        mouse=document.createElement("div");
        mouse.style.width="100%"
        mouse.style.height="100%"
        domidmousearea.parentNode.appendChild(mouse); 
        mouse.style.backgroundColor="rgba(255, 255, 255, 0.2)"
        mouse.style.position="absolute"
        mouse.style.zIndex="200"
        mouse.style.top="0%"

        mouse.addEventListener("mousemove",  SliderDrag);
        mouse.addEventListener("mouseup",    SliderStopMouse);
    }
    
    async function SliderStopMouse(ev) {
        console.log("Stop mouse"); 
        var clickend=new Date();
                
        mouse.removeEventListener("mousemove",  SliderDrag);           
        mouse.removeEventListener("mouseup",    SliderStopMouse);  
        mouse.parentNode.removeChild(mouse)
        console.log("Triggering resize");
        window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again   
            
         console.log(clickend.getTime()-clickstart.getTime());   
            
        if (ClickCB && (clickend.getTime()-clickstart.getTime() < 150 ) ) { // then just a click
            console.log("Clicked");
            ClickCB();
        }
        
    }
    
    domiddraggable.addEventListener('touchstart', SliderStartTouch);
    domiddraggable.addEventListener('mousedown',  SliderStartMouse);  
}

// Developers can annotate touch and wheel listeners with {passive: true} to indicate that they will never invoke preventDefault.


export function InsertIFrame(windowid,url) {
   var domid=document.getElementById(windowid);   
   //console.log(domid);
   var iframe=document.createElement("iframe");
    iframe.src=url;
    iframe.width="100%"
    iframe.height="100%"
    iframe.style.height="100%"
    iframe.style.minHeight="100%" 
    iframe.style.position="absolute";
    iframe.style.top="0";
    iframe.style.left="0";
   // iframe.style.outline="1px";
   // iframe.style.outlineStyle="solid";
    domid.appendChild(iframe);
    //console.log("In InsertIFrame");
    //console.log(iframe);
    return iframe;
}


// based on https://jsmanifest.com/the-publish-subscribe-pattern-in-javascript/


const subscribers = {}

export function publish(eventName, data) {
    console.log(`publish ${eventName}`);
    //console.log(subscribers[eventName]);
    
    if (!Array.isArray(subscribers[eventName])) { return }
    subscribers[eventName].forEach((callback) => {  callback(data)  })
}

export function subscribe(eventName, callback) {
  if (!Array.isArray(subscribers[eventName])) {
    subscribers[eventName] = []
  }
  subscribers[eventName].push(callback)
  const index = subscribers[eventName].length - 1 
  var f= function(){subscribers[eventName].splice(index, 1) }
  return f;
}
  
  
export function MonitorDomid(areaid,parentclass,childclass,triggerclass,cbChildChanged) {
    
    function cbMutation(mutationsList, observer) {
        console.log("in cbMutation");
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes') { // console.log('The ' + mutation.attributeName + ' attribute was modified.');                
                var target = mutation.target;
                if (target.className.includes(triggerclass)) {
                    var children=domid.getElementsByClassName(childclass);
                    for (var i=0;i<children.length;i++) {
                        if (children[i] == target)                       
                            cbChildChanged(mutation.target,i);
                    }
                }
            }
        }
    }    
    const observer = new MutationObserver(cbMutation);
    var domid=document.getElementById(areaid);
    var nav=domid.getElementsByClassName(parentclass)
    observer.observe(nav[0], { attributes: true, childList: true, subtree: true,attributeFilter:["class"] } ); // only trigger on class changes    
}
  
export function MonitorVisible(areaid) {
    //console.log("In MonitorVisible");
    function cbMutation(mutationsList, observer) {
        //console.log("in cbMutation MonitorVisible");
        for(let mutation of mutationsList) {
            //console.log(mutation);
            if (mutation.type === 'attributes') { // console.log('The ' + mutation.attributeName + ' attribute was modified.');                                
                var target = mutation.target;
                publish(`${areaid}display${target.style.display}`);
            }
        }
    }    
    const observer = new MutationObserver(cbMutation);
    var domid=document.getElementById(areaid);
    observer.observe(domid, { attributes: true, childList: false, subtree: false,attributeFilter:["style"] } ); // only trigger on style changes    
}  



export function SelectTabBasedOnName(areaid,classid) {
    console.log("In SelectTabBasedOnName");
    var domid=document.getElementById(areaid);
    var slides=domid.getElementsByClassName("w-slide");
    var dots=domid.getElementsByClassName("w-slider-dot");
    console.log(dots);
    for (var i=0;i<slides.length;i++) {
        var domidclass=slides[i].className;        
        domidclass = domidclass.replace("w-slide", "").trim();
        console.log(domidclass);
        if (domidclass == classid) {
             dots[i].click();
             break;
        }
    }    
}   


export function SelectTabBasedOnNumber(areaid,id) {
    
    var domid=document.getElementById(areaid);
    var dots=domid.getElementsByClassName("w-slider-dot");
    //console.log(dots);
    console.log(`In SelectTabBasedOnNumber id=${id} dots.length=${dots.length}`);
    dots[id].click()    
}   




export function CanvasProgressInfo(domid,fHorizontal,seeninfo) {
    //console.log(seeninfo);
    //console.log(domid);
    var canvas=domid.getElementsByTagName("CANVAS")[0];
    if (!canvas) {
        canvas=document.createElement("CANVAS");        
        domid.appendChild(canvas); 
        canvas.width="20"  // symmetric
        canvas.height="20"  // symmetric
        canvas.style.width="100%"
        canvas.style.height="100%"
    }    
    var ctx = canvas.getContext('2d');       
    canvas.width="20"
    canvas.height="20"    
    var arearect=domid.getBoundingClientRect()
    //console.log(arearect);
    var factor
    
    if (fHorizontal) {
        factor       = Math.round(arearect.width / seeninfo.seensec.length);
        if (factor < 1) factor = 1; // in case bounding rect is still empty
        canvas.width = seeninfo.seensec.length*factor // note, this cleans the ctx
    }
    else {
        factor        = Math.round(arearect.height / seeninfo.seensec.length);
        if (factor < 1) factor = 1;  // in case bounding rect is still empty
        canvas.height = seeninfo.seensec.length // note, this cleans the ctx
    }
    //console.log(factor);
    //console.log(canvas);
    
    
    var primcolor=window.getComputedStyle(domid).getPropertyValue("color"); // use text color of parent
    //console.log( ctx.fillStyle );
    //void ctx.fillRect(x, y, width, height);
    for (var i=0;i<seeninfo.seensec.length;i++) {
        //console.log(seeninfo.seensec[i]) 
        ctx.fillStyle = primcolor; // seeninfo.seensec[i] ? primcolor:  "yellow";
        if (seeninfo.seensec[i]) 
            if (fHorizontal)
                ctx.fillRect(i*factor, 0, factor, 20);
            else
                ctx.fillRect(0, i*factor, 20, factor);
    }
}




export function LoadVideoSeen(vidinfo) {
    var storageid=`video-${vidinfo.videoid}`;
    var get=localStorage.getItem(storageid);
    var jsonparsed={}
    
    if (get) { // previous info about this video        
        jsonparsed=JSON.parse(get)
        jsonparsed.seensum=0
        for (var i=0;i<vidinfo.duration;i++)
            jsonparsed.seensum += jsonparsed.seensec[i];
        
    } else {
        jsonparsed.seensum=0;
        jsonparsed.seensec=[]
        for (var i=0;i<vidinfo.duration;i++)
            jsonparsed.seensec[i]=0;
        jsonparsed.seenend=false;
    }
    return jsonparsed;
}    

export function SaveVideoSeen(seeninfo,vidinfo) {
    var storageid=`video-${vidinfo.videoid}`;
    var seenperc=parseFloat(seeninfo.seensum / vidinfo.duration).toFixed(3)
    var obj = { seensec: seeninfo.seensec, seenperc: seeninfo.seenperc, seenend: seeninfo.seenend };
    //console.log(obj)
    var myJSON = JSON.stringify(obj);    
    localStorage.setItem(storageid,myJSON)  
}    


// see chrome dev console / tab application / left column: Local storage




export function GetCidViaIpfsProvider(cid,nr) {
    return `${ipfsproviders[nr]}/${cid}`;    
}    

export function NrIpfsProviders() {
   return ipfsproviders.length;
}    
let ipfsproviders=["https://ipfs.io/ipfs","https://ipfs.infura.io/ipfs"];

export async function ipfsgetjson(cid) {

    var indexjson
    for (var i=0;i<NrIpfsProviders();i++) {
        var url=GetCidViaIpfsProvider(cid,i);
        console.log(`Checking ${url}`);
        indexjson=await fetch(url);   // /index.json
        if (indexjson.ok) break; // found a working version     
    }
    if (!indexjson.ok)
        return undefined;    
    var json = await indexjson.json();
    return json;
}    



export class DomList {    
    constructor (objectclass) {
        console.log(`In constructor of DomList with objectclass=${objectclass}`);
        var list = document.getElementsByClassName(objectclass);
        //console.log(list)    
        if (list && list[0]) {
            this.template    = list[0];        
            this.parentnode  = list[0].parentNode
            list[0].remove();
        } else
            console.error(`${objectclass} not found`);
    }
    
    AddListItem() {
        console.log("In AddListItem");
        if (!this.template) return undefined;
        var target = this.template.cloneNode(true);
        this.parentnode.appendChild(target);  
        return target;
    }
 
    EmptyList() {        
        while (this.parentnode && this.parentnode.firstChild)
            this.parentnode.removeChild(this.parentnode.lastChild); // first remove previous children    
    }
}    


