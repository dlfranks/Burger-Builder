import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import Aux from '../../hoc/Auxi';
import classes from './burger.module.css'



const Burger = (props) => {

    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey =>{
            return[...Array(props.ingredients[igKey]).map( (_, i) => {  //ingredients:{salad:1,bacon:1,cheese:1,meat:1}
                return <BurgerIngredient key={igKey + i} type={igKey}/>;
            })];
    });
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
        
        
    );
}

export default Burger;