import React from 'react'
import styles from '../Problems.module.css'
import { useNavigate } from 'react-router-dom';

const ProblemsCard = ({problem,index}) => {
    const navigate = useNavigate();
     function getDificultyColor(Difficulty){
        switch(Difficulty){
            case "Easy":
                return '#D4D925';
            case "Medium":
                return '#FF5B00';
            case "Hard":
                return '#990000'
        }
    }
    function getStatusColor(Status){
        switch(Status){
            case "Solved":
                return '#D4D925';
            case "Attempted":
                return '#FF5B00';
            case "Unsolved":
                return '#990000'
        }
    }
    return (
        <div key={index} className={styles.problemCard}>
            <div className={styles.problemCardContent}>
                <h3 className={styles.problemNumber}>{index+1}.</h3>
                <h3 className={styles.problemTitle}>{problem.title}</h3>
                <h3 className={styles.Difficulty} style={{
                    backgroundColor: getDificultyColor(problem.difficulty)
                }}>{problem.difficulty}</h3>
                <h3 className={styles.problemStatus} style={{ color: getStatusColor('Solved') }}>{'Solved'}</h3>
            </div>
            <button
                className='button button-primary'
                onClick={e => {
                    e.stopPropagation();
                    navigate(`/codingScreen/${problem._id}`);
                }}
            >
                Solve
            </button>
        </div>
    )
}

export default ProblemsCard