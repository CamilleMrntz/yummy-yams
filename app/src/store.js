import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Importez votre slice

export default configureStore({
  reducer: {
    user: userReducer, // Ajoutez votre reducer
    // Autres reducers...
  },
});
