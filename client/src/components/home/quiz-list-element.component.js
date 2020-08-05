import React, { Component } from "react";
import {Link} from "react-router-dom";

export default function QuizElement({quiz}) {
    return (
      <li className="list-group-item d-inline-flex align-items-baseline justify-content-between">{quiz.name}
          <Link to={{pathname: "/quizAttempt", data:{"quiz":quiz}}}><button className="btn btn-light">Start</button></Link>
      </li>
    );
}
