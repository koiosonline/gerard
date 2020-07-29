

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(s) {
    var logtext=document.getElementById("log"); 
    if ((typeof s) !="string")  {
        console.log("converting to string");
        s = JSON.stringify(s);
    }   
    if (logtext)
        logtext.innerHTML +=s+"\r";
    logtext.scrollTop = logtext.scrollHeight; // keep the windows "scrolled down"
}

function SetupField(id) {
    let params = (new URL(document.location)).searchParams;
    let idvalue= params.get(id); 
    var target=document.getElementById(id)    
    target.contentEditable="true"; // make div editable
    target.style.whiteSpace = "pre"; //werkt goed in combi met innerText
    
    if (!idvalue)
        idvalue=localStorage.getItem(id); 
    if (!idvalue) 
            idvalue = target.innerHTML   
    target.innerHTML=idvalue    
    target.addEventListener('input',SaveTxt , true); // save the notes    
    
    function SaveTxt(txt) { 
        localStorage.setItem(id, txt.target.innerText);
        console.log("input");
        console.log(txt.target.innerText); 
    }
}    


//const fetch = require('node-fetch');



SetupField("figmakey")
SetupField("pageid")
SetupField("components")
SetupField("objname")
SetupField("embed")
SetupField("pin")


start();


async function FigmaApiGet(url,token) { // cache to prevent rate limit errors by figma
    var fcache=url.includes("images")    
    if (fcache) {
        var cache=localStorage.getItem(url);
        if (cache) return JSON.parse(cache);
    }    
    var x=await fetch(url, { headers: {'X-Figma-Token': token } } );
    var y=await x.text()
    var obj=JSON.parse(y); // to be able to check if an error has occured
    if (!obj.err && fcache)
        localStorage.setItem(url, y);
    return obj;    
}

async function FigmaGetImage(url) {
        //console.log(`FigmaApiGetImage Loading ${url}`);
        var p1=await fetch(url)
        //console.log(p1);
        var blob=await (p1).blob()
        //console.log(blob)
        
        //if (blob.type=="image/svg+xml") // then its text   // also stored by diskcache
        //    localStorage.setItem(url, await blob.text());
        return blob;
    
}    


async function ClearCache() {
console.log("In ClearCache")
console.log(localStorage);
var keys = Object.keys(localStorage);
        if (keys.length > 0) {
            for (var j=0;j< keys.length;j++) {
                var id=keys[j]
                var val=localStorage[id];                
                console.log(id,val)
                 if (val.includes("figma"))                
                    localStorage.removeItem(id);
            }
        } 



}


function MakeBlob(html) {
    var blob = new Blob([html], {type: 'text/html'});
    var url = URL.createObjectURL(blob);      
    return url;
}    


var sleeptimer=0;

var retry=0;
var imagesloaded=0;

async function FigmaApiGetImageSrc(url,token) {
    for (var i=0;i<8;i++) {
        if (i > 0) {
            console.log(`Retry ${i} for ${url}`); 
            sleeptimer +=200; 
            retry++;
            document.getElementById("retry").innerHTML=retry;
        }

//console.log(`FigmaApiGetImageSrc check url ${url}`);
        
        await sleep(Math.random() * sleeptimer); // some extra time to prevent rate limits
        var obj=await FigmaApiGet(url,token); 
                            
        if (!obj || obj.err || !obj.images) continue; // try again

//console.log(`FigmaApiGetImageSrc check url ${url}`);
//console.log(obj);

        var keys = Object.keys(obj.images);
        var key=keys[0];
        var str=obj.images[key];       
        
        
        var blob=await FigmaGetImage(str)
        

        imagesloaded++;
        document.getElementById("images").innerHTML=imagesloaded;
        //log(`Loaded ${str}`);
        var url2= URL.createObjectURL(blob)
        //console.log(`In FigmaApiGetImageSrc url=${url2}`);
         
        //var picturedata=await fetch(str);
        //console.log(picturedata);
        //var svg=await picturedata.txt() // assume it is in svg (txt) format
        //var blob=await picturedata.blob()
        //console.log(data);       
        //var blob = new Blob([data], { type: "image/svg" });
        //console.log(blob)
        //var url = URL.createObjectURL(blob);      
        //*/
        //console.log(url)
        //btoa() 
        // src="data:image/png;base64,
        // readAsDataURL
        
        
        return { type: "image", blob:blob, url:url2 }; // also end for loop
    }
}




async function SaveToIPFS(data,pinlocation) {        
    const ipfs = window.IpfsHttpClient(pinlocation); // 'https://ipfs.infura.io:5001'
    //const ipfs = window.IpfsHttpClient('http://diskstation:5002'); 
    console.log("SaveToIPFS");
    console.log(ipfs);
    
    for await (const result of ipfs.add(data) )
        return result.path;
}

// http://www.gpersoon.com:8080/ipfs/QmRDDFeTUve2Lxq77t5MqjNNQrGVMYoD5Nje9ai3YPug3U

// http://192.168.0.40:8080/ipfs/QmfQkD8pBSBCBxWEwFSu4XaDVSWK6bjnNuaWZjMyQbyDub/#/welcome
// http://gpersoon.com:8080/ipfs/QmfQkD8pBSBCBxWEwFSu4XaDVSWK6bjnNuaWZjMyQbyDub/#/welcome


var globalpinlocation;



let globalconnectto=[]
let imagelist=[]




