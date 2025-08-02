import React from 'react'
import styles from '../Problems.module.css'
const ProblemsCard = ({problem,index}) => {
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
            <h3  style={{ color: getStatusColor('Solved'),width:"15%" }}>{'Solved'}</h3>
            <input type="button" value="Solve" className='button button-primary' />
        </div>
    )
}

export default ProblemsCard