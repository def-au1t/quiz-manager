import React from "react";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
// import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric' };
  return new Date(dateString).toLocaleDateString('pl-PL',options);
}


export default function AttemptElement({attempt, totalQuestions}) {


  const getPrimary = () => {
      if(attempt && attempt.finished){
        return formatDate(attempt.startTime);
      }
      else {
        return formatDate(attempt.startTime);
      }
  }

  const getSecondary = () => {
      if(attempt && attempt.finished){
        return 'Wynik: '+ (attempt.points*100/attempt.answeredCount).toFixed(1)+'%';
      }
      else {
         return "Pozostały " + (totalQuestions - attempt.answeredCount) + ' pytania';
      }
  }


    return (
      <ListItem key={attempt} >
        <ListItemText
          primary={getPrimary()}
          secondary={getSecondary()}
        />
        <ListItemSecondaryAction>
          {!attempt.finished && <Button component={Link} to={{pathname: "/quiz/solve/"+attempt._id, }}>Kontynuuj</Button>}
        </ListItemSecondaryAction>
      </ListItem>


    );
}
