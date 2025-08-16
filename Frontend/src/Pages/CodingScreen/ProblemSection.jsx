import React, { useEffect, useRef,useState } from 'react'
import styles from './CodingScreen.module.css';
import MenuTab from './Components/MenuTab';
import InfoTab from './Components/InfoTab';
const ProblemSection = ({problem}) => {
  const [activeTab,setActiveTab] = useState(0);
  const problemInfoRef = useRef(null);

  useEffect(() => {
    const problemInfo = problemInfoRef.current;

    if (problemInfo) {
      // Add wheel event handler to ensure mouse wheel scrolling works
      const wheelHandler = (e) => {
        e.stopPropagation(); // Prevent parent elements from handling the wheel event
        problemInfo.scrollTop += e.deltaY;
      };
      problemInfo.addEventListener('wheel', wheelHandler, { passive: false });

      return () => {
        problemInfo.removeEventListener('wheel', wheelHandler);
      };
    }
  }, []);

  return (
     <div className={styles.problemSection}>
        {/* Navigation Menus  */}
        <div className={styles.menuContainer}>
            <MenuTab activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>

        {/*Problem Description */}
        {
          activeTab === 0 && <div ref={problemInfoRef} className={styles.problemInfoContainer}>
          <h2>{problem.title}</h2>
        <div className={styles.menuContainer}>
            <InfoTab Difficulty={problem.difficulty}/> 
        </div>
        <p>{problem.description}</p>

        {problem.requirements && problem.requirements.length > 0 && (
          <>
            <h3>Requirements</h3>
            <ol className={styles.requirementsList}>
              {problem.requirements.map((requirement, idx) => (
                <li key={idx}>
                  {requirement}
                </li>
              ))}
            </ol>
          </>
        )}

        <h3>Examples</h3>
        <ul>
          {problem.sampleTestCases.map((tc, idx) => (
            <li key={idx} className={styles.testCase}>
              <strong>{`Example ${idx+1} : `}</strong> {tc.input} <br />
              <strong>Input:</strong> {tc.input} <br />
              <strong>Explanation:</strong> {tc.explanation}
            </li>
          ))}
        </ul>
        <h3>Constraints</h3>
        <ol className={styles.constraintsContainer}>
          {
          problem.constraints.map((item,index)=>{
           return <li key={index}>{item}</li>
          })
          }
        </ol>
        
        </div>
        }

        {/*Problem Solution */}
        {
          activeTab === 1 && 
          <div>
          
          </div>
        }
          
      </div>
  )
}

export default ProblemSection