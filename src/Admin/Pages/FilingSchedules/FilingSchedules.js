import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import withDataService from 'Services/DataService';

import index from './index';

const setSchedule = (type, templates) => {
	let t = templates.filter(t => (t.FilingSchedule === type.ID))
		.sort((a, b) => (parseInt(a.Filing_Order, 10) < parseInt(b.Filing_Order, 10) ? -1 : 1));
	let tracks = [], sorted = [];
	t.forEach((item) => {
		if(tracks.indexOf(item['Filing_Track']) < 0) {
			tracks.push(item['Filing_Track']);
		}
	});
	tracks.forEach((track) => {
		sorted.push({periods: t.filter(r => r['Filing_Track'] === track)});
	});
	if(!sorted.length) {
		sorted.push({periods:[{}]});
	}
	let activeSchedule = {...type, templates:sorted};
	return function(dispatch) {
		dispatch({type: actions.PAGE_UPDATE, page:"FilingSchedule", activeSchedule: activeSchedule});
		dispatch({type: actions.FORM_SET_VALUES, form:"FilingSchedule", values: activeSchedule});
	}
}

const deleteSchedule = (type, props) => {
	return function(dispatch, getState) {
		props.deleteData("FilingSchedule", type, function() {
			//if this was being edited, let's reset that
			let page = getState().page.FilingSchedule;
			if(page && page.activeSchedule && (page.activeSchedule.ID === type.ID || !page.activeSchedule.ID)) {
				dispatch({type: actions.PAGE_UPDATE, page:"FilingSchedule", activeSchedule: undefined});
			}
		});
	}	
}

const saveSchedule = (type, props) => {
	return function(dispatch, getState) {
		//save the root first, get the ID and bind it to the children
		if(type.ID !== undefined) {
			props.saveData("FilingSchedule", type, undefined, function(response) {
				let track_index = 0;
				type.templates.forEach((track) => {
					let filing_order = 0;
					if(track.DELETE) {
						track.periods.forEach((template) => {
							if(template.ID !== undefined) {
								props.deleteData("ReportingPeriodTemplate", template);
							}
						});
					} else {
						track.periods.forEach((template) => {
							if(template.DELETE) {
								props.deleteData("ReportingPeriodTemplate", template);
							} else {
								template.Filing_Order = filing_order;
								template.Filing_Track = track_index;
								template.FilingSchedule = type.ID;
								if(Object.getOwnPropertyNames(template.Start).length === 0) {
									delete(template.Start);
								}
								if(template.ID !== undefined) {
									props.saveData("ReportingPeriodTemplate", template);
								} else {
									props.createData("ReportingPeriodTemplate", "ReportingPeriodTemplates", template);
								}
								filing_order++;
							}											
						});
						track_index++;
					}				
				});
			});			
		} else {
			props.createData("FilingSchedule", "FilingSchedules", type, undefined, function(response) {
				type.templates.forEach((track, track_index) => {
					track.forEach((template, order) => {
						template.Filing_Order = order;
						template.Filing_Track = track_index;
						template.FilingSchedule = response.data.ID;
						if(Object.getOwnPropertyNames(template.Start).length === 0) {
							delete(template.Start);
						}
						props.createData("ReportingPeriodTemplate", "ReportingPeriodTemplates", template);
					});
				});
			});
		}
	}
}

const mapState = (state) => ({
	activeSchedule: state.page.FilingSchedule ? state.page.FilingSchedule.activeSchedule : undefined,
	data: state.form && state.form.FilingSchedule ? state.form.FilingSchedule : {}
});

const mapDispatch = (dispatch, ownProps) => {return {
	onSetSchedule: (type) => {dispatch(setSchedule(type, ownProps.ReportingPeriodTemplates))},
	onDeleteSchedule: (type) => {dispatch(deleteSchedule(type, ownProps))},
	onSaveSchedule: (type) => {dispatch(saveSchedule(type, ownProps))}
}};

export default withDataService()(connect(mapState, mapDispatch)(index));