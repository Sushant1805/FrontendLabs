import React from 'react'
import FeaturesData from "../Data/FeaturesData"
import { IoExtensionPuzzleOutline } from "react-icons/io5";

const Features = () => {
    return (
        <>
                <div className='feature-page' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '100vh', justifyContent: 'center', paddingTop: '30px', paddingBottom: '30px' }}>

                <h1 className='feature-heading' data-aos="fade-up" data-aos-duration="1000" style={{ fontSize: '2.2rem', marginBottom: '0.7rem', textAlign: 'center', maxWidth: '700px' }}>Why FrontendLabs?</h1>
                <p className='feature-subheading' data-aos="fade-up" data-aos-duration="1000" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center', maxWidth: '700px' }}>Tired of tutorials that don't stick? FrontendLabs helps you learn by doing with real-world challenges that sharpen your skills and build confidence.</p>

                <div className="feature-card-container" data-aos="fade-up" data-aos-duration="1500" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.2rem', maxWidth: '900px', width: '100%' }}>
                    {
                        FeaturesData.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`card glass-effect card-${index}`}
                                    style={{ minWidth: '220px', maxWidth: '260px', flex: '1 1 220px', padding: '1.2rem 1rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: 'auto' }}
                                >
                                    <item.icon className='icon' style={{ fontSize: '2rem', marginBottom: '0.7rem' }} />
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>{item.title} <br/> {item.title1 ? item.title1 : ''}</h3>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: 0 }}>{item.desc}</p>
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