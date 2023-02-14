import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: '',
  role: null,
  access_token: null,
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.id = payload.id
      state.role = payload.role
      state.email = payload.email
      state.access_token = payload.access_token
    },
  }
});

// this is for dispatch
export const { login } = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;