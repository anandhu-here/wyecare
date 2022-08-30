/* eslint-disable default-param-last */
import { LIST_REQUEST, LIST_SUCCESS, LIST_FAIL, LIST_RESET } from '../types/users';

export const usersReducer = (state = { USERLIST: [] }, action) => {
  switch (action.type) {
    case LIST_REQUEST:
      return {
        loading: true,
        USERLIST: [],
      };
    case "GET_USER_REQUEST":
      return {
        loading:true,
        user:null
      }
    case "GET_USER_REQUEST_SUCCESS":
      return{
        loading:false,
        user: action.payload,
        success:true
      }
    case "GET_USER_REQUEST_FAIL":
      return{
        loading: false,
        error: action.payload
      }
    case LIST_SUCCESS:
      return {
        loading: false,
        success: true,
        USERLIST: action.payload,
      };

    case LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
        USERLIST: [],
      };

    case LIST_RESET:
      return {
        USERLIST: [],
      };

    default:
      return state;
  }
};
