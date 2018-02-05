import React, { Component } from 'react';

import withDataService from 'Services/DataService';
import withDataSource from 'Services/DataSource';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';

import SelectorList from 'Components/SelectorList';
import Page from '../Page';
import CommitteeTypeForm from './CommitteeTypeForm';
import Actions from '../../Components/Actions';

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
		let {getData, getBatchData, data} = this.props;
		
		let datasets = [
			{table: "OfficerType", alias: "OfficerTypes"},
			{table: "Form", alias: "Forms"},
			{table: "LookupType", callback: (response) => {
				data.LookupType.data.forEach(lookuptype => {
					getData("Lookup", lookuptype.Name, {LookupType: lookuptype.ID});
				});
			}}
		];
		getBatchData(datasets);
	}
	render() {
		let {classes, page, selectCommitteeType, source, activeType, actionTypes} = this.props;
		return (
			<Page pageName="Committee Types">
				<Drawer type="permanent" classes={{paper: classes.drawer}}>
					<SelectorList table="CommitteeType" alias="CommitteeTypes" primaryText="Name" 
						permission="CommitteeType" displayText="Committee Type" setIndex={page.index}
						onEdit={(item, index)=>{selectCommitteeType(item, index)}}/>
				</Drawer>
				{page.activeType && <CommitteeTypeForm/>}
				{page.activeType && <Paper className={classes.paper}>
					<Actions model="Actions" form="CommitteeType" source={source} actionTypes={actionTypes} sequences={activeType.Actions} triggers={source.Triggers}/>
					
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
					<p>Maybe create an action sequence system. Nothing too complex, but the idea goes like this:</p>
					<p>There are defined triggers. These are per table or per area, whatever. Things like onSubmit, onApprove, onAmend, etc.</p>
					<p>Then, there's actions the system can take, such as generating reports, sending emails. . . uh, maybe something else</p>
					<p>Then, in configuration, you just link them up. The deserialized structure established in reports (and data sources) would be very useful here</p>
				</Paper>}
			</Page>
		);
	}
}

export default withDataSource("Registration")(withDataService()(withStyles(style)(index)));