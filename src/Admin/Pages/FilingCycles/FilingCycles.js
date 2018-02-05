import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import withDataService from 'Services/DataService';
import * as FilingSchedule from 'Services/FilingSchedule';

import index from './index';

const dataSets = [
	{table: "Election", alias: "Elections"},
	{table: "FilingCycle", alias: "FilingCycles"},
	{table: "ReportingPeriodTemplate", alias: "ReportingPeriodTemplates"}
];

const initialize = (props) => {
	return function(dispatch, getState) {
		props.getBatchData(dataSets, () => {
			let data = getState().data;
			//do we sort here or elsewhere?
		});
	}
}

const editCycle = (cycle) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"FilingCycle", cycle: cycle});
		dispatch({type: actions.FORM_SET_VALUES, form:"FilingCycle", values: cycle});
	}
}

const buildSchedule = (begin, end, schedule, data) => {
	let templates = FilingSchedule.getTemplates(data.ReportingPeriodTemplates, schedule);
	let tracks = [];
	templates.forEach((track, index) => {
		tracks.push({periods:[]});
		track.periods.forEach((template, i) => {
			let reportingPeriod = {
					Start: FilingSchedule.calculateDate(template.Start, tracks[index].periods, begin),
					End: FilingSchedule.calculateDate(template.End, tracks[index].periods, begin),
					Due: FilingSchedule.calculateDate(template.Due, tracks[index].periods, begin),
					Name: template.Name,
					ReportType: template.ReportType
			}
			tracks[index].periods.push(reportingPeriod);
		});
	});
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_SET_VALUE, form:"FilingCycle", key: 'ReportingPeriods', value: tracks});
	}	
}

const mapState = (state) => ({
	active: state.page.FilingCycle ? state.page.FilingCycle.cycle : false,
	data: state.form.FilingCycle
});


const mapDispatch = (dispatch, ownProps) => {return {
	initialize: () => {dispatch(initialize(ownProps.dataService))},
	edit: (cycle) => {dispatch(editCycle(cycle))},
	buildSchedule: (begin, end, schedule) => {dispatch(buildSchedule(begin, end, schedule, ownProps.dataService))}
}};

const mergeProps = (stateProps, dispatchProps, ownProps) => (
	{...ownProps, cycles: {...stateProps, ...dispatchProps}}
);
export default withDataService(undefined, "dataService")(connect(mapState, mapDispatch, mergeProps)(index));