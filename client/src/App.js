import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Redirect, Switch, Route, useHistory} from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import QuizList from "./components/quiz-list.component";
import QuizAttempt from "./components/quiz-attempt.component";
import makeStyles from "@material-ui/core/styles/makeStyles";
import QuizInfo from "./components/quiz-info.component";
import {AuthContext} from "./context/AuthContext";
import Navigation from "./components/partial/navigation.component";
import NewQuizForm from "./components/new-quiz.component";
import StickyFooter from "./components/partial/sticky-footer";



export const globalStyles = makeStyles((theme) => ({
  paper:{
    width:'100%',
    textAlign: 'center'
  },
  divider:{
    alignSelf: 'stretch',
  },
  container: {
    marginTop: "1em",
    display: "flex",
    justifyContent: "center"
  },
  pageHeader: {
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  th : {
    fontWeight: "bold",
    fontVariantCaps: 'small-caps'
  },
  list: {
    width: '100%',
  }
}));

function App (props)  {


  const classes = globalStyles();

  const [user, setUser] = useState(undefined);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);



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
          setLoading(false)
        } else {
          setUser(null)
          if (res.message) setMessage(res.message)
        }

      } else {
        setUser(null);
        setLoading(false)
      }
    }

    setMessage("");
    getProfile();
  }, [])



  return (
    <AuthContext.Provider value={{user: user, login: login, logout:logout, loading:loading}}>
      <Router>
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
          <Navigation/>
            {message && <div>{message}</div>}
            <Switch>
              <Route exact path="/"> {user === null ? <Home/> : <QuizList/> } </Route>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile"> {user === null ? <Redirect to="/"/> : <Profile/> } </Route>
              <Route exact path="/quiz/:id" component={QuizInfo}  />
              <Route exact path="/new" component={NewQuizForm} />
              <Route path="/quiz/solve/:id" component={QuizAttempt} />
              {/*<Route path="/admin" component={BoardAdmin} />*/}
            </Switch>
          <StickyFooter/>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
