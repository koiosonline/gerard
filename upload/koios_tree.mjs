 import {getElement,DomList,LinkClickButton,subscribe} from '../lib/koios_util.mjs';
 
 
 
   var ParagraphboxList = new DomList("paragraphbox")  
   
   
    //ParagraphboxList.EmptyList()
    
    var rownum=1;
    
    
    for (var i=1;i<10;i++) {
        ShowBlock(1,rownum++,`Paragraph ${i}`);
        for (var j=1;j<3;j++) {
           ShowBlock(2,rownum++,`Paragraph ${i}.${j}`);
           for (var k=1;k<3;k++) {
               ShowBlock(3,rownum++,`Paragraph ${i}.${j}.${k}`);
           }
        }
    }
     
         var target=getElement("input")    
    target.contentEditable="true"; // make div editable
    target.style.whiteSpace = "pre"; //werkt goed in combi met innerText
    
    console.log("link");
     LinkClickButton("addbutton");subscribe("addbuttonclick",Input);  
     
     
     function Input() {
         var target=getElement("input")    
         console.log(target.innerHTML);
     }    
     
     function ShowBlock(x,y,txt) {
         var pb = ParagraphboxList.AddListItem() 
         console.log(JSON.stringify(pb))
         pb.style.left= `${x*25}px`         
         getElement("paragraph",pb).innerHTML=txt;
         
     }