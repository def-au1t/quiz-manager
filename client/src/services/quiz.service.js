import authHeader from './auth-header';

const API_URL = '/api/quiz/';

class QuizService {
  getQuizList() {
    return fetch(API_URL + 'list', { headers: authHeader() });
  }

  getQuizData(id) {
    return fetch(API_URL + id.toString(), {
      headers: authHeader()
    });
  }

  deleteQuiz(id) {
    return fetch(API_URL + id.toString(), {
      method: "DELETE",
      headers: authHeader()
    });
  }

  createQuizJson(quizJson){
    return fetch(API_URL + 'create', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(quizJson),
    })
  }

  getAttemptList(){
    return fetch(API_URL + 'attempt/list', {
      headers: authHeader()
    });
  }

  startQuiz(quizId){
    return fetch(API_URL + quizId + '/start', {
      method: "POST",
      headers: {
        ...authHeader()
      }
    })
  }

  getAttempt(attemptId){
    return fetch(API_URL + 'attempt/' + attemptId , {
      method: "GET",
      headers: {
        ...authHeader()
      }
    })
  }

  sendAnswer(quizId, questionId, attemptId, answers){
    return fetch(API_URL + quizId +'/question/' + questionId , {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({attemptId, answers}),
    })
  }

  finishAttempt(attemptId){
    return fetch(API_URL + 'attempt/' + attemptId  + '/finish', {
      method: "POST",
      headers: {
        ...authHeader()
      }
    })
  }

  getSettings() {
    return JSON.parse(localStorage.getItem('attemptSetting'));
  }

  setSettings(settings){
    if(!settings) {
      localStorage.removeItem("attemptSetting");
    }
    localStorage.setItem("attemptSetting", JSON.stringify(settings));
  }
}

export default new QuizService();
