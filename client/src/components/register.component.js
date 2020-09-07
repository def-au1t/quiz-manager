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



const useStyles = makeStyles((theme) => ({
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

export default function Register (props) {

  const classes = useStyles();
  const authContext = useContext(AuthContext);


  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("");;
  const [email, setEmail] = useState("");
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

  const changeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const re = /\S+@\S+\.\S+/;
    if(newEmail === ""){
      setEmailError("Adres e-mail nie może być pusty");
    }
    else if(!re.test(newEmail)){
      setEmailError("Nieprawidłowa postać adresu");
    }
    else{
      setEmailError("");
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


  const registerHandler = async () => {
    setMessage("");
    if(usernameError || passwordError || emailError){
      setMessage("Niepoprawne dane!");
      return;
    }
    try {
      let res = await AuthService.register(username, email, password)
      setSuccess(res.ok);
      res = await res.json()
      let resMessage = "";
      switch (res.message) {
        case "User was registered successfully!": resMessage="Zarejestrowano pomyślnie!"; break;
        case "Failed! Username is already in use!": resMessage="Ta nazwa użytkownika już jest zajęta!"; break;
        case "Failed! Email is already in use!": resMessage="Ten adres e-mail już jest zajęty!"; break;
      }
      setMessage(resMessage);
    }
    catch(err){
      setMessage(err.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <Card className={classes.root} >
        <CardContent>
          {!success && (
          <>
            <Avatar className={classes.avatar}
                    src={"https://ssl.gstatic.com/accounts/ui/avatar_2x.png"}/>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Zarejestruj się
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
                  name="email"
                  label="E-mail"
                  type="email"
                  id="email"
                  error={emailError}
                  autoComplete="email"
                  onClick={changeEmail}
                  onInput={changeEmail}
                  helperText={emailError}
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
                  onClick={registerHandler}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Zarejestruj się
                </Button>

              </div>
            </div>
          </>
            )}
          {message && (<Alert severity={success ? "success" : "error"}>{message}</Alert>)}
        </CardContent>
      </Card>

    </>
  )
}
