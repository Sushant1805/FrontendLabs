import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showRegisterModal: false,
    showLoginModal : false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setShowRegister(state, action) {
            state.showRegisterModal = action.payload;
        },
        setShowLogin(state,action){
            state.showLoginModal = action.payload;
        }
    }
});

// Correct export
export const { setShowRegister,setShowLogin } = modalSlice.actions;
export default modalSlice.reducer;
