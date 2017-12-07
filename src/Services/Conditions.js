import React, { Component } from 'react';
import * as utils from 'Services/value_utils';
import * as actions from 'Store/actionTypes';
import { connect } from 'react-redux';

class Conditions extends Component {
	//wraps a child element, intercepts it's on-change handler and calls this functionality on top of it
	componentWillMount() {
		//call on change on the child if it has it
		let { initialize, init } = this.props;
		//only initialize each set once
		if(init === undefined) {
			init = true;
		}
		if(init) {
			initialize();
		}		
	}
	
	render() {
		let { form, className, onChange, handleChange, children, options, conditions } = this.props;
		//only bind the on-change to selects and checkboxes
		const childrenWithProps = React.Children.map(children, 
			(child) => {if(child) {
				let props = {conditions, form};
				if(!conditions.Properties || !conditions.Properties.some(p => p === 'optional')) {
					props.required = true;
				}
				if(conditions.Properties) {
					props.hidden = conditions.Properties.some(p => p === 'hidden');
					props.disabled = conditions.Properties.some(p => p === 'disabled');
				}
				//Values
				if(conditions.Values && options && options.length) {
					props.options = options.map(o => conditions.Values.some(v => v === o.ID || v === '*') ? o : {...o, disabled: true});
				} else {
					props.options = options;
				}
				if(conditions.Label) { props.label = conditions.Label; }
				if(conditions.Help) { props.helpText = conditions.Help; }
				
				if(['checkbox', 'select'].some(i => i === child.props.type)) {
					props.onChange = (m,v,e) => {onChange(m,v,e); handleChange()};
				} else if (child.props.section && child.props.section.Type === 'list') {
					props.onChange = handleChange;
				} else {
					props.onChange = onChange;
				}
				return React.cloneElement(child, props);
			}});
		//handle conditions here. we have optional, hidden, and disabled
		//bind all properties, values, help text, and labels to the child
		if(conditions.Properties && conditions.Properties.some(i => i === 'hidden')) {
			return null;
		} else {
			return (<span className={className}>{childrenWithProps}</span>);
		}
		
	}
}

const onChangeHandler = (form, structure, root, options, init ) => {
	return function (dispatch, getState) {
		var data = {} ;
		//if we're a sub-item, we need to put our values in another context?
		if(root && root.data && root.sub) {
			data = JSON.parse(JSON.stringify(root.data));
			var sub = getState().form[form];
			if(sub) {
				data[root.sub] = JSON.parse(JSON.stringify(sub));
			}
		} else {
			data = getState().form[form];
			if(data) { data = JSON.parse(JSON.stringify(data)); }
		}
		if(!init || (data && !Object.keys(data).length) || (data && root.sub && !Object.keys(data[root.sub]).length)) {
			Evaluator(structure, data, dispatch, form, options);
		} 		
	}
	
}

