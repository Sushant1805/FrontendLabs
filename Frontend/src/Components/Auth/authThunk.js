// src/features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/apiClient'

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/auth/user-profile')
    console.log('[loadUser] /api/auth/user-profile response:', res.data);
    return res.data.user // or adjust based on your backend shape
  } catch (err) {
    console.error('[loadUser] Error:', err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load user')
  }
})
