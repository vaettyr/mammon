import * as actions from 'Store/actionTypes';
import * as http from 'axios';

const fetchTime = (uri = "DataService.php", dispatch, alias, table, query, state) => {
	dispatch({
		type: actions.GET_DATA_TIME_START,
		table: alias,
		source: table,
		query: query
	});
	
	return http.get(process.env.REACT_APP_API + uri + '?last_change&'+query)
	.then(response => {
		dispatch({
			type: actions.GET_DATA_TIME_END,
			table: alias,
			source: table
		});
		return {last_change:response.data.last_change?Date.parse(response.data.last_change.date):false, last_fetch: state.data[alias].timestamp};
	})
	.catch(error => {
		dispatch({
			type: actions.GET_DATA_TIME_ERROR,
			table: alias,
			error: error
		});
		return Promise.reject(error);
	});
}
export default fetchTime;