import React, { useState } from 'react';
import { menuTabs } from '../../../Data/MenuTabsData';
import styles from '../CodingScreen.module.css';

const MenuTab = ({activeTab,setActiveTab}) => {
    return (
        <>
            {menuTabs.map((item, index) => {
                return (
                    <div key={index} className={`${styles.menuTab} ${activeTab === index ? styles.activeTab : ''}`} onClick={()=>setActiveTab(index)}>
                        <item.icon />
                        <h4 className={styles.menuTabText}>{item.tabName}</h4>
                    </div>
                );
            })}

        </>
    );
};

export default MenuTab;
