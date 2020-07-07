
    console.log("Start script startgen");
    var loadedimages=[]
    var globalprevpage;
    
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


async function onhoverhandler(info) {   
    console.log('onhoverhandler');

    console.log(info);    
    var found=await SwitchTo(info.this,"--hover") 
    if (found) {
        found.addEventListener("mouseleave", MouseLeave)
        async function MouseLeave() {
            found.removeEventListener("mouseleave",  MouseLeave);
            console.log("mouseleave");
            await SwitchBack(info.this,found)        
        }
    }
}

async function SwitchBack(domid,found) {   
    var main=domid.firstChild; 
    main.style.opacity="1";  
    found.style.opacity="0";
    window.getComputedStyle(found).opacity;
    await sleep(200);
    found.style.display="none"; // so the original button is in front again
    main.style.display="block" // enable previous object again
}

async function SwitchTo(domid,divtype) {
    var main=domid.firstChild;
    var btnclass=main.classList[0]
    console.log(`SwitchTo ${btnclass}${divtype}`)    
    var found=domid.getElementsByClassName(`${btnclass}${divtype}`)[0]    
    if (found) {        
        found.style.display="block"
        found.style.width=main.style.width
        found.style.height=main.style.height
        found.style.left=main.style.left
        found.style.top=main.style.top       
        found.style.right=main.style.right       
        found.style.bottom=main.style.bottom      
        found.style.position=main.style.position              
        found.style.transitionDelay="0s"        
        found.style.opacity="0";        
        found.style.transition="all 200 ease-in-out";
        window.getComputedStyle(found).opacity; // delay to prevent the browser optimizing (so you don't see the transition)

        var labelsdest=found.getElementsByClassName("__label")
        var labelssource=main.getElementsByClassName("__label")        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].innerHTML = labelssource[0].innerHTML
        main.style.transition="all 200 ease-in-out";
        main.style.transitionDelay="0s"        
        main.style.opacity="0"; // start the transition
        found.style.opacity="1"; // start the transition
        await sleep(200);
        main.display="none";
        return found;
    }    
    return undefined;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function SwitchPage(newpage) {    
    console.log(`SwitchPage to ${newpage}`)
    if (newpage) {
            var destdomid=document.getElementsByClassName(newpage)[0];
            if (!destdomid) { console.error(`Page not found ${newpage}`);return; }
            destdomid.style.display="block"
            console.log(destdomid);
            
            if (destdomid.classList.contains("@overlay")) {
                console.log("overlay found");
                destdomid.style.zIndex="2"
            } else {
                document.getElementsByClassName(globalprevpage)[0].style.display="none"
                console.log(document.getElementsByClassName(globalprevpage)[0]);
            }         
            // info.event.preventDefault(); // prevent click on lower laying object // doesn't make a difference            
            globalprevpage=newpage
    }
}    


    async function onclickhandler(info) {
        console.log(`In onclickhandler, target=${info.dest?info.dest:""} prev=${globalprevpage}`);
        console.log(info)
        
        var ftoggle=info.this.getElementsByClassName("@toggle").length > 0
        if (ftoggle) {
            if (!info.this.dataset.toggle)
                info.this.dataset.toggle="false"
            info.this.dataset.toggle = (info.this.dataset.toggle=="true")?"false":"true"
            console.log(`Toggle=${info.this.dataset.toggle}`)
            if (info.this.dataset.toggle=="true")
                SwitchTo(info.this,"--active") 
            else 
                SwitchTo(info.this,"") 
        } else {        
            var found=await SwitchTo(info.this,"--active") 
            if (found) {
                await sleep(200)        
                await SwitchBack(info.this,found)        
            }
            SwitchPage(info.dest)
        }
    }


//setTimeout(main, 3000);




   // document.addEventListener("DOMContentLoaded", main)
    
  //  export function main() {
    //  console.log("DOMContentLoaded");
      
      
      var firstpageclass=document.getElementsByClassName ("firstpage")[0].dataset.firstpage
      console.log("Firstpage="+firstpageclass);
      document.getElementsByClassName(firstpageclass)[0].style.display="block"
      globalprevpage=firstpageclass;
      
/*      
      var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

      if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(async function(entries, observer) {
          entries.forEach(async function(entry) {
            if (entry.isIntersecting) {
              let lazyImage = entry.target;
              console.log(JSON.stringify(lazyImage))
              let src=lazyImage.dataset.src;  // get the src element of the dataset (e.g. data-src)
              
              var urlpromise = loadedimages[src]
              if (!urlpromise) {             
                  //loadedimages[src]=true; // make sure it isn't loaded again              
                  loadedimages[src] = urlpromise = LoadImage(src);
              }
              lazyImage.src = await urlpromise;
              console.log(JSON.stringify(lazyImage))
              //lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.classList.remove("lazy");
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        });

        lazyImages.forEach(function(lazyImage) {
          lazyImageObserver.observe(lazyImage);
        });
      } else {
        // Possibly fall back to event handlers here
      }
      */
  //  }