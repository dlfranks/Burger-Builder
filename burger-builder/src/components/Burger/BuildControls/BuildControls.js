import React from 'react';
import BuildControl from './BuildControl/BuildControl';
import classes from './buildControls.module.css';

const controls = [
    {label: 'Salad', type:'salad'},
    {label: 'Bacon', type:'bacon'},
    {label: 'Cheese', type:'cheese'},
    {label: 'Meat', type:'meat'}
]
const buildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {
                controls.map((ctrl) => {
                    return (<BuildControl 
                    key={ctrl.label}
                    label={ctrl.label}
                    added={() => props.ingredientAdded(ctrl.type)}
                    removed={() => props.ingredientRemoved(ctrl.type)}
                    disabled = {props.disabled[ctrl.type]}

                    />
                )})}
            <div>
                <button
                className={classes.OrderButton}
                disabled={!props.purchasable}
                onClick={props.ordered}
                >Order Now</button>
            </div>
            
        </div>
    );
}

export default buildControls;