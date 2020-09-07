import React from "react";
import {globalStyles} from "../../App"
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";


export default function Message (props) {

  const global = globalStyles()

  if(!props.msg) return "";
  else
  return (
    <Box m={2}>
      <Alert severity={props.err ? "error" :  "info"}>{props.msg}</Alert>
    </Box>
  );
}

