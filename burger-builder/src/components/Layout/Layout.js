import React from 'react';
import Aux from '../../hoc/Auxi.js';
import classes from './layout.module.css';


const layout = (props) => (
    <Aux>
        <div>Toolbar, SideDrawer, Backdrop</div>
     
        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
    

);

export default layout;