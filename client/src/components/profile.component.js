import React, {Component, useContext, useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {AuthContext} from "../context/AuthContext";


export default function Profile (props) {

  const currentUser = useContext(AuthContext);

  return (
      <>
      <Paper>
        <h1> Informacje o użytkowniku</h1>
        {currentUser && currentUser.user &&
        <><h3>Nazwa użytkownika: {currentUser.user.username} </h3>
        <h3>Email: {currentUser.user.email} </h3>
        <h3>Hasło: {currentUser.user.password} </h3></>
        }
      </Paper>
        </>
    );
}
