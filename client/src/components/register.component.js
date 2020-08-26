//
// const required = value => {
//   if (!value) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This field is required!
//       </div>
//     );
//   }
// };
//
// const email = value => {
//   if (!isEmail(value)) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         This is not a valid email.
//       </div>
//     );
//   }
// };
//
// const vusername = value => {
//   if (value.length < 3 || value.length > 20) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The username must be between 3 and 20 characters.
//       </div>
//     );
//   }
// };
//
// const vpassword = value => {
//   if (value.length < 6 || value.length > 40) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         The password must be between 6 and 40 characters.
//       </div>
//     );
//   }
// };
//
// export default class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.handleRegister = this.handleRegister.bind(this);
//     this.onChangeUsername = this.onChangeUsername.bind(this);
//     this.onChangeEmail = this.onChangeEmail.bind(this);
//     this.onChangePassword = this.onChangePassword.bind(this);
//
//     this.state = {
//       username: "",
//       email: "",
//       password: "",
//       successful: false,
//       message: ""
//     };
//   }
//
//   onChangeUsername(e) {
//     this.setState({
//       username: e.target.value
//     });
//   }
//
//   onChangeEmail(e) {
//     this.setState({
//       email: e.target.value
//     });
//   }
//
//   onChangePassword(e) {
//     this.setState({
//       password: e.target.value
//     });
//   }
//
//   handleRegister(e) {
//     e.preventDefault();
//
//     this.setState({
//       message: "",
//       successful: false
//     });
//
//     this.form.validateAll();
//
//     if (this.checkBtn.context._errors.length === 0) {
//       AuthService.register(
//         this.state.username,
//         this.state.email,
//         this.state.password
//       ).then(
//         response => {
//           this.setState({
//             message: response.data.message,
//             successful: true
//           });
//         },
//         error => {
//           const resMessage =
//             (error.response &&
//               error.response.data &&
//               error.response.data.message) ||
//             error.message ||
//             error.toString();
//
//           this.setState({
//             successful: false,
//             message: resMessage
//           });
//         }
//       );
//     }
//   }
//
//   render() {
//     return (
//       <div className="col-md-12">
//         <div className="card card-container">
//           <img
//             src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
//             alt="profile-img"
//             className="profile-img-card"
//           />
//
//           <Form
//             onSubmit={this.handleRegister}
//             ref={c => {
//               this.form = c;
//             }}
//           >
//             {!this.state.successful && (
//               <div>
//                 <div className="form-group">
//                   <label htmlFor="username">Username</label>
//                   <Input
//                     type="text"
//                     className="form-control"
//                     name="username"
//                     value={this.state.username}
//                     onChange={this.onChangeUsername}
//                     validations={[required, vusername]}
//                   />
//                 </div>
//
//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <Input
//                     type="text"
//                     className="form-control"
//                     name="email"
//                     value={this.state.email}
//                     onChange={this.onChangeEmail}
//                     validations={[required, email]}
//                   />
//                 </div>
//
//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <Input
//                     type="password"
//                     className="form-control"
//                     name="password"
//                     value={this.state.password}
//                     onChange={this.onChangePassword}
//                     validations={[required, vpassword]}
//                   />
//                 </div>
//
//                 <div className="form-group">
//                   <button className="btn btn-primary btn-block">Sign Up</button>
//                 </div>
//               </div>
//             )}
//
//             {this.state.message && (
//               <div className="form-group">
//                 <div
//                   className={
//                     this.state.successful
//                       ? "alert alert-success"
//                       : "alert alert-danger"
//                   }
//                   role="alert"
//                 >
//                   {this.state.message}
//                 </div>
//               </div>
//             )}
//             <CheckButton
//               style={{ display: "none" }}
//               ref={c => {
//                 this.checkBtn = c;
//               }}
//             />
//           </Form>
//         </div>
//       </div>
//     );
//   }
// }
import React, {Component, useContext, useEffect, useRef, useState} from "react";
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


  const registerHandler = () => {

    setMessage("");
    if(usernameError || passwordError || emailError){
      setMessage("Niepoprawne dane!");
      return;
    }


    AuthService.register(username, email, password)
      .then(
        response => {
          if(response.data.message === "User was registered successfully!"){
            setMessage("Zarejestrowano pomyślnie");
          }
          else setMessage(response.data.message);
          setSuccess(true);
        },
        error => {
          let resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          switch (resMessage) {
            case "Failed! Username is already in use!": resMessage="Ta nazwa użytkownika już jest zajęta!"; break;
            case "Failed! Email is already in use!!": resMessage="Ten adres e-mail już jest zajęta!"; break;
          }
          setMessage(resMessage);
          setSuccess(false);
        }
      );
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
