let form = document.querySelector("#quizeOptions");
let categoryInput = document.querySelector("#categoryOptions");
let difficultyInput= document.querySelector("#difficultyOptions");
let numberOfQuestion =document.querySelector("#qustionNumber");
let startButton = document.querySelector("#startBtn");

let questions;
let myQuestion;
let myQuiz;



startButton.addEventListener("click", async()=>{
    let category=categoryInput.value;
    let difficulty=difficultyInput.value;
    let number =numberOfQuestion.value;

    console.log(category,difficulty,number)

    myQuiz=new Quiz(category,difficulty,number);
    questions=await myQuiz.getAllQuestions();
    console.log(questions)

    myQuestion=new Question(0);
    console.log(myQuestion)
    myQuestion.displayQuestion();

    form.classList.add("d-none")



})




/********************************************* */

class Quiz{
    constructor(category,difficulty,number){
        this.category=category;
        this.difficulty=difficulty;
        this.number=number;
        this.score=0;
    }

    getApi(){
        return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
    }

    async getAllQuestions(){
        let res = await fetch(this.getApi());
        res=await res.json();
        return res.results;
    }

    showResult(){
        return `
        <div class="container px-5 ">
            <div class="bg-white text-center py-3 rounded-3">
                <p class="fs-2 fw-bold " >
                ${this.score == this.number
                    ? `Congratulations 🎉` 
                    : `your score is ${this.score} of ${this.number}`}
                </p>
                <button class="btn btn-primary rounded-pill again">Try Again</button>
            </div>
        </div>
        `;
    }
}


/****************************************************************/

class Question{
    constructor(index){
        this.index=index;
        this.question=questions[index].question;
        this.category=questions[index].category;
        this.difficulty=questions[index].difficulty;
        this.incorrect_answers=questions[index].incorrect_answers;
        this.correct_answer=questions[index].correct_answer;
        this.myAllAnswers=this.getAllAnswers();
        this.isAnswered=false;
    }

    getAllAnswers(){
        let allAnswers=[...this.incorrect_answers,this.correct_answer];
        allAnswers.sort();
        return allAnswers;
    }

    displayQuestion(){
        let cartona=`
        <div class="py-3  bg-white rounded-3">
            <div class="d-flex justify-content-between py-3">
            <span class="ms-4">${this.category}</span>
            <span class="me-4"> ${this.index+1} of ${questions.length}</span>
        </div>
        <h2 class="mx-2 text-center pb-3">${this.question}</h2>
        <ul class="list-unstyled my-answers d-flex justify-content-center flex-wrap gap-2">
            ${this.myAllAnswers.map((answers)=>`<li>${answers}</li>`).toString().replaceAll(",","")}
        </ul>

        <div class="text-center pt-3">
            <span class="score">score : ${myQuiz.score}</span>
        </div>
        </div>
        `;
        document.querySelector(".my-question").innerHTML=cartona;

        let answerLi = document.querySelectorAll(".my-answers li");
        answerLi.forEach((li)=>{
            li.addEventListener("click",()=>{
                console.log(this.checkAnswer(li));
                this.nextQuestion()
            })
        })
    }

    checkAnswer(choice){
        if(!this.isAnswered){
            this.isAnswered=true;
            if(choice.innerHTML==this.correct_answer){
                myQuiz.score++;
                choice.classList.add("correct","animate__animated","animate__pulse")
            }
            else{
                choice.classList.add("wrong","animate__animated","animate__shakeX")
            }
        }
    }

    nextQuestion(){
        this.index++;
        setTimeout(()=>{
            if(this.index<questions.length){
                let myNewQuestion=new Question(this.index);
                myNewQuestion.displayQuestion();
            }
            else{
                let result= myQuiz.showResult();
                document.querySelector(".my-question").innerHTML=result;
                document.querySelector(".again").addEventListener("click",()=>{
                    document.location.reload();
                })
            }

        },2000)
    
    }

    
}