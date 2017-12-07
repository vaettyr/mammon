import * as actions from '../actionTypes';

export const menu = (state = {}, action) => {
	let { menu, type, ...rest} = action;
	switch (type) {
	case actions.SHOW_MENU:
		return {...state, [menu]:{ open: true, ...rest }};
	case actions.HIDE_MENU:
		return {...state, [menu]:{ open: false }};
	default:
		return state;
	}
}