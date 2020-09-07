import React, {useContext, useState} from "react";
import AuthService from "../services/auth.service";
import {AuthContext} from "../context/AuthContext";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { Alert } from '@material-ui/lab';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';



export const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    marginTop: "2em",
    maxWidth: 500
  },
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    margin: 'auto',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login (props) {

  const classes = useStyles();
  const authContext = useContext(AuthContext);

  const loginHandler = async () => {

    setMessage("");
    if(!username || !password){
      setMessage("Wypełnij wszystkie pola!");
      return;
    }
    try {
      let res = await AuthService.login(username, password)
      if(res.ok){
        authContext.login(res)
        props.history.push("/profile");
        return;
      }
      let resMessage = "";
      switch (res.message) {
        case "User Not found.": resMessage="Nie znaleziono użytkownika!"; break;
        case "Invalid Password!": resMessage="Niepoprawne hasło!"; break;
      }
      setMessage(resMessage);
    }
    catch(err){
      setMessage(err.message);
    }
  };

  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const changeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if(newUsername === ""){
      setUsernameError(true);
    }
    else{
      setUsernameError(false);
    }
  }
  const changePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if(newPassword === ""){
      setPasswordError(true);
    }
    else{
      setPasswordError(false);
    }
  }

  return (
    <>
      <Card className={classes.root} >
          <CardContent>
            <Avatar className={classes.avatar}
                    src={"https://ssl.gstatic.com/accounts/ui/avatar_2x.png"}/>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Zaloguj się
              </Typography>
              <div className={classes.form}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="login"
                  label="Login"
                  name="login"
                  autoComplete="username"
                  autoFocus
                  onClick={changeUsername}
                  onInput={changeUsername}
                  error={usernameError}
                  helperText={usernameError ? "Nazwa użytkownika nie może być pusta." : ""}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Hasło"
                  type="password"
                  id="password"
                  error={passwordError}
                  autoComplete="current-password"
                  onClick={changePassword}
                  onInput={changePassword}
                  helperText={passwordError ? "Hasło nie może być puste." : ""}
                />
                <Button
                  onClick={loginHandler}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Zaloguj się
                </Button>

                {message && (<Alert severity="error">{message}</Alert>)}
              </div>
            </div>
          </CardContent>
        </Card>

  </>
    )
}
