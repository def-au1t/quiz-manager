import React, {Component, useState} from "react";
import Button from "@material-ui/core/Button";
import {convertPDSToJson} from "../utils/quizConverter";
import QuizService from "../services/quiz.service";

export default function NewQuizForm (props) {

  const [quizContent, setQuizContent] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [message, setMessage] = useState(null);

  const contentChanged = (e) => {
    setQuizContent(e.target.value);
  }
  const titleChanged = (e) => {
    setQuizTitle(e.target.value);
  }

  const createNewQuiz = () => {
    if(!quizContent && !quizTitle) return;
    let jsonQuiz = {};
    jsonQuiz.name = quizTitle
    jsonQuiz.questions = convertPDSToJson(quizContent);
    console.log(jsonQuiz)
    QuizService.createQuizJson(jsonQuiz)
      .then(res => res.json())
      .then(
        result => {
          setMessage(result.message);
        },
        error => {
          setMessage(error.message);
        })
  }

  return(
    <>
      {message && <div>{message}</div>}
      <div>Tytuł:<input type="text" onChange={titleChanged}/></div>
      <div>Treść:<textarea onChange={contentChanged}/></div>
      <br/>
      <Button onClick={createNewQuiz}>Utwórz nowy quiz</Button>
    </>
  )
}
