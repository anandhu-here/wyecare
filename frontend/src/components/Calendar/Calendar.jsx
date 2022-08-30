import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Day from "./Day";
import DayDetail from "./DayDetail";
import NewEventSidebar from "./NewEventSidebar";
import Buttons from "./Buttons";
import { getCurrentDateDispatch, getEventsFromLS } from "../../redux/actions/actionCreatorsDispatch";
import axios from 'axios';
import moment from 'moment';
import AssignedUser from "./AssignedUser";

const Calendar = ({agentId}) => {
  const body = document.getElementsByTagName("body");
  const dispatch = useDispatch();
  const calendarContext = useSelector(state => state.calendar);
  const {userInfo} = useSelector(state => state.userLogin);
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
  } = calendarContext;

   
  useEffect(()=>{
    var mon = moment().month()+1;
    const month = mon<10?"0"+ mon?.toString():mon
    axios.get(`http://localhost:8000/api/shifts?month=${month}&homeid=${userInfo.user.profile.id}&admin=${false}`, {headers:{
      'Authorization':`Token ${userInfo.token}`
    }}).then(res=>{
      dispatch({type:"SET_SHIFTS", payload:res.data})
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
                <Buttons />
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
              
              <DayDetail id={agentId} />
              <AssignedUser />
              {/* <NewEventSidebar /> */}
            </div>
        )
      }
    </>
  );
};

export default Calendar;
