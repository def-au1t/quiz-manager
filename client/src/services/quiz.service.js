import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/quiz/';

class QuizService {
  getQuizList() {
    return axios.get(API_URL + 'list');
  }

  getQuizData(id) {
    return fetch(API_URL + id.toString());
  }

}

export default new QuizService();
