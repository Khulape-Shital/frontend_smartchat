const { createSlice, isFulfilled } = require("@reduxjs/toolkit");
const { act } = require("react");
const { fetchModels } = require("./modelsthunk");

const modelSlice = createSlice({
    name:"models",
    initialState :{
        models:[],
        selected :"",
        loading:false
    },

    reducers:{
        setSelectedModel:(state, action)=>{
            state.selected= action.payload
        }
    },

    extraReducers:(builder)=>{
        builder
            .addCase(fetchModels.pending,(state)=>{
                state.loading = true;

            })
            .addCase(fetchModels.fulfilled,(state,action)=>{
                state.loading = false,
                state.models= action.payload.map((m)=>m.model);
            })
            .addCase(fetchModels.rejected,(state)=>{
                state.loading= false;
        
            })
    }
})
export const {setSelectedModel}= modelSlice.actions;
export default modelSlice.reducer;  