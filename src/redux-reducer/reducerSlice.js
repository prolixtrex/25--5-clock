import {createSlice} from '@reduxjs/toolkit'

const reducerSlice = createSlice({
    name: 'clock',
    initialState: {
        breakLength: 5,
        sessionLength: 25,
    },
    reducers: {
        breakIncrement: (state) => {
            if (state.breakLength < 60) {
                state.breakLength += 1
            }
        },
        breakDecrement: (state) => {
            if (state.breakLength > 1) {
                state.breakLength -= 1
            }
        },
        sessionIncrement: (state) => {
            if(state.sessionLength < 60) {
                state.sessionLength += 1;
            }
        },
        sessionDecrement: (state) => {
            if(state.sessionLength > 1) {
                state.sessionLength -= 1;
            }
        },
        resetBS: (state) => {
            state.breakLength = 5;
            state.sessionLength = 25;
        }
    }
})

export const {breakIncrement, breakDecrement, sessionIncrement, sessionDecrement, resetBS} = reducerSlice.actions;

export default reducerSlice.reducer;