import { combineReducers } from "redux";
import loginReducer from '../reducers/loginReducer';

const reducers = combineReducers({
    login:loginReducer
})

export default reducers;