import React, { Component } from 'react';

import withDataService from 'Services/DataService';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';

import SelectorList from 'Components/SelectorList';
import Page from '../Page';
import CommitteeTypeForm from './CommitteeTypeForm';

const style = (theme) => ({
	drawer: {
		position: 'initial',
		height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)'
	},
	paper: {
		margin: theme.spacing.unit,
		padding: theme.spacing.unit
	}
});

class index extends Component {
	componentDidMount() {
		//get all officer types and all lookup values
		let {getData, data} = this.props;
		getData("OfficerType", "OfficerTypes");
		getData("LookupType", null, null, function(response) {
			data.LookupType.data.forEach(lookuptype => {
				getData("Lookup", lookuptype.Name, {LookupType: lookuptype.ID});
			});
		});
	}
	render() {
		let {classes, page, selectCommitteeType} = this.props;
		return (
			<Page pageName="Committee Types">
				<Drawer type="permanent" classes={{paper: classes.drawer}}>
					<SelectorList table="CommitteeType" alias="CommitteeTypes" primaryText="Name" 
						permission="CommitteeType" displayText="Committee Type" setIndex={page.index}
						onEdit={(item, index)=>{selectCommitteeType(item, index)}}/>
				</Drawer>
				{page.activeType && <CommitteeTypeForm/>}
				{page.activeType && <Paper className={classes.paper}>
					<h2>Other things that need to be known or can be configured</h2>
					<ul>
						<li>Sub-Types</li>
						<li>Status upon initial submission?</li>
						<li>Status upon amendment? (auto-approve)</li>
						<li>Create Account (for candidates)</li>
						<li>Publicly Accessible</li>
						<li>Correspondences?</li>
						<li>Confirmation page options?</li>
						<li>Registration form(s) and Notifications/Certifications (forms w/no databinding)</li>
					</ul>
				</Paper>}
			</Page>
		);
	}
}

export default withDataService()(withStyles(style)(index));