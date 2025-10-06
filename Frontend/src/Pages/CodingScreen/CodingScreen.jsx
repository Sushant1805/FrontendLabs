// pages/CodingScreen.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import styles from './CodingScreen.module.css';
import ProblemSection from "./ProblemSection";
import axios from "axios";
import EditorSection from "./EditorSection";
import SuccessToast from './Components/SuccessToast';
import { useDispatch, useSelector } from "react-redux";
import { setSampleTestCases, setMainTestCases, clearTestResults, setActiveTab, setShowSuccessToast, clearSubmissions, setSubmissions, setIsLoadingSubmissions } from "./codeSlice";

export default function CodingScreen() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);
  // Fixed widths
  const problemWidth = 50; // percent
  const editorWidth = 50; // percent

  // Clear test results when problem ID changes (when navigating between problems)
  useEffect(() => {
    dispatch(clearTestResults());
    dispatch(clearSubmissions());
    dispatch(setActiveTab(0));
    dispatch(setShowSuccessToast(false));
  }, [id, dispatch]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(data => {
        setProblem(data.data);
        console.log(data.data);
      });
  }, [id]);

  useEffect(() => {
    if (problem) {
      dispatch(setSampleTestCases(problem.sampleTestCases || []));
      dispatch(setMainTestCases(problem.mainTestCases || []));
      dispatch(clearTestResults());
      dispatch(clearSubmissions());
      dispatch(setActiveTab(0));
      dispatch(setShowSuccessToast(false));
    }
  }, [problem, dispatch]);

  // ...no dragging logic...

  if (!problem) return <div>Loading...</div>;

  return (
    <>
      <Navbar problemId={id} />
      <div
        className={styles.container}
        id="coding-container"
        style={{ position: 'relative' }}
      >
        <div
          className={styles.problemSection}
         
        >
          <ProblemSection problem={problem} />
        </div>
        <div
          className={styles.editorSection}
          
        >
          <EditorSection starterCode={problem.starterCode} />
        </div>
      </div>
      <SuccessToast />
    </>
  );
}
