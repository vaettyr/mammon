import * as actions from '../actionTypes';

/* structure of the data sub-state
 * {
 * 		alias_name: {
 * 			query: string (the stringified query params used for the last retrieval
 * 			timestamp: Date (when the data was last retrieved
 * 			data: [] (the actual data)
 * 			fetching: bool (if a fetch is currently in progress)
 * 			error: string (the error returned from the server)
 * 		}
 * }
 * action flow
 * data is requested
 * if no sub-state exists, begin fetching
 * query is compared. If no match, begin fetching
 * if query matches, check if timestamp is stale. If it is, fetch last update. If not, exit
 * when last update returns, compare to timestamp. If it is newer, begin fetching
 * 
 * actions
 * 
 * fetch last update start. Will set fetching to true
 * fetch last update end. Will set fetching to false, may initiate a data fetch
 * fetch last update error. Set fetching to false, sets error 
 * fetch data start. Set fetching to true.
 * fetch data end. Set fetching to false, set data, set timestamp
 * fetch data error. Set fetching to false, sets error
 */

export const data = (state = {}, action) => {
	let sub = state[action.table] || {query: '', fetching: false};
	let {error, ...rest} = sub;
	switch (action.type) {
	case actions.GET_DATA_TIME_START:
	case actions.GET_DATA_START:
	case actions.GET_DATA_TIME_END:		
		return {...state, [action.table]:{...rest, source: action.source, data:(sub.data||[]), fetching: false}};		
	case actions.GET_DATA_END:
		return {...state, [action.table]:{...rest, source: action.source, data: action.data, timestamp: action.timestamp, fetching: false}};
	case actions.GET_DATA_TIME_ERROR:
	case actions.GET_DATA_ERROR:
		return {...state, [action.table]:{...sub, error:action.error, fetching: false}};
		
	case actions.CREATE_DATA_START:
		return {...state, [action.table]:{...rest, source: action.source, data: (sub.data || []), saving: true}};
	case actions.CREATE_DATA_END:
		return {...state, [action.table]:{...sub, data: [...sub.data, action.data], saving: false}};
	case actions.CREATE_DATA_ERROR:
		return {...state, [action.table]:{...sub, error:action.error, saving: false}};
		
	case actions.SAVE_DATA_START:
		return throughTables(state, action.source, (table) => { 
			let {error, ...rest} = table; 
			return {...rest, data: table.data || [], saving:true};
		});	
	case actions.SAVE_DATA_END:
		return throughData(state, action.source, (table) => {
			let {error, ...rest} = table;
			return {...rest, saving: false};
		},(item) => (
			item.ID === action.data.ID && (!action.data.VERSION || item.VERSION === action.data.VERSION)?
			action.data : item ));		
	case actions.SAVE_DATA_ERROR:
		return throughTables(state, action.source, (table) => ({...table, saving:false, error:action.error}));
	
	case actions.DELETE_DATA_START:
		return throughTables(state, action.source, (table) => ({...table, deleting: true}));
	case actions.DELETE_DATA_END:
		return throughData(state, action.source, (table) => {
				let {error, ...rest} = table;
				return {...rest, deleting: false};
			}, (item) => (
				item.ID === action.data.ID && (!action.data.VERSION || item.VERSION === action.data.VERSION)?
				{} : item ));
	case actions.DELETE_DATA_ERROR:
		return throughTables(state, action.source, (table) => ({...table, deleting:false, error:action.error}));	
	
	case actions.CLEAN_DATA:
		return throughTables(state, action.source, (table) => {
			let { data, ...rest } = table;
			return {...rest, data: data.filter(i=> Object.keys(i).length > 0)}
		});
		//return {...state, [action.table]:{...sub, data:sub.data.filter(i=> Object.keys(i).length > 0 )}};
	case actions.AUGMENT_DATA:
		return {...state, [action.table]:{...sub, data:[...sub.data, ...action.data]}};
	default:
		return state;
	}
}

const throughTables = (state, source, execute) => {
	let newState = {};
	Object.keys(state).forEach(table => {
		if(state[table].source === source) {
			newState[table] = execute(state[table]);
		} else {
			newState[table] = state[table];
		}
	});
	return newState;
}

const throughData = (state, source, forTable, forItem) => {
	let newState = {};
	Object.keys(state).forEach(table => {
		if(state[table].source === source ) {
			newState[table] = {...forTable(state[table]), data: state[table].data.map(item => forItem(item))};
		} else {
			newState[table] = state[table];
		}
	});
	return newState;
}