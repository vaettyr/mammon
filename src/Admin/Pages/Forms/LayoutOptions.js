import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { MenuItem } from 'material-ui/Menu';

import Form from 'Components/Form';
import Field from 'Components/Field';

const style = (theme) => ({
	container: {
		display:'flex',
		flexWrap:'wrap'
	}
});

const displays = [
	{Name:"Inline", Value:"inline"},
	{Name:"Inline Block", Value:"inline-block"},
	{Name:"Block", Value:"block"}
]

const positions = [
	{Name:"Static", Value:"static"},
	{Name:"Relative", Value:"relative"},
	{Name:"Fixed", Value:"fixed"},
	{Name:"Absolute", Value:"absolute"}
]

class LayoutOptions extends Component {
	render() {
		let { classes, form, element } = this.props;
		return (<Form form={form} className={classes.container}>
			<Field type="select" label="Display" model={"Data."+element.path+".Display"} priority="1">
				{displays.map((item, index) => <MenuItem key={index} value={item.Value}>{item.Name}</MenuItem>)}
			</Field>
			<Field type="select" label="Position" model={"Data."+element.path+".Position"} priority="1">
				{positions.map((item, index) => <MenuItem key={index} value={item.Value}>{item.Name}</MenuItem>)}
			</Field>
			{element.Position && element.Position !== 'static' && <span>
				<Field type="number" label="Top" model={"Data."+element.path+".Top"} suffix="%"/>
				<Field type="number" label="Bottom" model={"Data."+element.path+".Bottom"} suffix="%"/>
				<Field type="number" label="Left" model={"Data."+element.path+".Left"} suffix="%"/>
				<Field type="number" label="Right" model={"Data."+element.path+".Right"} suffix="%"/>
			</span>}
			<Field type="number" label="Width" model={"Data."+element.path+".Width"} suffix="%" empty="initial"/>
			<Field type="number" label="Height" model={"Data."+element.path+".Height"} suffix="%" empty="initial"/>
		</Form>);
	}
}

export default withStyles(style)(LayoutOptions);