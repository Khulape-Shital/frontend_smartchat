import { get_models } from "@/services/chatService";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchModels= createAsyncThunk(
    "models/fetchModels",
    async ()=>{
        const res = await get_models();
        return res;
    }
)