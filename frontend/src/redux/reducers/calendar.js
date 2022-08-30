import {
  GET_CURRENT_DATE,
  SET_DAYS,
  PREV_MONTH,
  NEXT_MONTH,
  TOGGLE_DETAIL_SB,
  TOGGLE_EVENTS_SB,
  TOGGLE_NEW_EVENT_SB,
  SET_DAY_DETAIL,
  DELETE_EVENT,
  SET_EVENTS,
  ADD_EVENT_DATE,
} from "../types/calendar";

const initialState = {
  currentDayOfMonth: null,
  currentMonth: null,
  currentYear: null,
  shiftspublished: [],
  userAssignedSidebarToggled:false,
  shift:[],
  detailSidebarToggledAd:false,
  userSidebarToggledAd: false,
  days: [],
  assigny:[],
  dayDetail: {
    today: null,
    assigned: [],
    published: false
  },
  userAssignToggled:false,
  shiftType:null,
  detailSidebarToggled: false,
  eventsSidebarToggled: false,
  newEventSidebarToggled: false,
  editEventSidebarToggled: false,
  eventDate: '',
  loading:false,
  home_id:null,
  notification:[]
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_DATE:

      return {
        ...state,
        currentDayOfMonth: action.payload.date,
          currentMonth: action.payload.month,
          currentYear: action.payload.year
      };
    case SET_DAYS:
      return {
        ...state,
        days: action.payload
      };
    case PREV_MONTH:
      return {
        ...state,
        currentMonth: action.payload.month,
          currentYear: action.payload.year
      };
    case NEXT_MONTH:
      return {
        ...state,
        currentMonth: action.payload.month,
          currentYear: action.payload.year
      };
    case TOGGLE_DETAIL_SB:
      return {
        ...state,
        detailSidebarToggled: action.payload
      };
    case "NEW_NOTIFICATION":
      const temp = [...state.notification]
      temp.unshift(action.payload)
      console.log(action.payload, "----")
      return{
        ...state,
        notification:temp
      }
    case "CLEAR_NEW_NOTIFICATION":
      return{
        ...state,
        notification:[]
      }
    case "TOGGLE_DETAIL_SB_AD":
      return{
        ...state,
        detailSidebarToggledAd:true,
        shift: [...action.payload]
      }
    case "TOGGLE_USER_SB_AD":
      return{
        ...state,
        userSidebarToggledAd:true,
        ...action.payload

      }
    case "USER_ASSIGN_SB_CLOSE":
      return{
        ...state,
        userAssignToggled:false
      }
    case "USER_ASSIGN_SB_TOGGLED":
      return{
        ...state,
        userAssignToggled:true
      }
      case "CLOSE_USER_SB_AD":
        return{
          ...state,
          userSidebarToggledAd:false,
          shiftType:null,
          home_id:null
        }
    case "CLOSE_DETAIL_SB_AD":
      return{
        ...state,
        detailSidebarToggledAd:false,
      }
    case "TOGGLE_USER_ASSIGNED_SB":
      return{
        ...state,
        userAssignedSidebarToggled: true
      }
    case "CLOSE_USER_ASSIGNED_SB":
      return{
        ...state,
        userAssignedSidebarToggled: false
      }
    case TOGGLE_EVENTS_SB:
      return {
        ...state,
        eventsSidebarToggled: action.payload
      };
    case TOGGLE_NEW_EVENT_SB:
      return {
        ...state,
        newEventSidebarToggled: action.payload
      };
    case SET_DAY_DETAIL:
      return {
        ...state,
        dayDetail: action.payload
      };

    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.payload)
      };
      case "SET_SHIFTS":
        return{
            ...state,
            shiftspublished:action.payload
        }
    
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload
      };
    
    case ADD_EVENT_DATE:
      return {
        ...state,
        eventDate: action.payload
      };
    default:
      return state;
  }
};