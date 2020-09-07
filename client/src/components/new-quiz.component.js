import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {convertPDSToJson} from "../utils/quizConverter";
import QuizService from "../services/quiz.service";
import PageContainer from "./utils/page-container.component";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Message from "./utils/message.component";

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
    if(!quizContent && !quizTitle){
      setMessage("Nie wypełniono wszystkich pól")
      return;
    };
    let jsonQuiz = {};
    jsonQuiz.name = quizTitle
    jsonQuiz.questions = convertPDSToJson(quizContent);
    QuizService.createQuizJson(jsonQuiz)
      .then(res => res.json())
      .then(
        result => {
          if(result.message === "Quiz was added successfully!"){
            setMessage(result.message);
            props.history.push('/')
          }
        },
        error => {
          setMessage(error.message);
        })
  }

  const classes = makeStyles((theme) => ({
    textArea:{
      minWidth:'50%',
      fontFamily: 'Roboto',
      borderStyle: "solid",
      borderColor: "lightgrey",
      padding: '1em',
    }
  }))();


  return(
    <>
      <PageContainer title={"Tworzenie nowego quizu"}>
      <Message msg={message} err={true}/>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField style={{minWidth: '50%'}} label="Nazwa quizu" type="text" onChange={titleChanged}/>
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize className={classes.textArea} rowsMin={15} placeholder="Zawartość quizu"  onChange={contentChanged}/>
        </Grid>
        <Grid item xs={12}>
          <Box m={2}>
            <Button fullWidth color={"primary"} variant={"contained"} onClick={createNewQuiz}>Utwórz nowy quiz</Button>
          </Box>
        </Grid>
      </Grid>

      </PageContainer>
    </>
  )
}
