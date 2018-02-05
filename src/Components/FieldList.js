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

const mapState = (state, ownProps) => { 
	let raw = ownProps.model.replace(/\[(\w+)\]/g, '.$1').split('.').reduce((root, prop) => root && root[prop] ? root[prop] : '', state.form[ownProps.form])||[];
	return {
	value: raw,
	filtered: (callback) => {
		let processed = raw.reduce((list, item, index) => {
			if(!item.DELETE) {
				list.push({item, index});
			}
			return list;
		}, []);
		let list = [];
		processed.forEach((element, index) => list.push(callback(element.item, element.index, index)));
		return list;
	}
}};

const move = (from, to, form, model) => ({type:actions.FORM_LIST_SORT, key: model, form: form, from:from, to:to});
const push = (item, form, model) => ({type: actions.FORM_LIST_ADD, item: item, form: form, key: model});
const remove = (index, form, model, soft) => ({type:actions.FORM_LIST_REMOVE, index: index, form: form, key: model, soft:soft});


const mapDispatch = (dispatch, ownProps) => ({
	move: (index, direction) => {dispatch(move(index, index + direction, ownProps.form, ownProps.model))},
	//pop,
	push: (item) => {dispatch(push(item, ownProps.form, ownProps.model))},
	remove: (index, soft) => {dispatch(remove(index, ownProps.form, ownProps.model, soft))},
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