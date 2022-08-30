import axios from 'axios';
import { LIST_REQUEST, LIST_SUCCESS, LIST_FAIL } from '../types/users';
import { DOMAIN } from '../constants';



export const users = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Token ${userInfo.access}`,
      },
    };

    const { data } = await axios.get(`${DOMAIN}http://localhost:8000/api/user-list`, config);

    dispatch({
      type: "CARER_LIST_SUCCESS",
      payload: data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: "CARER_LIST_FAIL",
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};


export const getuser = () => async (dispatch, getState, navigate) => {
  try {
    dispatch({
      type: "GET_USER_REQUEST",
    });

    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Token ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${DOMAIN}http://localhost:8000/api/user`, config);
    dispatch({
      type: "GET_USER_REQUEST_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "GET_USER_REQUEST_FAIL",
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};