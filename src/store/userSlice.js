import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// import jwt_decode from 'jwt-decode'
import { jwtDecode } from 'jwt-decode'


const API = 'http://127.0.0.1:5000' // Adjust if needed

// ----------- Async Thunks -----------

export const loginUser = createAsyncThunk('user/loginUser', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/login`, userData)
    localStorage.setItem('token', res.data.access_token)
    return res.data.access_token
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const registerUser = createAsyncThunk('user/registerUser', async (userData, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/register`, userData) // includes username now
    return res.data.message
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})


export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/api/users')  // change URL if needed
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, thunkAPI) => {
  try {
    await axios.delete(`/api/users/${id}`)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token')
  dispatch(logout())
}

// ----------- Slice -----------

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token') || null,
    role: null,
    status: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null
      state.role = null
      localStorage.removeItem('token')
    },
    loadUser: (state) => {
      const token = localStorage.getItem('token')
      if (token) {
        const decoded = jwtDecode(token)
        state.token = token
        state.role = decoded.role
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.allUsers = state.allUsers.filter(user => user.id !== action.payload)
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload
        const decoded = jwtDecode(action.payload)
        state.role = decoded.role
        state.status = 'succeeded'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'registered'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout, loadUser } = userSlice.actions
export default userSlice.reducer
