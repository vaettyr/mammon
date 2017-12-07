import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography'
import * as actions from 'Store/actionTypes';


import Form from 'Components/Form';
import Field from 'Components/Field';
import withDataService from 'Services/DataService';

const style = (theme) => ({
	paper: {
		margin:10,
		padding:10
	},
	form: {
		display: '-webkit-flex',
		flexDirection: 'column'
	}
});

class OfficeForm extends Component {
	
	componentDidMount(){
		this.props.getData("JurisdictionType", "JurisdictionTypes");
		this.props.getData("Office", "BallotGroups", {column:"BallotGroup"});
	}
	
	render() {
		let {classes, JurisdictionTypes, onSaveOffice, data, type, office, jurisdiction, tags} = this.props;
		return (<Paper className={[classes.paper, classes.form].join(' ')}>
			<Typography type="title" color="primary">{this.props.isNew ? "New "+type : "Edit "+type}</Typography>
			<Form form="Office" className={classes.form}>
				{office && <Typography type="subheading" color="secondary">{office.Name}</Typography>}
				{jurisdiction && <Typography type="subheading" color="secondary">
					{JurisdictionTypes.find(j=>j.ID===office.JurisdictionType).Name}: {jurisdiction.Name}</Typography>}
				<Field type="text" model="Name" label="Name" required/>
				{type==="Office" &&<Field type="select" model="JurisdictionType" label="Jurisdiction">
					<MenuItem value="">None</MenuItem>
					{JurisdictionTypes.map((type, index) => (
						<MenuItem key={index} value={type.ID}>{type.Name}</MenuItem>
					))}
				</Field>}
				{type === "Office" && <Field type="checkbox" model="HasDistricts" label="Has Districts"/>}
				{type==="Office" && <Field type="checkbox" model="NonPartisan" label="Non-Partisan" />}
				<Field type="autosuggest" model="BallotGroup" label="Group" getSuggestions={()=>tags}/>
				<Field type="number" model="DisplayOrder" label="Order" />
			</Form>
			<Button raised color="primary" onClick={()=>{onSaveOffice(data)}}>Save</Button>
		</Paper>);
	}
}

const saveOffice = (office, props) => {
	return function(dispatch, getState) {
		let { BallotGroups } = getState().data;
		var newTag = false;
		if(office.BallotGroup && !BallotGroups.data.some(t => t === office.BallotGroup)) { newTag = true;}
		if(!office.ID) {
			props.createData("Office", "Offices", office, undefined, function(response) {
				dispatch({type:actions.FORM_CLEAR_VALUES, form: "Office"});
				dispatch({type:actions.PAGE_UPDATE, page:"Offices", editOffice: undefined});
				if(newTag) {
					dispatch({type: actions.AUGMENT_DATA, table: "BallotGroups", data:[office.BallotGroup]});
				}
			});
		} else {
			props.saveData("Office", office, undefined, function(response) {
				dispatch({type:actions.FORM_CLEAR_VALUES, form: "Office"});
				dispatch({type:actions.PAGE_UPDATE, page:"Offices", editOffice: undefined});
				if(newTag) {
					dispatch({type: actions.AUGMENT_DATA, table: "BallotGroups", data:[office.BallotGroup]});
				}
			});
		}
	}
}

const mapState = (state, ownProps) => ({
	JurisdictionTypes: state.data.JurisdictionTypes ? state.data.JurisdictionTypes.data : [],
	data: state.form.Office ? state.form.Office : {},
	tags: state.data.BallotGroups ? state.data.BallotGroups.data : [],
	isNew: state.form.Office ? !state.form.Office.ID : true,
	type: state.form.Office ? 
			(state.form.Office.Office && state.form.Office.Office !== "0" ? 'District' : 'Office') : 
			undefined,
	office: state.form.Office && state.data.Offices ? 
			state.data.Offices.data.find(o=>o.ID === state.form.Office.Office) : undefined,
	jurisdiction: state.form.Office && state.data.Jurisdictions ? 
			state.data.Jurisdictions.data.find(j=>j.ID === state.form.Office.Jurisdiction) : undefined
});

const mapDispatch = (dispatch, ownProps) => { return {
	onSaveOffice: (office) =>{dispatch(saveOffice(office, ownProps))}
}};

export default withDataService()(connect(mapState, mapDispatch)(withStyles(style)(OfficeForm)));