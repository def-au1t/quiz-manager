import axios from 'axios';
import authHeader from './auth-header';

const API_URL = '/api/user/';

class UserService {
    // getPublicContent() {
    //     return axios.get(API_URL + 'all');
    // }
    //
    getUserBoard() {
        return axios.get(API_URL + '../test/user', { headers: authHeader() });
    }

    // getAdminBoard() {
    //     return axios.get(API_URL + 'admin', { headers: authHeader() });
    // }
    //
    updateUserData(email, password) {
      if(!password){
        return axios
          .post(API_URL, {
              email
          }, { headers: authHeader() })
          .then(response => {
              return response.data;
          })
          .catch((err) => err);}
      else {
        return axios
        .post(API_URL, {
          email,
          password
        })
        .then(response => {
          return response.data;
        })
        .catch((err) => err);}
    }

  getCurrentUserLocal() {
    // console.log(JSON.parse(localStorage.getItem('user')));
    return JSON.parse(localStorage.getItem('user'));
  }

  getCurrentUserServer() {
    // console.log(JSON.parse(localStorage.getItem('user')));
    return fetch(API_URL, {
      method: "GET",
      headers: authHeader(),
    })
  }
}

export default new UserService();
