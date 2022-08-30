import React from "react";
import { useSelector, useDispatch } from 'react-redux';

import { deleteEventDispatch } from "../../redux/actions/actionCreatorsDispatch";
import NewEventButton from "./NewEventButton";
import { editEventSidebarObj, setDayDetailObj, toggleDetailSidebarObj, toggleNewEventSidebarObj } from "../../redux/actions/actionCreatorsObj";
import moment from 'moment';
import { Close } from "@mui/icons-material";


const DayDetail = ({id}) => {

  const calendarContext = useSelector(state => state.calendar);
  const dispatch = useDispatch();

  const {
    detailSidebarToggled,
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
        detailSidebarToggled
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
          dispatch(toggleDetailSidebarObj(false));
          dispatch(toggleNewEventSidebarObj(false));
        }}
      >
        <Close />
      </button>
      <p className="detail-sidebar__date">{`${moment.months(currentMonth - 1)} ${dayDetail.today}, ${currentYear}`}</p>
      <NewEventButton target_id={id} date={dayDetail.today} />
    </div>
  );
};

export default DayDetail;
