import React, { Component } from 'react';
import { connect } from 'react-redux';

import getData from './DataService/getData';
import createData from './DataService/createData';
import saveData from './DataService/saveData';
import deleteData from './DataService/deleteData';

export default function withDataService(uri, alias) {
	//get uri here
	return function DataServiceFactory(WrappedComponent) {
		class DataService extends Component {		
			render() {
				return <WrappedComponent {...this.props}/>;
			}
		}
		
		const getBatchData = (datasets, uri, finished) => {
			return function (dispatch, getState) {
				function getNextDataset(datasets, index) {					
					return new Promise((resolve, reject) => {
						if(datasets && index < datasets.length) {
							let { table, alias, params, callback } = datasets[index];
							dispatch(getData(uri, table, alias, params, (response) => {
								if(callback) { callback(response); } 
								getNextDataset(datasets, index).then(()=>{resolve(true)});
							}));
						} else {
							resolve(true);
						}
						index ++;
					});
					
				}
				getNextDataset(datasets, 0).then(()=>{
					if(finished) {
						finished();
					}
				});
				//getNextDataset(datasets, 0);
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
				getBatchData: (datasets, callback) => { dispatch(getBatchData(datasets, uri, callback))},
				saveData: (table, data, query, callback) => { dispatch(saveData(uri, table, data, query, callback))},
				createData: (table, alias, data, query, callback) => { dispatch(createData(uri, table, alias, data, query, callback))},
				deleteData: (table, data, callback, postponeClean, force) => { dispatch(deleteData(uri, table, data, callback, postponeClean, force))}
			}
		}
		
		const mergeProps = (stateProps, dispatchProps, ownProps) => { 
			if(alias) {
				return {...ownProps, [alias]: {...stateProps, ...dispatchProps}};
			} else {
				return {...ownProps, ...stateProps, ...dispatchProps};
			}			
		};
		
		return connect(mapStateToProps, mapDispatchToProps, mergeProps)(DataService);
	}
}

