// pages/CodingScreen.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import styles from './CodingScreen.module.css';
import ProblemSection from "./ProblemSection";
import axios from "axios";
import EditorSection from "./EditorSection";

export default function CodingScreen() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
    .then(data => setProblem(data.data));
  }, [id]);

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
