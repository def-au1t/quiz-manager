import React, { Component } from "react";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
// import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

export default function QuizElement({quiz}) {
    return (
      <div>
        <h3>{quiz.name}</h3>
        <div>Liczba pytań: {quiz.numQuestions}</div>
        <Link to={{pathname: "/quiz/"+quiz.id, }}><button>Start</button></Link>
        {/*<Link to={{pathname: "/quiz/"+quiz.id, data:{"quiz":quiz}}}><button>Start</button></Link>*/}
      </div>


    );
}
