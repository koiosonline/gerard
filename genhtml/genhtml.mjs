

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
            
        await sleep(Math.random() * sleeptimer); // some extra time to prevent rate limits
        var obj=await FigmaApiGet(url,token); 
                            
        if (!obj || obj.err || !obj.images) continue; // try again
        
        var keys = Object.keys(obj.images);
        var key=keys[0];
        var str=obj.images[key];       
        //log(`Loading ${str}`);
        
        var blob=await (await fetch(str)).blob()
        imagesloaded++;
        document.getElementById("images").innerHTML=imagesloaded;
        //log(`Loaded ${str}`);
        var url= URL.createObjectURL(blob)
         
         
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
        
        
        return { type: "image", blob:blob, url:url }; // also end for loop
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
    if (figdata.name == objname || figdata.id==objname) 
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



           

/*                
                ages.find(checkAdult);
                btn-secondary--lg
genhtml.mjs:208 btn-secondary--lg--focus
genhtml.mjs:208 btn-secondary--lg--hover
genhtml.mjs:208 btn-secondary--lg--active
genhtml.mjs:208 btn-secondary--lg--disabled
                */
                
                
        }
}

 var globalbuttons;

async function start() {
    log("Pass 1");
    var token=document.getElementById("figmakey").innerHTML.trim();
    var documentid=document.getElementById("pageid").innerHTML.trim();    
    var componentsid=document.getElementById("components").innerHTML.trim();    
    globalobjname=document.getElementById("objname").innerHTML.trim();
    globalembed=document.getElementById("embed").innerHTML.trim();
    
    if (globalembed.replace(/\./g,'')=="") globalembed=undefined; // if only ..., then no embed
    if (componentsid.replace(/\./g,'')=="") componentsid=undefined; // if only ..., then no embed
    
    globalpinlocation=document.getElementById("pin").innerHTML.trim();
    console.log(`Start ${token} ${documentid}`);
    
    globalbuttons=await GetComponents(componentsid,token)
    
    
    var url=`https://api.figma.com/v1/files/${documentid}`  // to export the vectors: ?geometry=paths    
    var documentpart=await FigmaApiGet(url,token)
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
    
    var completepage=await RenderAllPages(globalconnectto,false);
    //console.log(completepage);
    var html=await MakePage(completepage,globalembed,globalfonts,globalmediastyles,globalbuttons,globalobjname,false)    
    
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
}    
    
    
export async function SaveAlsoOnIpfs() {
    console.log(`SaveAlsoOnIpfs firstpage=${globalobjname}`);
    var completepage=await RenderAllPages(globalconnectto,true);
    var html=await MakePage(completepage,globalembed,globalfonts,globalmediastyles,globalbuttons,globalobjname,true)    
    var result=SaveOnIpfs(html)
    var str2=""
    str2 +="IPFS link 1: "+MakeUrl(`https://ipfs.infura.io/ipfs/${result}`);
    str2 +="IPFS link 2: "+MakeUrl(`https://ipfs.io/ipfs/${result}`);
    str2 +="IPFS link 3: "+MakeUrl(`http://www.gpersoon.com:8080/ipfs/${result}`);
    document.getElementById("output").innerHTML += str2;
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
            if (val) {
                log(`Page ${i+1} of ${keys.length}  ${val.name} (${key})`);
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
    log(`Page ${globalpagesfirstpass++} ${currentobject.name} ${currentobject.id}`);
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


            
function MakeHeader(embed,globalfonts,globalmediastyles) {   
    var strprefix=""    
    
    strprefix +='<head>'
    strprefix +='<meta name="viewport" content="width=1440, initial-scale=1.0">'
    strprefix +='<meta charset="utf-8" />'
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
    
async function MakePage(strinput,embed,globalfonts,globalmediastyles,buttons,firstpage,fIPFS) {
    var str="" 
    str +='<html>'
    
    var head=MakeHeader(embed,globalfonts,globalmediastyles)   
    str += head;

// document.getElementsByTagName('head')[0].innerHTML = 

    
    str +='<body>'    
    var body=""
    body += `<div class="firstpage" data-firstpage="${firstpage}">`
    body += "</div>"    
    body += strinput
    
    
    body +=`<div id="buttons">${buttons}`
    body += "</div>"    
    
    if (!fIPFS) document.getElementById('inject').innerHTML +=body;
    var x=await fetch(loadimagescript);
    var y=await x.text()
    
    var scriptwithtag=MakeScriptTag(false,undefined,y); // not as a module: function's have to be exported & imported then
    
    
    var myscript = document.createElement('script');
    myscript.innerHTML=y;
    document.body.appendChild(myscript);
    
    body +=scriptwithtag;
    
    str += body;


    console.log("after inject")
    
  if (!fIPFS) {  
    if (embed) {
        console.log(`Loading ${embed}`);
        var mod=await import(embed);
        console.log(mod)
    }
    //await import(loadimagescript);
    
    document.getElementById('buttons').innerHTML =buttons;
    var event = new Event('DOMContentLoaded',{  bubbles: true,  cancelable: true});
    window.document.dispatchEvent(event);
    
    
  }
    
    str +='</body>'
    str +='</html>'    
    return str;
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
    rest = rest.replace(/[^0-9\-]/g, ''); // only keep numbers (includeing - sign)
    console.log(`GetAtParam ${name} ${rest}`)
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
        
        var fthisisabutton=GetAtParam(figdata,"@click") || GetAtParam(figdata,"@toggle")
        
        var gridcol=   GetAtParam(figdata,"@gridcol")
        var gridrow=   GetAtParam(figdata,"@gridrow")
        var fgrid = gridcol || gridrow
        
        var frelative=   GetAtParam(figdata,"@relative")
        
        var b=figdata.absoluteBoundingBox;
        var strtxt=""
        var strstyle=""
        var image=""
        var surroundingdiv=""
        var display=""
        var width=""
        var height=""
        var fflex=false;


    if (figdata.transitionNodeID) {
        //log(`Connect: to ${figdata.transitionNodeID}`);
        if (!globalconnectto[figdata.transitionNodeID]) {
            globalconnectto[figdata.transitionNodeID]=true; // prevent recursing too fast
            globalconnectto[figdata.transitionNodeID]=ConvertToHTML(figdata.transitionNodeID,figmadocument,documentid,token,embed) // = promise, so executed in parallel
        }
        
        var onclick=figdata.transitionNodeID;
    }

        if (fpartofgrid)
           strstyle += "grid-area: auto;" // autolayout the childeren on the grid
        else 
        if (b) { //|| figdata.layoutMode
            strstyle +=`position: ${(frelative || fpartofflex )?"relative":"absolute"};`;      // for grid with auto layout, relative position is neccesary          
            if (!pb) {
                strstyle +=`width:100%;height:100%;`; // no parent => so give it all the space, left & top default values // 
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
                
                console.log(`pb:${JSON.stringify(pb)} b:${JSON.stringify(b)} l:${xoffset} r:${xoffsetright} t:${yoffset} b:${yoffsetbottom}`);
                if (!fpartofflex) {
                    switch(figdata.constraints ? figdata.constraints.horizontal : "default") {
                        case "SCALE":
                            strstyle +=`left:${(parseFloat(xoffset)/parseFloat(pb.width)*100).toFixed(2)}%;`;
                            //strstyle +=`right:${(parseFloat(xoffsetright)/parseFloat(pb.width)*100).toFixed(2)}%;`;
                            width=`${(parseFloat(b.width)/parseFloat(pb.width)*100).toFixed(2)}%`;
                            
                            break;
                        case "CENTER":                              
                            strstyle +=`left:${(parseFloat(xoffset)/parseFloat(pb.width)*100).toFixed(2)}%;`;
                            width=`${b.width}px`;
                            //surroundingdiv +="display: flex; justify-content: center;";
                            //strstyle +=`left:1%;`
                            break;
                        case "RIGHT":
                            strstyle +=`right:${xoffsetright}px;`; // negative number
                            width=`${b.width}px`;
                            break;
                        default:
                            strstyle +=`left:${xoffset}px;`
                            if (parseFloat(b.width) * 100 > 1) 
                                width=`${b.width}px`;
                    }
                    switch(figdata.constraints ? figdata.constraints.vertical : "default") {
                        case "SCALE":                       
                            strstyle +=`top:${(parseFloat(yoffset)/parseFloat(pb.height)*100).toFixed(2)}%;`;                        
                         if (faspect) {
                            strstyle +=`padding-bottom:${ (parseFloat(b.height)/parseFloat(b.width) ) * (parseFloat(b.width)/parseFloat(pb.width)*100)}%;`;
                            
                            }
                         else   
                            height =`${(parseFloat(b.height)/parseFloat(pb.height)*100).toFixed(2)}%`;
                            //strstyle +=`bottom:${(parseFloat(yoffsetbottom)/parseFloat(pb.height)*100).toFixed(2)}%;`;
                            break;
                        case "CENTER":                            
                            strstyle +=`top:${(parseFloat(yoffset)/parseFloat(pb.height)*100).toFixed(2)}%;`;
                            height =`${b.height}px`;
                            //strstyle +=`top:1%`
                            //surroundingdiv +="display: flex;align-items: center; ";
                            break;
                        case "BOTTOM":
                            strstyle +=`bottom:${yoffsetbottom}px;`; // negative number
                            height =`${b.height}px`;
                            break;                                                                                
                        default:
                            strstyle +=`top:${yoffset}px;`
                            if (parseFloat(b.height) * 100 > 1) 
                                height =`${b.height}px`;
                    }
                }
                 if (fpartofflex) {
                    width=undefined; 
                    height=undefined;
                    if (fpartofflex!==true)
                        strstyle +=fpartofflex; // contains the margin values
                }
                if (figdata.layoutMode) {
                    width=undefined; // determined by underlying divs
                    height=undefined; // determined by underlying divs
                    display="flex"
                    strstyle +=`padding: ${figdata.verticalPadding?figdata.verticalPadding:""}px ${figdata.horizontalPadding?figdata.horizontalPadding:""}px;`
                    switch (figdata.layoutMode) {
                        case "VERTICAL": strstyle+="flex-direction: column;";fflex=`margin: ${figdata.itemSpacing?figdata.itemSpacing:0}px 0px;`; break;
                        case "HORIZONTAL": strstyle +="flex-direction: row;";fflex=`margin: 0px ${figdata.itemSpacing?figdata.itemSpacing:0}px;`; break;
                    }
                }
                if (width)
                    strstyle +=`width:${width};`;
                if (height)
                    strstyle +=`height:${height};`;    
                console.log(strstyle);
            }
        }    
                
        if (fgrid)
            display="grid"
        if (gridcol)
            strstyle +=`grid-template-columns: repeat(${gridcol}, 1fr);`
        if (gridrow)
            strstyle +=`grid-template-rows: repeat(${gridrow}, 1fr);`                
                
        
        if (figdata.clipsContent)
            strstyle +="overflow: hidden;"
        
        if (figdata.fills && figdata.fills[0] && figdata.fills[0].color && (figdata.fills[0].visible != false)) {               
            if (figdata.fills[0].type="SOLID") {
                var color=figdata.fills[0].color
                //if (figdata.fills[0].opacity)
                    color.a=figdata.fills[0].opacity
                var rgba=ConvertColor(color)
              }
          }
          
        if (figdata.fills && figdata.fills[0] && figdata.fills[0].type == "IMAGE") {
            console.log(figdata.fills);                
            if (figdata.id)  // link to an image??
                image = `https://api.figma.com/v1/images/${documentid}?ids=${figdata.id}&format=svg`
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
        
        if (fsvg)  // then make this into an svg
            image = `https://api.figma.com/v1/images/${documentid}?ids=${figdata.id}&format=svg`                
        
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
console.log(display);        
      
        var insrtstyle=strstyle?`style="${strstyle}"`:""
        
        var eventhandlers=onclick?`onClick="onclickhandler({event:event,this:this,dest:'${onclick}'})" `:""
        
        
        if (fthisisabutton  && !fpartofbutton) { // don't do event on nested parts of the button
             eventhandlers+='onmouseover="onhoverhandler({event:event,this:this,hover:true});" '
             //eventhandlers+='onmouseout="onhoverhandler({event:event,this:this,hover:false});" '
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
        
        if (surroundingdiv)
            htmlobjects.push( `<div style="${surroundingdiv};width:100%;height:100%;border-style:solid;border-width:1px;border-color:red;">` );
            
        if (image) {
            htmlobjects.push('<image src='+'"') // data-src= 
            //log(`Getting image ${image}`);
            //await sleep(500); // avoid rate limit on figma       

            if (!imagelist[image]) {
                imagelist[image]=true;
                imagelist[image]=FigmaApiGetImageSrc(image,token)
            }
            classname+=" lazy "
            htmlobjects.push(imagelist[image])
            htmlobjects.push(`"  class="${classname}" ${insrtstyle} ${eventhandlers} title="${figdata.name}">${strtxt}\n`) //  ${figdata.type}
            htmlobjects.push('</image>');
        }
        else 
            htmlobjects.push(`<div class="${classname}" ${insrtstyle} ${eventhandlers} title="${figdata.name}">${strtxt}\n`) //  ${figdata.type}



        
        var children=figdata.children;
    //    figdata.children=[];     (why was this done?)
        if (children && !fsvg ) // allways recurse to try and find the intended object // don't recurse when @svg is shown
            for (var i=0;i<children.length;i++) {
                
                if (fflex) {
                    var fflextopass=(i==0 || (i==children.length-1) )?true:fflex; // for first & last item, no margins, so just pass true
                    
                } else fflextopass=fflex;
                htmlobjects.push( recurse(children[i],figmadocument,documentid,token,fgrid,fthisisabutton,fflextopass,figdata.absoluteBoundingBox) )
            }    
        
       // if (!objname) 
       {
            if (!image) // close the div
                htmlobjects.push('</div>');

            if (surroundingdiv)
                htmlobjects.push("</div>") // close the surrounding div
        }
       // console.log("Returning from recurse");
       // console.log(htmlobjects);
        return htmlobjects;
        
    }    



document.getElementById("SaveOnIpfs").addEventListener("click", SaveAlsoOnIpfs)




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
