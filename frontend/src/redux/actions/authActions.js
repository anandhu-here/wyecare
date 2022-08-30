import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGOUT,
} from '../types/auth';

import { DOMAIN } from '../constants';

export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  axios.post(`${DOMAIN}http://localhost:8000/api/login`, { email, password }, config).then(res=>{
    const { data } = res;
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
  }).catch(error=>{
    console.log(error, "888888888")
    dispatch({type:"LOGIN_FAIL", payload:error.message})
  })
};

export const register = (firstName, lastName, email, password, homeName, type, company, phone, postcode, key) => async (dispatch) => {
  try {
    dispatch({
      type: REGISTER_REQUEST,
    });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post(
      `${DOMAIN}http://localhost:8000/api/signup`,
      { first_name: firstName, last_name:lastName, email, password,home_name:homeName, type, company, phone, postcode, key },
      config
    );

    dispatch({ 
      type: REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: LOGOUT });
  
};
