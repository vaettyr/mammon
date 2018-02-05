import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Field from './Field';
import { MenuItem } from 'material-ui/Menu';

const style = (theme) => ({
	
});

const isPopulated = (item) => {
	return item !== null && item !== undefined && item !== "";
}

class OfficeSelector extends Component {
	render() {
		//compound the onChange to clear other items when root level items change
		let { form, onChangeHandler, prefix, data, model, required, Offices, Jurisdictions } = this.props;
		//get the selected office to determine jurisdiction/districts
		let activeOffice = (data && data[model] && Offices) ? (prefix ? Offices.find(o => o.ID === data[model][prefix + "_Office"]) : Offices.find(o => o.ID === data[model]["Office"])) : null;
		
		let selectors = [<Field label={prefix?prefix + " Office":"Office"} type="select" required={required} 
			model={model +"."+(prefix?prefix+"_Office":"Office")} onChange={onChangeHandler} form={form}>
			{Offices && Offices.filter(o => !o.Office).map((office, i) => (<MenuItem key={i} value={office.ID}>{office.Name}</MenuItem>))}
		</Field>];
		
		if(activeOffice && isPopulated(activeOffice.JurisdictionType)) {
			selectors.push(<Field label={prefix?prefix + " Jurisdiction":"Jurisdiction"} type="select" required={required} 
					model={model + "." + (prefix?prefix+"_Jurisdiction":"Jurisdiction")} onChange={onChangeHandler} form={form}>
					{Jurisdictions && Jurisdictions.filter(j => j.JurisdictionType === activeOffice.JurisdictionType).map((j, i) => (<MenuItem key={i} value={j.ID}>{j.Name}</MenuItem>))}
				</Field>);
		}
		
		if(activeOffice && activeOffice.HasDistricts && (!isPopulated(activeOffice.JurisdictionType) || isPopulated(data[model][(prefix?prefix+"_Jurisdiction":"Jurisdiction")]))) {
			selectors.push(<Field label={prefix?prefix + " District":"District"} type="select" required={required} 
					model={model+"."+(prefix?prefix+"_District":"District")} onChange={onChangeHandler} form={form}>
					{Offices && Offices.filter(o => o.Office === activeOffice.ID).map((o,i) => (<MenuItem key={i} value={o.ID}>{o.Name}</MenuItem>))}
				</Field>)
		}
		
		return selectors;
	}
}

const onChangeHandler = (args, onChange, model, prefix, data, offices) => {
	return function (dispatch, getState) {
		onChange(args.key, args.value, args.error);
		//check the key and the value and determine if we need to clear out any of the other items
		let officekey = model + "." + (prefix?prefix+"_Office":"Office");
		let jurisdictionkey = model + "." + (prefix?prefix+"_Jurisdiction":"Jurisdiction");
		let districtkey = model + "." + (prefix?prefix+"_District":"District");
		//find the active office and determine validation
		let officeid = args.key===officekey?args.value:(data&&data[model])?data[model][(prefix?prefix+"_Office":"Office")]:null;
		let activeOffice = officeid !== null? offices.find(o => o.ID === officeid) : {};
		let required = {isValid:true, error: "Required"};
		let hasJurisdiction = activeOffice !== null && isPopulated(activeOffice.JurisdictionType);
		let hasDistrict = activeOffice !== null && activeOffice.HasDistricts;
		switch(args.key) {
			case officekey:
				onChange(jurisdictionkey, null, hasJurisdiction?required:{});
				onChange(districtkey, null, hasDistrict?required:{});
				break;
			case jurisdictionkey:
				onChange(districtkey, null, hasDistrict?required:{});
				break;			
			default:
				break;
		}
	}
}

const mapDispatch = (dispatch, ownProps) => ({
	onChangeHandler: (key, value, error) => dispatch(onChangeHandler({key, value, error}, ownProps.onChange, ownProps.model, ownProps.prefix, ownProps.data, ownProps.Offices))
});

export default connect(null, mapDispatch)(withStyles(style)(OfficeSelector));