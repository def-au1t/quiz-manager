import React from "react";
import {Link as RouterLink} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {BallotOutlined, Delete} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";


export default function QuizElement({quiz, del}) {
    return (
      <ListItem button component={RouterLink} to={"/quiz/"+quiz.id}>
        <ListItemIcon><BallotOutlined fontSize="large"/></ListItemIcon>
          <ListItemText primary={quiz.name} secondary={"Liczba pytań: "+ quiz.numQuestions}/>
          <ListItemSecondaryAction onClick={() => del(quiz.id)}>
            <IconButton>
              <Delete/>
            </IconButton>
          </ListItemSecondaryAction>
      </ListItem>

    );
}
