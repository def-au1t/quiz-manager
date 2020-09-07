import {AuthContext} from "../../context/AuthContext";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import {Link as RouterLink} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import AppBar from "@material-ui/core/AppBar";
import React, {useContext} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) => ({
  root: {
    flexDirection: "horizontal",
    justifyContent: "space-between"
  },
  menuLeft: {
    display: "flex",
    flexDirection: "horizontal"
  },

  title: {
    marginRight: "1em"
  },
}));


export default function Navigation (props) {

  const classes = useStyles();
  const {user, logout} = useContext(AuthContext)

  return(
    <AppBar position="static">
      <Toolbar className={classes.root}>
        <div className={classes.menuLeft}>
            <Typography variant="h6" className={classes.title}>Quiz Manager</Typography>
          <Button color="inherit" component={RouterLink} to="/"> {user ? "Moje Quizy" : "Strona Główna"} </Button>
        </div>
        <div>
          {user ?
            <>
              <Button color="inherit" component={RouterLink} to="/profile" endIcon={<AccountCircle />}>
                {user.username}
              </Button>
              <Button style={{marginLeft:"20px"}} color="inherit" onClick={logout}>
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
  )


}
