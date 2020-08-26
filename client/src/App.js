import React, {Component, useEffect, useState} from "react";
import { BrowserRouter as Router, Redirect, Switch, Route, Link as RouterLink, useHistory} from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/quiz-list.component";
import BoardAdmin from "./components/board-admin.component";
import QuizAttempt from "./components/quiz-attempt.component";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AccountCircle} from "@material-ui/icons";
import Container from "@material-ui/core/Container";
import QuizInfo from "./components/quiz-info.component";
import {AuthContext} from "./context/AuthContext";
import Navigation from "./components/partial/navigation.component";
import Paper from "@material-ui/core/Paper";
import NewQuizForm from "./components/new-quiz.component";



const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "1em",
    display: "flex",
    justifyContent: "center"
  },
}));

function App (props)  {


  const classes = useStyles();

  const [user, setUser] = useState(undefined);
  const [message, setMessage] = useState("");



  let history = useHistory();

  const login = (user) => {
    setUser(user);
  }

  const logout = () => {
    setUser(null);
    AuthService.logout();
  }


  useEffect(() => {
    async function getProfile(){
      const userLocal = UserService.getCurrentUserLocal();
      if (userLocal) {
        let res = await UserService.getCurrentUserServer()
        const ok = res.ok
        res = await res.json()
        if (ok && res.id === userLocal.id) {
          setUser(userLocal);
        } else {
          setUser(null)
          console.log(res)
          if (res.message) setMessage(res.message)
        }

      } else {
        setUser(null);
      }
    }
    getProfile();
  }, [])



  return (
    <AuthContext.Provider value={{user: user, login: login, logout:logout}}>
      <Router>
        <div>
          <Navigation/>
          <Container className={classes.container}>
            {message && <div>{message}</div>}
            <Switch>
              <Route exact path="/"> {user === null ? <Home/> : <BoardUser/> } </Route>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile"> {user === null ? <Redirect to="/"/> : <Profile/> } </Route>
              <Route exact path="/quiz/:id" component={QuizInfo}  />
              <Route exact path="/new" component={NewQuizForm} />
              <Route path="/quiz/solve/:id" component={QuizAttempt} />
              {/*<Route path="/admin" component={BoardAdmin} />*/}
            </Switch>
          </Container>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
