// <script src="https://gpersoon.com/koios/test/koios_lessons.js"></script>
function GetIframe(id) {
   console.log(`Getting Iframe with id=${id}`); 
}    

async function asyncloaded() {  
    console.log("hi in koios lessons");
    
console.log("parent");    
console.log(window.parent); // if ( window.location == window.parent.location ) not in iframe
}
window.addEventListener('load', asyncloaded);  
console.log("start");
