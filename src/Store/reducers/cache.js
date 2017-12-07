import * as actions from '../actionTypes';

export const cache = (state = [], action) => {
	switch (action.type) {
	case actions.CACHE_PUSH:
		return [...state, action.action];
	case actions.CACHE_POP:
		return state.slice(0, state.length - 1);
	case actions.CACHE_CLEAR:
		return [];
	default:
		return state;
	}
}