import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    code : '',
    testCases : [],
    sampleTestCases: [],
    mainTestCases: [],
    testResults: [],
    testType: null, // 'sample' or 'main'
    activeTab: 0, // 0: Description, 1: Solution, 2: Results, 3: Submissions
    showSuccessToast: false,
    isLoading: false,
    submissions: [],
    isLoadingSubmissions: false,
    showCodeModal: false,
    modalCode: ''
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
            state.isLoading = false;
        },
        setShowSuccessToast(state, action) {
            state.showSuccessToast = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setSubmissions(state, action) {
            state.submissions = action.payload;
        },
        setIsLoadingSubmissions(state, action) {
            state.isLoadingSubmissions = action.payload;
        },
        clearSubmissions(state) {
            state.submissions = [];
            state.isLoadingSubmissions = false;
            state.showCodeModal = false;
            state.modalCode = '';
        },
        setShowCodeModal(state, action) {
            state.showCodeModal = action.payload;
        },
        setModalCode(state, action) {
            state.modalCode = action.payload;
        },
        openCodeModal(state, action) {
            state.showCodeModal = true;
            state.modalCode = action.payload;
        },
        closeCodeModal(state) {
            state.showCodeModal = false;
            state.modalCode = '';
        }
    }
})

export const {setCode, setTestCases, setSampleTestCases, setMainTestCases, setTestResults, setTestType, setActiveTab, clearTestResults, setShowSuccessToast, setIsLoading, setSubmissions, setIsLoadingSubmissions, clearSubmissions, setShowCodeModal, setModalCode, openCodeModal, closeCodeModal} = codeSlice.actions;
export default codeSlice.reducer