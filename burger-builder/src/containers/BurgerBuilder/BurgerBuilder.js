import React, {Component} from 'react';
import Aux from '../../hoc/Auxi';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorhandler';


const INCREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients:null,
        totalPrice:4,
        purchasable:false,
        purchasing:false,
        loading:false, 
        error:false
        
    }
    componentDidMount (){
        axios.get('https://react-my-burger-edff0-default-rtdb.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients:response.data});
        })
        .catch(error => {
            this.setState({error: true});
        });
    }
    updatedPurchaseState (ingredients){
        const sum = Object.keys(ingredients).map((igKey) => {
            return this.state.ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({purchasable: sum > 0});
    }

    addingIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        const updateCount = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCount;
        const priceAddition = INCREDIENT_PRICES[type];
        const oldprice = this.state.totalPrice;
        const newPrice = oldprice + priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updateIngredients}, () => this.updatedPurchaseState(updateIngredients));
        
    }

    removeIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updateCount = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = updateCount;
        const priceAddition = INCREDIENT_PRICES[type];
        const oldprice = this.state.totalPrice;
        const newPrice = oldprice - priceAddition;
        this.setState({totalPrice:newPrice, ingredients: updateIngredients});
        this.updatedPurchaseState(updateIngredients);
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

        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
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
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                    price={this.state.totalPrice}
                    ingredientAdded={this.addingIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled = {disabledInfo}
                    ordered = {this.purchaseHandler}
                    purchasable={this.state.purchasable}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients}
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

export default withErrorHandler(BurgerBuilder, axios);