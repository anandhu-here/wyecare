import axios from "axios";
import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { addEventDate, setDayDetailObj, toggleDetailSidebarObj, toggleDetailSidebarObjAdmin } from "../../redux/actions/actionCreatorsObj";
import { users } from "../../redux/actions/usersActions";

const Day = ({ day: { visible, dayOfMonth, date } }) => {
  const calendarContext = useSelector(state => state.calendar);
  const authContext = useSelector(state => state.userLogin);
  const dispatch = useDispatch();
  const {
    events,
    shiftspublished
  } = calendarContext;

  const {
    agent, admin
  } = authContext.userInfo.user;
  let todaysEvents = [];
  let assigned_incomplete = [];
  let assigned_complete = [];

  shiftspublished.forEach(shift => {
    
    var total = shift.longday + shift.night + shift.early + shift.late;
    if (date === `${shift.year}-${shift.month}-${shift.day}`) {
      todaysEvents.push(shift);
    }
  });

  let total_as = 0;
  let total_ = 0;

  todaysEvents.map(shift=>{
    var t = shift.longday + shift.night + shift.late + shift.early;
    total_as+=shift.assigned.length;
    total_+=t
  })
  
 
  const d = new Date();
  const today = d.getDate();
  let cn = "day";
  
  if (today === dayOfMonth) cn = "day current-day";
  
  if (todaysEvents.length>0 && today === dayOfMonth) cn = "day current-day published";
  if (todaysEvents.length > 0) cn = "day published";
  if(total_as !== 0 && total_as < total_) cn = "day assigned_incomplete";
  if(total_as !== 0 && total_as === total_) cn = "day assigned_complete";
  if (!visible) cn = "day hidden";
  const fetchUsers = async () =>{
    const {token} = authContext.userInfo;
    var temp = []
    axios.get("http://localhost:8000/api/users?type=CARER",{
      headers:{
        'Content-type': 'application/json',
        Authorization:`Token ${token}`
      }
    } ).then(res=>{
      
      res.data.map(user=>{
        temp.unshift({...user, opened:false})
      })
      dispatch({
        type: "CARER_LIST_SUCCESS",
        payload: temp,
      });
      return res.data
    }).catch(error=>{
      dispatch({
        type: "CARER_LIST_FAIL",
        payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
      });
      return error
    })
  }
  return (
    <button
      className={cn}
      onClick={() => {
        if( todaysEvents.length === 0 ){
          alert("No shifts this day!")
        }
        else if(todaysEvents.length > 0){
          fetchUsers().then(()=>{
            dispatch(setDayDetailObj(dayOfMonth));
            dispatch({type:"TOGGLE_DETAIL_SB_AD", payload:todaysEvents});
          }).catch(e=>{
            alert("Something went wrong! try again");
          })
          
        }
      }}
    >
      {dayOfMonth}
      
    </button>
  );
};

export default Day;
