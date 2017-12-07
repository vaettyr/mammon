import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

class Form extends Component {
	
	constructor(props) {
		super(props);
		this.render = this.render.bind(this);
	}
	
	render() {
		//renders all of it's children
		let { children, form, className, onChangeHandler, nested} = this.props;
		const childrenWithProps = React.Children.map(children, 
		(child) => {if(child) {return React.cloneElement(child, {onChange: onChangeHandler, form: form})}});
		if(!nested) {
			return (<form className={className}>{childrenWithProps}</form>);
		} else {
			return (<div className={className}>{childrenWithProps}</div>);
		}
	}
}
const onChangeHandler = (key, value, error, form) => {
	return function (dispatch, getState) {
		if(key && value !== undefined && form) {
			dispatch({type: actions.FORM_SET_VALUE, form: form, key: key, value: value});
			dispatch({type: actions.VALIDATOR_SET_ERROR, form: form, key: key, error: error});
		}		
	}
}
const mapStateToProps = (state, ownProps) => ({
	data: state.form[ownProps.form],
	valid: state.validator[ownProps.form] ? Object.keys(state.validator[ownProps.form]).some(item => state.validator[ownProps.form][item].isValid) : false
})
const mapDispatchToProps = (dispatch, ownProps) => ({
	onChangeHandler: (key, value, error) => dispatch(onChangeHandler(key, value, error, ownProps.form))
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);