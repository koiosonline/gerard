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
    var fOn=fInitial;
    
    var button=document.getElementById(nameButton);
    if (button) {
        ShowButton(button,fOn)
        button.title=nameButton; // add hoover text
        button.addEventListener("click", x=>{
            fOn = !fOn;
            publish(`${nameButton}${fOn?"on":"off"}`);            
            ShowButton(button,fOn)
        });
    }
    return button;
}


 export function DragItem(draggable,dragarea,mousearea,XYCB) {
    var domiddraggable=document.getElementById(draggable); 
    var domidmousearea=document.getElementById(mousearea); 
    var domiddragarea=document.getElementById(dragarea); 
    
        
     async function SliderDrag(ev) {   
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
        //console.log(`SliderDrag ${percx} ${percy}`);
    }
    
    function SetzIndex(fChange) {  
        domiddraggable.style.zIndex = (fChange? "-1": "")
        domidmousearea.style.zIndex  = (fChange? "1": "")
        
        
        var arrchildren=domidmousearea.children;    
        for (var i=0;i<arrchildren.length;i++) 
            arrchildren[i].style.zIndex=(fChange? "-2": "")      
        
    }
    
    async function SliderStart(ev) {
        console.log(`Start dragging`);        
        SetzIndex(true); // set all childeren to lower z-index, so the mouse works well        
        SliderDrag(ev);
        
        domidmousearea.addEventListener("dragover",   SliderDrag);           
        domidmousearea.addEventListener("mousemove",  SliderDrag);
        domidmousearea.addEventListener("touchmove",  SliderDrag);
        
        domidmousearea.addEventListener("mouseup",    SliderStop);
        domidmousearea.addEventListener("touchend",   SliderStop);
        
        
/*        
        domidmousearea.addEventListener("dragend",    ev=>{console.log("dragend");SliderStop();});  
        domidmousearea.addEventListener("drop",       ev=>{console.log("drop");SliderStop();});  
        domidmousearea.addEventListener("dragexit",   ev=>{console.log("dragexit");SliderStop();});  
        domidmousearea.addEventListener("dragleave",  ev=>{console.log("dragleave");SliderStop();});  
        domidmousearea.addEventListener("mouseleave", ev=>{console.log("mouseleave");SliderStop();});  
        domidmousearea.addEventListener("touchcancel",ev=>{console.log("touchcancel");SliderStop();});  
*/        
    }       
    
    async function SliderStop(ev) {
        console.log("Stop dragging");
        SetzIndex(false); // back to normal
        domidmousearea.removeEventListener("dragover",   SliderDrag);           
        domidmousearea.removeEventListener("mousemove",  SliderDrag);           
        domidmousearea.removeEventListener("touchmove",  SliderDrag);
        
        domidmousearea.removeEventListener("mouseup",    SliderStop);  
        domidmousearea.removeEventListener("touchend",   SliderStop);

/*        
        domidmousearea.removeEventListener("drop",       SliderStop);            
        domidmousearea.removeEventListener("dragend",    SliderStop);  
        domidmousearea.removeEventListener("dragleave",  SliderStop);  
        domidmousearea.removeEventListener("dragexit",   SliderStop);          
        domidmousearea.removeEventListener("mouseleave", SliderStop);
        domidmousearea.removeEventListener("touchcancel",SliderStop);
*/
    console.log("Triggering resize");
    window.dispatchEvent(new Event('resize')); // resize window to make sure the slide scroll is calibrated again        
    }   
    domiddraggable.addEventListener('mousedown',  SliderStart);
    domiddraggable.addEventListener('touchstart', SliderStart);
  //  domiddraggable.addEventListener('dragstart',  SliderStart);    
  
  
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



export function FindDotConnectToTab(areaid,classid) {
    console.log("In FindDotConnectToTab");
    var domid=document.getElementById(areaid);
    var slides=domid.getElementsByClassName("w-slide");
    var dots=domid.getElementsByClassName("w-slider-dot");
    console.log(dots);
    for (var i=0;i<slides.length;i++) {
        var domidclass=slides[i].className;        
        domidclass = domidclass.replace("w-slide", "").trim();
        console.log(domidclass);
        if (domidclass == classid)
            return dots[i]
    }    
    return undefined;
}   


