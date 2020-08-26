import React, {Component, useEffect, useState} from "react";

import UserService from "../services/user.service";
import QuizService from "../services/quiz.service";
import QuizElement from "./quiz-list/quiz-list-element.component";
import {Link} from "react-router-dom";

export default function BoardUser () {

  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const getUserQuizList = () => {
    QuizService.getQuizList()
      .then(res => res.json())
      .then(
        result => {
          setQuizList(result);
          setLoading(false);
          console.log(result)
        },
        err => {
          setError(err);
          setLoading(false);
        }
  )}

  useEffect(getUserQuizList, [])


    return (
      <div>
        {(loading) ? "Ładowanie" :
      Array.from(quizList).map(quiz => <QuizElement quiz={quiz}/>)}
        <Link to={'/new'}><button>Dodaj nowy quiz</button></Link>
      </div>
    );
}