async function SaveOnIpfs(data) {
console.log(`in SaveOnIpfs ${globalpinlocation}`);
console.log(data);
document.getElementById("SaveOnIpfs").innerHTML=""
    var result=await SaveToIPFS(data,globalpinlocation)
    console.log("saved SaveOnIpfs");
    console.log(result);
    return result;

    //document.getElementById("output").innerHTML += str2;
    //return `http://www.gpersoon.com:8080/ipfs/${result}`;
    //return `https://ipfs.io/ipfs/${result}`;
}




function FindObject(objname,figdata) {
//console.log(figdata);

    var firstpart = figdata.name.split(" ")[0]
    if (firstpart == objname || figdata.id==objname) 
        return figdata;
    var children=figdata.children;
    if (children)
        for (var i=0;i<children.length;i++) {
            var child=FindObject(objname,children[i] )
            if (child) return child;
        }
    return undefined; // not found        
}

var globalobjname;
var globalembed;
var globalpagesfirstpass=1;


/*
function FindRelated(components,object) {
    var keys = Object.keys(components);
    if (keys.length > 0) {
        for (var j=0;j< keys.length;j++) {
            var id2=keys[j]
            var val2=components[id2];
            if (val2.name.includes(val.name))
                console.log(val2.name)
                    
}    

*/


function IsButton(name) {
    return name.includes("btn-")
}    
/*
async function GetComponents(componentsid,token) {
    var componentlist=[];
    if (componentsid) {
        var componentspart=await FigmaApiGet(`https://api.figma.com/v1/files/${componentsid}`,token)        
        var components=componentspart.components
        var figmadocument=componentspart.document;
        console.log(components)

        
        var keys = Object.keys(components);
        if (keys.length > 0) {
            //console.log(keys);
            for (var i = 0; i < keys.length; i++) {
                var id=keys[i];
                var val = components[id];
                if (IsButton(val.name)) {
                    componentlist[val.name] = ConvertToHTML(id,figmadocument,componentsid,token)
                }
            }
        }
        console.log(componentlist);
           
        var keys = Object.keys(componentlist);
        if (keys.length > 0) {
            //console.log(keys);
            for (var i = 0; i < keys.length; i++) {
                var id=keys[i];
                console.log(id)
                var val = (await componentlist[id]).htmlobj;
                console.log(val);
                
            }
        }
        var res=await RenderAllPages(componentlist,false)
        console.log(res);
        return res;               
    }
}
*/

 //var globalbuttons;
 var globalcomponentsdocument=undefined;
var globalcompletepage;
var globalcomponentsid;

async function start() {
    
    var token=document.getElementById("figmakey").innerHTML.trim();
    var documentid=document.getElementById("pageid").innerHTML.trim();    
    globalcomponentsid=document.getElementById("components").innerHTML.trim();    
    globalobjname=document.getElementById("objname").innerHTML.trim();
    globalembed=document.getElementById("embed").innerHTML.trim();
    
    
    if (token.replace(/\./g,'')=="") { log("Figma token missing");return;}
    if (documentid.replace(/\./g,'')=="") { log("Document id missing");return;}
    if (globalembed.replace(/\./g,'')=="") globalembed=undefined; // if only ..., then no embed
    if (globalcomponentsid.replace(/\./g,'')=="") globalcomponentsid=undefined; // if only ..., then no embed
    
    
    log("Pass 1");
    globalpinlocation=document.getElementById("pin").innerHTML.trim();
    console.log(`Start ${token} ${documentid}`);
    
    //globalbuttons=await GetComponents(componentsid,token)
    if (globalcomponentsid) {
        var components=(await FigmaApiGet(`https://api.figma.com/v1/files/${globalcomponentsid}`,token));
        if (components.err) {log(`Error retrieving figma info: ${components.status} ${components.err} `);return;}
        console.log(components);
        globalcomponentsdocument=components.document
    }
    
    var url=`https://api.figma.com/v1/files/${documentid}`  // to export the vectors: ?geometry=paths    
    var documentpart=await FigmaApiGet(url,token)
    
    if (documentpart.err) {log(`Error retrieving figma info: ${documentpart.status} ${documentpart.err} `);return;}
    console.log(documentpart);
          
    
 
    
    
    
    var figmadocument=documentpart.document;
    console.log(figmadocument);
    //log(`Found page: ${figmadocument.name?figmadocument.name:""} ${figmadocument.id}`);    
    var fo=FindObject(globalobjname,figmadocument)
    console.log(fo);
    
    if (!fo) {
         log(`Can't find: ${globalobjname}`);
         return;
    }
    
    //log(`Page: ${globalpagesfirstpass++} ${globalobjname} ${fo.id}`); // id: ${fo.id}
    

    globalconnectto[fo.id] = ConvertToHTML(fo.id,figmadocument,documentid,token)
    log("Pass 2");
    //console.log(globalconnectto);
    
     globalcompletepage=await RenderAllPages(globalconnectto,false);
    //console.log(completepage);
    var html=await MakePage(globalcompletepage,globalembed,globalfonts,globalmediastyles,globalobjname,false)    
    
    var url=MakeBlob(html);    
    
    document.getElementById("output").innerHTML += `Complete page=${MakeUrl(url)}`   

/*
    keys = Object.keys(imagelist);
    if (keys.length > 0) {
        for (var i = 0; i < keys.length; i++) {                
            key=keys[i];
            log(`Wait for ${i} ${key}`);
            console.log(imagelist[key]);
            val = await imagelist[key];
            document.getElementById("output").innerHTML += `Image ${key} in seperate tab: ${MakeUrl(val)}`                                   
        }
    }
*/
    document.getElementById("SaveOnIpfs").innerHTML="Save on IPFS"  
    document.getElementById("AlsoInject").innerHTML="Inject in current page"  
}    
    
    
export async function SaveAlsoOnIpfs() {
    console.log(`SaveAlsoOnIpfs firstpage=${globalobjname}`);
    var completepage=await RenderAllPages(globalconnectto,true);
    var html=await MakePage(completepage,globalembed,globalfonts,globalmediastyles,globalobjname,true)    
    var result=await SaveOnIpfs(html)
    var str2=""
    str2 +="IPFS link 1: "+MakeUrl(`https://ipfs.infura.io/ipfs/${result}`);
    str2 +="IPFS link 2: "+MakeUrl(`https://ipfs.io/ipfs/${result}`);
    str2 +="IPFS link 3: "+MakeUrl(`http://www.gpersoon.com:8080/ipfs/${result}`);
    document.getElementById("output").innerHTML += str2;
}
 
