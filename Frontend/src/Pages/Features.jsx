import React from 'react'
import FeaturesData from "../Data/FeaturesData"
import { IoExtensionPuzzleOutline } from "react-icons/io5";

const Features = () => {
    return (
        <>
            <div className='feature-page'>

                <h1 className='feature-heading'>Why FrontendLabs?</h1>
                <p className='feature-subheading'>Tired of tutorials that don’t stick? FrontendLabs helps you learn by doing with real-world challenges that sharpen your skills and build confidence.</p>

                <div className="feature-card-container">
                    {
                        FeaturesData.map((item, index) => {
                            return (
                                <div key={index} className={`card glass-effect card-${index}`}>
                                    <IoExtensionPuzzleOutline className='icon' />
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            )

                        })
                    }
                </div>
                

            </div>
        </>
    )
}

export default Features