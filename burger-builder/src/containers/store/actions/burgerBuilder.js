import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type:actionTypes.REMOVE_INGREDIENTS,
        ingredientName: name
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.setIngredients,
        ingredients: ingredients
    };
};

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-my-burger.firebaseio.com/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data));
            })
            .catch(error => {
                dispatch(fetchIngredientsfailed());
        });
    };
        
};