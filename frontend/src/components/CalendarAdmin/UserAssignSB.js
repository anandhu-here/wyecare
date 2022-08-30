import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function UserAssignSB() {
    const calendarContext = useSelector(state=>state.calendar);
    const dispatch = useDispatch();
    const {
        userAssignToggled
    } = calendarContext;
  return (
    <div className={
        userAssignToggled?
        "user-sidebar toggled box-shadow":
        "user-sidebar"
      }
          >
          <button
          className="sidebar__close-btn"
          onClick={() => {
            dispatch({type:"TOGGLE_USER_SB_AD", payload:null});
            dispatch({type:"USER_ASSIGN_SB_CLOSE", payload:true});
          }}
        ></button>
         
      </div>
  )
}

export default UserAssignSB