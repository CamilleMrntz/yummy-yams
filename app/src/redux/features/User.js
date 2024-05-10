import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: "user",
    initialState: { value: []},
    reducers: {
        addUser: (state, action) => {
            state.value.push(action.payload)
        }
    }
})

export const { addUser } = userSlice.actions;

export default userSlice.reducer