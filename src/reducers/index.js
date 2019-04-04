import { combineReducers } from 'redux'
import employee from './employee'
import { reducer as formReducer } from 'redux-form'

export default combineReducers({
    employee,
    form: formReducer
  })