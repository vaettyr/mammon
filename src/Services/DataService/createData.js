import * as actions from 'Store/actionTypes';
import * as http from 'axios';
import { structureToString, structureFromString, serializeData, deserializeData } from './util';


const serializeParameters = ["Data", "Actions", "Parameters"];

const createData = (uri = 'DataService.php', table, alias, data, query, callback) => {
	return (dispatch, getState) => {
		dispatch({
			type: actions.CREATE_DATA_START,
			table: alias,
			source: table
		});
		data = serializeData(structureToString(data), serializeParameters);
		if(query) {
			query = Object.keys(query).map(i => "&"+i+"="+query[i]).join('');
		}
		http.post(process.env.REACT_APP_API + uri + '?table='+table+(query?query:''), data)
		.then(response => {
			dispatch({
				type: actions.CREATE_DATA_END,
				table: alias,
				data: deserializeData(structureFromString(response.data), serializeParameters)
			});
			if(callback) {callback(response);}
		})
		.catch(error => {
			dispatch({
				type: actions.CREATE_DATA_ERROR,
				table: alias,
				error: error
			});
		});
	}
}

export default createData;