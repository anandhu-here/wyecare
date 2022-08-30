import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { prevMonthDispatch, nextMonthDispatch } from "../../redux/actions/actionCreatorsDispatch"

import axios from 'axios';

const Buttons = ({key}) => {

  const calendarContext = useSelector(state => state.calendar);
  const {userInfo} = useSelector(state => state.userLogin);

  const dispatch = useDispatch();
  const {
    shiftspublished,
    currentMonth
  } = calendarContext

  const fetchShifts = () =>{
    var month = currentMonth + 1;
    const mon = month<10?"0"+ month?.toString():month
    dispatch({type:"SET_LOADING", payload:null})
    axios.get(`http://localhost:8000/api/shifts?month=${mon}&agent=${true}&key=${key}`, {headers:{
      'Authorization':`Token ${userInfo.token}`
    }}).then(res=>{
      dispatch({type:"SET_SHIFTS", payload:[...shiftspublished,...res.data ]})
      dispatch({type:"STOP_LOADING", payload:null})
    }).catch(e=>{
      
      dispatch({type:"STOP_LOADING", payload:null})
    })
  }
  return (
    <div className="buttons">
      <button
        className="prev-btn"
        onClick={() => {
          dispatch(prevMonthDispatch(calendarContext));
        }}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      <button
        className="next-btn"
        onClick={() => {
          dispatch(nextMonthDispatch(calendarContext));
          fetchShifts()
        }}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Buttons;
