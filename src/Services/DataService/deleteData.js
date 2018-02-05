import * as actions from 'Store/actionTypes';
import * as http from 'axios';

// no alias needed. no index needed
// const deleteData = (table, alias, data, index, callback, postponeClean,
// force) => {
const deleteData = (uri = "DataService.php", table, data, callback, postponeClean, force) => {
	var call = deleteData;
	return (dispatch, getState) => {
		dispatch({type: actions.CACHE_PUSH, action: (hard) => { dispatch(call(uri, table, data, callback, postponeClean, hard))}});				
		dispatch({
			type: actions.DELETE_DATA_START,
			source: table
		});
		let {ID, VERSION} = data;
		var query = "table="+table+(ID ? "&ID="+ID : "")+(VERSION ? "&VERSION="+VERSION : "");
		query = force ? "force&"+query : "check&"+query;
		http.delete(process.env.REACT_APP_API + uri + '?'+query)
		.then(response => {
			dispatch({
				type: actions.DELETE_DATA_END,
				source: table,
				data: {ID: ID, VERSION: VERSION}
			});
			if(!postponeClean) {
				dispatch({
					type: actions.CLEAN_DATA,
					source: table
				});
			}
			if(callback) {
				callback(response);
			}
		}).catch(error => {
			dispatch({
				type: actions.DELETE_DATA_ERROR,
				source: table,
				error: error
			});
			if(error.response && error.response.status === 300) {
				// we got a warning back. Show the dialog to the user
				dispatch({
					type: actions.SHOW_DIALOG,
					name: "delete",
					data: error.response.data.data
				});
			}
		});
	}
}
export default deleteData;