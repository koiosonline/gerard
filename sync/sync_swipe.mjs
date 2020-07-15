
 import {getElement,loadScriptAsync,ForAllElements,setElementVal,getElementVal} from '../lib/koiosf_util.mjs';

/*
    <style>
        html,
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        #board {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            background-color: rgb(245, 247, 250);
        }

        .card {
            width: 320px;
            height: 320px;
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 1%;
            box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
            background-color: lightgray;
            transform: translateX(-50%) translateY(-50%) scale(0.95);
        }

    <div id="board"></div>
    
*/    

async function asyncloaded() {
     console.log(`In asyncloaded of script: ${import.meta.url}`);
    

    await loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js")
    console.log("done");
}


document.addEventListener("DOMContentLoaded", asyncloaded)



export var carrouselwait = function(board){
  return new Promise((resolve, reject) => {
    

    
class Carousel {   // based on https://github.com/simonepm/likecarousel
            constructor(element) {
                this.counter=0
                this.board = element                
                this.handle()                 // handle gestures
            }
            handle() {
               // console.log("In handle")
                this.cards = this.board.querySelectorAll('.card')  // list all cards
              //  console.log(this.cards);                
                this.topCard = this.cards[this.cards.length - 1]                 // get top card
                this.nextCard = this.cards[this.cards.length - 2]                 // get next card                
                if (this.cards.length > 0) {  // if at least one card is present                   
                    this.topCard.style.transform =' rotate(0deg) rotateY(0deg) scale(1)' // set default top card position and scale
                    if (this.hammer) this.hammer.destroy() // destroy previous Hammer instance, if present
                    this.hammer = new Hammer(this.topCard)                       // listen for tap and pan gestures on top card
                    this.hammer.add(new Hammer.Tap())
                    this.hammer.add(new Hammer.Pan({position: Hammer.position_ALL,threshold: 0}))
                    this.hammer.on('tap', (e) => { this.onTap(e)}) // pass events data to custom callbacks
                    this.hammer.on('pan', (e) => { this.onPan(e)})
                }
                else
                    resolve(); // no more cards ==> ready
            }
            onTap(e) {            
                let propX = (e.center.x - e.target.getBoundingClientRect().left) / e.target.clientWidth    // get finger position on top card
                let rotateY = 15 * (propX < 0.05 ? -1 : 1)  // get rotation degrees around Y axis (+/- 15) based on finger position
                this.topCard.style.transition = 'transform 100ms ease-out'                   // enable transform transition
                this.topCard.style.transform ='  rotate(0deg) rotateY(' + rotateY + 'deg) scale(1)'                 // apply rotation around Y axis
                setTimeout(() => {this.topCard.style.transform ='  rotate(0deg) rotateY(0deg) scale(1)'}, 100)  // // wait for transition end reset transform properties
            }
            onPan(e) {
                if (!this.isPanning) {
                    this.isPanning = true                   
                    this.topCard.style.transition = null  // remove transition properties
                    if (this.nextCard) this.nextCard.style.transition = null                   
                    let style = window.getComputedStyle(this.topCard)  // get top card coordinates in pixels
                    let mx = style.transform.match(/^matrix\((.+)\)$/)
                    this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
                    this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0                   
                    let bounds = this.topCard.getBoundingClientRect() // get top card bounds                   
                    this.isDraggingFrom =(e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1  // get finger position on top card, top (1) or bottom (-1)
                }
                let posX = e.deltaX + this.startPosX  // get new coordinates
                let posY = e.deltaY + this.startPosY
                let propX = e.deltaX / this.board.clientWidth                  // get ratio between swiped pixels and the axes
                let propY = e.deltaY / this.board.clientHeight
                let dirX = e.deltaX < 0 ? -1 : 1                    // get swipe direction, left (-1) or right (1)
                let deg = this.isDraggingFrom * dirX * Math.abs(propX) * 45                  // get degrees of rotation, between 0 and +/- 45
                let scale = (95 + (5 * Math.abs(propX))) / 100                   // get scale ratio, between .95 and 1               
                this.topCard.style.transform ='translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)' // move and rotate top card                
                if (this.nextCard) this.nextCard.style.transform = '  rotate(0deg) rotateY(0deg) scale(' + scale + ')' // scale up next card

                if (e.isFinal) {
                    this.isPanning = false
                    let successful = false                   
                    this.topCard.style.transition = 'transform 200ms ease-out'  // set back transition properties
                    if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'                    
                    if (propX > 0.25 && e.direction == Hammer.DIRECTION_RIGHT) {   // check threshold and movement direction
                        successful = true  
                        posX = this.board.clientWidth // get right border position                        
                    } else if (propX < -0.25 && e.direction == Hammer.DIRECTION_LEFT) {
                        successful = true 
                        posX = -(this.board.clientWidth + this.topCard.clientWidth) // get left border position                        
                    } else if (propY < -0.25 && e.direction == Hammer.DIRECTION_UP) {
                        successful = true                        
                        posY = -(this.board.clientHeight + this.topCard.clientHeight) // get top border position
                    }
                    if (successful) {     
console.log(`successful ${e.direction==Hammer.DIRECTION_LEFT?"left":"right"}`)
                        this.topCard.style.transform ='translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg)' // throw card in the chosen direction                       
                        setTimeout(() => {   // wait transition end
                            // remove swiped card
                            this.board.removeChild(this.topCard)
                            // add new card
                            this.handle()
                        }, 200)
                    } else {
                        this.topCard.style.transform ='  rotate(0deg) rotateY(0deg) scale(1)' // reset cards position and size
                        if (this.nextCard) this.nextCard.style.transform = '  rotate(0deg) rotateY(0deg) scale(0.95)'
                    }
                }
            }
            
            
        }
        
    let carousel = new Carousel(board);
});
}




