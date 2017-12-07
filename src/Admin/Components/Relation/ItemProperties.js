import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles'

import { MenuItem } from 'material-ui/Menu';
import Field from 'Components/Field';
import ColumnValues from './ColumnValues';

const style = (theme) => ({
	row: {
		display:'-webkit-flex',
		flexDirection:'row'
	}
})
class ItemProperties extends Component {
	render() {
		let { item, model, onChange, form, classes } = this.props;
		if(model) { 
		return (<span className={classes.row}>
			<Field type="select" model={model+".Properties"} onChange={onChange} 
				form={form} label="Properties" multiple>
				<MenuItem value="optional">Optional</MenuItem>
				<MenuItem value="hidden">Hidden</MenuItem>
				<MenuItem value="disabled">Disabled</MenuItem>
			</Field>
			<ColumnValues onChange={onChange} form={form} column={item} model={model+".Values"}/>
			<Field type="text" model={model+".Label"} onChange={onChange} form={form} label="Label"/>
			<Field type="textarea" model={model+".Help"} onChange={onChange} form={form} label="Help Text"/>		
		</span>);
		} else {return null;}
	}
}

export default withStyles(style)(ItemProperties);