export async function AlsoInject() {
    InjectPage(globalcompletepage,globalembed,globalfonts,globalmediastyles,globalobjname,false)
}

 
    
async function RenderAllPages(globalconnectto,fIPFS) {
    //log("RenderAllPages");
    var completepage=""
    
    var keys = Object.keys(globalconnectto);
    if (keys.length > 0) {
        for (var i = 0; i < keys.length; i++) {                
            var key=keys[i];
            //log(`Wait for ${i} ${key}`);
            //console.log(globalconnectto[key]);
            var val = await globalconnectto[key];
            //console.log(val);
            log(`Page ${i+1} of ${keys.length}  ${val?val.name:"(not found)"} (${key})`);
            if (val) {                
                var html= await recursehtml(val.htmlobj,fIPFS);    
            
            
                //var blob=MakeBlob(html);
                //document.getElementById("output").innerHTML += `Open ${val.name.padEnd(60, ' ')} : ${MakeUrl(blob)}`   
                completepage += html; // already a div
            }
        }
    } 
    return completepage
}




    
    
    
    
    
let globalmediastyles = []
let globalfonts = []

   
 
    
    
    
    
async function ConvertToHTML(foid,figmadocument,documentid,token) {  
    var currentobject=FindObject(foid,figmadocument)
    
    log(`Page ${globalpagesfirstpass} ${foid} ${currentobject?currentobject.name:"(not found)"} ${currentobject?currentobject.id:""}`);
    
    if (!currentobject) return undefined;
    globalpagesfirstpass++ // only increase if a page is really present
    
    //console.log(currentobject)
    var htmlobj=await recurse(currentobject,figmadocument,documentid,token,false,false,false,undefined); // retrieve the found object
    
    var returnset={ name:currentobject.name, id: foid, htmlobj: htmlobj }    
    //log(`Exit ConvertToHTML ${foid} name: ${currentobject.name}`);    
    return returnset;
}    
    
    
    
function GetMediaStyles(globalmediastyles) {
    var stylestr=""
    var keys = Object.keys(globalmediastyles);
    if (keys.length > 0) {
        stylestr +="<style>\n"
        console.log(keys);    
        for (var i = 0; i < keys.length; i++) {
            var key=keys[i];
            var val = globalmediastyles[key];
            stylestr +=`.${key} \{ display: none; \} \n`
            stylestr +=`@media only screen and  ${val} \{  .${key}  \{ display: block; \} \} \n`
        }
        stylestr +="</style>\n"
        console.log(stylestr);
    }
    return stylestr;
}
        

function GetFonts(globalfonts) { 
    var fontstr=""
    var keys = Object.keys(globalfonts);
    if (keys.length > 0) {
        for (var i = 0; i < keys.length; i++) {
            var key=keys[i];
            switch (key) {
                case "Arial": break; // standard font                
                case "FontAwesome":             
                case "Font Awesome 5 Free":  
                case "Font Awesome 5 Brands":   fontstr +='<link href="https://use.fontawesome.com/releases/v5.0.1/css/all.css" rel="stylesheet">'; break;
                default:                        fontstr +=`<link href="https://fonts.googleapis.com/css2?family=${key}&display=swap" rel="stylesheet">`;
            }
        }
        console.log(fontstr);
    }
    return fontstr;
}    

function MakeScriptTag(fModule,src,content) { // string trick to prevent confusion by javascript interpreter
       var str="<"+"script "
       if (fModule)
          str +=' type="module" '
       if (src)
          str +=` src="${src}" `
       str +=">"
       if (content)
          str +=content;       
       str +="<"+"/"+"script"+">"        
       return str;
}


var errorscript=`<script>

window.onerror = function(message, source, lineno, colno, error) {   // especially for ios
    console.log("In onerror");
    var str="Error: "+message+" "+source+" "+lineno+" "+colno+" ";
    if (error && error.stack) str += error.stack;
    
    //console.log(error.stack);
    
    alert(str)
    
} 
</script>
`

            
function MakeHeader(embed,globalfonts,globalmediastyles) {   
    var strprefix=""    
    
    strprefix +='<head>'
    strprefix +='<meta name="viewport" content="width=1440, initial-scale=1.0">'
    strprefix +='<meta charset="utf-8" />'
    strprefix +=errorscript;
    strprefix += GetFonts(globalfonts);
    if (embed) {
        console.log(`Embedding ${embed}`); 
        strprefix +=MakeScriptTag(true,embed)        
    }
    strprefix += GetMediaStyles(globalmediastyles);
    strprefix +='</head>'
    return strprefix;
}
    
