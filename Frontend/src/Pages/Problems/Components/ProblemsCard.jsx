import React from 'react'
import styles from '../Problems.module.css'
import { useNavigate } from 'react-router-dom';

const ProblemsCard = ({problem,index,disableSolve}) => {
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
            <h3 style={{width:'5%'}}>{index+1}.</h3>
            <h3 style={{width:'25%',textAlign:'start'}}>{problem.title}</h3>
            <h3 className={styles.Difficulty} style={{
                backgroundColor: getDificultyColor(problem.difficulty),
                width:"10%"
            }}>{problem.difficulty}</h3>
            <h3  style={{ color: getStatusColor(problem.Status),width:"15%" }}>{problem.Status}</h3>
            <button
                className='button button-primary'
                onClick={e => {
                    e.stopPropagation();
                    navigate(`/codingScreen/${problem._id}`);
                }}
                disabled={disableSolve}
                style={disableSolve ? {background:'#222', color:'#aaa', cursor:'not-allowed'} : {}}
            >
                Solve
            </button>
        </div>
    )
}

export default ProblemsCard