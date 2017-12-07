import * as actions from 'Store/actionTypes';
import fetchData from './fetchData';
import fetchTime from './fetchTime';

const getData = (uri, table, alias, params, callback) => {
	//table: the name of the table we're pulling data from
	//alias: the name to expose this data under
	//params: query object used to retrieve the data			
	
	alias = alias || table;
	
	var call = getData;
	return (dispatch, getState) => {
		dispatch({type: actions.CACHE_PUSH, action: () => { dispatch(call(table, alias, params, callback))}});
		
		var state = getState();
		var query = "table="+table;
		if(params) {
			Object.keys(params).forEach(key => { query += "&" + key + "=" + params[key]});
		}
		//if there's no entry or an entry with no data, go ahead and fetch the data
		if(!state.data[alias] || !state.data[alias].data || !state.data[alias].timestamp) {
			fetchData(uri, dispatch, alias, table, query).then(response => {
				if(callback) {callback(response);}
			});
		} else {
			//otherwise, check if the timestamp is stale
			fetchTime(uri, dispatch, alias, table, query, state)
			.then((response) => {
				//compare the time returned to the current state time
				if(response.last_change > response.last_fetch) {
					fetchData(uri, dispatch, alias, table, query).then(response => {
						if(callback) {callback(response);}
					});
				} else {
					//clear the cache
					dispatch({type: actions.CACHE_CLEAR});
					if(callback) {callback(response);}
				}
			}).catch(error => {
				//debugger;
			});					
		}				
	}
}
export default getData;