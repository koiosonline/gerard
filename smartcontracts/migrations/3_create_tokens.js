var KOIOSNFT = artifacts.require("KOIOSNFT");
const fetch = require('node-fetch');
const fs2 = require('fs');
const token = fs2.readFileSync(".figma").toString().trim();
const documentid = fs2.readFileSync(".figmadocument").toString().trim();

//var KoiosImage  ="QmPWgVJrKqbt86jMfYxCG4yTLmcoQzvbdstLzA3Lben2bt"
//var AdminImage  ="QmdUGX6YaXa5x2k9HSjhhNyvgWngt4B683QyaraUzH1F3o"
//var TeacherImage="QmPZKjkNxMWE1KSsXb3RWSQWWUsPWh261KpAj3F9C9QW7o"


//var GiveKeyImage="QmeyHqMWYb83DLNFVzAxtnphM2iwu9YZ8pav8x2DX1fhvt"



var toarray=[
            "0x8e2A89fF2F45ed7f8C8506f846200D671e2f176f", // gerard
            "0xEA9a7c7cD8d4Dc3acc6f0AaEc1506C8D6041a1c5", // gerard canary
            "0x336101f6685906fFe861ac519A98A6736d2D5b37", // phil
            "0xe88cAc4e10C4D316E0d52B82dd54f26ade3f0Bb2", // corwin
            "0x4Ad2eaE4137e11EB3834840f1DC38F5f0fa181c3" // mathieu        
            ]


module.exports = async function(deployer) {
    const IpfsHttpClient = require('ipfs-http-client')
    var ipfs = await IpfsHttpClient(/*"http://diskstation:5002"); */ 'https://ipfs.infura.io:5001'); //for infura node
	
	var url=`https://api.figma.com/v1/files/${documentid}`  // to export the vectors: ?geometry=paths    
    var documentpart=(await FigmaApiGet(url,token)).document;
	
	
	cidKoios=await MakeImage(ipfs, "Koioslogo",documentpart); 	
	cidAdmin=await MakeImage(ipfs, "Admin",documentpart); 	
	cidKeyGiver=await MakeImage(ipfs, "Key-giver",documentpart); 	
	
	
	
    KOIOSNFTContract = await KOIOSNFT.deployed()
    console.log(`KOIOSNFTContract is at address:  ${KOIOSNFTContract.address}`);
    console.log(`totalSupply is now:  ${await KOIOSNFTContract.totalSupply()}`);
    var managerid=await CreateNewBadge(ipfs,"Admin",               "General administrator",        cidAdmin,0,false,false,false);      
    await CreateNewBadge(ipfs,"Koios",               "Info for the contract",                      cidKoios,managerid,false,false,false);    
    var coursecreatorid=await CreateNewBadge(ipfs,"coursecreator",       "Creat",                  cidKeyGiver,managerid,false,false,false);     
    
    var coursesdata=await fetch("https://gpersoon.com/koios/gerard/viewer_figma/courseinfo.json");
    var courses=await coursesdata.json()
    //console.log(courses);

    for (const courseid in courses) {
      //console.log(`Id:${courseid}`);
      var currentcourse=courses[courseid];
      //console.log(currentcourse)      
      //var cidimage=""
      //if (currentcourse.image) {
          //var imagedata=await fetch(currentcourse.image);
          //var imagebin=await imagedata.buffer()
          //var cidimage =  (await ipfs.add(imagebin)).path;
          //console.log(cidimage)
      //}
	  teacherid=undefined;
      cidTeacher=await MakeImage(ipfs, "Teacher"+"-"+courseid,documentpart); 
	  if (cidTeacher) var teacherid=await CreateNewBadge(ipfs, "teacher of "+currentcourse.courselevel, currentcourse.description,cidTeacher,coursecreatorid,false,false,false);
	  
	  if (!teacherid) continue;
	  
	  cidStudent=await MakeImage(ipfs, "Student"+"-"+courseid,documentpart); 
	  if (cidStudent) var studentid=await CreateNewBadge(ipfs, "Student of "+currentcourse.courselevel, currentcourse.description,cidStudent,teacherid,false,false,false);

	  cidNetworked=await MakeImage(ipfs, "Networked"+"-"+courseid,documentpart); 
	  if (cidNetworked) await CreateNewBadge(ipfs, "Networked in "+currentcourse.courselevel, currentcourse.description,cidNetworked,teacherid,true,true,false);
	  
	  cidNotestaken=await MakeImage(ipfs, "Notestaken"+"-"+courseid,documentpart); 
	  if (cidNotestaken) await CreateNewBadge(ipfs, "Notes taken in "+currentcourse.courselevel, currentcourse.description,cidNotestaken,teacherid,false,true,false);
	  	  
	  cidQuestionsasked=await MakeImage(ipfs, "Questionsasked"+"-"+courseid,documentpart); 
	  if (cidQuestionsasked) await CreateNewBadge(ipfs, "Questions asked in "+currentcourse.courselevel, currentcourse.description,cidQuestionsasked,teacherid,false,true,false);
	  
	  cidCoursecompleted=await MakeImage(ipfs, "Course completed"+"-"+courseid,documentpart); 
	  if (cidCoursecompleted) await CreateNewBadge(ipfs, "Course completed of "+currentcourse.courselevel, currentcourse.description,cidCoursecompleted,teacherid,false,true,false);
	   
	  cidKnowledgetransfered=await MakeImage(ipfs, "Knowledgetransfered"+"-"+courseid,documentpart); 
	  if (cidKnowledgetransfered) await CreateNewBadge(ipfs, "Knowledge transfered in "+currentcourse.courselevel, currentcourse.description,cidKnowledgetransfered,teacherid,false,true,false);
	
      cidVideowatched=await MakeImage(ipfs, "Videowatched"+"-"+courseid,documentpart); 
	  if (cidVideowatched) await CreateNewBadge(ipfs, "Video watched of "+currentcourse.courselevel, currentcourse.description,cidVideowatched,teacherid,false,true,false);
		
      
    }
    console.log(`totalSupply is now:  ${await KOIOSNFTContract.totalSupply()}`);
};

