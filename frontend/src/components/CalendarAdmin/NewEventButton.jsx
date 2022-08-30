import { useSelect } from "@mui/base";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeServiceField, clearEventField, addEventDate, toggleEventsSidebarObj, toggleNewEventSidebarObj, toggleDetailSidebarObj, setDayDetailObj } from "../../redux/actions/actionCreatorsObj";
import axios from 'axios';

import moment from "moment";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import AddBox from "@mui/icons-material/AddBox";
import { AddBoxOutlined, Remove } from "@mui/icons-material";

const NewEventButton = ({ date }) => {
  const [loading, setLoading] = useState(false);
  const calendarContext = useSelector(state => state.calendar);
  const [showId, setShow] = useState(null);
  const [clicked, setClicked] = useState(showId==null?false:true);
  const {shift} = calendarContext;
  const {users} = useSelector(state=>state.userState);
  const dispatch = useDispatch();
  const handleUserSB = (home,home_id, num, type)=>{
    if(num > 0){
      dispatch({type:"CLOSE_DETAIL_SB_AD", payload:null});
      dispatch({type:"TOGGLE_USER_SB_AD", payload:{shiftType:type, home_id, num, homename:home}});
    }
    else{
      alert(`Sorry, ${home} has no ${type} available!`)
    }
  }
  return (
    
          <nav  className="navbar">
            {loading&&<div style={{display:"flex",position:"absolute", justifyContent:"center", alignItems:"center", top:0, bottom:0,left:0, width:"100%", height:"100%", backgroundColor:"white"}} >
              <CircularProgress />
            </div>}
            <div className="button-group">
            <Grid md={7} style={{display:"flex",width:"100%"}} >
              
            </Grid>
              {
                shift.map(i=>{
                  return(
                    <Grid key={i.home_id} container style={{ display:"flex",alignItems:"flex-start", marginBlock:"0.5rem", borderBottom:"1px solid grey ", paddingBottom:"3%"}}>
                      
                      <Grid md={7}>
                        <Button variant="outlined" style={{paddingInline:"14%",marginBottom:"5%" }} ><Typography fontSize={15} >{i.home}</Typography></Button>
                        <div style={{paddingLeft:"14%"}} onClick={()=>{
                        }} className="shift-type"  ><Typography fontSize={12}  color={"grey"} >LONGDAYS : {i.longday}</Typography></div>
                        <div style={{paddingLeft:"14%"}} onClick={()=>{
                        }} className="shift-type"  ><Typography fontSize={12}  color={"grey"} >NIGHTS : {i.night}</Typography></div>
                        <div style={{paddingLeft:"14%"}} onClick={()=>{
                        }} className="shift-type"  ><Typography fontSize={12}  color={"grey"} >LATES : {i.late}</Typography></div>
                        <div style={{paddingLeft:"14%"}} onClick={()=>{
                        }} className="shift-type"  ><Typography fontSize={12}  color={"grey"} >EARLYS : {i.early}</Typography></div>
                      </Grid>
                      
                      <Grid md={5}   >
                      <Button variant="outlined" onClick={()=>{
                          dispatch({type:"CLOSE_DETAIL_SB_AD", payload:null});
                          dispatch({type:"TOGGLE_USER_SB_AD", payload:true});
                        }}
                        style={{paddingInline:"13%"}} ><Typography>ASSIGN</Typography></Button>
                      </Grid>
                    </Grid>
                  )
                })
              }
            </div>
          </nav>
  );
};

export default NewEventButton;
