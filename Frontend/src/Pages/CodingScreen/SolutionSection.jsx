import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import styles from './CodingScreen.module.css';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  duotoneDark,
  duotoneLight,
  okaidia,
  twilight,
  coy,
  prism,
  solarizedlight,
  tomorrow,
  funky
} from "react-syntax-highlighter/dist/esm/styles/prism";
const SolutionSection = ({ title,id }) => {
    const solutionInfoRef = useRef(null);

    useEffect(() => {
        const solutionInfo = solutionInfoRef.current;

        if (solutionInfo) {
            // Add wheel event handler to ensure mouse wheel scrolling works
            const wheelHandler = (e) => {
                // Only handle wheel events if the element can scroll
                if (solutionInfo.scrollHeight > solutionInfo.clientHeight) {
                    e.stopPropagation(); // Prevent parent elements from handling the wheel event

                    // Check if we're at the top or bottom to allow natural scrolling
                    const atTop = solutionInfo.scrollTop === 0;
                    const atBottom = solutionInfo.scrollTop >= solutionInfo.scrollHeight - solutionInfo.clientHeight;

                    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
                        return; // Allow default behavior at boundaries
                    }

                    e.preventDefault();
                    solutionInfo.scrollTop += e.deltaY;
                }
            };

            solutionInfo.addEventListener('wheel', wheelHandler, { passive: false });

            return () => {
                solutionInfo.removeEventListener('wheel', wheelHandler);
            };
        }
    }, [title]); // Re-run when tab changes
    const URL = `http://localhost:5000/api/editorials/${id}`;
    const [editorial, setEditorial] = useState([])
    useEffect(() => {
        axios.get(URL)
            .then((data) => setEditorial(data.data.data.solutions));
    }, [])
    if (!editorial) return <p>Loading Solutions..</p>
    return (
        <div ref={solutionInfoRef} className={styles.solutionInfoContainer}>
            <h1>{title} Solutions</h1>
            {
                editorial && editorial.map((item, index) => {
                    return <div className={styles.solutionContainer} key={index}>
                        <h2>Approach {index + 1} : {item.approachName}</h2>
                        <h2>Algorithm</h2>
                        <p>{item.algorithm}</p>
                        <h2>Implementation</h2>
                        <SyntaxHighlighter language="javascript" style={twilight}>
                            {item.implementation}
                        </SyntaxHighlighter>
                     
                        <h2>Complexity Analysis</h2>
                        {
                            item.complexityAnalysis.map((complexity, i) => {
                                return <div key={i}>
                                    <h2>{complexity.complexity}</h2>
                                    <p>{complexity.explanation}</p>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    )
}

export default SolutionSection