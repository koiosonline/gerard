 
 import {getElement,loadScriptAsync,ForAllElements,setElementVal,getElementVal,DomList} from '../lib/koiosf_util.mjs';
 import {carrouselwait} from './sync_swipe.mjs';
 
 
 
 
function log(logstr) {   
    getElement("logboxcontent").innerHTML +=logstr+"\n";
}

console.error=log;


var globaldb;
var globalipfs;
const globalserverid='QmaXQNNLvMo6vNYuwxD86AxNx757FoUJ3qaDoQ58PY2bxz'

async function GetChoiceItems(source) {            
    var f=await fetch(source)
    var Items=await f.json();            
    console.log(JSON.stringify(Items))
    return Items;    
}            

        
async function main() {
        console.log("Main");           
        await loadScriptAsync("https://ipfs.io/ipfs/Qmeigun79nKUaxP6vqW88S3JhiLvGWt6eVv9MUTpiCnEpP");   // https://unpkg.com/ipfs@0.41.0/dist/index.min.js
        await loadScriptAsync("https://ipfs.io/ipfs/QmQjf6j2zphmojaCZESZYHmNRrV16vX8FK3FHhHEt89oHD");   // https://www.unpkg.com/orbit-db@0.24.1/dist/orbitdb.min.js
        
        window.LOG='Verbose' // 'debug'
        //SetupField("question1")
        SetupField("name")               

        await GetChoiceItems("https://gpersoon.com/koios/gerard/sync/beroepsproducten.json");



        setElementVal("offering-type",`
            <select id="idoffering-type">
                    <option value="none">--select--</option> 
                    <option value="Advies">Advies</option>
                    <option value="Handeling">Handeling</option>
                    <option value="Onderzoek">Onderzoek</option>
                    <option value="Ontwerp">Ontwerp</option>   
                    </select>
            `)

        setElementVal("offering-product",`
        <select id="idoffering-product" >
                    <option value="none">--select--</option> 
                    <option value="Bedrijfswaardering">Bedrijfswaardering</option>
                    <option value="Adviesgesprek">Adviesgesprek</option>
                    <option value="Benchmarkonderzoek">Benchmarkonderzoek</option>
                    <option value="Dashboard">Dashboard</option>   
                    </select>
        `)


        setElementVal("search-type",`
        <select id="idsearch-type" >
                    <option value="none">--select--</option> 
                    <option value="Advies">Advies</option>
                    <option value="Handeling">Handeling</option>
                    <option value="Onderzoek">Onderzoek</option>
                    <option value="Ontwerp">Ontwerp</option>   
                    </select>
        `)

        setElementVal("search-product",`
        <select id="idsearch-product" >
                    <option value="none">--select--</option> 
                    <option value="Bedrijfswaardering">Bedrijfswaardering</option>
                    <option value="Adviesgesprek">Adviesgesprek</option>
                    <option value="Benchmarkonderzoek">Benchmarkonderzoek</option>
                    <option value="Dashboard">Dashboard</option>   
                    </select>
        `)

 getElement("offeringfreetext").contentEditable="true"; // make div editable
 getElement("searchfreetext").contentEditable="true"; // make div editable


        getElement("send").addEventListener("click", Send);
        getElement("search").addEventListener("click", ShowRecords);
        getElement("swipe").addEventListener("click", Swipe);
        getElement("delete").addEventListener("click", Delete);
        getElement("peers").addEventListener("click", Peers);
        getElement("connect").addEventListener("click", Connect);
        getElement("disconnect").addEventListener("click", Disconnect);
        getElement("info").addEventListener("click", Pubsubinfo);
        
            
            
           // const ipfsOnServer = window.IpfsHttpClient('http://diskstation:5002');  
            
           // log(`ipfsOnServer id=${(await ipfsOnServer.id())?.id}`);
            
            var IPFS=Ipfs; // for the browser version    

            globalipfs = await IPFS.create() //{EXPERIMENTAL: { pubsub: true } } ???
            
           
         
          //  globalipfs.libp2p.on('peer:connect',   Peers)
          //  globalipfs.libp2p.on('peer:disconnect', x=>{log(`disconnect ${JSON.stringify( x )}`)})
         
         //await Connect();
         
         
            
            
            const orbitdb = await OrbitDB.createInstance(globalipfs,{ directory: './access_db_httpclient_diskstation' })   
            
            //log(`orbitdb id=${orbitdb.id}`);    
            var accessController = { write: ["*"] }  
            
            globaldb = await orbitdb.docs('koiostest',{
                accessController:accessController,   
                meta: { name: 'test koios via diskstation' }// results in a different orbit database address
            })    
            
            
            const address = globaldb.address;    
            //log(`address=${globaldb.address.toString()}`);    
                 
            await globaldb.load();
            ShowRecords()
            var dbeventsonreplicated=false;
            globaldb.events.on('replicate.progress', (address, hash, entry, progress, have) => {
                    console.log(progress, have)
                      getElement("loaded").innerHTML=(parseFloat(progress) /  parseFloat(have) * 100).toFixed(2);
                    if (progress >= have) { // then we have the initial batch
                         if (!dbeventsonreplicated) {
                            dbeventsonreplicated=true;
globaldb.events.on('replicated', ShowRecords)
                           }
                    }
            } )
                        
            globaldb.events.on('replicated', ShowRecords)            
            globaldb.events.on('write', (address, entry, heads) => {
                console.log('write', address, entry, heads);
                ShowRecords()
            } )
           Connect();
         
        }
        
