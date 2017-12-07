import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import SelectorList from 'Components/SelectorList';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	}
});

class index extends Component {
	
	render() {
		let { open, close, history, redirect } = this.props;
		return (
			<Dialog open={open} onRequestClose={close}>
				<DialogTitle>Register</DialogTitle>
				<DialogContent className={this.props.classes.container}>
					<SelectorList table="CommitteeType" alias="CommitteeTypes" primaryText="Name" uri="PublicDataService.php"
						onSelect={(item)=>{redirect(item, history)}}/>
				</DialogContent>
			</Dialog>
		);
	}
}

const startRegistration = (type, history) => {
	return function (dispatch, getState) {
		dispatch({type: actions.HIDE_DIALOG, name: 'register'});
		history.push("/Registration/"+type.Name.replace(/\W/g, ''));
	}
}

const mapState = (state, ownProps) => ({
	open: state.dialog.some(item => item.name === 'register')
});

const mapDispatch = (dispatch, ownProps) => { return {
	close: () => dispatch({type: actions.HIDE_DIALOG, name: 'register'}),
	redirect: (type, history) => dispatch(startRegistration(type, history))
}}

export default connect(mapState, mapDispatch)(withRouter(withStyles(styles)(index)));