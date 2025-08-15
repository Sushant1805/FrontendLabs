import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    code : '',
    testCases : []
}

const codeSlice = createSlice({
    name : 'code',
    initialState,
    reducers:{
        setCode(state,action){
            state.code = action.payload
        },
        setTestCases(state,action){
            state.testCases = action.payload;
        }
    }
})

export const {setCode,setTestCases} = codeSlice.actions;
export default codeSlice.reducer