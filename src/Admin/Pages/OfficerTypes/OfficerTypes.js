import withDataService from 'Services/DataService';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import index from './index';

const mapState = (state, ownProps) => ({
	page: state.page.OfficerType
});

const onEdit = (item) => {
	return function(dispatch, getState) {
		dispatch({type:actions.FORM_SET_VALUES, form:"OfficerType", values: item});
		dispatch({type:actions.PAGE_UPDATE, page:"OfficerType", editType: item})
	}
}

const onDelete = (item, props) => {
	return function(dispatch, getState) {
		let editType = getState().page.OfficerType ? getState().page.OfficerType.editType : {};
		props.deleteData("OfficerType", item, function() {
			if(item.ID === editType.ID) {
				dispatch({type:actions.PAGE_UPDATE, page:"OfficerType", editType: undefined});
			}
		});
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	onEdit: (item) => {dispatch(onEdit(item))},
	onDelete: (item) => { dispatch(onDelete(item, ownProps))}
}}

export default withDataService()(connect(mapState, mapDispatch)(index));