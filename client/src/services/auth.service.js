const API_URL = "/api/auth/";

class AuthService {
  async login(username, password) {
    let res = await fetch(API_URL + "signin",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })})

    const ok = res.ok;
    res = await res.json();
    if (res.accessToken) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return {ok, ...res};
  }

  logout() {
    localStorage.removeItem("user");
  }

  async register(username, email, password) {
    return fetch(API_URL + "signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });
  }


}


export default new AuthService();
