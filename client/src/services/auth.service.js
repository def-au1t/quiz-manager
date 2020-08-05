import axios from "axios";

const API_URL = "/api/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signIn", {
                username,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, email, password) {
        return axios.post(API_URL + "signup", {
            username,
            email,
            password
        });
    }

    getCurrentUser() {
        // console.log(JSON.parse(localStorage.getItem('user')));
        return JSON.parse(localStorage.getItem('user'));
    }
}


export default new AuthService();
