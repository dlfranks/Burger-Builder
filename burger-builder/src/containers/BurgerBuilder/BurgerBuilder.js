import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorhandler';
import * as actions from '../../store/actions/index';



class BurgerBuilder extends Component {

    state = {
        purchasing:false,
    }
    componentDidMount (){
        console.log(this.props);
        this.props.onInitIngredients();
    }
    updatedPurchaseState (ingredients){
        const sum = Object.keys(ingredients).map((igKey) => {
            return this.props.ings[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }

    
    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } );
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});

    }
    purchaseContinueHandler = () => {
        
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                    price={this.props.price}
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved = {this.props.onIngredientRemoved}
                    disabled = {disabledInfo}
                    ordered = {this.purchaseHandler}
                    purchasable={this.updatedPurchaseState(this.props.ings)}
                    isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null

    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
        

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));