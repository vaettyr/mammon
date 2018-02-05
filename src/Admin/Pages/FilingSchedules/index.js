import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography';

import withDataService from 'Services/DataService';
import FilingSchedule from './FilingSchedule';
import SelectorList from 'Components/SelectorList';

const style = (theme) => ({
	drawer: {
		position: 'initial',
		height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)'
	},
	root: {
		display: 'flex',
		flexDirection:'column',
		margin: theme.spacing.unit
	},
	toolbar: {
		display:'flex',
		background: theme.palette.primary['200']
	},
	main: {
		display:'flex',
		flexDirection:'row'
	},
	paper: {
		flex: 1,
		padding:theme.spacing.unit
	}
})

class index extends Component {
	componentDidMount() {
		let {getData} = this.props;
		getData("ReportingPeriodTemplate", "ReportingPeriodTemplates");
	}
	render() {
		let {classes, activeSchedule, onSetSchedule, onDeleteSchedule, onSaveSchedule, data} = this.props;
		return (<Paper className={classes.root}>
				<Toolbar className={classes.toolbar}>Filing Schedules</Toolbar>
				<div className={classes.main}>
					<Drawer type="permanent" classes={{paper: classes.drawer}}>
						<SelectorList table="FilingSchedule" alias="FilingSchedules" primaryText="Name" 
							permission="FilingSchedule" secondaryText="Description" displayText="Filing Schedule"
							onEdit={(item) => {onSetSchedule(item)}} 
							onCreate={()=>{onSetSchedule({})}}
							onDelete={(item)=>{onDeleteSchedule(item)}}/>
					</Drawer>
					{activeSchedule && <Paper className={classes.paper}>
						<FilingSchedule schedule={activeSchedule} data={data} onSave={()=>{onSaveSchedule(data)}} form="FilingSchedule"/>
					</Paper>}
					{!activeSchedule && <Paper className={classes.paper}>
						<Typography type="title">Filing Schedules</Typography>
						<p>A Filing Schedule is a template that is used to generate a list of reports that must be filed by any Candidate 
							or Committee who is assigned to a giving Filing Cycle. It consists of a list of Reporting Period Templates, 
							which in turn define the following:
						</p>
						<ul>
							<li>The name of the Report, as it appears to the Candidate or Committee</li>
							<li>The period of time the report covers</li>
							<li>When the report is due</li>
							<li>The content of the report</li>
							<li>Any notifications associated to the report</li>
						</ul>
						<p>Filing Schedules can also define multiple tracks of Reporting Period Templates. These alternate tracks are 
							used to define fallbacks in case a particular Report does not apply to a given Candidate or Committee. 
							This is useful for creating Reporting Periods to cover the period of time prior to when a given Candidate or
							Committee registered in the system, or any ongoing reports that may be required after the end of a Filing Cycle.
						</p>
						<p>For more information about how these dates are calculated and how a Filing Schedule is used to create the actual
							list of reports for a Candidate or Committee, see the help text on the Schedule page.
						</p>
					</Paper>}
				</div>
		</Paper>);
	}
}

export default withDataService()(withStyles(style)(index));