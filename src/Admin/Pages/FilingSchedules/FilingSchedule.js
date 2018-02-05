import React, { Component } from 'react';
import Form from 'Components/Form';
import Field from 'Components/Field';
import FieldList from 'Components/FieldList';
import ReportingPeriod from './ReportingPeriod';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { MenuItem } from 'material-ui/Menu';
import ItemMenu, { withMenu } from 'Components/ItemMenu';

const style = (theme) => ({
	topline: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap:'wrap'
	},
	body: {
		flexBasis:'100%'
	}
});

class FilingSchedule extends Component {
	render() {
		let { data, form, classes, menu, onSave } = this.props;
		return(<Form form={form} className={classes.topline}>
				<Field type="text" label="Name" model="Name" required/>
				<Field type="textarea" label="Description" model="Description" required/>				
				<FieldList model="templates" root="templates" data={data} component={ReportingTrack} menu={menu}/>
				<span>Add a validator to this!</span>
				<Button raised color="primary" onClick={onSave}>Save Schedule</Button>
				<ItemMenu menu={menu}>
					{menu.ref && menu.ref.index > 0 && <MenuItem onClick={()=>{menu.ref.fields.move(menu.ref.index, -1)}}>Move Left</MenuItem>}
					{menu.ref && menu.ref.index < (menu.ref.root.length - 1) && <MenuItem onClick={()=>{menu.ref.fields.move(menu.ref.index, 1)}}>Move Right</MenuItem>}
					{menu.ref && <MenuItem onClick={()=>{menu.ref.fields.remove(menu.ref.index)}}>Delete</MenuItem>}
				</ItemMenu>
			</Form>);
	}
}

class ReportingTrackBase extends Component {
	render() {
		let { parent, filtered, data, form, fields, menu, classes } = this.props;
		return (<div className={classes.body}> 
			{filtered((track, index, place) => (
				<div key={index}>
					<Typography type="title">Track {place + 1}</Typography>
					{place > 0 && <Button raised color="primary" onClick={()=>{fields.remove(index, true)}}>Delete Track</Button>}
					<FieldList model={parent+"["+index+"].periods"} root={parent+"["+index+"].periods"} menu={menu} form={form} data={data} component={ReportingPeriod}/>
				</div>
			))}
			<Button color="primary" raised onClick={()=>{fields.push([{}])}}>Add Alternate Track</Button>
		</div>);
	}
}

const ReportingTrack = withStyles(style)(ReportingTrackBase);
export default withMenu('FilingSchedule')(withStyles(style)(FilingSchedule));