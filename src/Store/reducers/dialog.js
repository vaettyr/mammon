import * as actions from '../actionTypes';

export const dialog = (state = [], action) => {
	let { type, ...rest } = action;
	switch (type) {
	case actions.SHOW_DIALOG:
		return [...state, {...rest}];
	case actions.HIDE_DIALOG:
		return state.filter(item => item.name !== action.name);
	case actions.UPDATE_DIALOG:
		return state.map(item => item.name !== action.name ? item: Object.assign({}, action, item, { type: undefined }));
	default:
		return state;
	}
}