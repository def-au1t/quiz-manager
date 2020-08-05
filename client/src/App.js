import React, {Component, useEffect, useState} from "react";
import { BrowserRouter as Router, Redirect, Switch, Route, Link as RouterLink, useHistory} from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
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


// const LinkBehavior = React.forwardRef((props, ref) => (
//   <RouterLink ref={ref} to="/" {...props} />
// ));


const useStyles = makeStyles((theme) => ({
  root: {
    flexDirection: "horizontal",
    justifyContent: "space-between"
  },
  menuRight: {
  },

  title: {
    textTransform: "none"
  },
}));

function App (props)  {


  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(undefined);



  let history = useHistory();

  const logOut = () => {
    AuthService.logout()
    setCurrentUser(undefined)

  }

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [])



  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar className={classes.root}>
            <div>
              <Button color="inherit" className={classes.title} component={RouterLink} to="/">
                <Typography variant="h6">Quiz Manager</Typography>
              </Button>
              <Button color="inherit" component={RouterLink} to="/">
                Wszystkie quizy
              </Button>
              {currentUser && <Button color="inherit" component={RouterLink} to="/user">
                Moje quizy
              </Button>}
            </div>
            <div>
              {currentUser ?
                <>
                  <Button color="inherit" component={RouterLink} to="/profile" endIcon={<AccountCircle />}>
                    {currentUser.username}
                  </Button>
                  <Button style={{marginLeft:"20px"}} color="inherit" className={classes.menuRight} onClick={logOut}>
                    Wyloguj się
                  </Button>
                </>
                :
                <>
                  <Button color="inherit" className={classes.menuRight} component={RouterLink} to="/login">
                    Zaloguj się
                  </Button>
                  <Button color="inherit" className={classes.menuRight} component={RouterLink} to="/register">
                    Zarejestruj się
                  </Button>
                </>
              }
            </div>
          </Toolbar>
        </AppBar>
        <Container >
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile"> {currentUser === null ? <Redirect to="/"/> : <Profile/> } </Route>
            <Route exact path="/quiz">  <QuizInfo/>  </Route>
            <Route path="/quizAttempt" component={QuizAttempt} />
            <Route path="/user"> {currentUser === null ? <Redirect to="/"/> : <BoardUser/> } </Route>
            {/*<Route path="/admin" component={BoardAdmin} />*/}
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
