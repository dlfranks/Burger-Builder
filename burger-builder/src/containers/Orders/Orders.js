import React, { Component } from 'react';
import {connect} from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/WithErrorHandler/withErrorhandler';


class Orders extends Component{
    
    state = {
        orders: [],
        loading: true
    }

    componentDidMount () {
        this.props.onFetchOrders();
    }

    render (){

        return (
            <div>
                {
                    this.state.orders.map(order => (
                        <Order
                            key={order.id}
                            ingredients={order.ingredients}
                            price={order.price} />
                    ))
                }
            </div>
        );
    };
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: () => dispatch(actons.fetchedOrders())
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Orders);


