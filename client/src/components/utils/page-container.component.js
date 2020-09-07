import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {globalStyles} from "../../App"
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";


export default function PageContainer (props) {

  const global = globalStyles()


  return (
    <Container fixed className={global.container}>
    <Paper className={global.paper}>
      <Grid container direction="column" alignItems="center">
        {props.title &&
          <>
            <Box p={2}>
              <Typography variant={props.variant} component="h1" className={global.pageHeader} > {props.title}</Typography>
            </Box>
            <Divider variant="fullWidth" className={global.divider}/>
          </>}
        {props.loading ? <Box m={4}><CircularProgress /></Box> : props.children}
      </Grid>
    </Paper>
    </Container>
  );
}

PageContainer.defaultProps = {
  title:"",
  variant: "h5",
  loading: false
}
