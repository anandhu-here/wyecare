import { useSelect } from "@mui/base";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { changeServiceField, clearEventField, addEventDate, toggleEventsSidebarObj, toggleNewEventSidebarObj, toggleDetailSidebarObj, setDayDetailObj } from "../../redux/actions/actionCreatorsObj";
import axios from 'axios';
import { Add, Remove } from '@mui/icons-material';
import useWebSocket from 'react-use-websocket';

import moment from "moment";
import { Button, CircularProgress } from "@mui/material";

const NewEventButton = ({ date, target_id }) => {
  const [loading, setLoading] = useState(false);
  const [longday, setLongday] = useState(0);
  const [early, setEarly] = useState(0);
  const [late, setLate] = useState(0);
  const [night, setNight] = useState(0);
  const [shift, setShift] = useState([]);
  const dispatch = useDispatch();
  const calendarContext = useSelector(state => state.calendar);
  const authContext = useSelector(state => state.userLogin);
  const {currentMonth, currentYear, shiftspublished} = calendarContext;
  const { sendJsonMessage } = useWebSocket('ws://3.86.108.50:8000/ws/notification/');
 
  const handleNext = (dat) =>{  
    const day = dat<10?"0"+dat.toString():dat
    const month = currentMonth<10?"0"+ currentMonth.toString():currentMonth
    var temp = { longday, night, late, early, day:day, home_id: authContext.userInfo.user.profile.id, month:month, year:currentYear}
    var shifts = [...shift];
    
    shifts.unshift(temp)
    setShift([...shifts])
    dispatch(toggleDetailSidebarObj(false));
    setLongday(0);setNight(0);setEarly(0);setLate(0);
    setTimeout(() => {
      dispatch(toggleDetailSidebarObj(true));
      dispatch(setDayDetailObj(dat+1, []));
    }, 500);
    
  }
  const handleAssign = (d) =>{
    const { id } = authContext.userInfo.user.profile;
    var shifts = [...shift];
    const month = currentMonth<10?"0"+ currentMonth.toString():currentMonth
    const day = d<10?"0"+d.toString():d
    var temp = { longday, night, late, early, day:day, home_id: id, month:month, year: calendarContext.currentYear}
    shifts.unshift(temp)
    var finalshifts = [...shiftspublished, ...shifts]
    setLoading(true)
    if(shifts.length > 1){
      axios.post("http://localhost:8000/api/shift-bulk-publish",{shift:[...shifts]}, {
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Token' + authContext.userInfo.token
        }
      } ).then(res=>{
        dispatch({type:"SET_SHIFTS", payload:[...finalshifts]})
        setLoading(false);
        dispatch(toggleDetailSidebarObj(false));
      }).catch(e=>{
        setLoading(false);
      })
    }
    else{
      axios.post("http://localhost:8000/api/shift-publish",{shift:{longday, night, late, early, day:day, home_id: id, month:month, year: calendarContext.currentYear, agent_id:target_id }}, {
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Token' + authContext.userInfo.token
        }
      } ).then(res=>{
        dispatch({type:"SET_SHIFTS", payload:[res.data, ...shiftspublished]})
        
        setLoading(false);
        dispatch(toggleDetailSidebarObj(false));
        sendJsonMessage({
          'message':`${authContext.userInfo.user.profile.name} has added shifts`,
          'sender_id': authContext.userInfo.user.id,
          'target_id': target_id,
          'data':res.data
        })
      }).catch(e=>{
        setLoading(false);
      })
    }

  }
  

  const {
    newEventSidebarToggled,
    eventDate,
    days
  } = calendarContext;

  const dispatchEditEventDate = () => {
    dispatch(addEventDate(date))
    dispatch(changeServiceField('date', days[eventDate].date))
  }

  return (
    
          <nav  className="navbar">
            {loading&&<div style={{display:"flex",position:"absolute", justifyContent:"center", alignItems:"center", top:0, bottom:0,left:0, width:"100%", height:"100%", backgroundColor:"white"}} >
              <CircularProgress />
            </div>}
            <div className="button-group">
              {/* <button
                className="new-event-btn"
                onClick={() => {
                  dispatch(toggleNewEventSidebarObj(!newEventSidebarToggled));
                  dispatch(toggleEventsSidebarObj(false));
                  dispatch(toggleDetailSidebarObj(false))
                  dispatch(clearEventField())
                  date ? dispatchEditEventDate() : dispatch(addEventDate(null))
                }}
              >
                <i className="fas fa-plus"></i> Long 
              </button> */}
              <div style={{display:"flex",width:'100%', justifyContent:"center", alignItems:"center", paddingBlock:"1rem"}} >
              <Button variant="outlined" onClick={()=>{setLongday(longday-1)}} ><Remove  /></Button>
                <div style={{paddingInline:'1rem', width:"60%", textAlign:'center' }}>LONG DAY {longday>0&&"(" + longday + ")"} </div>
                <Button variant="outlined" onClick={()=>{setLongday (longday+1)}}><Add /></Button>
              </div>
              <div style={{display:"flex",width:'100%', justifyContent:"center", alignItems:"center", paddingBlock:"1rem"}} >
                <Button variant="outlined" onClick={()=>{setNight(night-1)}}><Remove /></Button>
                <div style={{paddingInline:'1rem', width:"60%", textAlign:'center'}}>NIGHT {night>0&&"(" + night + ")"}</div>
                <Button variant="outlined" onClick={()=>{setNight(night+1)}} ><Add /></Button>
              </div>
              <div style={{display:"flex",width:'100%', justifyContent:"center", alignItems:"center", paddingBlock:"1rem"}} >
                <Button variant="outlined" onClick={()=>{setLate(late-1)}}><Remove /></Button>
                <div style={{paddingInline:'1rem', width:"60%", textAlign:'center'}}>LATE {late>0&&"(" + late + ")"}</div>
                <Button variant="outlined" onClick={()=>{setLate(late+1)}}><Add /></Button>
              </div>
              <div style={{display:"flex",width:'100%', justifyContent:"center", alignItems:"center", paddingBlock:"1rem"}} >
                <Button variant="outlined" onClick={()=>{
                  setEarly(early-1)
                }} ><Remove /></Button>
                <div style={{paddingInline:'1rem', width:"60%", textAlign:'center'}}>EARLY {early>0&&"(" + early + ")"}</div>
                <Button variant="outlined" onClick={()=>{
                  setEarly(early+1)
                }} ><Add /></Button>
              </div>
              <div style={{display:"flex", width:"100%", justifyContent:"space-evenly"}} >
              <Button varient="outlined" onClick={()=>{
                handleAssign(date);
              }} >
                ASSIGN
              </Button>
              <Button varient="outlined" onClick={()=>{
                handleNext(date)
              }} style={{marginLeft:"1rem"}}>
                NEXT
              </Button>
            </div>
            </div>
            
            
          </nav>
  );
};

export default NewEventButton;
