import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../src/Components/Auth/authSlice'

const store = configureStore({
    reducer:{
        auth : authReducer
    }
})

export default store;