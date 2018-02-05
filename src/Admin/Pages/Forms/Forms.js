import { connect } from 'react-redux';
import withDataService from 'Services/DataService';
import * as actions from 'Store/actionTypes';
import * as defaultForm from './defaultStructure.json';
import index from './index';

const hasChildren = (item) => {
	return (item.Type && (item.Type === 'Container' || item.Type === 'Page' || item.Type === 'Header' || item.Type === 'Footer' || item.Type === 'Repeater'));
}

const editFormType = (type, index) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"Forms", index:index});
		dispatch({type: actions.FORM_SET_VALUES, form:"Form", values: type});
	}
}

const deleteForm = (form, index, props) => {
	return function(dispatch, getState) {
		props.deleteData("Form", form, function() {
			let page = getState().page.Forms;
			if(page && page.index && page.index === index) {
				dispatch({type: actions.PAGE_UPDATE, page:"Forms", index: undefined});
			}
		});	
	}
}

const newForm = (count) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"Forms", index:count});
		dispatch({type: actions.FORM_SET_VALUES, form:"Form", values: defaultForm});
	}
}

const save = (form, props) => {
	return function (dispatch, getState) {
		if(form.ID === undefined) {
			props.createData("Form", "Forms", form, undefined, function(response) {
				//dispatch({type: actions.PAGE_UPDATE, page:"Forms", index:undefined});
				//dispatch({type: actions.FORM_SET_VALUES, form:"Form", values: {}});
			});
		} else {
			props.saveData("Form", form, undefined, function(response) {
				//dispatch({type: actions.PAGE_UPDATE, page:"Forms", index:undefined});
				//dispatch({type: actions.FORM_SET_VALUES, form:"Form", values: {}});
			});
		}
	}
}

const selectElem = (el, path, e) => {
	return function(dispatch, getState) {
		let page = getState().page;
		if(page.Forms && page.Forms.activeElement && el && page.Forms.activeElement.ID === el.ID) {
			dispatch({type: actions.PAGE_UPDATE, page:"Forms", activeElement: undefined});
		} else {
			dispatch({type: actions.PAGE_UPDATE, page:"Forms", activeElement: {...el, path}});
		}		
		if(e && e.stopPropagation) {
			e.stopPropagation();
		}
	}
}

const insertPage = (index) => {
	let element = {ID: uuidv4(), Type:"Page", Width:'100%', Children:[]}
	if(index) {
		return function(dispatch, getState) {
			dispatch({type: actions.FORM_LIST_INSERT, item: element, form: "Form", key: "Data.Pages", index: index});
		}
	} else {
		return function(dispatch, getState) {
			dispatch({type: actions.FORM_LIST_ADD, item: element, form: "Form", key: "Data.Pages"});
		}
	}	
}

const insertElement = (element, form, parent) => {
	element = {...element, ID: uuidv4()};
	if(hasChildren(parent)) {
		let model = "Data." + parent.path + ".Children";
		let path = model.replace("Data.", "") + "["+(parent.Children?parent.Children.length:0)+"]";
		return function(dispatch, getState) {
			dispatch({type: actions.FORM_LIST_ADD, item: element, form: form, key: model});
			dispatch({type: actions.PAGE_UPDATE, page:"Forms", activeElement: {...element, path}});
		}
	} else {
		var reference = /\[(\d+)\]$/;
		var index = reference.exec(parent.path);
		if(index && index[1]) { index = parseInt(index[1], 10); }
		let model = "Data." + parent.path.replace(reference,'');
		let path = model.replace("Data.","");
		return function(dispatch, getState) {
			dispatch({type: actions.FORM_LIST_INSERT, item: element, form: form, key: model, index: index});
			dispatch({type: actions.PAGE_UPDATE, page:"Forms", activeElement: {...element, path}});
		}
	}	
}

const cutElement = (selection) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"Forms", clipboard: {...selection, path:undefined}, activeElement: undefined});
		var reference = /\[(\d+)\]$/;
		var index = reference.exec(selection.path);
		if(index && index[1]) { index = parseInt(index[1], 10); }
		let model = "Data." + selection.path.replace(reference,'');
		dispatch({type: actions.FORM_LIST_REMOVE, index: index, form: "Form", key: model});
	}
}

const deleteElement = (selection) => {
	return function(dispatch, getState) {
		var reference = /\[(\d+)\]$/;
		var index = reference.exec(selection.path);
		if(index && index[1]) { index = parseInt(index[1], 10); }
		let model = "Data." + selection.path.replace(reference,'');
		dispatch({type: actions.FORM_LIST_REMOVE, index: index, form: "Form", key: model});
	}
}

const copyElement = (selection) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page:"Forms", clipboard: { ...selection, path:undefined}});
	}
}

const pasteElement = (clipboard, selection) => {
	return function(dispatch, getState) {
		let index = 0, model = "Data.Pages[0].Children";
		if(selection) {
			if(hasChildren(selection)) {
				model = "Data." + selection.path + ".Children";
				index = selection.Children.length - 1;
			} else {
				var reference = /\[(\d+)\]$/;
				index = reference.exec(selection.path);
				if(index && index[1]) { index = parseInt(index[1], 10); }
				model = "Data." + selection.path.replace(reference,'');
			}		
		}
		//generate new ids
		//get new path
		dispatch({type: actions.FORM_LIST_INSERT, item: clipboard, form: "Form", key: model, index: index});
		dispatch({type: actions.PAGE_UPDATE, page:"Forms", clipboard: undefined});
	}
}

const mapState = (state, ownProps) => ({
	page: state.page && state.page.Forms ? state.page.Forms: {},
	dataSources: state.data && state.data.DataSources ? state.data.DataSources.data : {},
	content: state.form && state.form.Form ? state.form.Form : {},
	errors: state.validator["Form"] || {},
	valid: state.validator && state.validator["Form"] ? Object.keys(state.validator["Form"]).some(item => state.validator["Form"][item].isValid) : false
});

const uuidv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
	    return v.toString(16);
	  });
}

const mapDispatch = (dispatch, ownProps) => { return {
	selectForm: (type, index) => dispatch(editFormType(type, index)),
	newForm: (count) => dispatch(newForm(count)),
	deleteForm: (form, index) => dispatch(deleteForm(form, index, ownProps)),
	save: (form) => dispatch(save(form, ownProps)),
	selectElement: (el, path, e) => dispatch(selectElem(el, path, e)),
	insertElement: (element, form, parent) => dispatch(insertElement(element, form, parent)),
	insertPage: (index) => dispatch(insertPage(index)),
	deleteElement: (selection) => dispatch(deleteElement(selection)),
	cutElement: (selection) => dispatch(cutElement(selection)),
	copyElement: (selection) => dispatch(copyElement(selection)),
	pasteElement: (clipboard, selection) => dispatch(pasteElement(clipboard, selection)),
	removeStyle: (index, model) => dispatch({type:actions.FORM_LIST_REMOVE, index: index, form: "Form", key: model})
}};

export default withDataService()(connect(mapState, mapDispatch)(index));