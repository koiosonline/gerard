
    console.log("Start script startgen");
    var loadedimages=[]
    
    
    /*
    async function LoadImage(src) {
        console.log("Loading image "+src)
        
        // later convert this to native ipfs
        var data=await fetch(src)
        var text=await data.text()
        //console.log(text);
        
        
        var blob2 = new Blob([text], { type: "image/svg+xml" });
        console.log(blob2);
        var url=URL.createObjectURL(blob2)          
        console.log(url);
        return url;
    } 
*/    



/*
async function SwitchBack(domid,found) {   
    var main=domid.firstChild; 
    main.style.opacity="1";  
    found.style.opacity="0";
    window.getComputedStyle(found).opacity;
    await sleep(200);
    found.style.display="none"; // so the original button is in front again
    main.style.display="block" // enable previous object again
}
*/

async function SwitchTo(domid,divtype) {
     //console.log(`SwitchTo ${divtype}`)    
   //  console.log(domid)
     var previous;
     var found;
    
    var children = domid.childNodes;
  //  console.log(children);
    for (var i=0;i<children.length;i++) {
      // console.log(children[i]);
        //children[i].style.display="none"
        if (children[i].style) {
            children[i].style.transition="all 200 ease-in-out";
            children[i].style.transitionDelay="0s"        
            children[i].style.opacity="0"; // start the transition
        }
        //console.log(children[i].style.display)
        //if (children[i].style.display!="none") {
          //  console.log("found previous")
            
            //previous=children[i];
            //console.log(previous)
            //break; // should just be 1
        //}
    }
    
    var main=domid.firstChild;
  //  console.log(main)
    
    if (divtype=="") {
        var found=main;
    } else {  
        var btnclass=main.classList[0]
    //    console.log(`SwitchTo ${btnclass}${divtype}`)    
        var foundlist=domid.getElementsByClassName(`${btnclass}${divtype}`)
      //  console.log(foundlist);
        if (foundlist.length==0)
            found=main; // otherwise nothing is visible
         else 
            found=foundlist[0]    
        
    }
   // console.log("found")
   // console.log(found)
    if (found) { 
    
    //console.log("previous")
    //console.log(previous)
        
        found.style.display="block"
//        found.style.width=domid.style.width
//        found.style.height=domid.style.height
//        found.style.left=domid.style.left
//        found.style.top=domid.style.top       
//        found.style.right=domid.style.right       
//        found.style.bottom=domid.style.bottom      
//        found.style.position=domid.style.position              

        found.style.position="absolute"
         found.style.width="100%"
        found.style.height="100%"

        found.style.transitionDelay="200"        
        found.style.opacity="0";        
        found.style.transition="all 200 ease-in-out";
        window.getComputedStyle(found).opacity; // delay to prevent the browser optimizing (so you don't see the transition)

        var labelsdest=found.getElementsByClassName("__label")
        var labelssource=main.getElementsByClassName("__label")        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].innerHTML = labelssource[0].innerText   // .replace(/ /g,'&nbsp') doesn't work well with lots of text
        
        
        var labelsdest=found.getElementsByClassName("__icon")
        var labelssource=main.getElementsByClassName("__icon")        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].src = labelssource[0].src
       // console.log(labelssource)
       // console.log(labelsdest)
        
        
        
     
        found.style.opacity="1"; // start the transition
        //await sleep(200);
     //   previous.style.display="none";
       // console.log("found")
       // console.log(found)
      //  console.log("previous")
      //  console.log(previous)
      
        
      
        return found;
    }    
    return undefined;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var globalprevpage;
var currentoverlay

