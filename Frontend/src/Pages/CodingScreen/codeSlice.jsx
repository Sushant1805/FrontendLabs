import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    code : '',
    testCases : [],
    sampleTestCases: [],
    mainTestCases: [],
    testResults: [],
    testType: null, // 'sample' or 'main'
    activeTab: 0, // 0: Description, 1: Solution, 2: Results, 3: Submissions
    showSuccessToast: false
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
        },
        setSampleTestCases(state, action) {
            state.sampleTestCases = action.payload;
        },
        setMainTestCases(state, action) {
            state.mainTestCases = action.payload;
        },
        setTestResults(state, action) {
            state.testResults = action.payload;
        },
        setTestType(state, action) {
            state.testType = action.payload;
        },
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        },
        clearTestResults(state) {
            state.testResults = [];
            state.testType = null;
        },
        setShowSuccessToast(state, action) {
            state.showSuccessToast = action.payload;
        }
    }
})

export const {setCode, setTestCases, setSampleTestCases, setMainTestCases, setTestResults, setTestType, setActiveTab, clearTestResults, setShowSuccessToast} = codeSlice.actions;
export default codeSlice.reducer