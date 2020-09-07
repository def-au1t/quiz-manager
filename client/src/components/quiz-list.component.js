import React, {useEffect, useState} from "react";

import QuizService from "../services/quiz.service";
import QuizElement from "./partial/quiz-list-element.component";
import PageContainer from "./utils/page-container.component";
import List from "@material-ui/core/List";
import {globalStyles} from "../App"
import {makeStyles} from "@material-ui/core/styles";
import {Link as RouterLink} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  quizList: {
    maxWidth: '400px'
  }
}));


export default function QuizList () {

  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const global = globalStyles()
  const classes = useStyles()

  const getUserQuizList = () => {
    QuizService.getQuizList()
      .then(res => res.json())
      .then(
        result => {
          setQuizList(result);
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        }
  )}

  const deleteQuiz = (id) => {
    QuizService.deleteQuiz(id)
      .then(res => res.json())
      .then(
        result => {
          setLoading(true);
          getUserQuizList()
        },
        err => {
          setError(err);
        }
      )}

  useEffect(getUserQuizList, [])


    return (
      <PageContainer title="Moje quizy" loading={loading}>
        <List className={global.list+' '+classes.quizList}>
        {quizList &&
        Array.from(quizList)
          .sort((a, b) =>  a.name.localeCompare(b.name) )
          .map(quiz =>
            <QuizElement key={quiz.id} del={deleteQuiz} quiz={quiz}/>)}
        </List>
        <Box my={2}>
        <Button variant="contained" color="primary" component={RouterLink} to={'/new'}> Utwórz nowy quiz</Button>
        </Box>
      </PageContainer>
    );
}
