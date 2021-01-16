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
import * as burgerBuilderActions from '../store/actions/burgerBuilder';



class BurgerBuilder extends Component {

    state = {
    
        purchasable:false,
        loading:false, 
        error:false
        
    }
    componentDidMount (){
        console.log(this.props);
        // axios.get('https://react-my-burger-edff0-default-rtdb.firebaseio.com/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients:response.data});
        // })
        // .catch(error => {
        //     this.setState({error: true});
        // });
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
        this.setState({purchasing:true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});

    }
    purchaseContinueHandler = () => {
        //alert('You continue!');
        //this.setState({loading:true});

    
        this.props.history.push('/checkout');
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price : this.state.price,
        //     customer:{
        //         name: 'Max Schwarzmüller',
        //         address: {
        //             street: 'Teststreet 1',
        //             zipCode: '41351',
        //             country: 'Germany'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders.json', order).then(response => {
            
        //     this.setState({loading:false, purchasing:false});
        // })
        // .catch(error => {
        //     this.setState({loading:false, purchasing:false});
            
        // });
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

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
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>;
        }
        
        if(this.state.loading)
            orderSummary = <Spinner/>;
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients)

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));