// this script is embedded in the destination page==========================================================================// dont use reverse quotes    
var loadimagescript= "./startgen.mjs"
// end ==========================================================================        
    
async function MakePage(strinput,embed,globalfonts,globalmediastyles,firstpage,fIPFS) {
    var str="" 
    str +='<html>'   
    var head=MakeHeader(embed,globalfonts,globalmediastyles)   
    str += head;    
    str +='<body>'    
    var body=""
    body += `<div class="firstpage" data-firstpage="${firstpage}">`
    body += "</div>"    
    body += strinput    
    var x=await fetch(loadimagescript);
    var y=await x.text()    
    var scriptwithtag=MakeScriptTag(false,undefined,y); // not as a module: function's have to be exported & imported then    
    body +=scriptwithtag;    
    str += body;
    str +='</body>'
    str +='</html>'    
    return str;
}   
        

async function InjectPage(strinput,embed,globalfonts,globalmediastyles,firstpage,fIPFS) {
    var head=MakeHeader(embed,globalfonts,globalmediastyles)       
    var body=""
    body += `<div class="firstpage" data-firstpage="${firstpage}">`
    body += "</div>"    
    body += strinput
    
    document.getElementById('inject').innerHTML +=body;
    var x=await fetch(loadimagescript);
    var y=await x.text()
    var myscript = document.createElement('script');
    myscript.innerHTML=y;
    document.body.appendChild(myscript);

    if (embed) {
        console.log(`Loading ${embed}`);
        var mod=await import(embed);
        console.log(mod)
    }
    var event = new Event('DOMContentLoaded',{  bubbles: true,  cancelable: true});
    window.document.dispatchEvent(event);    
    main();
}   
        

 

    
function MakeUrl(url) {
    return `<a href="${url}" target="_blank"> ${url}` + " in new page</a><br>"
}





function _convertFigmaColorToRGB(value) {
    return Math.ceil(value * 255);
}

async function  recursehtml(htmlobjpromise,fIpfs) {
    var str=""
    if (typeof(htmlobjpromise) == "string")
        return htmlobjpromise;
        
    var htmlobj = await htmlobjpromise;
    if (!htmlobj) return ""
   if (typeof(htmlobj) == "string")
        return htmlobj;
//console.log(  htmlobj)      
   if (htmlobj.type && htmlobj.type=="image") {
        if (fIpfs)
            return SaveOnIpfs(htmlobj.blob)
        else
           return htmlobj.url;
   }
   
    if (htmlobj.length > 0)
        for (var i=0;i<htmlobj.length;i++) {
            var part=htmlobj[i]
            var objtype=typeof(part)
            switch (objtype) {
                case "string": str +=part;break;
                default:       str += await recursehtml(part,fIpfs);
            }
    }    
   return str;
}


function GetAtParam(figdata,name) {
    var pos=figdata.name.indexOf(name);
    if (pos < 0) return undefined;
    
    var rest=figdata.name.substring(pos + name.length).toLowerCase();
    rest = rest.split(" ")[0]  // take the part before a space
    //rest = rest.replace(/[^0-9\-]/g, ''); // only keep numbers (includeing - sign)
    rest = rest.replace(/[:]/g, ''); // remove :
    
    //console.log(`GetAtParam ${name} ${rest}`)
    return rest.length==0?true:rest;
}




