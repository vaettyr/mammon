import React, { Component } from 'react';
import * as FilingSchedule from 'Services/FilingSchedule';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Card from 'material-ui/Card';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';

import Form from 'Components/Form';
import Field from 'Components/Field';

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
	grow: {
		flexGrow:1
	},
	main: {
		display:'flex',
		flexDirection:'row'
	},
	calendar: {
		flexWrap:'wrap',
		display:'flex',
		justifyContent:'space-around',
		'&:after': {
			content:'""',
			flex:'auto'
		}
	},
	month: {
		display:'inline-block',
		flexDirection:'column',
		padding: theme.spacing.unit,
		margin: theme.spacing.unit,
		borderWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.primary['200'],
		borderRadius: theme.spacing.unit
	},
	monthLabel: {
		textAlign:'center'
	},
	week: {
		flexDirection:'row',
		flexBasis:'100%',
		display:'flex'
	},
	day: {
		display: 'flex',
		width: theme.spacing.unit * 6,
		height: theme.spacing.unit * 9
	}		
});

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const daysInMonth = (month, year) => {
	let isLeapYear = (year % 4) || ((year % 100 === 0) && (year % 400)) ? 0 : 1;
	let daysInMonth = 31 - ((month === 1) ? (3 - isLeapYear) : ((month) % 7 % 2));
	return daysInMonth;
}

class index extends Component {	
	
	componentWillMount() {
		let { cycles } = this.props;
		cycles.initialize();
	}
	componentWillUpdate(nextProps) {
		let { cycles, dataService } = nextProps;
		if(cycles && cycles.data) {
			let { Begin, End, FilingSchedule } = cycles.data;
			if( Begin && End && FilingSchedule !== undefined && FilingSchedule !== null && (
				Begin !== this.props.cycles.data.Begin || End !== this.props.cycles.data.End || FilingSchedule !== this.props.cycles.data.FilingSchedule)) {
				cycles.buildSchedule(Begin, End, FilingSchedule);
			}
		}
		
	}
	renderWeeks(classes, month, year, start) {
		let startdate = new Date(0);
		startdate.setYear(year);
		startdate.setDate(start||1);
		startdate.setMonth(month);
		
		let offset = startdate.getDay();
		let days = daysInMonth(month, year);
		let weeks = [];
		let week = [];
		for(var i = 0; i < days + offset; i++) {
			week.push(<span key={i} className={classes.day}>{i < offset ? "": (start||1) + (i - offset)}</span>);
			if(week.length > 6) {
				weeks.push(<span key={weeks.length} className={classes.week}>{week}</span>);
				week = [];
			}
		}
		if(week.length > 0) {
			weeks.push(<span key={weeks.length} className={classes.week}>{week}</span>);
		}
		return weeks;
	}
	renderMonth(classes, month, year, start) {
		return (<span key={month+"-"+year} className={classes.month}>
			<Typography type='title' className={classes.monthLabel}>{months[month]}, {year}</Typography>
			<span className={classes.week}>
				<span className={classes.day}>Su</span>
				<span className={classes.day}>Mo</span>
				<span className={classes.day}>Tu</span>
				<span className={classes.day}>We</span>
				<span className={classes.day}>Th</span>
				<span className={classes.day}>Fr</span>
				<span className={classes.day}>Sa</span>
			</span>
			{ this.renderWeeks( classes, month, year, start) }
		</span>);
	}
	renderCalendar(classes, start, end) {
		//for now, just push months
		let months = [];
		let month = start.getMonth();
		let year = start.getFullYear();
		let endMonth = end.getMonth();
		let endYear = end.getFullYear();
		while (year !== endYear || month !== endMonth + 1) {
			months.push( this.renderMonth( classes, month, year ) );
			month ++;
			if(month > 11) {
				month = 0;
				year++;
			}
		}
		return months;
	}
	render() {
		let { classes, cycles, dataService } = this.props;
		return (
			<Paper className={classes.root}>
				<Toolbar className={classes.toolbar}>
					Filing Cycles
					<span className={classes.grow}></span>
					<Button color="inherit" onClick={()=>{cycles.edit({})}}>New</Button></Toolbar>
				<div className={classes.main}>
					{cycles.active && <Card>
						<Form form="FilingCycle">
							<Field type="text" label="Name" required model="Name"/>
							<Field type="date" label="Begin" required model="Begin"/>
							<Field type="date" label="End" required model="End"/>
							<Field type="select" label="Schedule" required model="FilingSchedule">
								{dataService.FilingSchedules && dataService.FilingSchedules.map((schedule, index) => (
									<MenuItem key={index} value={schedule.ID}>{schedule.Name}</MenuItem>
								))}
							</Field>
							<Field type="date" label="Open" model="Open"/>
							<Field type="date" label="Close" model="Close"/>
							<Field type="text" label="Restrictions" model="Restrictions" />
						</Form>
					</Card>}
					{cycles.active && cycles.data.ReportingPeriods && <div className={classes.calendar}>
						{this.renderCalendar(classes, FilingSchedule.toDate(cycles.data.Begin), FilingSchedule.toDate(cycles.data.End))}
					</div>}
				</div>
			</Paper>
		);
	}
}

export default withStyles(style)(index);