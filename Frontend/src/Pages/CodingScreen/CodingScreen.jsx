// pages/CodingScreen.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import styles from './CodingScreen.module.css';
import ProblemSection from "./ProblemSection";
import axios from "axios";
import EditorSection from "./EditorSection";
import { useDispatch } from "react-redux";
import { setTestCases } from "./codeSlice";

export default function CodingScreen() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
    .then(data => setProblem(data.data));
  }, [id]);
  useEffect(() => {
    if (problem) {
      dispatch(setTestCases(problem.testCases));
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
    </>
  );
}
