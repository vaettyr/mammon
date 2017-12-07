import * as actions from '../actionTypes';

export const options = (state = {}, action) => {
	switch (action.type) {
	case actions.SET_OPTION_FILTER:
		return {...state, active: action.table, index: undefined,  edit: false};
	case actions.OPTION_NEW_TYPE:
		return {...state, active: undefined, index: undefined, edit: "NEW"};
	case actions.OPTION_EDIT_TYPE:
		return {...state, active: undefined, index: action.index, edit: "EDIT"};
	case actions.OPTION_CLOSE_TYPE:
		return {...state, active: undefined, index: undefined, edit: false}
	case actions.OPTION_EDIT_ENTRY:
		return {...state, index: action.index, edit: "EDIT"};
	case actions.OPTION_CLOSE_ENTRY:
		return {...state, index: undefined, edit: false };
	default:
		return state;
	}
}