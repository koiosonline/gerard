 
 import {getElement,loadScriptAsync} from '../lib/koios_util.mjs';
 
function log(logstr) {   
    getElement("log").innerHTML +=logstr+"\n";
}

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
        await loadScriptAsync("https://unpkg.com/ipfs@0.41.0/dist/index.min.js");
        await loadScriptAsync("https://www.unpkg.com/orbit-db@0.24.1/dist/orbitdb.min.js");
        
        window.LOG='Verbose' // 'debug'
        //SetupField("question1")
        SetupField("name")               

        await GetChoiceItems("https://gpersoon.com/koios/gerard/sync/beroepsproducten.json");



        var typeprovide=getElement("type-provide")
            typeprovide.innerHTML=`
        <select id="typeprovide" >
                    <option value="none">--select--</option> 
                    <option value="Advies">Advies</option>
                    <option value="Handeling">Handeling</option>
                    <option value="Onderzoek">Onderzoek</option>
                    <option value="Ontwerp">Ontwerp</option>   
                    </select>
        `

        var productprovide=getElement("product-provide")
            productprovide.innerHTML=`
        <select id="productprovide" >
                    <option value="none">--select--</option> 
                    <option value="Bedrijfswaardering">Bedrijfswaardering</option>
                    <option value="Adviesgesprek">Adviesgesprek</option>
                    <option value="Benchmarkonderzoek">Benchmarkonderzoek</option>
                    <option value="Dashboard">Dashboard</option>   
                    </select>
        `


        var typesearch=getElement("type-search")
            typesearch.innerHTML=`
        <select id="typesearch" >
                    <option value="none">--select--</option> 
                    <option value="Advies">Advies</option>
                    <option value="Handeling">Handeling</option>
                    <option value="Onderzoek">Onderzoek</option>
                    <option value="Ontwerp">Ontwerp</option>   
                    </select>
        `

        var productsearch=getElement("product-search") // onchange=...
            productsearch.innerHTML=`
        <select id="productsearch" >
                    <option value="none">--select--</option> 
                    <option value="Bedrijfswaardering">Bedrijfswaardering</option>
                    <option value="Adviesgesprek">Adviesgesprek</option>
                    <option value="Benchmarkonderzoek">Benchmarkonderzoek</option>
                    <option value="Dashboard">Dashboard</option>   
                    </select>
        `





        getElement("send").addEventListener("click", Send);
        getElement("delete").addEventListener("click", Delete);
        getElement("peers").addEventListener("click", Peers);
        getElement("connect").addEventListener("click", Connect);
        getElement("disconnect").addEventListener("click", Disconnect);
        getElement("info").addEventListener("click", Pubsubinfo);
        
            
            
           // const ipfsOnServer = window.IpfsHttpClient('http://diskstation:5002');  
            
           // log(`ipfsOnServer id=${(await ipfsOnServer.id())?.id}`);
            
            var IPFS=Ipfs; // for the browser version    

            globalipfs = await IPFS.create() //{EXPERIMENTAL: { pubsub: true } } ???
            
           
         
            globalipfs.libp2p.on('peer:connect',   Peers)
            globalipfs.libp2p.on('peer:disconnect', x=>{log(`disconnect ${JSON.stringify( x )}`)})
         
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
        
async function ShowRecords() {
        console.log("In ShowRecords");
        var str=""
        const result = await globaldb.query(() => true); // get all records
        //console.log(result);        
        getElement("entries").innerHTML=result.length;
        //log(`Number of entries: ${result.length}`)   
        str=JSON.stringify(result)
      //  for (var i=0;i<result.length;i++)
        //    str += `Name: ${result[i].name} Question: ${result[i].question}<br>`;

        getElement("records").innerHTML=str;
}          
        
        
async function Send() {
    console.log("In function Send()");
    var namefield=getElement("name")
    var name=namefield.innerHTML.trim();
    var questionfield=getElement("question")
    
    var e1 = document.getElementById("typesearch");
    console.log(e1.selectedIndex)
    console.log(e1.options)
    var typesearch = e1.options[e1.selectedIndex].value;
    console.log(typesearch);
    
    
    var e2 = document.getElementById("productsearch");
    console.log(e2.selectedIndex)
    console.log(e2.options)
    var productsearch = e2.options[e2.selectedIndex].value;
    console.log(productsearch);
    
    
    
    //var question=questionfield.innerHTML.trim();
  //  log(`Send ${name} ${question}`);
  //  console.log(question);
    
     var h1=await globaldb.put({ _id: new Date().getTime(), name:name, typesearch:typesearch, productsearch:productsearch })   
    
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
    await Peers();
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
