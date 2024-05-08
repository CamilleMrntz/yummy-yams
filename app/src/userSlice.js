import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    // Autres états liés à l'utilisateur...
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    // Autres reducers...
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
