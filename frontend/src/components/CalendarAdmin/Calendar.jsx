import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Day from "./Day";
import DayDetail from "./DayDetail";
import NewEventSidebar from "./NewEventSidebar";
import Buttons from "./Buttons";
import { getCurrentDateDispatch, getEventsFromLS } from "../../redux/actions/actionCreatorsDispatch";
import axios from 'axios';
import moment from 'moment';
import UserSidebar from "./UserSidebar";
import { Slide } from "@mui/material";
import UserAssignSB from "./UserAssignSB";

const Calendar = () => {
  const body = document.getElementsByTagName("body");
  const dispatch = useDispatch();
  const calendarContext = useSelector(state => state.calendar);
  const {users} = useSelector(state => state.userState);
  const {userInfo} = useSelector(state=>state.userLogin);
  const {
    currentMonth,
    currentYear,
    shiftspublished,
    loading,
    days,
    detailSidebarToggled,
    eventsSidebarToggled,
    newEventSidebarToggled,
    editEventSidebarToggled,
    userSidebarToggledAd
  } = calendarContext;

  useEffect(()=>{
    console.log(userInfo, "-")
    const key = userInfo.user.profile.key
    var mon = moment().month()+1;
    const month = mon<10?"0"+ mon?.toString():mon
    axios.get(`http://localhost:8000/api/shifts?month=${month}&agent=${true}&key=${key}`, {headers:{
      'Authorization':`Token ${userInfo.token}`
    }}).then(res=>{
      
      dispatch({type:"SET_SHIFTS", payload:res.data})
      console.log(res.data, "data")
    }).catch(e=>{
    })
  }, [])
  useEffect(() => {
    dispatch(getCurrentDateDispatch(moment().year(), moment().month() + 1, moment().date()));
    dispatch(getEventsFromLS());
  }, [dispatch]);



  if (
    detailSidebarToggled ||
    eventsSidebarToggled ||
    newEventSidebarToggled ||
    editEventSidebarToggled 
  ) {
    body[0].style.overflowY = "hidden";
  } else {
    body[0].style.overflowY = "visible";
  }
  return (
    <>
      {
        loading?(
          <div>Loading...</div>
        ):(
          <div className="calendar">
              <div className="title">
                {moment.months(currentMonth - 1)} {currentYear}{" "}
                <Buttons key={userInfo.user.profile.key} />
              </div>
              <div className="calendar-table">
                <div className="thead">
                  <div>Monday</div>
                  <div>Tuesday</div>
                  <div>Wednesday</div>
                  <div>Thursday</div>
                  <div>Friday</div>
                  <div>Saturday</div>
                  <div>Sunday</div>
                </div>
                <div className="thead-sm">
                  <div>M</div>
                  <div>T</div>
                  <div>W</div>
                  <div>Th</div>
                  <div>F</div>
                  <div>St</div>
                  <div>S</div>
                </div>
                <div className="tbody">
                  {days.map((day, index) => (
                    <Day key={index} day={day} />
                  ))}
                </div>
              </div>
              
              <DayDetail />
              <UserSidebar users={users} />
              <UserAssignSB />
              {/* <NewEventSidebar /> */}
            </div>
        )
      }
    </>
  );
};

export default Calendar;
