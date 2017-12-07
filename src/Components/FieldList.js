import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

class FieldList extends Component {
	//wraps an element and binds some utility features to it
	//also exposes it to the Form element
	
	render() {
		let {component, model, ...rest} = this.props;
		//renders it's component
		const child = React.createElement(component, {...rest, model: (name, index) => `${model}[${index}].${name}`, parent: model });
		return child;
	}
}

const mapState = (state, ownProps) => { return {
	value: ownProps.model.replace(/\[(\w+)\]/g, '.$1').split('.').reduce((root, prop) => root && root[prop] ? root[prop] : '', state.form[ownProps.form])
}};

const move = (from, to) => {
	debugger;
}

const push = (item, form, model) => ({type: actions.FORM_LIST_ADD, item: item, form: form, key: model});
const remove = (index, form, model) => ({type:actions.FORM_LIST_REMOVE, index: index, form: form, key: model});


const mapDispatch = (dispatch, ownProps) => ({
	move,
	//pop,
	push: (item) => {dispatch(push(item, ownProps.form, ownProps.model))},
	remove: (index) => {dispatch(remove(index, ownProps.form, ownProps.model))},
	//clear,
	//shift, 
	//unshift,
	//swap
});

const merge = (stateProps, dispatchProps, ownProps) => ({
	...ownProps,
	...stateProps,	
	fields: dispatchProps
});
export default connect(mapState, mapDispatch, merge) (FieldList);