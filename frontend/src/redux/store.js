import { createStore, applyMiddleware, combineReducers,  } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { loginReducer, registerReducer } from './reducers/authReducers';
import calendar  from './reducers/calendar';
import { serviceChangeReducer } from './reducers/serviceChange';
import usersReducer from './reducers/userReducer';
const reducer = combineReducers({
  userLogin: loginReducer,
  userRegister: registerReducer,
  calendar:calendar,
  serviceChangeReducer:serviceChangeReducer,
  userState: usersReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};
const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
