import React from "react";

import PageContainer from "./utils/page-container.component";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function Home (props) {
  return(
    <PageContainer>
      <Box m={3}>
      <Typography variant={"h3"} component={"h1"}>Quiz Manager</Typography>
      </Box>
      <Box>
        <Typography variant={"h5"} component={"h2"}>Testuj swoją wiedzę i śledź postępy...</Typography>
      </Box>
      <Box m={4}>
        <Button color={"secondary"} variant={"contained"} component={Link} to='/login'> Rozpocznij</Button>
      </Box>

    </PageContainer>
  )
}
