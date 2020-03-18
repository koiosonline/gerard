console.log(`In ${window.location.href} starting script: ${import.meta.url}`);

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
        button.style.color="#13c4a3";
        //console.log(button);
        await Promise.all( [
                sleep(1000), // show color for at least 1 sec.
                funct(button)
            ]
            );          
        button.style.color=orgcolor;   
    }
}


export function HideButton(nameButton,fHide) {
    var button=document.getElementById(nameButton);
    if (button) {  
        button.style.display=fHide?"none":"flex"; // flex is used to center the icons in the button
    }
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
        domidmousearea.addEventListener("drop",       SliderStop);            
        domidmousearea.addEventListener("dragend",    SliderStop);  
        domidmousearea.addEventListener("dragleave",  SliderStop);  
        domidmousearea.addEventListener("dragexit",   SliderStop);  
        domidmousearea.addEventListener("mousemove",  SliderDrag);
        domidmousearea.addEventListener("mouseup",    SliderStop);  
        domidmousearea.addEventListener("mouseleave", SliderStop);          
        domidmousearea.addEventListener("touchmove",  SliderDrag);
        domidmousearea.addEventListener("touchend",   SliderStop);
        domidmousearea.addEventListener("touchcancel",SliderStop);        
    }       
    
    async function SliderStop(ev) {
        console.log("Stop dragging");
        SetzIndex(false); // back to normal
        domidmousearea.removeEventListener("dragover",   SliderDrag);           
        domidmousearea.removeEventListener("drop",       SliderStop);            
        domidmousearea.removeEventListener("dragend",    SliderStop);  
        domidmousearea.removeEventListener("dragleave",  SliderStop);  
        domidmousearea.removeEventListener("dragexit",   SliderStop);          
        domidmousearea.removeEventListener("mousemove",  SliderDrag);   
        domidmousearea.removeEventListener("mouseup",    SliderStop);  
        domidmousearea.removeEventListener("mouseleave", SliderStop);
        domidmousearea.removeEventListener("touchmove",  SliderDrag);
        domidmousearea.removeEventListener("touchend",   SliderStop);
        domidmousearea.removeEventListener("touchcancel",SliderStop);
    }   
    domiddraggable.addEventListener('mousedown',  SliderStart);
    domiddraggable.addEventListener('touchstart', SliderStart, {passive:true} );     
  //  domiddraggable.addEventListener('dragstart',  SliderStart);    
}