var globalmymatches=[];        
        
async function ShowRecords() {
   //     console.log("In ShowRecords");
        globalmymatches=[];
       
        var name=getElementVal("name")
        
        var allofferings=""
        var myofferings=""
        var mymatches=""
        
        var searchfreetext=getElementVal("searchfreetext")
       // console.log(searchfreetext);
        const result = await globaldb.query(() => true); // get all records
        //console.log(result);        
        getElement("entries").innerHTML=result.length;
        //log(`Number of entries: ${result.length}`)   
       // str=JSON.stringify(result)
        
        for (var i=0;i<result.length;i++) {
            var line=""
            ForAllElements(result[i],undefined,(id,val)=>{ 
                if (id != "_id")
                    line +=`${id}: ${val} `
            } )
            line +="<br>"
            if (result[i].name==name) myofferings+=line;
            allofferings+=line; 
          
            if (result[i].freetext && result[i].freetext.includes(searchfreetext) && (result[i].name!=name)) { // exclude my own offerings
                mymatches+=line;
                globalmymatches.push(result[i]);
            }
        }

        setElementVal("allofferings",allofferings);
        setElementVal("myofferings",myofferings);
        setElementVal("mymatches",mymatches);
      //  console.log(globalmymatches)
}          
        
        
var cardlist=new DomList("card");    
    
        
async function Swipe() {
//console.log("In function Swipe");

       let board = getElement('cardcontainer')
       cardlist.EmptyList()
        
     //   console.log("domlist")
        
        for (var i=0;i<globalmymatches.length;i++) {        
            var card=cardlist.AddListItem()
            var item=globalmymatches[i]
            setElementVal("Cardheader",`Card #${i+1}`,card)
            
            setElementVal("field1",item.name,card)
            setElementVal("field2",item.freetext,card)
            setElementVal("field3",item.productsearch,card)
            setElementVal("field4",item.typesearch,card)
        }
        
     //   card1.style.transform="translateX(-50%) translateY(-50%) scale(0.95)"
     //   card2.style.transform="translateX(-50%) translateY(-50%) scale(0.95)"
       
       
       await carrouselwait(board)
       //console.log("After carrouselwait")
       SwitchPage("close");//close the popup
//let carousel = new Carousel(board)       
        
}
        
        
        
        
        
async function Send() {
    console.log("In function Send()");
    var name=getElementVal("name")
    
    
    
    var e1 = getElement("idoffering-type")
    console.log(e1)
    console.log(e1.selectedIndex)
    console.log(e1.options)
    var typesearch = e1.options[e1.selectedIndex].value;
    console.log(typesearch);
    
    
    var e2 = getElement("idoffering-product");
    console.log(e2.selectedIndex)
    console.log(e2.options)
    var productsearch = e2.options[e2.selectedIndex].value;
    console.log(productsearch);
    
    var offeringfreetext=getElementVal("offeringfreetext");
        
    var h1=await globaldb.put({ _id: new Date().getTime(), name:name, typesearch:typesearch, productsearch:productsearch,freetext:offeringfreetext })   
    
}        
        
async function Delete() {
    const result = await globaldb.query(() => true); // get all records
    for (var i=0;i<result.length;i++)
           await globaldb.del(result[i]._id)
    //ShowRecords();       
}        

async function Peers() {
    var peers=await globalipfs.swarm.peers()
   console.log()
   var fconnectedtoserver=false;
   for (var i=0;i<peers.length;i++) {        
        var adr=peers[i].addr.toString();
        console.log(adr);
        if (adr.includes(globalserverid)) fconnectedtoserver=true;
   } 
   console.log(`Connected to server: ${fconnectedtoserver}`);
    getElement("connected").innerHTML=fconnectedtoserver;
   
}

async function Connect() {
    const con='/dns4/gpersoon.com/tcp/4004/wss/p2p/'+globalserverid;
    log(`Connect ${con}`)
    await globalipfs.swarm.connect(con); // put the address of the create_db.js here
    //await Peers();
}

async function Disconnect() {
    const con='/dns4/gpersoon.com/tcp/4004/wss/p2p/'+globalserverid;
    log(`Disconnect ${con}`)
    await globalipfs.swarm.disconnect(con,{timeout:5000}); // put the address of the create_db.js here
    await Peers();
}

async function Pubsubinfo() {
    log(`ipfs id=${(await globalipfs.id()).id}`);
    var res=await globalipfs.pubsub.ls()
    console.log(res);
    for (var i=0;i<res.length;i++) {        
        var adr=res[i].toString();
        log(adr);
    }

}


function SetupField(id) {
    let params = (new URL(document.location)).searchParams;
    let idvalue= params.get(id); 
    var target=getElement(id)    
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
        
        
window.onload=main()        
   //document.addEventListener("DOMContentLoaded", main)

