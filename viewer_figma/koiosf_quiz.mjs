//console.log(`In ${window.location.href} starting script: ${import.meta.url}`);


import {loadScriptAsync,DomList,LinkToggleButton,subscribe,getElement,MonitorVisible,ForAllElements,setElementVal,publish,GetJson,LinkClickButton,LinkVisible,GetCSVIPFS} from '../lib/koiosf_util.mjs';
import {GetCourseInfo,GlobalCourseList} from './koiosf_course.mjs';
import {GlobalLessonList} from './koiosf_lessons.mjs';





class QuizList {    
    constructor (source) {
        this.QuizListPromise=GetCSVIPFS(source)
    }
 
    async GetList() {
        return await this.QuizListPromise;
    }
    
    async SetMatch(match) {    
        if (match.includes("-"))
            match=match.split("-")[1] // take the part after the -
        
        var List=await this.GetList();
        
        console.log(`In GetMatchingQuestions match=${match}`);
        this.subset=[]
        for (var i=0;i<List.length;i++) {
            var line=List[i]
            if (line[0]===match) 
               this.subset.push(line)
        } 
        this.start=-1
        return this.subset.length;
    }    
    
    GetCurrent() {
       if (this.start >= this.subset.length) 
           return undefined;       
       return this.subset[this.start]
    }
    
    GetNext() {
       this.start++
       return this.GetCurrent()
    }
    
    async GetCurrentCourseData() {
    
    }
    
    
    UpdateMyList(courseid,fremove) {
    
        
    }
    
    SetCurrentCourse(courseid) {
    
    }

    GetCurrentCourse() {
    
    }
    LoadCurrentCourse() {
    
    }

}    

subscribe("setcurrentcourse",NewCourseSelected)


export var GlobalQuizList;

async function NewCourseSelected() {   
    console.log("In NewCourseSelected");
    var quizcid=await GetCourseInfo("quizinfo") 
    console.log("quizcid");
    console.log(quizcid);   
    if (quizcid) {    
        GlobalQuizList=new QuizList(quizcid)   
 
        var List=await GlobalQuizList.GetList();
        console.log(List);
    }
    
    
    
    
}    

LinkClickButton("checkanswer",CheckAnwer)
async function CheckAnwer() {
    console.log("In CheckAnwer");
	setElementVal("quizresult","");
    
    var answers=[]
    answers.push(GetToggleState(getElement("answera","scr_quiz"),"displayactive"))
    answers.push(GetToggleState(getElement("answerb","scr_quiz"),"displayactive"))
    answers.push(GetToggleState(getElement("answerc","scr_quiz"),"displayactive"))
    answers.push(GetToggleState(getElement("answerd","scr_quiz"),"displayactive"))
    
    console.log(answers);
    
    var btnlist=[];
    
    btnlist.push(getElement("answera","scr_quiz"))
    btnlist.push(getElement("answerb","scr_quiz"))
    btnlist.push(getElement("answerd","scr_quiz"))  // note order, d after b
    btnlist.push(getElement("answerc","scr_quiz"))
    
    
    for (var i=0;i<10;i++) {    
        btnlist[(i )  % btnlist.length].dispatchEvent(new CustomEvent("displaydisabled"));
        btnlist[(i+1) % btnlist.length].dispatchEvent(new CustomEvent("displaydefault"));
        btnlist[(i+2) % btnlist.length].dispatchEvent(new CustomEvent("displayactive"));
        //window.getComputedStyle(btnlist[nr])
        await sleep(50);
    }
    
    var question=GlobalQuizList.GetCurrent();
    console.log(`In CheckAnwer`);
    console.log(question[2]); // that's the column with the answers
    
    
    var btnlist2=[];
    
    btnlist2.push(getElement("answera","scr_quiz"))
    btnlist2.push(getElement("answerb","scr_quiz"))    
    btnlist2.push(getElement("answerc","scr_quiz"))
    btnlist2.push(getElement("answerd","scr_quiz"))  
    
    var countok=0
    for (var i=0;i<btnlist2.length;i++) {    
        var letter=String.fromCharCode(65+i);
		
        var answerok=question[2].includes(letter) // check answer column
		
		
		
        btnlist2[i].dispatchEvent(new CustomEvent(answerok?"displayactive":"displaydefault"));
        
        var rightanswer=(answers[i] == answerok)
		
		if (rightanswer)
			 countok++
        
		console.log(`answer: ${letter} should be selected:${answerok} done right: ${rightanswer} countok:${countok}`)
		
        //btnlist2[i].style.borderColor=rightanswer?"green":"red";
        //btnlist2[i].style.borderStyle="solid";        
        btnlist2[i].style.outline=(rightanswer?"#4DFFC1 solid 5px":"#FF79A8 dashed 5px")
        btnlist2[i].style.outlineOffset="2px"
        //console.log(btnlist2[i].style);
    }
    
        
       var str=(countok==4)?"Well done":`${countok*25}% right, try again`
	   console.log(str)
	   setElementVal("quizresult",str);
    
    
}    


subscribe("loadvideo",NewVideoSelected);
LinkVisible("scr_quiz" ,ScrQuizMadeVisible)   



async function ScrQuizMadeVisible() {
    console.log("In ScrQuizMadeVisible");
    setElementVal("quizresult","");
    
    console.log(`In ScrQuizMadeVisible`);
    console.log(question);
    
    getElement("answera","scr_quiz").dispatchEvent(new CustomEvent("displaydefault"));
    getElement("answerb","scr_quiz").dispatchEvent(new CustomEvent("displaydefault"));
    getElement("answerc","scr_quiz").dispatchEvent(new CustomEvent("displaydefault"));
    getElement("answerd","scr_quiz").dispatchEvent(new CustomEvent("displaydefault"));
    
    getElement("answera","scr_quiz").style.borderColor=""
    getElement("answerb","scr_quiz").style.borderColor=""
    getElement("answerc","scr_quiz").style.borderColor=""
    getElement("answerd","scr_quiz").style.borderColor=""
    getElement("answera","scr_quiz").style.borderStyle=""
    getElement("answerb","scr_quiz").style.borderStyle=""
    getElement("answerc","scr_quiz").style.borderStyle=""
    getElement("answerd","scr_quiz").style.borderStyle=""
    
    
    if (!GlobalQuizList) return;
    
    var question=GlobalQuizList.GetNext();
    
    if (!question) return;
    setElementVal("question",question[1],"scr_quiz")
    setElementVal("__label",question[3],"answera","scr_quiz")
    setElementVal("__label",question[4],"answerb","scr_quiz")
    setElementVal("__label",question[5],"answerc","scr_quiz")
    setElementVal("__label",question[6],"answerd","scr_quiz")

}

async function NewVideoSelected() {   
    if (GlobalQuizList) {
        var vidinfo=await GlobalLessonList.GetCurrentLessonData()    
        var match=(vidinfo.title).split(" ")[0]
        var nrquestions=await GlobalQuizList.SetMatch(match);    
    }
    console.log(`In NewVideoSelected match=${match} nrquestions:${nrquestions}`);
    
    
     var btn=getElement("btnquiz","scr_viewer")
     
     console.log(btn);
     btn.dispatchEvent(new CustomEvent((nrquestions >0 )?"show":"hide"));
    
}

    

 
 