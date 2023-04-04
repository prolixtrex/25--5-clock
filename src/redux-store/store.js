import { configureStore } from "@reduxjs/toolkit";
import reducerSlice from "../redux-reducer/reducerSlice";


export default configureStore({
    reducer: {
        clock: reducerSlice
    }
})