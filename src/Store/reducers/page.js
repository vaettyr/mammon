import * as actions from '../actionTypes';

export const page = (state = {}, action) => {
	let sub = state[action.page] || {},
	{page, type, ...rest} = action;
	switch (action.type) {
	case actions.PAGE_UPDATE:
			return {...state, [action.page]:{...sub, ...rest}};
	default:
		return state;
	}
}