import * as actions from '../actionTypes';

export const datasource = (state = {}, action) => {
	switch (action.type) {
	case actions.GET_DATA_SOURCE_START:	
		return {...state, [action.source]:{fetching: true}};		
	case actions.GET_DATA_SOURCE_END:
		return {...state, [action.source]:{...action.data, fetching:false}};
	case actions.GET_DATA_SOURCE_ERROR:
		return {...state, [action.source]:{error:action.error, fetching: false}};
	default:
		return state;
	}
}