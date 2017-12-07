import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import withDataService from 'Services/DataService';

import index from './index';

const setJurisdictionType = (type) => {
	return function(dispatch) {
		dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", activeType: type, editType: undefined});
	}
}

const editJurisdictionType = (type) => {
	return function(dispatch) {
		dispatch({type:actions.FORM_SET_VALUES, form: "JurisdictionType", values: type });		
		dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", editType: type, activeType: undefined});
	}	
}

const deleteJurisdictionType = (type, props) => {
	return function(dispatch, getState) {
		props.deleteData("JurisdictionType", type, function() {
			//if this was being edited, let's reset that
			let page = getState().page.Jurisdiction;
			if(page && page.editType && page.editType.ID === type.ID) {
				dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", editType: undefined});
			}
			if(page && page.activeType && page.activeType.ID === type.ID) {
				dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", activeType: undefined});
			}
		});
	}
}

const editJurisdiction = (jurisdiction, props) => {
	return function(dispatch, getState) {
		dispatch({type:actions.FORM_SET_VALUES, form: "Jurisdiction", values: jurisdiction });		
		dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", editJurisdiction: jurisdiction});
	}
}

const deleteJurisdiction = (jurisdiction, props) => {
	return function(dispatch, getState) {
		let { editJurisdiction } = getState().page.Jurisdiction;
		props.deleteData("Jurisdiction", jurisdiction, function() {
			//if this was being edited, let's reset that
			if(editJurisdiction && editJurisdiction.ID === jurisdiction.ID) {
				dispatch({type: actions.PAGE_UPDATE, page:"Jurisdiction", editJurisdiction: undefined});
			}
		});
	}
}

const mapState = (state) => ({
	activeType: state.page.Jurisdiction ? state.page.Jurisdiction.activeType : undefined,
	editType: state.page.Jurisdiction ? state.page.Jurisdiction.editType : undefined,
	editJurisdiction: state.page.Jurisdiction ? state.page.Jurisdiction.editJurisdiction : undefined
});

const mapDispatch = (dispatch, ownProps) => {return {
	onSetJurisdictionType: (type) => {dispatch(setJurisdictionType(type))},
	onEditJurisdictionType: (type) => {dispatch(editJurisdictionType(type))},
	onDeleteJurisdictionType: (type) => {dispatch(deleteJurisdictionType(type, ownProps))},
	onEditJurisdiction: (jurisdiction) => {dispatch(editJurisdiction(jurisdiction, ownProps))},
	onDeleteJurisdiction: (jurisdiction) => {dispatch(deleteJurisdiction(jurisdiction, ownProps))}
}};

export default withDataService()(connect(mapState, mapDispatch)(index));