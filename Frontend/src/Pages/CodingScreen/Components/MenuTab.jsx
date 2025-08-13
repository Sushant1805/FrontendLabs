import React from 'react';
import { menuTabs } from '../../../Data/MenuTabsData';
import styles from '../CodingScreen.module.css';

const MenuTab = () => {
    return (
        <>
            {menuTabs.map((item, index) => {
                return (
                    <div key={index} className={styles.menuTab}>
                        <item.icon />
                        <h4 className={styles.menuTabText}>{item.tabName}</h4>
                    </div>
                );
            })}

        </>
    );
};

export default MenuTab;
