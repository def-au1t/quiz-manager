import React, {useEffect, useState} from "react";

import QuizService from "../services/quiz.service";
import PageContainer from "./utils/page-container.component";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {globalStyles} from "../App";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import TableBody from "@material-ui/core/TableBody";
import {Link} from "react-router-dom";



export default function QuizAttempt (props) {

  const [quiz, setQuiz] = useState(undefined)
  const [attempt, setAttempt] = useState(undefined)
  const [question, setQuestion] = useState(undefined)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({})

  const [correctAnswers, setCorrectAnswers] = useState(undefined) // Returned from server
  const [stats, setStats] = useState({
    questionsCount: 0,
    questionsAnswered: 0,
    questionsCorrect: 0
  })

  const [answering, setAnswering] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const global = globalStyles()

  function updateStats(){
    if(!attempt || !quiz) return;
    const questionsAnswered = new Set(attempt.answers.map(question => question._id)).size;
    const questionsCount = quiz.questions.length;
    const questionsCorrect = attempt.answers.filter(a => a.points > 0).length;
    setStats({
      questionsCount,
      questionsAnswered,
      questionsCorrect
    })
  }

  function getFirstRandomQuestion(){
    if(!question) getRandomQuestion();
  }

  function getRandomQuestion() {
    if(!quiz || !attempt) return
    let questionsAvailable = []
    const answered = new Set(attempt.answers.map(question => question.question))
    for(let question of quiz.questions){
      if(!answered.has(question._id)){
        questionsAvailable.push(question)
      }
    }
    if(!questionsAvailable || questionsAvailable.length < 1){
      setIsEnd(true);
      setLoading(false);
      finishQuiz()
      setQuestion(null);
      return;
    }
    let randomQuestion = questionsAvailable[Math.floor(Math.random() * questionsAvailable.length)]
    randomQuestion.answers = getArrayOrder(randomQuestion.answers);
    setQuestion(randomQuestion);
    setLoading(false);
    if(randomQuestion){
      setAnswers(randomQuestion.answers.map((a) => {return {'_id': a._id, 'answer': false}}));
    }
  }

  function getQuizData(){
    if(quiz) return;
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

  function changeAnswer(answerId, newValue){
    let newAnswers = [...answers];

    let toMod = newAnswers.find((a) => {return a._id === answerId})
    if(!toMod) return;
    toMod.answer = newValue;
    setAnswers(newAnswers)
  }

  function sendAnswers(){
    QuizService.sendAnswer(quiz._id, question._id, attempt._id, answers)
      .then(res => res.json())
      .then(res => {
        setCorrectAnswers(res)
        getCurrentAttempt();
      })
      .catch(err => {
        console.log(err)
      })
  }

  function buttonAction(){
    if(answering){
      sendAnswers();
    }
    else{
      getRandomQuestion();
      setCorrectAnswers(undefined);
    }
    setAnswering(!answering)
  }

  function finishQuiz(){
    QuizService.finishAttempt(attempt._id)
      .then(res => res.json())
      .then(res => {
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getArrayOrder = (array) => {
    if(settings.shuffle){
      return shuffle(array);
    }
    else{
      return array;
    }
  }


  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  function getStatsResult(){
      if(stats.questionsAnswered > 0)
        return ((stats.questionsCorrect/stats.questionsAnswered)*100).toFixed(0)+'%'
      return 'brak'

  }

  useEffect(getCurrentAttempt, [])
  useEffect(getQuizData, [attempt])
  useEffect(getFirstRandomQuestion, [attempt, quiz])
  useEffect(updateStats, [attempt, quiz])
  useEffect(() => setSettings(QuizService.getSettings()), [])
  useEffect(() => {if(settings) QuizService.setSettings(settings)}, [settings])



  return (
    <PageContainer title={quiz ? quiz.name : "Ładowanie..."} loading={loading}>
      <Grid container>
        <Grid item xs={12} md={8}>
          { question &&
          <>
            <Box m={2} ><Typography variant="h6">{question.text.split('\n').map(i => {
              return <p key={i}>{i}</p>})}</Typography></Box>
            <Box m={2}>
            <List>
              {(question.answers).map((answer) => {

                const getColor = (id) => {
                  if(correctAnswers && !answering){
                    const answerResponse = correctAnswers.find(a => a._id === id)
                    if(!answerResponse) return 'white';
                    if(answerResponse.result === true) return "#c8e6c9"
                    else if(answerResponse.result === false) return "#ffccbc"
                  }
                  return 'white';
                }

                return(
                  // <Box background border={!answering && correctAnswers ? 5 : 0} borderColor={getColor(idx)}>
                <ListItem style={{backgroundColor: getColor(answer._id)}} key={answer._id} button onClick={() => changeAnswer(answer._id, !(answers && answers.find(a => a._id === answer._id) && answers.find(a => a._id === answer._id).answer))}>
                  <ListItemIcon>
                    <Checkbox
                      checked={answers && answers.find(a => a._id === answer._id) && answers.find(a => a._id === answer._id).answer}
                    />
                  </ListItemIcon>
                  <ListItemText>{answer.text}</ListItemText>
                </ListItem>
                  // </Box>
                )
              })}
            </List>
            </Box>

          </>
          }

          {!isEnd &&
            <Box m={2}><Button variant="contained" onClick={buttonAction} color="primary">
              {answering ? "Odpowiedz" : "Kontynuuj"}
            </Button></Box>
          }

        </Grid>
        <Grid item xs={12} md={!isEnd ? 4 : 12}>
          <Box m={2} ><Typography variant="h6">Statystyki:</Typography></Box>
          <Box m={2}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={global.th}>Udzielono odpowiedzi:</TableCell>
                <TableCell>{stats.questionsAnswered} z {stats.questionsCount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={global.th}>Wynik:</TableCell>
                <TableCell>
                  {getStatsResult()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </Box>
        </Grid>
      </Grid>
      {isEnd &&
      <Box m={2} ><Button variant={"outlined"} component={Link} to ={'/quiz/'+quiz._id} color="primary" >
        Powrót
      </Button></Box>}
    </PageContainer>

  );
}
