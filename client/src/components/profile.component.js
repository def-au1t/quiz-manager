import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {globalStyles} from "../App"
import PageContainer from "./utils/page-container.component";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";


import UserService from "../services/user.service";
import Message from "./utils/message.component";
import TableBody from "@material-ui/core/TableBody";


export default function Profile (props) {

  const [message, setMessage] = useState("");
  const [msgError, setMsgError] = useState(false);

  const currentUser = useContext(AuthContext);

  const global = globalStyles()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(currentUser.loading)
  }, [currentUser.loading])


  const deleteAccount = async () => {
    if(window.confirm("Czy jesteś pewien?")){
      try{
        let res = await UserService.deleteAccount();
        currentUser.logout();
        if(!res.ok) {
          setMsgError(true)
        }
        res = await res.json()
        setMessage(res.message)
      }
      catch(err){
        setMessage(err.message)
        setMsgError(true)
      }
    }
  }

  return (
        <PageContainer title={"Panel użytkownika"} loading={loading}>
          <Message msg={message} err={msgError}/>
          {currentUser && currentUser.user &&
          <>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" className={global.th}>Nazwa użytkownika:</TableCell>
                <TableCell>{currentUser.user.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" className={global.th}>Adres E-Mail:</TableCell>
                <TableCell>{currentUser.user.email}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
            <Box m={2}>
              <Button variant="contained" color="secondary" onClick={deleteAccount}>Usuń konto
              </Button>
            </Box>
          </>
          }
        </PageContainer>
    );
}
