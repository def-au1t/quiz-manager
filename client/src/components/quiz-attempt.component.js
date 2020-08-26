import React, {Component, useEffect, useState} from "react";

import QuizService from "../services/quiz.service";
import QuizElement from "./quiz-list/quiz-list-element.component";
import Container from "@material-ui/core/Container";

function Answer ({answer, idx, update}) {

  return(
    <div>
    <input type="checkbox" id={'answer-'+idx} onClick={(e) => update(idx, e.target.checked)}/>
      <label htmlFor={'answer-'+idx}>{answer} </label>
    </div>
  )
}

export default function QuizAttempt (props) {

  const [quiz, setQuiz] = useState(undefined)
  const [attempt, setAttempt] = useState(undefined)
  const [question, setQuestion] = useState(undefined)
  const [answers, setAnswers] = useState([])

  const [correctAnswers, setCorrectAnswers] = useState(undefined) // Returned from server
  const [stats, setStats] = useState({
    questionsCount: undefined,
    questionsAnswered: undefined,
    questionsCorrect: undefined
  })

  const [answering, setAnswering] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  function updateStats(){
    if(!attempt || !quiz) return;
    console.log("update stats")
    const questionsAnswered = new Set(attempt.answers.map(question => question._id)).size;
    const questionsCount = quiz.questions.length;
    const questionsCorrect = attempt.answers.filter(a => a.points > 0).length;
    setStats({
      questionsCount,
      questionsAnswered,
      questionsCorrect
    })
  }

  function getRandomQuestion() {
    if(!quiz || !attempt) return
    let questionsAvailable = []
    const answered = new Set(attempt.answers.map(question => question.question))
    console.log(quiz.questions)
    for(let question of quiz.questions){
      if(!answered.has(question._id)){
        questionsAvailable.push(question)
      }
    }
    console.log("Q:")
    console.log(questionsAvailable)
    if(!questionsAvailable || questionsAvailable.length < 1){
      console.log("Brak pytań")
      setIsEnd(true);
      finishQuiz()
      setQuestion(null);
      return;
    }
    let randomQuestion = questionsAvailable[Math.floor(Math.random() * questionsAvailable.length)]
    setQuestion(randomQuestion);
    console.log(randomQuestion)
    if(randomQuestion) setAnswers(new Array(randomQuestion.answers.length).fill(false));
  }

  function getQuizData(){
    if(!attempt) return;
    if(!attempt.quiz) return;
    QuizService.getQuizData(attempt.quiz)
      .then(res => res.json())
      .then(res => {
        setQuiz(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function getCurrentAttempt () {
    const attemptId = props.match.params.id
    QuizService.getAttempt(attemptId)
      .then(res => res.json())
      .then(res => {
        setAttempt(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function changeAnswer(answerIdx, newValue){
    console.log(newValue + ":"  + answerIdx)
    let newAnswers = answers;
    newAnswers[answerIdx] = newValue;
    setAnswers(newAnswers)
    console.log(newAnswers)
  }

  function sendAnswers(){
    QuizService.sendAnswer(quiz._id, question._id, attempt._id, answers)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setCorrectAnswers(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  function buttonAction(){
    if(answering){
      sendAnswers();
    }
    setAnswering(!answering)
  }

  function finishQuiz(){
    QuizService.finishAttempt(attempt._id)
      .then(res => res.json())
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(getCurrentAttempt, [correctAnswers])
  useEffect(getQuizData, [attempt])
  useEffect(getRandomQuestion, [attempt, quiz])
  useEffect(updateStats, [attempt, quiz])



  return (
    <Container>
      Podejście {props.match.params.id}
      {attempt &&
      <div>{attempt.startTime}</div>
      }
      <div>Odpowiedziano: {stats.questionsAnswered}</div>
      <div>Poprawnie: {stats.questionsCorrect}</div>
      <div>Łącznie: {stats.questionsCount}</div>
      {answering && question &&
        <>
        <div>{question.text}</div>
        {question.answers.map((answer, idx) => <Answer idx={idx} answer={answer} update={changeAnswer} key={idx}/>)}
        </>
      }
      {!answering && correctAnswers &&
      <div>{correctAnswers.toString()}</div>
      }

      {}


      {!isEnd && <button onClick={buttonAction} >{answering ? "Sprawdź" : "Następne"} </button> }
      {/*<button onClick={() => console.log(attempt)} >Attempt status </button>*/}
      {/*<button onClick={() => alert(isEnd)} >Answers input </button>*/}
    </Container>
  );
}