const Evaluator = (structure, values, dispatch, form, options) => {
	var parent = "";
	if(Array.isArray(structure)) {
		structure.forEach((item) => {evaluate(item, parent, values); checkLimits(item, parent, values, options)});
	} else {
		Object.keys(structure).forEach((index) => evaluate(structure[index], parent, values));
	}
	
	function checkLimits(item, container, values, options) {
		if(item.Limits && item.Limits.rows) {
			var invalidRows = [];
			item.Limits.rows.forEach((row) => {
				//does this row apply? row.conditions
				var rowIsActive = false;
				if(row.columns && row.columns.length > 0) {
					var valid = true;
					for(var c=0; c< row.columns.length; c++) {
						let {root, list, Name} = item.Limits.columns[c];
						if(!root && list) { root = list;}
						let v = utils.getValue(root.replace(/\W/g, '_') + "." + Name.replace(/\W/g, '_'), values);
						if(typeof v === 'object' && !Object.getOwnPropertyNames(v).length) { v = -1 }
						if(!row.columns[c].some(f => f === v )) {
							valid = false;
							break;
						}
					}
					rowIsActive = valid;
				} else {
					rowIsActive = true;
				}
				//if it does, check the filters against our entries row.filters
				if(rowIsActive) {
					var count = 0;
					var indices = [];
					var entries = values[item.Name.replace(/\W/g, '_')];
					if(row.filters && row.filters.length > 0 && Array.isArray(entries) && entries.length > 0) {
						
						//is there one row that has all of the required filters?
						//entries.forEach(e => {
						for(var j=0; j<entries.length;j++) {
							let e = entries[j];
							var isvalid = true;
							for(var f=0; f<row.filters.length; f++) {
								let { Name } = item.Limits.filters[f];
								isvalid = row.filters[f].some(v => ((typeof e[Name] === 'object' && !Object.getOwnPropertyNames(e[Name]).length) ? -1 : e[Name] ) === v);
							}
							if(isvalid) {
								count++;
								indices.push(j);
							}
						}
						//});
						
					} else {
						count = entries.length || 0;
					}
					//if the limit is not satisfied, put it in the list row.min row.max
					if((row.min && (count < parseInt(row.min, 10))) || (row.max && (count > parseInt(row.max, 10)))) {
						let filters = row.filters.map((filter, index) => ({values: filter, column: item.Limits.filters[index]}))
						invalidRows.push({...row, count, indices, filters});
					}
				}
			});
			//at the end, dispatch the list
			//handle it as a validation error!
			let error = {isValid: invalidRows.length > 0};
			if(error.isValid) {
				error.error = invalidRows;
			}
			dispatch({type:actions.VALIDATOR_SET_ERROR, form: form, key:item.Name.replace(/\W/g,'_'), error});
		}
	}
	
	function evaluate(item, container, values) {
		if(item.Conditions && item.Conditions.rows) {
			//evaluate each row until you find one that matches
			var hasSet = false;
			item.Conditions.rows.forEach((row) => {
				//the first item of the row are the settings we'll apply. Skip it for now
				if(row.length > 0 && !hasSet) {
					var valid = true;
					for(var i=1; i<row.length; i++) {
						//fetch the value for this column
						let {root, list, Name} = item.Conditions.columns[i-1];
						if(!root && list) { root = list;}
						let v = utils.getValue(root.replace(/\W/g, '_') + "." + Name.replace(/\W/g, '_'), values);
						if(typeof v === 'object' && !Object.getOwnPropertyNames(v).length) { v = -1 }
						if(!row[i].some(f => f === v )) {
							valid = false;
							break;
						}				
					}
					if(valid) {
						dispatch({type:actions.CONDITIONS_SET_ITEM, form: form, key: (container ? container.replace(/\W/g,'_')+"."+item.Name.replace(/\W/g,'_') : item.Name.replace(/\W/g,'_')), conditions: row[0]});
						hasSet = true;
					}
				}
			});
			if(!hasSet) {
				dispatch({type:actions.CONDITIONS_SET_ITEM, form: form, key: (container ? container.replace(/\W/g,'_')+"."+item.Name.replace(/\W/g,'_') : item.Name.replace(/\W/g,'_')), conditions: {clear: true}});
			}
		}
		if(item.Contents) {
			item.Contents.forEach((sub) => evaluate(sub, container ? container + "." + item.Name : item.Name, values));
		}
	}	
}

const mapState = (state, ownProps) => ({
	conditions: state.conditions && state.conditions[ownProps.form] && ownProps.model ? utils.getValue(ownProps.model, state.conditions[ownProps.form]) : {}
});

const mapDispatch = (dispatch, ownProps) => { return {
	handleChange: () => dispatch(onChangeHandler(ownProps.form, ownProps.structure, ownProps.data, ownProps.options)),
	initialize: () => dispatch(onChangeHandler(ownProps.form, ownProps.structure, ownProps.data, ownProps.options, true))
}}
export default connect(mapState, mapDispatch)(Conditions);

