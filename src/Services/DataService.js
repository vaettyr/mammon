import React, { Component } from 'react';
import { connect } from 'react-redux';

import getData from './DataService/getData';
import createData from './DataService/createData';
import saveData from './DataService/saveData';
import deleteData from './DataService/deleteData';

export default function withDataService(uri) {
	//get uri here
	return function DataServiceFactory(WrappedComponent) {
		class DataService extends Component {		
			render() {
				return <WrappedComponent {...this.props}/>;
			}
		}
		
		const mapStateToProps = (state, ownProps) => {
			let props = {};
			Object.keys(state.data).forEach(table => {
				props[table] = state.data[table] ? state.data[table].data : [];
			});
			return props;
		}
		
		const mapDispatchToProps = (dispatch, ownProps) => {
			uri = uri || ownProps.uri;
			return {
				getData: (table, alias, params, callback) => { dispatch(getData(uri, table, alias, params, callback))},
				saveData: (table, data, query, callback) => { dispatch(saveData(uri, table, data, query, callback))},
				createData: (table, alias, data, query, callback) => { dispatch(createData(uri, table, alias, data, query, callback))},
				deleteData: (table, data, callback, postponeClean, force) => { dispatch(deleteData(uri, table, data, callback, postponeClean, force))}
			}
		}
		return connect(mapStateToProps, mapDispatchToProps)(DataService);
	}
}

