// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {loadUser}  from './authThunk' // 👈 import your thunk here

const initialState = {
  user: null,              // Will store user info (e.g., name, email)
  isAuthenticated: false,  // Flag to track login status
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { login, logout, updateUser } = authSlice.actions
export default authSlice.reducer
