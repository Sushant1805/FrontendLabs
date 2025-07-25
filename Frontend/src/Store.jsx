import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../src/Components/Auth/authSlice'
import modalReducer from '../src/Components/Auth/modalSlice'
const store = configureStore({
    reducer:{
        auth : authReducer,
        modal : modalReducer
    }
})

export default store;