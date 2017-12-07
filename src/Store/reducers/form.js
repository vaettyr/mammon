import * as actions from '../actionTypes';

export const form = (state = {}, action) => {
	//let sub = state[action.form] || {};
	let comp = JSON.parse(JSON.stringify(state));
	switch (action.type) {
	case actions.FORM_SET_VALUES:
		return {...state, [action.form]:{...action.values}};
	case actions.FORM_SET_VALUE:		
		action.key.replace(/\[(\w+)\]/g, '.$1').split('.')
			.reduce((root, prop, index, list) => {
				if(index === list.length-1) {
					root[prop] = action.value;
					return undefined;
				} else {
					if(!root[prop]) {
						root[prop] = {};
					}
					return root[prop];
				}}, 
				comp[action.form]);
		return comp;
	case actions.FORM_CLEAR_VALUES:
		return {...state, [action.form]:{}};		
	case actions.FORM_LIST_ADD:
		action.key.replace(/\[(\w+)\]/g, '.$1').split('.')
			.reduce((root, prop, index, list) => {
				if(index === list.length-1) {
					if (Array.isArray(root[prop])) {
						root[prop].push(action.item);
					} else {
						root[prop] = [action.item];
					} 			
					return undefined;
				} else {
					if(!root[prop]) {
						root[prop] = {};
					}
					return root[prop];
				}}, 
				comp[action.form]);
		return comp;
		//return {...state, [action.form]:{...sub, [action.key]:[...(sub[action.key]?sub[action.key]:[]), action.item]}}
	case actions.FORM_LIST_REMOVE:
		action.key.replace(/\[(\w+)\]/g, '.$1').split('.')
		.reduce((root, prop, index, list) => {
			if(index === list.length-1) {
				root[prop] = [...root[prop].slice(0, action.index), ...root[prop].slice(action.index+1)];
				return undefined;
			} else {
				if(!root[prop]) {
					root[prop] = {};
				}
				return root[prop];
			}}, 
			comp[action.form]);
		return comp;
		//return {...state, [action.form]:{...sub, [action.key]:[...(sub[action.key].slice(0, action.index)), ...(sub[action.key].slice(action.index+1))]}}
	case actions.FORM_LIST_SORT:
		action.key.replace(/\[(\w+)\]/g, '.$1').split('.')
		.reduce((root, prop, index, list) => {
			if(index === list.length-1) {
				while (action.from < 0) {
			        action.from += root[prop].length;
			    }
			    while (action.to < 0) {
			        action.to += root[prop].length;
			    }
			    if (action.to >= root[prop].length) {
			        var k = action.to - root[prop].length;
			        while ((k--) + 1) {
			            root[prop].push(undefined);
			        }
			    }
			    root[prop].splice(action.to, 0, root[prop].splice(action.from, 1)[0]);
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