import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../src/Components/Auth/authSlice'
import modalReducer from '../src/Components/Auth/modalSlice'
import codeReducer from '../src/Pages/CodingScreen/codeSlice'
const store = configureStore({
    reducer:{
        auth : authReducer,
        modal : modalReducer,
        code : codeReducer,
    }
})

export default store;