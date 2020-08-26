import React, { Component } from "react";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
// import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";

export default function AttemptElement({attempt, totalQuestions}) {
    console.log(attempt)
    return (
      <Paper>
        <h4>Odpowiedziano na: {attempt.answeredCount} z {totalQuestions} </h4>
        <div>Punkty: {attempt.points} / {attempt.answeredCount}</div>
          <div>Data: {attempt.startTime} </div>
          {!attempt.finished && <Link to={{pathname: "/quiz/solve/"+attempt._id, }}><button>Kontynuuj</button></Link>}
      </Paper>


    );
}