/*
var str=`
{
    "name": "${name}",
    "description": "t${id} m${managerid} sm${SelfMint?"1":"0"} sb${SelfBurn?"1":"0"} at${AllowTransfer?"1":"0"}",
    "image": "${image?"ipfs://ipfs/"+image:""}"
}
`   
    const cid = (await ipfs.add(str)).path;    
*/


async function CreateNewBadge(ipfs, name,desc,cid,managerid,SelfMint,SelfBurn, AllowTransfer) {
    
    var result=await KOIOSNFTContract.CreateNewBadge(name,"",managerid,SelfMint,SelfBurn, AllowTransfer );
    var id=parseInt(result.logs[1].args[0].toString())
    await KOIOSNFTContract.UpdateBadge(id,name,cid,managerid,SelfMint,SelfBurn, AllowTransfer);
    console.log(`Adding Badge ${name} cid=${cid}  templateid=${id} managerid=${managerid}`) // image=${image}
    return id;
}




async function FigmaApiGetImageSrc(url,token) {
        var obj=await FigmaApiGet(url,token); 
        var keys = Object.keys(obj.images);
        var key=keys[0];
        var str=obj.images[key];               
        var buffer=await FigmaGetImage(str)        
        return buffer;
}
async function FigmaGetImage(url) {
	//console.log(url)
	var p1=await fetch(url)
	var buffer=await (p1).buffer()
	return buffer;    
}   



async function FigmaApiGet(url,token) { 
    var x=await fetch(url, { headers: {'X-Figma-Token': token } } );
    return await x.json()    
}

function FindObject(objname,figdata) {
//console.log(figdata);

    var firstpart = figdata.name.split(" ")[0]
	//console.log(firstpart);
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


async function MakeImage(ipfs, name,documentpart) {   
	console.log(`Find ${name} in figma`);
	var g=FindObject(name,documentpart);
	if (!g) return undefined;
	console.log(g.id);
	var imagelink = `https://api.figma.com/v1/images/${documentid}?ids=${g.id}&format=svg`       
	var buffer=await FigmaApiGetImageSrc(imagelink,token)	
	var result= await ipfs.add(buffer)
	const image =result.path;  
	//console.log(image);
	
    var str=`
{
    "name": "${name}",
    "description": "${name} token",
    "image": "${image?"ipfs://ipfs/"+image:""}"
}
`   
    const cid = (await ipfs.add(str)).path;  
	console.log(cid);
	return cid;
}
  