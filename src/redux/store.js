import { configureStore } from "@reduxjs/toolkit";
import modelreducer from "./thunkSlice/modelsSlice"

export const store = configureStore({
    reducer:{
       models:modelreducer,
    }
})