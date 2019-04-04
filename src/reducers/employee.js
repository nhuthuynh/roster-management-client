import {
    LOGIN,
    LOGOUT,
    REGISTER
} from '../constants/actiontypes'

const initialState = {
    employee: {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        isLoggedIn: false
    },
    roster: {}
}

const login = (state = initialState, action) => {
    switch(action.type) {
        case LOGIN:
            return initialState
        default:
            return state;
    }
}

const logout = (state = initialState, action) => {
    switch(action.type) {
        case LOGOUT:
            return initialState
        default:
            return state;
    }
}

const register = (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
            return initialState
        default:
            return state
    }
}

const employee = (state = initialState, action) => {
    switch(action.type) {
        case REGISTER:
            return initialState
        case LOGIN:
            return initialState
        case LOGOUT:
            return initialState
        default:
            return initialState
    }
}

export default employee