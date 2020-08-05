import React, { Component } from "react";

import QuizService from "../services/quiz.service";
import QuizElement from "./home/quiz-list-element.component";

export default class QuizAttempt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizData: {}
    };
  }

  componentDidMount() {
    const { quiz } = this.props.location
    console.log(this.props.location)
    // QuizService.getQuizData(this.props.quiz.id).then(
    //   response => {
    //     this.setState({
    //       quizData: response.data
    //     });
    //     console.log(this.state.quizData)
    //   },
    //   error => {
    //     this.setState({
    //       quizData:
    //         (error.response && error.response.data) ||
    //         error.message ||
    //         error.toString()
    //     });
    //   }
    // );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
            {this.state.quizData}
        </header>
      </div>
    );
  }
}