async function recurse(figdata,figmadocument,documentid,token,fpartofgrid,fpartofbutton,fpartofflex,pb) { // pb is (optional) parent boundingbox
        var htmlobjects=[]                        
        console.log(`Processing ${figdata.name} with ${figdata.children ? figdata.children.length : 0} children`);    //Type:${figdata.type}
        console.log(figdata);
        
        if (figdata.visible==false) return "";        
        
        var zindex=GetAtParam(figdata,"@zindex");        
        
        
        var fsvg=    GetAtParam(figdata,"@svg")            // console.log(`fsvg=${fsvg}`)
        var faspect= GetAtParam(figdata,"@aspect")      //  console.log(`faspect=${faspect}`)
        var fhidden= GetAtParam(figdata,"@hidden")      //  console.log(`faspect=${faspect}`)
        
        var click=GetAtParam(figdata,"@click");
        var dest=GetAtParam(figdata,"@dest");
        var toggle=GetAtParam(figdata,"@toggle")
        
        
        
        
        var fthisisabutton= click || toggle
        
        var gridcols=   GetAtParam(figdata,"@gridcols")
        var gridrows=   GetAtParam(figdata,"@gridrows")
        
        
        var gridcol=   GetAtParam(figdata,"@gridcol")
        var gridrow=   GetAtParam(figdata,"@gridrow")
        
        
  
        
        
        var fgrid = gridcols || gridrows
        
        var frelative=   GetAtParam(figdata,"@relative")
        
        var b=figdata.absoluteBoundingBox;
        var strtxt=""
        var strstyle=""
        var image=""
        var surroundingdiv=""
        var display=""
        var width=""
        var height=""
        var left=""
        var top=""
        var right=""
        var bottom=""
        var paddingbottom=""
        var fflex=false;
        var dimensions=""
        var objecttype="div" // standard type
        var strhref=""
        var urllocation=""
        var insdata=""


      if (dest) {
        log(`Connect: ${dest}`);
        if (!globalconnectto[dest]) {
            globalconnectto[dest]=true; // prevent recursing too fast
            globalconnectto[dest]=ConvertToHTML(dest,figmadocument,documentid,token,embed) // = promise, so executed in parallel
        }                
     }    



/*
    if (figdata.transitionNodeID) {
        //log(`Connect: to ${figdata.transitionNodeID}`);
        if (!globalconnectto[figdata.transitionNodeID]) {
            globalconnectto[figdata.transitionNodeID]=true; // prevent recursing too fast
            globalconnectto[figdata.transitionNodeID]=ConvertToHTML(figdata.transitionNodeID,figmadocument,documentid,token,embed) // = promise, so executed in parallel
        }
        
        var onclick=figdata.transitionNodeID;
    }
*/

    //if (figdata.type=="INSTANCE") {
//        console.log("Searching mastercomponent");
//        var mastercomponent=FindObject(figdata.componentId,figmadocument)   
//        console.log(mastercomponent);
//    }




       
        if (b) { //|| figdata.layoutMode
            dimensions +=`position: ${(frelative || fpartofflex )?"relative":"absolute"};`;      // for grid with auto layout, relative position is neccesary          
            if (!pb) {
                strstyle +=`width:100%;height:100%;`; // no parent => so give it all the space, left & top default values // 
                // dimensions=""; // prevent minor scroll actions ==> messes up zindez
                if (figdata.name != globalobjname)
                    display="none"; // initially hidden (relevant when there are more pages), except for the first one
                    
                
            }
            else  // now pb is present
               {
                //console.log("pb-b");
                //console.log(pb)
                //console.log(b);
                var xoffset=b.x-pb.x
                var xoffsetright=-(b.x+b.width-pb.x-pb.width);
                var yoffset=b.y-pb.y	     
                var yoffsetbottom=-(b.y+b.height-pb.y-pb.height); 
                
                //console.log(`pb:${JSON.stringify(pb)} b:${JSON.stringify(b)} l:${xoffset} r:${xoffsetright} t:${yoffset} b:${yoffsetbottom}`);
              /* if (!fpartofflex) */{
                    switch(figdata.constraints ? figdata.constraints.horizontal : "default") {
                        case "SCALE":
                            left =`${(parseFloat(xoffset)/parseFloat(pb.width)*100).toFixed(2)}%`;
                            //strstyle +=`right:${(parseFloat(xoffsetright)/parseFloat(pb.width)*100).toFixed(2)}%;`;
                            width=`${(parseFloat(b.width)/parseFloat(pb.width)*100).toFixed(2)}%`;
                            
                            break;
                        case "CENTER":                              
                            //left =`${(parseFloat(xoffset)/parseFloat(pb.width)*100).toFixed(2)}%`;
                            left =`calc(50% - ${b.width/2}px)`;  // There must be spaces surrounding the math operator. 
                            width=`${b.width}px`;
                            //surroundingdiv +="display: flex; justify-content: center;";
                            //strstyle +=`left:1%;`
                            break;
                        case "RIGHT":
                            right=`${xoffsetright}px`; // negative number
                            width=`${b.width}px`;
                            break;
                            
                        case "LEFT_RIGHT":
                            //width="100%";
                            left =`${xoffset}px`
                            right=`${xoffsetright}px`; // negative number
                            break;                            
                        default:
                            left =`${xoffset}px`
                            if (parseFloat(b.width) * 100 > 1) 
                                width=`${b.width}px`;
                    }
                    switch(figdata.constraints ? figdata.constraints.vertical : "default") {
                        case "SCALE":                       
                            top =`${(parseFloat(yoffset)/parseFloat(pb.height)*100).toFixed(2)}%`;
                         if (faspect) {
                            paddingbottom =`${ (parseFloat(b.height)/parseFloat(b.width) ) * (parseFloat(b.width)/parseFloat(pb.width)*100)}%`;
                            
                            }
                         else   
                            height =`${(parseFloat(b.height)/parseFloat(pb.height)*100).toFixed(2)}%`;
                            //strstyle +=`bottom:${(parseFloat(yoffsetbottom)/parseFloat(pb.height)*100).toFixed(2)}%;`;
                            break;
                        case "CENTER":                            
                            // top =`${(parseFloat(yoffset)/parseFloat(pb.height)*100).toFixed(2)}%`;
                            top =`calc(50% - ${b.height/2}px)`;  // There must be spaces surrounding the math operator. 
                            height =`${b.height}px`;
                            //strstyle +=`top:1%`
                            //surroundingdiv +="display: flex;align-items: center; ";
                            break;
                        case "BOTTOM":
                            bottom =`${yoffsetbottom}px`; // negative number
                            height =`${b.height}px`;
                            break; 

                        case "TOP_BOTTOM":
                            //height="100%";
                            top =`${yoffset}px`
                            bottom =`${yoffsetbottom}px`; // negative number
                            break;
                        default:
                            top =`${yoffset}px`
                            if (parseFloat(b.height) * 100 > 1) 
                                height =`${b.height}px`;
                    }
                }
                 if (fpartofflex) {
                    // console.log(width,height,left,right,bottom,top,paddingbottom)
                    if (figdata.type=="TEXT") {
                        width=undefined; 
                        height=undefined;
                    }                
                    left=undefined
                    right=undefined
                    bottom=undefined
                    top=undefined
                    paddingbottom=undefined
                    
                    
                     switch(figdata.layoutAlign) {
                        case "MIN":      strstyle +="align-self: flex-start;";break;
                        case "CENTER":   strstyle +="align-self: center;";    break;
                        case "MAX":      strstyle +="align-self: flex-end;";  break;
                        case "STRETCH":  break; // no style needed
                   } 
                    
                    
                   // console.log("fpartofflex");
                   // console.log(width,height,left,right,bottom,top,paddingbottom)
                }
                if (fpartofgrid) {
                        ;//strstyle += "grid-area: auto;" // autolayout the childeren on the grid
                    strstyle += "position:relative;" // to be a reference point for further div; don't calculate the sizes, this is done by the grid
                    dimensions =`position: relative;`;      
                    width=undefined; 
                    height=undefined;
                   
                    left=undefined
                    right=undefined
                    bottom=undefined
                    top=undefined
                    paddingbottom=undefined
                    
                    
                }    
                    
                    
                
                
                if (fpartofflex && (fpartofflex!==true)) {
                  //  console.log(`Adding ${fpartofflex}`)
                    dimensions +=fpartofflex; // contains the margin values                    
                }
                
                if (figdata.layoutMode) { // autolayout
                    
                    
                    display="flex"
                    dimensions +=`padding: ${figdata.verticalPadding?figdata.verticalPadding:0}px ${figdata.horizontalPadding?figdata.horizontalPadding:0}px;`
                    switch (figdata.layoutMode) {
                        case "VERTICAL": {
                                    dimensions+="flex-direction: column;";
                                    fflex=`margin-bottom: ${figdata.itemSpacing?figdata.itemSpacing:0}px;`;
                                    height=undefined; // determined by underlying divs
                                    if (figdata.counterAxisSizingMode && figdata.counterAxisSizingMode=="FIXED") {
                                        // keep width
                                    } else    
                                        width=undefined; // determined by underlying divs
                                    break;
                        } 
                        case "HORIZONTAL": {
                                    dimensions +="flex-direction: row;";
                                    fflex=`margin-right: ${figdata.itemSpacing?figdata.itemSpacing:0}px;`; 
                                    if (figdata.counterAxisSizingMode && figdata.counterAxisSizingMode=="FIXED") {
                                        // keep height 
                                    } else 
                                        height=undefined; // determined by underlying divs                                    
                                    width=undefined; // determined by underlying divs
                        }
                        break;
                    }
                }
                
                
                if (GetAtParam(figdata,"@width")) width=GetAtParam(figdata,"@width") // allways override if present
                if (GetAtParam(figdata,"@height")) height=GetAtParam(figdata,"@height")
                
                if (width)         dimensions +=`width:${width};`;
                if (height)        dimensions +=`height:${height};`;    
                if (left)          dimensions +=`left:${left};`;    
                if (right)         dimensions +=`right:${right};`;  
                if (bottom)        dimensions +=`bottom:${bottom};`;  
                if (top)           dimensions +=`top:${top};`;  
                if (paddingbottom) dimensions +=`padding-bottom:${paddingbottom};`;  
                
               // console.log(dimensions);
            }
        }    
                
        if (fgrid)
            display="grid"
        if (gridcols)
            strstyle +=`grid-template-columns: repeat(${gridcols}, 1fr);`
        if (gridrows)
            strstyle +=`grid-template-rows: repeat(${gridrows}, 1fr);`                
  
        if (gridcol) strstyle +=`grid-column-start: ${gridcol};grid-col-end: span 1;`
        if (gridrow) strstyle +=`grid-row-start: ${gridrow};grid-row-end: span 1;`
        
  
        
        if (figdata.clipsContent==true) strstyle +="overflow: hidden;"
        
        switch (figdata.overflowDirection) {
            case "VERTICAL_SCROLLING":   strstyle +="overflow-y: scroll;";break;
            case "HORIZONTAL_SCROLLING": strstyle +="overflow-x: scroll;";break;
            case "HORIZONTAL_AND_VERTICAL_SCROLLING": strstyle +="overflow: scroll;";break;
       //  default: // includes figdata.overflowDirection == undefined
       //         strstyle +="overflow: hidden;"
        }

//console.log(`overflow: ${strstyle}`)            
        
        if (figdata.fills && figdata.fills[0] && figdata.fills[0].color && (figdata.fills[0].visible != false)) {               
            if (figdata.fills[0].type="SOLID") {
                var color=figdata.fills[0].color
                //if (figdata.fills[0].opacity)
                    color.a=figdata.fills[0].opacity
                var rgba=ConvertColor(color)
              }
          }
          
        if (figdata.fills && figdata.fills[0] && figdata.fills[0].type == "IMAGE") {
           // console.log(figdata.fills);                
            if (figdata.id) {  // link to an image??
                image = `https://api.figma.com/v1/images/${documentid}?ids=${figdata.id}&format=svg`
                objecttype="image"
            }
        }
          
          
function ConvertColor(color) {
    var a = color.a // _convertFigmaColorToRGB(color.a); opacity 0..1
    var r = _convertFigmaColorToRGB(color.r);
    var g = _convertFigmaColorToRGB(color.g);
    var b = _convertFigmaColorToRGB(color.b);
    
    if (a==undefined) a=1;
    return `rgba(${r},${g},${b},${a})`;
}
          
        if (figdata.backgroundColor) 
           var backgroundrgba=ConvertColor(figdata.backgroundColor)

        
        if (figdata.strokes && figdata.strokes[0] && figdata.strokes[0].color) 
            if (figdata.strokes[0].type="SOLID") 
                var strokesrgba=ConvertColor(figdata.strokes[0].color)
             
          var strokeWeight = figdata.strokeWeight
            
        if (figdata.effects) {
            for (var i=0;i<figdata.effects.length;i++) {
                var effect = figdata.effects[i];
                if (effect.visible)
                    switch (effect.type) {
                        case "DROP_SHADOW": {
                            strstyle +=`box-shadow: ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${ConvertColor(effect.color)};`
                        }
                }
            }
        }
       
       
            
        if (figdata.style && figdata.style.fontFamily) {
            switch (figdata.style.fontFamily) {
                case "FontAwesome":             figdata.style.fontFamily = "Font Awesome 5 Free"; // and continue to next line
                case "Font Awesome 5 Free":     strstyle += "font-weight: 900;";figdata.style.fontWeight=0;break; // note other weights are part of pro plan                
            }
           strstyle += `font-family: '${figdata.style.fontFamily}', sans-serif;`;
           globalfonts[figdata.style.fontFamily] = true;
        }
        
        if (figdata.style && figdata.style.fontSize)
            strstyle += `font-size:${figdata.style.fontSize}px;`;
        
        
        if (figdata.style && figdata.style.fontWeight)
            strstyle += `font-weight:${figdata.style.fontWeight};`;
        
        if (figdata.style && figdata.style.textDecoration)
            strstyle += `text-decoration-line: ${figdata.style.textDecoration};`      
        
        if (figdata.style && figdata.style.lineHeightPx)
            strstyle += `font-height:${figdata.style.lineHeightPx}px;`;
        
        
        if (figdata.style && figdata.style.hyperlink) {
            objecttype="a"
            urllocation=figdata.style.hyperlink.url;
            console.log(`Found url ${urllocation}`);
        }    
        

        
        
        switch (figdata.type) {
           case "TEXT": strtxt +=figdata.characters;
           
                switch(figdata.style.textAlignVertical) {
                   case "TOP":    display="flex";strstyle +="align-items: flex-start;";break
                   case "CENTER": display="flex";strstyle +="align-items: center;";    break
                   case "BOTTOM": display="flex";strstyle +="align-items: flex-end;";  break                   
                }                
                switch(figdata.style.textAlignHorizontal) {
                   case "LEFT":   display="flex";strstyle +="justify-content: flex-start;";break;
                   case "CENTER": display="flex";strstyle +="justify-content: center;";    break;
                   case "RIGHT":  display="flex";strstyle +="justify-content: flex-end;";  break;
                }    
                // console.log(strstyle);
           break;
           //case "RECTANGLE": { console.log(figdata);                          break; }
         //  case "GROUP": strstyle +=`position: relative; display:inline-block;`; break;
           case "FRAME":       break;
         //  case "COMPONENT":  strstyle +=`position: relative; display:inline-block;`; break;
          
        //  case "ELLIPSE": strstyle +="border-radius: 50%;";break; // circle for now
         // case "INSTANCE": // do same as vector
         // case "COMPONENT": // do same as vector
         
          case "REGULAR_POLYGON":
          case "ELLIPSE":
          case "STAR":
          case "LINE":   // same as vector
          case "VECTOR": fsvg=true;break; // get object as an svg
        }
        
        if (zindex)
            strstyle +=`z-index:${zindex};`
        
        if (fsvg) { // then make this into an svg {            
            image = `https://api.figma.com/v1/images/${documentid}?ids=${figdata.id}&format=svg`                
            objecttype="image"
        }    
        
        if (figdata.rectangleCornerRadii) {
            let r=figdata.rectangleCornerRadii;
            strstyle +=`border-radius: ${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px;`; // (first value applies to top-left corner, second value applies to top-right corner, third value applies to bottom-right corner, and fourth value applies to bottom-left corner)
        }
        
        if (!fsvg) {  // don't draw boxed for svgs and for vector images
            if (figdata.type!="TEXT")
                backgroundrgba = rgba;
            if (backgroundrgba)
                strstyle+=`background-color:${backgroundrgba};`
            if (rgba)
                strstyle+=`color:${rgba};`
            if (strokesrgba) 
                strstyle+=`border-color:${strokesrgba};border-style:solid;`
            switch (figdata.strokeAlign) {
               case "INSIDE": strstyle += "box-sizing: border-box;";break;
            }   
            if(strokeWeight)    
                strstyle+=`border-width:${strokeWeight}px;`    
            
            
            if (figdata.strokeDashes)
                strstyle += "border-style: dashed;"
            
        }        
        
        
        if (fhidden)
            display="none";
        if (display)        
            strstyle +=`display:${display};`;
//console.log(display);        
      
        
        
        var eventhandlers=""
        
        if (fthisisabutton  && !fpartofbutton) { // don't do event on nested parts of the button
        
        surroundingdiv=";"
        
             //eventhandlers+='onmouseenter="onhoverhandler({event:event,this:this,hover:true})" ' //mouseover
             if (!onclick) onclick=true;
        }
        
        
        if (dest) {
            insdata=`data-dest="${dest}"`
          //  console.log(`insdata : ${insdata}`);
        }
        
        if (onclick) {
             surroundingdiv=";"
          //  eventhandlers +=`onClick="onclickhandler({event:event,this:this,dest:'${onclick?onclick:""}'})" `
        }
        
        
  
        
        var classname=figdata.name;
        var mediapos=classname.indexOf("@media");
        //console.log(mediapos)
        if (mediapos >=0) {
            var rest=classname.substring(mediapos + "@media".length).toLowerCase();
            console.log(rest);
            var key = rest.replace(/[^A-Za-z0-9]/g, '');
            globalmediastyles[key]=rest;
            classname=classname.substring(0,mediapos) + " " + key;
            console.log(classname);
        }      

        classname += ` ${figdata.id} `; // to be able to access the item via the id
                
        //console.log(insrtstyle);
        
        if (surroundingdiv) {
            var strstyle2 = strstyle + dimensions;
            var insrtstyle2=strstyle2?`style="${strstyle2}"`:""
            htmlobjects.push( `<div class="${classname}" ${insrtstyle2} class="surround" ${insdata} style="${surroundingdiv};border-style:solid;border-width:1px;border-color:red;" ${eventhandlers}>` ); // width:100%;height:100%;
            dimensions=""; // dimensions are part of surroundingdiv
            
            dimensions ='position: absolute;width:100%;height:100%;' // set dimension to max in order to use of surroundingdiv
            
            insdata="" // don't put it on buttons itself anymore
            
            classname=classname.split(" ")[0]; // only keep the first part  to prevent confusion (when attaching eventlisteners)
             //classname = classname.replace("@click", ""); // remove the click from childbutton; its prevent in surroundingdiv
             //classname = classname.replace("@toggle", "");
            
        }
            
            
        strstyle +=dimensions;
            
        var insrtstyle=strstyle?`style="${strstyle}"`:""
           // console.log(`insrtstyle ${insrtstyle}`)
        switch (objecttype) {
            case "image":   
                htmlobjects.push(`<${objecttype} src=`)
                htmlobjects.push('"') // data-src= 
                if (!imagelist[image]) {
                    imagelist[image]=true;
                    imagelist[image]=FigmaApiGetImageSrc(image,token)
                }
                classname+=" lazy " // for lazy evaluatation/retrieval of images, see startgen.mjs
                htmlobjects.push(imagelist[image])
                htmlobjects.push(`"  class="${classname}" ${insrtstyle} ${insdata} title="${figdata.name}">${strtxt}\n`) //  ${figdata.type}
                htmlobjects.push('</image>');
                break;
            
                case "a":  strhref=`href="{urllocation}" `;
                case "div": htmlobjects.push(`<${objecttype} class="${classname}" ${insrtstyle} ${insdata} ${strhref} title="${figdata.name}">${strtxt}\n`) //  ${figdata.type}
                            break;
        }



        
        var children=figdata.children;
    //    figdata.children=[];     (why was this done?)
        if (children && !fsvg ) // allways recurse to try and find the intended object // don't recurse when @svg is shown
            for (var i=0;i<children.length;i++) {
                
                if (fflex) {
                    var fflextopass=fflex; // goed afjust margin here, depending on child#, but with dynamicly duplicted items not useful
                    
                } else fflextopass=fflex;
                htmlobjects.push( recurse(children[i],figmadocument,documentid,token,fgrid,fthisisabutton,fflextopass,figdata.absoluteBoundingBox) )
            }    
       
            //if (!image) // close the div
                htmlobjects.push(`</${objecttype}>`);


 
        if (fthisisabutton) { // this is a button so also get all other instance of a button 
           htmlobjects.push(GetOtherButton(figdata.name,"--hover"))
           htmlobjects.push(GetOtherButton(figdata.name,"--active"))
           htmlobjects.push(GetOtherButton(figdata.name,"--focus"))
           htmlobjects.push(GetOtherButton(figdata.name,"--disabled"))
        }
  

       
       
       
            if (surroundingdiv)
                htmlobjects.push("</div>") // close the surrounding div
       
        
        
    
        
        
       // console.log("Returning from recurse");
       // console.log(htmlobjects);
        return htmlobjects;
       

    async function GetOtherButton(name,subselect) {    
        var firstpart=name.split(" ")[0]
        //console.log(firstpart);
        if (!globalcomponentsdocument) return ""
        var fo=FindObject(`${firstpart}${subselect}`,globalcomponentsdocument)
        if (!fo) return ""
        var button=await recurse(fo,figmadocument,globalcomponentsid,token,fgrid,fthisisabutton,fflextopass,undefined) // no bounding=> hidden &max width     // get from componentsid!!!       
      //  console.log("button info is:")
      //  console.log(button);
        return button;
    }

       
    }    


        



document.getElementById("SaveOnIpfs").addEventListener("click", SaveAlsoOnIpfs)
document.getElementById("AlsoInject").addEventListener("click", AlsoInject)
document.getElementById("ClearCache").addEventListener("click", ClearCache)




/*
var svg=""
svg +=`<svg width="${figdata.size.x}" height="${figdata.size.y}" viewBox="0 0 ${figdata.size.x} ${figdata.size.y}" fill="none" xmlns="http://www.w3.org/2000/svg">`
                
for (var i=0;i<figdata.strokeGeometry.length;i++) {
    console.log(figdata.strokeGeometry[i].path);
    console.log(figdata.strokeGeometry[i].windingRule);
    svg +=`<path d="${figdata.strokeGeometry[i].path}" stroke="#FF206E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
}
svg +="</svg>"
*/
