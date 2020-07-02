
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


function SwapObjects(obj1,obj2) {
    var temp = document.createElement("div"); // create marker element     
    console.log('swapping');
    console.log(obj1);
    console.log(obj2);
    obj1.parentNode.insertBefore(temp, obj1); // and insert it where obj1 is   
    obj2.parentNode.insertBefore(obj1, obj2); // move obj1 to right before obj2
    temp.parentNode.insertBefore(obj2, temp); // move obj2 to right before where obj1 used to be    
    temp.parentNode.removeChild(temp); // remove temporary marker node
    // temp should be carbage collected
}   


function onhoverhandler(info) {   
    var btnclass=info.this.classList[0]
    console.log(`onhoverhandler ${info.hover} ${btnclass}`)
    
    var buttons=document.getElementById("buttons");
    var hover=buttons.getElementsByClassName(`${btnclass}--hover`);
    if (hover && hover[0]) {        
        var cln = hover[0].cloneNode(true);
        cln.style.display="block"
        cln.style.width=info.this.style.width
        cln.style.height=info.this.style.height
        cln.style.left=info.this.style.left
        cln.style.top=info.this.style.top       
        
        
        var labelsdest=cln.getElementsByClassName("__label")
        var labelssource=info.this.getElementsByClassName("__label")
        
        console.log(labelssource)
        console.log(labelsdest);
        
        if (labelssource && labelssource[0] && labelsdest && labelsdest[0])
            labelsdest[0].innerHTML = labelssource[0].innerHTML
        
        cln.addEventListener("mouseout", x=> { 
            console.log("mouseout");
            info.this.style.display="block" // enable previous object again
            cln.parentNode.removeChild(cln); // remove the hover object
        } )
        info.this.parentNode.insertBefore(cln, info.this)        
        info.this.style.display="none"; // hide during the hoover        
    }    
}

    function onclickhandler(info) {
        console.log(`In onclickhandler, target=${info.dest}`);
        console.log(info)
        var destdomid=document.getElementsByClassName(info.dest)[0];
        destdomid.style.display="block"
        console.log(destdomid);
        
        if (destdomid.classList.contains("@overlay")) {
            console.log("overlay found");
            destdomid.style.zIndex="2"
        } else {
            document.getElementsByClassName(globalprevpage)[0].style.display="none"
        }         
        // info.event.preventDefault(); // prevent click on lower laying object // doesn't make a difference
        
        globalprevpage=info.dest
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