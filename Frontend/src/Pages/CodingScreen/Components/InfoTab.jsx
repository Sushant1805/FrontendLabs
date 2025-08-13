import React from 'react'
import styles from '../CodingScreen.module.css';
import { RiFireLine } from "react-icons/ri";
import { IoTimeOutline } from "react-icons/io5";
const InfoTab = ({ Difficulty }) => {
    function getTime(Difficulty) {
        switch (Difficulty) {
            case 'Easy':
                return `10-15 mins`;
            case 'Medium':
                return `20-30 mins`;
            case 'Hard':
                return `30-45 mins`;
        }
    }
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
    return (
        <>
         <div className={styles.menuTab}>
            <RiFireLine/>
            <h4 className={styles.menuTabText} style={{
                color: getDificultyColor(Difficulty)
            }}>{Difficulty}</h4>
        </div>
         <div className={styles.menuTab}>
            <IoTimeOutline/>
            <h4 className={styles.menuTabText}>{getTime(Difficulty)}</h4>
        </div>
        </>
       
    )
}

export default InfoTab