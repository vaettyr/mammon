import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import withDataService from 'Services/DataService';

import index from './index';

const editOffice = (office, props) => {
	return function(dispatch, getState) {
		dispatch({type:actions.PAGE_UPDATE, page: 'Offices', editOffice: office.office});
		dispatch({type:actions.FORM_SET_VALUES, form:'Office', values: office.office});
	}
}

const deleteOffice = (office, props) => {
	return function(dispatch, getState) {
		let { editOffice } = getState().page.Offices;
		props.deleteData("Office", office, function() {
			if(office.ID === editOffice.ID) {
				dispatch({type:actions.PAGE_UPDATE, page:"Offices", editOffice: undefined});
			}
		});
	}
}

const editDistrict = (parents, district, props) => {
	return function(dispatch, getState) {
		//parse the parents
		if(!district.Office && parents.office) { district.Office = parents.office.ID;}
		if(!district.Jurisdiction && parents.jurisdiction) {district.Jurisdiction = parents.jurisdiction.ID;}
		dispatch({type:actions.PAGE_UPDATE, page: 'Offices', editOffice: district});
		dispatch({type:actions.FORM_SET_VALUES, form:'Office', values: district});
	}
}

const mapState = (state) => ({
	offices: state.data.Offices ? 
			state.data.Offices.data.filter(o => !o.Office || o.Office === "0")
				.sort((a,b)=>a.DisplayOrder<b.DisplayOrder?-1:1): [],
	jurisdictionTypes: state.data.JurisdictionTypes ? state.data.JurisdictionTypes.data : [],
	editOffice: state.page.Offices ? state.page.Offices.editOffice : undefined
});

const mapDispatch = (dispatch, ownProps) => { return {
	onEditOffice: (office) => {dispatch(editOffice(office, ownProps))},
	onDeleteOffice: (office) => {dispatch(deleteOffice(office, ownProps))},
	onEditDistrict: (parents, district) => {dispatch(editDistrict(parents, district, ownProps))}
}};

export default withDataService()(connect(mapState, mapDispatch)(index));