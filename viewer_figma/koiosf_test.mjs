
import {LinkButton,sleep,subscribe,LinkToggleButton,HideButton} from '../lib/koiosf_util.mjs';
import {player,currentvidinfo,startVideo,SetVideoSeconds} from './koiosf_viewer.mjs';
import {SwitchDisplayMessageContinous,DisplayMessageContinous} from './koiosf_messages.mjs';
import {CurrentLesson,LastLesson} from './koiosf_lessons.mjs';

var fInTest;



//const wf=Webflow.require('ix2');
//const actions = wf.actions;
//const store = wf.store;
//console.log(actions);





subscribe("playerloading",  InitTest);

function InitTest() {
    var fInTest=window.location.href.includes("test");
    
    
    fInTest=false; // disable test button
    
    console.log(`fInTest=${fInTest}`);

    HideButton("test",!fInTest)
    //if (fInTest)
   // LinkToggleButton("test",false);subscribe("teston",Test);subscribe("testoff",Test);
}    

//LinkButton("test",Test);



/*
async function Test2() {
    console.log("In test2");
    console.log(wf);
    console.log(store.getState());
    //var x=actions.eventStateChanged(, )
    
    //document.dispatchEvent( new Event( 'readystatechange' ) );
    //console.log(x);
    //console.log(store.dispatch(x))

store.dispatch(actions.eventStateChanged('e-168:0', {clickCount: 1}));
store.dispatch(actions.eventStateChanged('e-169:0', {clickCount: 1}));
}
*/
 
var fSwitchTestOn=true;
var orgRelaxTime;

var s1,s2,s3,s4,s5,s6;
 
async function Test() {
    if (fSwitchTestOn) {
        //s1=subscribe('videoend',    x=> { DisplayMessageContinous(`Video #${CurrentLesson} has ended`) } );
        
        s2=subscribe('videostart',   async x=> {
            console.log("videostart event");           
            await sleep(3000);
            var CurrentPos=Math.round(player.getCurrentTime()); // has been updated in the mean time
            if (CurrentPos < currentvidinfo.duration-7) {
                DisplayMessageContinous(`Fast forward`);
                SetVideoSeconds(currentvidinfo.duration-5);
            } 
                
        } );               
        s3=subscribe('videocued', async x=> { 
            DisplayMessageContinous(`Lesson #${CurrentLesson} of ${LastLesson+1}`);
            await sleep(3000);
            startVideo();
        } );
        
        s4=subscribe('lessonsend', x=> { DisplayMessageContinous(`Lessons ended`)                    } );
        s5=subscribe('startrelax', x=> { DisplayMessageContinous(`Relax`)                    } );
        //s6=subscribe('stoprelax', x=> { DisplayMessageContinous(`Stop relax`)                    } );

        SwitchDisplayMessageContinous(true);
        DisplayMessageContinous("Testing mode");
        console.log("In test");
        
        player.setPlaybackRate(2);
        //DisplayMessageContinous("Go to beginning of video");              SetVideoSeconds(0);
        startVideo();
    }
    else {
        if (s1) s1();
        if (s2) s2();
        if (s3) s3();
        if (s4) s4();
        if (s5) s5();
        if (s6) s6();
        //  DisplayMessageContinous("Wait 50 seconds");                        await sleep(50000);
        player.setPlaybackRate(1);
        SwitchDisplayMessageContinous(false);
        //RelaxTime = orgRelaxTime;
    }
    fSwitchTestOn = !fSwitchTestOn;
}



