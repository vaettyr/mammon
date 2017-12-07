import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import { withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import { MenuItem } from 'material-ui/Menu';

import Form from 'Components/Form';
import Field from 'Components/Field';

import ErrorTip from 'Components/ErrorTip';

import withDataService from 'Services/DataService';

const style = (theme) => ({
	paper: {
		margin:10,
		padding:10
	},
	form: {
		display: '-webkit-flex',
		flexDirection: 'column'
	},
	spacer: {
		flexGrow: 1
	},
	itemRow: {
	    display: '-webkit-flex',
    	alignItems: 'center'
	},
	inline: {
		display:'-webkit-flex'
	},
	error: {
		color: 'red'
	},
	divider: {
		marginTop: theme.spacing.unit*4
	}
});

class OfficerTypeForm extends Component {
	componentDidMount() {
		this.props.getData("Role", "Roles");
	}
	
	render() {
		let { classes, roles, data, valid, errors, saveType } = this.props;
		return (<Paper className={classes.paper}>
			<Form className={classes.form} form="OfficerType">				
				<Field model="Name" type="text" label="Name" required/>
				<Field model="Role" type="select" label="Role" required>
					{roles.map((role, index) => (
						<MenuItem key={index} value={role.ID}>{role.Name}</MenuItem>
					))}
				</Field>
				<Field model="CreateAccount" type="select" label="Create Account" required>
					<MenuItem value="0">User Choice</MenuItem>
					<MenuItem value="1">Always</MenuItem>
					<MenuItem value="-1">Never</MenuItem>
				</Field>
				<ErrorTip errors={errors}
					filter={(item) => true}>
					<Button raised color="primary" disabled={valid} onClick={() => saveType(data)}>Save</Button>
				</ErrorTip>				
			</Form>			
		</Paper>);		
	}
}

const mapState = (state, ownProps) => ({
	roles: state.data && state.data.Roles ? state.data.Roles.data : [],
	data: state.form && state.form.OfficerType ? state.form.OfficerType: {},
	errors: state.validator["OfficerType"] || {},
	valid: state.validator && state.validator["OfficerType"] ? Object.keys(state.validator["OfficerType"]).some(item => state.validator["OfficerType"][item].isValid) : false
})

const saveType = (type, props) => {
	return function(dispatch, getState) {
		if(!type.ID) {
			props.createData("OfficerType", "OfficerTypes", type, undefined, function(response) {
				dispatch({type:actions.FORM_CLEAR_VALUES, form: "OfficerType"});
				dispatch({type:actions.PAGE_UPDATE, page:"OfficerType", editType: undefined});
			});
		} else {
			props.saveData("OfficerType", type, undefined, function(response) {
				dispatch({type:actions.FORM_CLEAR_VALUES, form: "OfficerType"});
				dispatch({type:actions.PAGE_UPDATE, page:"OfficerType", editType: undefined});
			});
		}
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	saveType: (type) => dispatch(saveType(type, ownProps))
}}

export default withDataService()(connect(mapState, mapDispatch)(withStyles(style)(OfficerTypeForm)));