function SwitchPage(newpage,callerthis) {    
    console.log(`SwitchPage to ${newpage} from ${globalprevpage}`) 	
    if (newpage) {
        var destdomid=document.getElementsByClassName(newpage)[0];            
        if (globalprevpage==destdomid) // stays on same page
            return
        if (currentoverlay) { // close the overlay first
            var ev = new CustomEvent("hide");
            currentoverlay.dispatchEvent(ev); 
            currentoverlay=undefined
        }    
        if (newpage=="close") return; // only close the overlay
        if (!destdomid) { console.error(`Page not found ${newpage}`);return; }
        var ev = new CustomEvent("show",{detail:callerthis});
        destdomid.dispatchEvent(ev); 
       
        if (destdomid.classList.contains("@overlay")) {
            destdomid.style.zIndex="2"                // note check web3modal is visible
            currentoverlay=destdomid
        } else {
            if (globalprevpage) {
                var ev = new CustomEvent("hide");
                globalprevpage.dispatchEvent(ev); 
            }
            globalprevpage=destdomid
            currentoverlay=undefined
        }         
    }
}    


function GetToggleState(domid,key) {
   if (!domid.dataset[key]) return false
   return domid.dataset[key]=="true"
}    

function SetToggleState(domid,key,bool) {
   domid.dataset[key]=bool;
   //console.log(`In SetToggleState ${key} ${domid.dataset[key]}`);
}    

function ToggleState(domid,key) {
   var current=GetToggleState(domid,key)
   //console.log(`In ToggleState1 ${key} ${current}`);
   current=!current;
   SetToggleState(domid,key,current)
   current=GetToggleState(domid,key)
   //console.log(`In ToggleState2 ${key} ${current}`);
   return current;
}    



function NewState() {
    
}

    


async function onmousedownhandler(event) {
    console.log("In onmousedownhandler")
    var ftoggle=this.className.includes("@toggle") 
    var fclick=this.className.includes("@click")
    if (! (ftoggle || fclick) ) return; // can't find the type of click
        
        
    if (GetToggleState(this,"displaydisabled")) return; // can't use when disabled
        
    SetToggleState(this,"mousedown",true)
    SetToggleState(this,"mousedowndisplayactive",GetToggleState(this,"displayactive"))
        
    if (ftoggle) { // screen output of the toggle, not persisted yet
        var ev = new CustomEvent("toggleactive");
        this.dispatchEvent(ev); 
    } else {
        var ev = new CustomEvent("displayactive");
        this.dispatchEvent(ev); 
    }        
}
    
async function onmouseuphandler(event) {
    console.log(`In onmouseuphandler,  prev=${globalprevpage?globalprevpage.className:""}  target=${this.dataset?this.dataset.dest:""}` );
     
    var ftoggle=this.className.includes("@toggle") 
    var fclick=this.className.includes("@click")
    if (! (ftoggle || fclick) ) return; // can't find the type of click
    
    if (GetToggleState(this,"displaydisabled")) return; // can't use when disabled
    
    if (ftoggle) {
        //var ev = new CustomEvent("toggleactive"); // already done
        //this.dispatchEvent(ev);       
    } else {        
        
        //await sleep(200)   
        var ev2 = new CustomEvent("displaydefault");
        this.dispatchEvent(ev2); 
        var ev3 = new CustomEvent('animatedclick',{detail:this});
     //   console.log("Sending animatedclick to");    
      //  console.log(this)        
        this.dispatchEvent(ev3);              
        if (this.dataset && this.dataset.dest)  // otherwise action is defined elsewhere
           SwitchPage(this.dataset.dest,this)
    }
    SetToggleState(this,"mousedown",false)
}




async function onhidehandler(event) {
    //console.log("In onhidehandler");    
    SetToggleState(this,"display",false);    
    this.style.display="none";
}    

async function onshowhandler(event) {
    //console.log("In onshowhandler");
    SetToggleState(this,"display",true);
    this.style.display="block"
    var ev = new CustomEvent("madevisible",{detail:event});
    this.dispatchEvent(ev); 
}    

async function ontoggledisplayhandler(event) {
    //console.log("In ontoggledisplayhandler");            
    var ev = new CustomEvent(GetToggleState(this,"display") ?"hide":"show");
    this.dispatchEvent(ev);     
}    



async function ondisplaydefaulthandler(event) {
    //console.log("In ondisplaydefaulthandler");
    SetToggleState(this,"displaydisabled",false);    
    SetToggleState(this,"displayactive",false);    
    SwitchTo(this,"")
}    

