import React from 'react'
import styles from './CodingScreen.module.css';
import MenuTab from './Components/MenuTab';
import InfoTab from './Components/InfoTab';
const ProblemSection = ({problem}) => {
  return (
     <div className={styles.problemSection}>
        {/* Navigation Menus  */}
        <div className={styles.menuContainer}>
            <MenuTab/> 
        </div>
        <h2>{problem.title}</h2>
        <div className={styles.menuContainer}>
            <InfoTab Difficulty={problem.difficulty}/> 
        </div>
        <p>{problem.description}</p>
        <h3>Examples</h3>
        <ul>
          {problem.testCases.map((tc, idx) => (
            <li key={idx} className={styles.testCase}>
              <strong>{`Example ${idx+1} : `}</strong> {tc.input} <br />
              <strong>Input:</strong> {tc.input} <br />
              <strong>Explanation:</strong> {tc.explanation}
            </li>
          ))}
        </ul>
        <h3>Constraints</h3>
        <strong>{problem.constraints}</strong>
          
      </div>
  )
}

export default ProblemSection