import authHeader from './auth-header';

const API_URL = '/api/user/';

class UserService {
    getUserBoard() {
        return fetch(API_URL + '../test/user', { headers: authHeader() });
    }

    updateUserData(email, password) {
      let body = {};
      if(!password){
        body = {email};
      }
      else {
        body = {email, password};
      }
      return fetch(API_URL,  { method: "POST",headers: authHeader(), body: JSON.stringify(body) })
        .then(response => {
          return response;
        })
        .catch((err) => err);
    }

  getCurrentUserLocal() {
    return JSON.parse(localStorage.getItem('user'));
  }

  getCurrentUserServer() {
    return fetch(API_URL, {
      method: "GET",
      headers: authHeader(),
    })
  }

  deleteAccount() {
    return fetch(API_URL, {
      method: "DELETE",
      headers: authHeader(),
    })
  }

}

export default new UserService();
