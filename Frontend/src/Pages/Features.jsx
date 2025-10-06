import React from 'react'
import FeaturesData from "../Data/FeaturesData"
import styles from './Features.module.css'

const Features = () => {
    return (
        <>
            <div className={styles.featureSection}>
                <h1 className={`${styles.featureHeading}`} data-aos="fade-up" data-aos-duration="1000">Why FrontendLabs?</h1>
                <p className={`${styles.featureSubheading}`} data-aos="fade-up" data-aos-duration="1000">Tired of tutorials that don't stick? FrontendLabs helps you learn by doing with real-world challenges that sharpen your skills and build confidence.</p>

                <div className={styles.featureCards} data-aos="fade-up" data-aos-duration="1500">
                    {FeaturesData.map((item, index) => (
                        <div key={index} className={`card glass-effect card-${index} ${styles.featureCard}`}>
                            <item.icon className={`icon ${styles.featureIcon}`} />
                            <h3 className={styles.featureTitle}>
                                {item.title} <br /> {item.title1 ? item.title1 : ''}
                            </h3>
                            <p className={styles.featureDesc}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Features