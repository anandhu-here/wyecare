  import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addEventDate, setDayDetailObj, toggleDetailSidebarObj } from "../../redux/actions/actionCreatorsObj";

const Day = ({ day: { visible, dayOfMonth, date } }) => {
  const calendarContext = useSelector(state => state.calendar);
  const authContext = useSelector(state => state.userLogin);
  const dispatch = useDispatch();
  const {
    shiftspublished
  } = calendarContext;

  const {
    agent, admin
  } = authContext.userInfo.user;
  let todaysEvents = [];
  var total_ = 0;
  var total_as=0;
  shiftspublished.forEach(shift => {
    if (date === `${shift.year}-${shift.month}-${shift.day}`) {
      todaysEvents.push(shift);
      var t = shift.longday + shift.night + shift.late + shift.early;
      total_as+=shift.assigned.length;
      total_+=t
    }
  });
  useEffect(()=>{
    shiftspublished.forEach(shift => {
      if (date === `${shift.year}-${shift.month}-${shift.day}`) {
        todaysEvents.push(shift);
        var t = shift.longday + shift.night + shift.late + shift.early;
        total_as+=shift.assigned.length;
        total_+=t
      }
    });
  }, [calendarContext])

  const d = new Date();
  const today = d.getDate();
  let cn = "day";

  if (today === dayOfMonth) cn = "day current-day";
  if (todaysEvents.length>0) cn = "day published";
  if (todaysEvents.length>0 && today === dayOfMonth) cn = "day current-day published";
  if(total_as !== 0 && total_as < total_) cn = "day assigned_incomplete";
  if(total_as !== 0 && total_as === total_) cn = "day assigned_complete";
  if (!visible) cn = "day hidden";
  return (
    <button
      className={cn}
      onClick={() => {
        if( todaysEvents.length === 0 ){
          dispatch(setDayDetailObj(dayOfMonth));
          dispatch(toggleDetailSidebarObj(true));
          dispatch(addEventDate(dayOfMonth));
        }
        else if(todaysEvents.length > 0){
          console.log(todaysEvents, "mlllllllllllllllllll")
          if(todaysEvents[0].assigned.length>0){
            dispatch(setDayDetailObj(dayOfMonth,todaysEvents[0].assigned, todaysEvents[0]))
            dispatch({type:"TOGGLE_USER_ASSIGNED_SB", payload:null})
            
          }
          if(agent || admin){
            dispatch({type:"SET_LOADING", payload:null});
            dispatch(setDayDetailObj(dayOfMonth, true))
            dispatch(toggleDetailSidebarObj(true));
            dispatch(addEventDate(dayOfMonth));

          }

        }
      }}
    >
      {dayOfMonth}
      
    </button>
  );
};

export default Day;
