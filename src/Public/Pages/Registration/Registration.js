import index from './index';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import DataObject from 'Services/DataObject';

const validatorReducer = (valid, item, index, list) => {
	if(!valid && item) {
		if(item.isValid !== undefined) {
			valid = item.isValid;
		}
		if(!valid) {
			if(Array.isArray(item)) {
				valid = item.reduce(validatorReducer, valid);
			} else if(typeof item === 'object') {
				let itemlist = Object.keys(item).filter(i => i !== 'isValid').map(v => item[v]);
				valid = itemlist.reduce(validatorReducer, valid);
			}
		}	
		return valid;
	} else {
		return valid;
	}
}

const allErrors = (errors, item, index, list) => {
	if(!errors[item.name]) {
		errors[item.name] = item;
	}
	if(typeof item === 'object') {
		return Object.keys(item).filter(i => i !== 'isValid' && i !== 'error' && i !== 'name').map(e => ({...item[e], name:item.name+"."+e})).reduce(allErrors, errors);
	} else {
		return errors;
	}
}

const mapState = (state, ownProps) => { 
	let status = state.validator && state.validator["Registration"] ? Object.keys(state.validator["Registration"]).map(v => ({...state.validator["Registration"][v], name: v})) : [];
	let valid = status.reduce(validatorReducer, false);
	let errors = status.reduce(allErrors, {});
	let linestatus = state.validator && state.validator["RegistrationListItem"] ? Object.keys(state.validator["RegistrationListItem"]).map(v => ({...state.validator["RegistrationListItem"][v], name: v})) : [];
	let linevalid = linestatus.reduce(validatorReducer, false);
	let lineerrors = linestatus.reduce(allErrors, {});
return {
	registration: state.data.CommitteeTypes ? state.data.CommitteeTypes.data.find(i => i.Name.replace(/\W/g, '') === ownProps.match.params.ID):{},
	officertypes: state.data.OfficerTypes ? state.data.OfficerTypes.data : [],
	options : state.data.Options ? state.data.Options.data : [],
	data: state.form.Registration,
	lineData: state.form.RegistrationListItem,
	openListItem: state.dialog.some(item => item.name === 'registrationlistitem'),
	callback: state.page.registration ? state.page.registration.onChange : undefined,
	listType: state.page.registration ? state.page.registration.activeListType: {},
	errors: errors,
	valid: valid,
	lineErrors: lineerrors,
	lineValid: linevalid	
}};

const editListItem = (item, type, index, callback) => {
	return function(dispatch, getState) {
		dispatch({type: actions.SHOW_DIALOG, name: 'registrationlistitem'});
		dispatch({type: actions.PAGE_UPDATE, page: 'registration', activeListType: type, onChange: callback});
		dispatch({type: actions.FORM_SET_VALUES, form: "RegistrationListItem", values: {...item, index}});
	}
}

const saveListItem = (item, type, callback) => {
	return function(dispatch, getState) {
		let { index, ...entry } = item;
		//this needs to force a re-validation
		if(index || index === 0) {
			dispatch({type: actions.FORM_SET_VALUE, form: "Registration", key: type.Name+"["+index+"]", value: entry});
		} else {
			dispatch({type: actions.FORM_LIST_ADD, item: item, form: "Registration", key: type.Name});			
		}
		dispatch({type: actions.FORM_SET_VALUES, form: "RegistrationListItem", values: {}});
		dispatch({type: actions.HIDE_DIALOG, name: 'registrationlistitem'});
		if(callback) {
			callback();
		}
	}
}

const removeListItem = (type, index, callback) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, index: index, form: "Registration", key: type.Name});
		if(callback) {
			callback();
		}
	}
}

const saveRegistration = (data, type) => {
	return function (dispatch, getState) {
		//parse through our structure and decide what to do with it and how to save it.
		//let registration = new DataObject(type.Structure, 'Registration', 'Registration.php');
		let registration = new DataObject(type.Structure, 1);
		debugger; //we might not need to serialize in here
		let registrationData = registration.serialize(data);
		registrationData.CommitteeType = type.ID;
		
		registration.on(registrationData, 'Submit');
		//freeze the screen
		/*
		registration.save(dispatch, registrationData,{then: (response) => {
			debugger;
			//redirect to the success confirmation screen
		}, catch: (error) => {
			debugger;
			//display an error message. Maybe let them try again later
		}});
		*/
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	setForm: (values) => dispatch({type: actions.FORM_SET_VALUES, form:"Registration", values: values}),
	editListItem: (item, type, index, callback) => dispatch(editListItem(item, type, index, callback)),
	removeListItem: (type, index, callback) => dispatch(removeListItem(type, index, callback)), 
	saveLineItem: (item, type, callback) => dispatch(saveListItem(item, type, callback)),
	closeListItem: () => dispatch({type: actions.HIDE_DIALOG, name: 'registrationlistitem'}),
	saveRegistration: (data, type) => dispatch(saveRegistration(data, type))
}}

export default connect(mapState, mapDispatch)(index);