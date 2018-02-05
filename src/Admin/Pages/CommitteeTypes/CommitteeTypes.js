import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import index from './index';

const editCommitteeType = (type, index) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"CommitteeTypes", activeType: type, index:index});
		dispatch({type: actions.FORM_SET_VALUES, form:"CommitteeType", values: type});
	}
}

const mapState = (state, ownProps) => ({
	page: state.page && state.page.CommitteeTypes ? state.page.CommitteeTypes: {},
	data: state.data,
	activeType: state.form ? state.form.CommitteeType : {}
});

const mapDispatch = (dispatch, ownProps) => { return {
	selectCommitteeType: (type, index) => dispatch(editCommitteeType(type, index))
}};

export default connect(mapState, mapDispatch)(index);