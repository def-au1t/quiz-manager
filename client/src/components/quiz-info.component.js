import React, {Component, useContext, useEffect, useState} from "react";

import QuizService from "../services/quiz.service";
import QuizElement from "./quiz-list/quiz-list-element.component";
import {AuthContext} from "../context/AuthContext";
import Paper from "@material-ui/core/Paper";
import {Link} from "react-router-dom";
import AttemptElement from "./partial/attempt-list-element.component";
import Container from "@material-ui/core/Container";





export default function QuizInfo (props){

  useContext(AuthContext);

  const [quizId, setQuizId] = useState(props.match.params.id);
  const [quiz, setQuiz] = useState(undefined);
  const [attempts, setAttempts] = useState(null);
  const [message, setMessage] = useState("");

  const summarizeAttempts = (attempt) => {
    if(!attempt) return {}
    let points = 0
    for (let answer of attempt.answers){
      points += answer.points;
    }
    const finished = !!attempt.endTime
    return({
      "_id": attempt._id,
      "points": points,
      "answeredCount": attempt.answers.length,
      "startTime": attempt.startTime,
      "finished": finished
    })

  }

  const startQuiz = async () => {
    let res = await QuizService.startQuiz(quizId)
    if(res.ok){
      let resJson = await res.json();
      const attemptId = resJson.attemptId;
      props.history.push("/quiz/solve/"+attemptId);
          }
    else {
      const status = res.status
      console.log(res)
      let bodyJson  = await res.json();
      if (bodyJson.message){
        setMessage(bodyJson.message)
      }
    }
  }




  useEffect(() => {
    const getQuizData = async () => {
      const res = await QuizService.getQuizData(quizId)
      if(res.ok){
        let quiz = await res.json()
        setQuiz(quiz)
        await getQuizAttempts()
      }
      else {
        const status = res.status
        let bodyJson  = await res.json()
        if (bodyJson.message){
          setMessage(bodyJson.message)
        }
      }
    };
    const getQuizAttempts = async () => {
      const res = await QuizService.getAttemptList()
      if(res.ok){
        let attempts = await res.json();
        attempts = attempts.filter(el => el.quiz === quizId).map(summarizeAttempts)
        setAttempts(attempts);
      }
      else {
        const status = res.status
        let bodyJson  = await res.json()
        if (bodyJson.message){
          setMessage(bodyJson.message)
        }
      }
    }
    getQuizData();
  }, [])

    return (
      <Container>
        {message && <div>{message}</div>}
        {quiz &&
        <Paper>
          <div>Nazwa: {quiz.name}</div>
          <div>Liczba pytań: {quiz.questions.length}</div>
          <div>Data utworzenia: {quiz.creationDate}</div>
          <button onClick={startQuiz}> Rozpocznij </button>
        </Paper>
        }
        {attempts &&
          Array.from(attempts).map(attempt => <AttemptElement attempt={attempt} totalQuestions={quiz.questions.length}/>)}
        {/*}*/}

    </Container>);
}
