import { combineReducers } from 'redux';
import  eventReducer from './event';
import  roomReducer from './room';
import  registrationReducer from './registration';
import  authReducer from './auth';
import  formReducer from './questionForms';
const rootReducer = combineReducers({
  event : eventReducer,
  room : roomReducer,
  registration : registrationReducer,
  auth : authReducer,
  questionForm : formReducer
});

export default rootReducer;


