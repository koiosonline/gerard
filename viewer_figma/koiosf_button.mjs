

import {LinkButton,HideButton,DragItem,publish,subscribe,LinkClickButton,LinkToggleButton,CanvasProgressInfo,SaveVideoSeen,LoadVideoSeen,ForceButton} from '../lib/koiosf_util.mjs';


console.log("Start koiosf_button.mjs");

LinkToggleButton("LeftMenuButton",true);subscribe("lefton",ToggleLeftMenu);subscribe("leftoff",ToggleLeftMenu);

var lm=.getElement("LeftMenuButton"); 
lm[0].addEventListener("click", ToggleLeftMenu); 

function ToggleLeftMenu() {
  console.log("ToggleLeftMenu");  
  var pop=.getElement("Popover_selection_video")
  console.log(pop[0].style.display)
  console.log(pop[0].style.display=="none")
    pop[0].style.display=(pop[0].style.display=="none")?"block":"none"
  
}      

var lm=.getElement("RightMenuButton"); 
lm[0].addEventListener("click", ToggleRightMenu); 

function ToggleRightMenu() {
  console.log("ToggleRightMenu");  
  var pop=.getElement("Popover_selection_literature")
  console.log(pop[0].style.display)
  console.log(pop[0].style.display=="none")
    pop[0].style.display=(pop[0].style.display=="none")?"block":"none"
  
}      



