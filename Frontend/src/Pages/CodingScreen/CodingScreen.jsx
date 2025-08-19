// pages/CodingScreen.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import styles from './CodingScreen.module.css';
import ProblemSection from "./ProblemSection";
import axios from "axios";
import EditorSection from "./EditorSection";
import SuccessToast from './Components/SuccessToast';
import { useDispatch } from "react-redux";
import { setSampleTestCases, setMainTestCases, clearTestResults, setActiveTab, setShowSuccessToast } from "./codeSlice";

export default function CodingScreen() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const dispatch = useDispatch()

  // Clear test results when problem ID changes (when navigating between problems)
  useEffect(() => {
    dispatch(clearTestResults());
    dispatch(setActiveTab(0));
    dispatch(setShowSuccessToast(false));
  }, [id, dispatch]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
    .then(data => setProblem(data.data));
  }, [id]);
  useEffect(() => {
    if (problem) {
      dispatch(setSampleTestCases(problem.sampleTestCases || []));
      dispatch(setMainTestCases(problem.mainTestCases || []));
      // Clear previous test results when switching problems
      dispatch(clearTestResults());
      // Reset to Description tab when switching problems
      dispatch(setActiveTab(0));
      // Hide success toast when switching problems
      dispatch(setShowSuccessToast(false));
    }
  }, [problem, dispatch]);
  if (!problem) return <div>Loading...</div>;

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      {/* Problem Details */}
     <ProblemSection problem={problem}/>
      {/* Code Editor */}
      <EditorSection starterCode={problem.starterCode}/>
    </div>
    {/* Success Toast */}
    <SuccessToast />
    </>
  );
}
