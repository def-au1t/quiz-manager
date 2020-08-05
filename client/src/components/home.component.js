import React, { Component } from "react";

import QuizService from "../services/quiz.service";
import QuizElement from "./home/quiz-list-element.component";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: []
    };
  }

  componentDidMount() {
    QuizService.getQuizList().then(
      response => {
        this.setState({
          content: response.data
        });
        console.log(this.state.content)
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <ul className="list-group">
            {this.state.content.map(el => <QuizElement quiz={el}/>)}
          </ul>
        </header>
      </div>
    );
  }
}
