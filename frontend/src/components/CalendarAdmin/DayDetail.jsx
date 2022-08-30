import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import { deleteEventDispatch } from "../../redux/actions/actionCreatorsDispatch";
import NewEventButton from "./NewEventButton";
import { editEventSidebarObj, setDayDetailObj, toggleDetailSidebarObj, toggleDetailSidebarObjAdmin, toggleNewEventSidebarObj } from "../../redux/actions/actionCreatorsObj";
import moment from 'moment';


const DayDetail = () => {

  const calendarContext = useSelector(state => state.calendar);
  const dispatch = useDispatch();

  const {
    detailSidebarToggledAd,
    dayDetail,
    currentMonth,
    currentYear,
  } = calendarContext;

  const fullEvent = (el) => {
    el.classList.toggle('active')
  }

  return (
    <div
      className={
        detailSidebarToggledAd
          ? "detail-sidebar toggled box-shadow"
          : "detail-sidebar"
      }
      style={{
        top: window.scrollY
      }}
    >
      <button
        className="sidebar__close-btn"
        onClick={() => {
          dispatch({type:"CLOSE_DETAIL_SB_AD", payload:null});
          dispatch(toggleNewEventSidebarObj(false));
        }}
      >
        <i className="fas fa-times-circle"></i>
      </button>
      <p className="detail-sidebar__date">{`${moment.months(currentMonth - 1)} ${dayDetail.today}, ${currentYear}`}</p>
      <NewEventButton date={dayDetail.today} />
    </div>
  );
};

export default DayDetail;
