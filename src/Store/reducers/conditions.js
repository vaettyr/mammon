import * as actions from '../actionTypes';

export const conditions = (state = {}, action) => {
	//let sub = state[action.form] || {};
	let comp = JSON.parse(JSON.stringify(state)) || {};
	switch (action.type) {
	case actions.CONDITIONS_SET_ITEM:		
		if(!comp[action.form]) comp[action.form] = {};
		action.key.replace(/\[(\w+)\]/g, '.$1').split('.')
		.reduce((root, prop, index, list) => {
			if(index === list.length-1) {
				root[prop] = action.conditions;
				return undefined;
			} else {
				if(!root[prop]) {
					root[prop] = {};
				}
				return root[prop];
			}}, 
			comp[action.form]);
		return comp;
	default:
		return state;
	}
}