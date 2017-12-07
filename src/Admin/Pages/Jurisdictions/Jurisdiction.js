import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
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

class Jurisdiction extends Component {
	render() {
		let {classes, saveJurisdiction, data, jurisdictionType} = this.props;
		return (
			<Paper className={[classes.paper, classes.form].join(' ')}>
				{this.props.isNew ? "New " : "Edit "}{jurisdictionType && jurisdictionType.Name}
				<Form form="Jurisdiction" className={this.props.classes.form}>
					<Field type="text" model="Name" label="Name" required/>
					<Field type="text" model="Description" label="Description" multiline rows="2"/>
				</Form>
				<Button raised color="primary" onClick={() => {saveJurisdiction(data)}}>Save</Button>
			</Paper>
		);
	}
}

const onSaveJurisdiction = (jurisdiction, props) => {
	return function (dispatch, getState) {
		if(jurisdiction.ID !== undefined) {
			props.saveData("Jurisdiction", jurisdiction, undefined, function(response) {
				dispatch({type:actions.PAGE_UPDATE, page:"Jurisdiction", editJurisdiction: undefined});
			});
		} else {
			jurisdiction.JurisdictionType = props.jurisdictionType.ID;
			props.createData("Jurisdiction", "Jurisdictions", jurisdiction, undefined, function(response) {
				dispatch({type:actions.PAGE_UPDATE, page:"Jurisdiction", editJurisdiction: undefined});
			});
		}
	}
	
}

const mapDispatch = (dispatch, ownProps) => { return {
	saveJurisdiction: (jurisdiction) => {dispatch(onSaveJurisdiction(jurisdiction, ownProps))}
}};

const mapState = (state, ownProps) => ({
	data: state.form['Jurisdiction'],
	isNew: state.form['Jurisdiction'] ? state.form.Jurisdiction.ID === undefined : true
});
	
export default withDataService()(connect(mapState, mapDispatch)(withStyles(style)(Jurisdiction)));