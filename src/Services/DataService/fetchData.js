import * as actions from 'Store/actionTypes';
import * as http from 'axios';
import { structureFromString, deserializeData } from './util';

const serializeParameters = ["Data", "Actions", "Parameters"];
const fetchData = (uri = 'DataService.php', dispatch, alias, table, query) => {
	dispatch({
		type: actions.GET_DATA_START,
		table: alias,
		source: table,
		query: query
	});
	return http.get(process.env.REACT_APP_API + uri + '?' + query)
	.then(response => {
		dispatch({
			type: actions.GET_DATA_END,
			table: alias,
			source: table,
			data: response.data.map(d=> deserializeData(structureFromString(d),serializeParameters )),
			timestamp: Date.now()
		});
		dispatch({type: actions.CACHE_CLEAR});
	})
	.catch(error => {
		dispatch({
			type: actions.GET_DATA_ERROR,
			table: alias,
			error: error
		});
	});
}
export default fetchData;