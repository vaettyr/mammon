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

class JurisdictionType extends Component {
	render() {
		let {classes, saveJurisdictionType, data} = this.props;
		return (
			<Paper className={[classes.paper, classes.form].join(' ')}>
				{this.props.isNew ? "New Jurisdiction Type" : "Edit Jurisdiction Type"}
				<Form form="JurisdictionType" className={this.props.classes.form}>
					<Field type="text" model="Name" label="Name" required/>
					<Field type="text" model="Description" label="Description" multiline rows="2"/>
				</Form>
				<Button raised color="primary" onClick={() => {saveJurisdictionType(data)}}>Save</Button>
			</Paper>
		);
	}
}

const onSaveJurisdictionType = (type, props) => {
	return function (dispatch, getState) {
		if(type.ID !== undefined) {
			props.saveData("JurisdictionType", type, undefined, function(response) {
				dispatch({type:actions.PAGE_UPDATE, page:"Jurisdiction", editType: undefined});
			});
		} else {
			props.createData("JurisdictionType", "JurisdictionTypes", type, undefined, function(response) {
				dispatch({type:actions.PAGE_UPDATE, page:"Jurisdiction", editType: undefined});
			});
		}
	}
	
}

const mapDispatch = (dispatch, ownProps) => { return {
	saveJurisdictionType: (type) => {dispatch(onSaveJurisdictionType(type, ownProps))}
}};

const mapState = (state, ownProps) => ({
	data: state.form['JurisdictionType'],
	isNew: state.form['JurisdictionType'] ? state.form.JurisdictionType.ID === undefined : true
});
	
export default withDataService()(connect(mapState, mapDispatch)(withStyles(style)(JurisdictionType)));