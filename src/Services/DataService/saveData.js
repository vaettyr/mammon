import * as actions from 'Store/actionTypes';
import * as http from 'axios';
import { structureToString, structureFromString, serializeData, deserializeData } from './util';


const serializeParameters = ["Data", "Actions", "Parameters"];
//no alias needed. no index needed
//const saveData = (table, alias, data, index, callback) => {
const saveData = (uri = 'DataService.php', table, data, query, callback) => {
	return (dispatch, getState) => {
		dispatch({
			type: actions.SAVE_DATA_START,
			source: table
		});
		let {ID, VERSION, ...Rest} = data;
		data = serializeData(structureToString(Rest), serializeParameters);
		var qstring = "table="+table+(ID ? "&ID="+ID : "")+(VERSION ? "&VERSION="+VERSION : "");
		if(query) {
			qstring += Object.keys(query).map(i => "&"+i+"="+query[i]).join('');
		}
		http.post(process.env.REACT_APP_API + uri + '?'+qstring, data)
		.then(response => {
			dispatch({
				type: actions.SAVE_DATA_END,
				source: table,
				data: deserializeData(structureFromString(response.data[0]), serializeParameters)
			});
			if(callback) {
				callback(response);
			}
		}).catch(error => {
			dispatch({
				type: actions.SAVE_DATA_ERROR,
				source: table,
				error: error
			});
		});
	}
}

export default saveData;