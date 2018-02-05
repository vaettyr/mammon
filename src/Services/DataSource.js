import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import * as http from 'axios';
import { structureFromString, deserializeData } from 'Services/DataService/util';

const serializeParameters = ["Data", "Actions", "Parameters"];
const persistActionTypes = 120;

export default function withDataSource(id) {
	
	return function DataSourceFactory(WrappedComponent) {
		class DataSource extends Component {		
			
			componentDidMount() {
				let {source, getSource, actionTypes, getActionTypes, actionTypesTimestamp} = this.props;
				if(!source) {
					getSource();
				}
				if(!actionTypes || actionTypesTimestamp + persistActionTypes < Date.now()) {
					getActionTypes();
				}
			}
			
			render() {
				return <WrappedComponent {...this.props}/>;
			}
		}
		
		const fetchDataSource = (id) => {
			return function(dispatch, getState) {
				dispatch({type:actions.GET_DATA_SOURCE_START, source:id});
				return http.get(process.env.REACT_APP_API + "/DataSource.php?DataSource=" + id)
				.then(response => {
					dispatch({type: actions.GET_DATA_SOURCE_END, source: id, data: response.data
					});
				})
				.catch(error => {
					dispatch({
						type: actions.GET_DATA_SOURCE_ERROR,
						source: id,
						error: error
					});
				});
			}
		}
		
		const fetchActionTypes = () => {
			return (dispatch, getState) => {
				dispatch({type: actions.GET_DATA_START, table: 'ActionTypes', source: 'ActionType', query: ''});						
				return http.get(process.env.REACT_APP_API + "/DataSource.php?ActionTypes")
				.then(response => {
					dispatch({
						type: actions.GET_DATA_END,
						table: 'ActionTypes',
						source: 'ActionType',
						data: response.data.map(d=> deserializeData(structureFromString(d),serializeParameters )),
						timestamp: Date.now()
					});
				})
				.catch(error => {
					dispatch({
						type: actions.GET_DATA_ERROR,
						table: 'ActionTypes',
						error: error
					});
				});
			}
		}
		
		const mapStateToProps = (state, ownProps) => {
			id = id || ownProps.id;
			return {
				source: state.datasource[id],
				actionTypes: state.data.ActionTypes?state.data.ActionTypes.data:{},
				actionTypesTimestamp: state.data.ActionTypes?state.data.ActionTypes.timestamp:-1
			}
		}
		
		const mapDispatchToProps = (dispatch, ownProps) => {
			id = id || ownProps.id;
			return {
				getSource: () => { dispatch(fetchDataSource(id))},
				getActionTypes: () => { dispatch(fetchActionTypes())}
			}
		}
		
		return connect(mapStateToProps, mapDispatchToProps)(DataSource);
	}
}