async function ondisplayactivehandler(event) {
    //console.log("In ondisplayactivehandler");
    SetToggleState(this,"displaydisabled",false);
    SetToggleState(this,"displayactive",true);    
    SwitchTo(this,"--active")
}  

async function ondisplaydisabledhandler(event) {
    //console.log("In ondisplaydisabledhandler");
    SetToggleState(this,"displaydisabled",true);    
    SetToggleState(this,"displayactive",false);    
    SwitchTo(this,"--disabled")
}  


async function onmouseenterhandler(event) { // hover
    //console.log("In onmouseenterhandler");        
    if (GetToggleState(this,"displaydisabled")) return; // can't use when disabled
    SwitchTo(this,"--hover")
}    

async function onmouseleavehandler(event) { // end of hover or end of mousedown; set to expected state
    //console.log("In onmouseleavehandler");        
    var fActive=GetToggleState(this,"displayactive")
    var fMousedown=GetToggleState(this,"mousedown")
    SetToggleState(this,"mousedown",false)
    
    if (GetToggleState(this,"displaydisabled")) { // allways back to disabled
        this.dispatchEvent(new CustomEvent("displaydisabled"));
        return; 
    }
    
    if (fMousedown) { // set back to initial state
        var startstate=GetToggleState(this,"mousedowndisplayactive")
        var ev = new CustomEvent(startstate?"displayactive":"displaydefault");
        this.dispatchEvent(ev); 
    } else {
        var ev = new CustomEvent(fActive?"displayactive":"displaydefault");
        this.dispatchEvent(ev); 
    }
    
}    



async function ontoggleactivehandler(event) {    
//console.log("In ontoggleactivehandler1");
    var newstate=ToggleState(this,"displayactive")
 //   console.log(`In ontoggleactivehandler newstate=${newstate}`);
    var ev = new CustomEvent(newstate?"displayactive":"displaydefault");
    this.dispatchEvent(ev);  
    
     await sleep(200)
     var ev2 = new CustomEvent('animatedtoggle');
   //  console.log("Sending animatedtoggle to");
     //console.log(this)
     this.dispatchEvent(ev2);                    
}    

function SetAllEventHandlers(domid) {
    //console.log("In SetAllEventHandlers for")
    //console.log(domid);
    SetEventHandlers(domid,"@toggle",)
    SetEventHandlers(domid,"@click")
    SetEventHandlers(domid,"@page")
}

function SetEventHandlers(domid,tag) {
    //console.log(`SetEventHandlers ${tag}`)
    if (domid) {
        SetHandler(domid,tag)    
    } else domid=document
    
    var buttons=domid.getElementsByClassName(tag)
    for (var i=0;i<buttons.length;i++) 
       SetHandler(buttons[i],tag)     
}    

function SetHandler(domid,tag) {
    //console.log("Setting handlers for:");
    if (domid.className.includes(tag)) {
        console.log(domid)
        if (tag=="@toggle" || tag=="@click") {
            domid.addEventListener("mousedown",onmousedownhandler)
            domid.addEventListener("mouseup",onmouseuphandler)
            domid.addEventListener("mouseenter",onmouseenterhandler)
            domid.addEventListener("mouseleave",onmouseleavehandler)
        }
        domid.addEventListener("hide",onhidehandler)
        domid.addEventListener("show",onshowhandler)
        domid.addEventListener("toggledisplay",ontoggledisplayhandler)
        domid.addEventListener("displaydefault",ondisplaydefaulthandler)
        domid.addEventListener("displayactive",ondisplayactivehandler)
        domid.addEventListener("displaydisabled",ondisplaydisabledhandler)
        domid.addEventListener("toggleactive",ontoggleactivehandler)
    }
}        



document.addEventListener("DOMContentLoaded", main)
    
async function main() {
    //console.log("DOMContentLoaded");
    SetAllEventHandlers()

    var firstlist=document.getElementsByClassName ("@first")
    if (firstlist && firstlist.length >0) {          
        var firstname=firstlist[0].className.split(" ")[0]; // only take the first partt
        SwitchPage(firstname)
    }      
}

