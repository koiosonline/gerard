import {sleep,publish,subscribe} from './koios_util.mjs';

var oldtarget;
var oldbackgroundColor;

function cbMutation(mutationsList, observer) {
    console.log("in cbMutation");
    for(let mutation of mutationsList) {
        if (mutation.type === 'attributes') {
    //        console.log('The ' + mutation.attributeName + ' attribute was modified.');
            var target=mutation.target;
            if (target.className.includes("w-active")) {
                if (target !== oldtarget) {
                    if (oldtarget)
                        oldtarget.style.backgroundColor = oldbackgroundColor;
                    oldbackgroundColor = target.style.backgroundColor;
                    target.style.backgroundColor = "red";
     //               console.log(mutation);
    
                    var domid=document.getElementById("popup");
                    var tabheadings=domid.getElementsByClassName("tab-heading");    
                    var dots=domid.getElementsByClassName("w-slider-dot");
                    for (var i=0;i<dots.length;i++) {
                        if (dots[i] == target) {
                            //console.log(`Found ${i}`);
                            var target2=tabheadings[i];
                             var name=target2.getElementsByTagName("h2")[0].innerHTML;
                             var icon=target2.getElementsByClassName("large-icon")[0].innerHTML;
                            // console.log(name);
                            // console.log(icon);
                             dots[i].id=name.toLowerCase().trim();
                             dots[i].innerHTML=icon;
                             dots[i].style.fontFamily="'Fa solid 900', sans-serif";   
                            //dots[i].style.width ="1em";
                            //dots[i].style.height="1em";
                            dots[i].style.marginBottom="1em";
                        }
                    }
                       
                    oldtarget=target;
                }                
            }
        }
    }
}

export function InitPopup() {
    const observer = new MutationObserver(cbMutation);
    var domid=document.getElementById("popup");
    console.log(domid);
    var nav=domid.getElementsByClassName("w-slider-nav")
    observer.observe(nav[0], { attributes: true, childList: true, subtree: true,attributeFilter:["class"] } ); // only trigger on class changes
    
    
    
}    
// Later, you can stop observing
// observer.disconnect();


/*
    margin: 20px;
    margin-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    margin-left: 20px;
*/

 

var RelaxTime=10000;

export async function Relax() {
    console.log("Relax");
    publish ("startrelax");
    var css=document.getElementById("popup").style.cssText;
    
    if (css.includes("none")) { // then popup not visible    
        document.getElementById('bottle').click();    
        sleep(1000);
    }
    console.log(document.getElementById("popup").style.cssText);
    document.getElementById('tabrelax').click();
    await sleep(RelaxTime);
    css=document.getElementById("popup").style.cssText;
    if (css.includes("block")) { // then popup  visible    
        document.getElementById('bottle').click();    
    }
    publish ("stoprelax");
}
   

