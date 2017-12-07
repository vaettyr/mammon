import { connect } from 'react-redux';
import index from './index';
import * as actions from 'Store/actionTypes';
import withDataService from 'Services/DataService';

const mapStateToProps = (state, props) => {
	return {	
		activeTable: state.options.active,
		edit: state.options.edit,
		index: state.options.index,
		optionsMenu: state.menu.options || {},
		optionsEntryMenu: state.menu.optionsentry || {}
	}
}

const setActiveTable = (table, id, props) => {
	return function(dispatch, getState) {
		dispatch({type:actions.SET_OPTION_FILTER, table: table});
		props.getData("Lookup", table, {LookupType: id});
	}
}

//this also needs to reset the form
const startNewOption = () => {
	return function (dispatch, getState) {
		dispatch({ type: actions.OPTION_NEW_TYPE });
		dispatch({type:actions.FORM_CLEAR_VALUES, form: "optionType" });
	}
}

const onSaveOptionType = (option, props) => {
	return function(dispatch, getState) {
		let {edit} = getState().options;
		const closeWindow = (response) => {
			dispatch({type:actions.FORM_CLEAR_VALUES, form: "optionType"});
			dispatch({type:actions.OPTION_CLOSE_TYPE});
		}
		if(edit==="NEW") {
			props.createData("LookupType", "LookupType", option, undefined, closeWindow);
		} else {
			props.saveData("LookupType", option, undefined, closeWindow);
		}		
	}
}
const onSaveOption = (data, props) => {
	return function(dispatch, getState) {
		let{ index, active } = getState().options;
		//need to add more data to this
		const closeWindow = (response) => {
			dispatch({type:actions.FORM_CLEAR_VALUES, form: active});
			dispatch({type:actions.OPTION_CLOSE_ENTRY});
		}
		var option = {...data, LookupType:getState().data["LookupType"].data.filter(item=>item.Name===active)[0].ID};
		if(index === undefined) {
			props.createData("Lookup", active, option, undefined, closeWindow);
		} else {
			props.saveData("Lookup", option, undefined, closeWindow);
		}
	}
}

const editType = (type, props) => {
	return function(dispatch, getState) {
		let {index} = getState().menu.options;
		dispatch({type:actions.OPTION_EDIT_TYPE, index: index});
		dispatch({type:actions.FORM_SET_VALUES, form: "optionType", values: type});
	}	
}
const editOption = (index, item, props) => {
	return function(dispatch, getState) {
		let {active} = getState().options;
		dispatch({type:actions.OPTION_EDIT_ENTRY, index: index});
		if(item === undefined) {
			dispatch({type:actions.FORM_CLEAR_VALUES, form: active });
		} else {
			dispatch({type:actions.FORM_SET_VALUES, form: active, values: item})
		}
	}
}
const deleteType = (type, props) => {
	return function (dispatch, getState) {
		props.deleteData("LookupType", type);
	}
}
const deleteEntry = (entry, props) => {
	return function (dispatch, getState) {
		props.deleteData("Lookup", entry);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setTable: (table, id) => dispatch(setActiveTable(table, id, ownProps)),
		startNewOption: () => dispatch(startNewOption()),
		onSaveOptionType: (option) => dispatch(onSaveOptionType(option, ownProps)),
		onSaveOption: (data) => dispatch(onSaveOption(data, ownProps)),
		editType: (type) => dispatch(editType(type, ownProps)),
		deleteType: (type) => dispatch(deleteType(type, ownProps)),
		deleteEntry: (entry) => dispatch(deleteEntry(entry, ownProps)),
		editOption: (index, item) => dispatch(editOption(index, item, ownProps))
	}
}

export default withDataService()(connect(mapStateToProps, mapDispatchToProps)(index));