import React, {useContext, useEffect, useState} from "react";

import QuizService from "../services/quiz.service";
import {AuthContext} from "../context/AuthContext";
import AttemptElement from "./partial/attempt-list-element.component";
import PageContainer from "./utils/page-container.component";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {globalStyles} from "../App";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TableBody from "@material-ui/core/TableBody";






export default function QuizInfo (props){

  const global = globalStyles()

  useContext(AuthContext);

  const emptyQuiz = {
    name: "Ładowanie...",
    questions: [],
    creationDate: Date.now().toLocaleString(),
  }

  const quizId = props.match.params.id;
  const [quiz, setQuiz] = useState(emptyQuiz);
  const [attempts, setAttempts] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({})

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
      let bodyJson  = await res.json();
      if (bodyJson.message){
        setMessage(bodyJson.message)
      }
    }
  }

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL',options);
  }


  useEffect(() => {
    const getQuizData = async () => {
      if(!loading) setLoading(true);
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
      setLoading(false);
    };
    const getQuizAttempts = async () => {
      if(!loading) setLoading(true);
      const res = await QuizService.getAttemptList()
      if(res.ok){
        let attempts = await res.json();
        attempts = attempts.filter(el => el.quiz === quizId).map(summarizeAttempts)
        const unsolved = attempts.filter(a => !a.finished)
        const solved = attempts.filter(a => a.finished);
        unsolved.sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime))
        solved.sort((a, b) => Date.parse(b.startTime) - Date.parse(a.startTime))
        setAttempts(unsolved.concat(solved));
      }
      else {
        const status = res.status
        let bodyJson  = await res.json()
        if (bodyJson.message){
          setMessage(bodyJson.message)
        }
      }
      setLoading(false)
    }
    getQuizData();
  }, [])

  useEffect(() => {setSettings(QuizService.getSettings())}, [])
  useEffect(() => {if(settings) QuizService.setSettings(settings)}, [settings])


  const  getFinished = (attempts) => Array.isArray(attempts) ? attempts.filter(a => a.finished) : []
  const  countMedianPercents = (attempts, total) =>
    Array.isArray(attempts) && attempts.length > 0 && total ? (attempts.reduce(
      (acc, item) => acc + item.points, 0)*100/(total*attempts.length))
      .toFixed(1) +'%'
      : "brak"

  return (
      <PageContainer title={quiz.name} loading={loading}>
        {message && <div>{message}</div>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box p={2}>
              <Typography variant="h6" >Informacje</Typography>
            </Box>
            <Divider/>
            <Table>
              <TableBody>
              <TableRow>
                <TableCell className={global.th}>Liczba pytań</TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={global.th}>Data utworzenia</TableCell>
                <TableCell>{formatDate(quiz.creationDate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={global.th}>Ukończonych podejść</TableCell>
                <TableCell>{getFinished(attempts).length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={global.th}>Średni wynik</TableCell>
                <TableCell>{countMedianPercents(getFinished(attempts), quiz.questions.length)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={global.th}>Średnia z 3 ostatnich</TableCell>
                <TableCell>{countMedianPercents(getFinished(attempts).slice(0,3), quiz.questions.length)}</TableCell>
              </TableRow>
              </TableBody>
            </Table>
            <Box my={2} mx={4}><Button fullWidth color="primary" variant="contained" onClick={startQuiz}> Rozpocznij </Button></Box>

            <Divider/>
            <Box mt={2}>
              <Typography variant="h6" >Ustawienia</Typography>
            </Box>
            <List>
              <ListItem key='shuffle'>
                <ListItemIcon>
                  <Checkbox
                    checked={!!settings.shuffle}
                    onChange={(e) => {
                      setSettings({...settings, shuffle: e.target.checked})
                    }}
                  />
                </ListItemIcon>
                <ListItemText>Losowa kolejność odpowiedzi</ListItemText>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box p={2}>
              <Typography variant="h6" >Podejścia</Typography>
            </Box>
            <Divider/>
            <List>
            {attempts &&
            attempts.slice(0,10).map(attempt => <AttemptElement key={attempt._id} attempt={attempt} totalQuestions={quiz.questions.length}/>)}
            </List>
          </Grid>
        </Grid>



    </PageContainer>);
}
