import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import FlagIcon from 'material-ui-icons/Flag';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import { MenuItem } from 'material-ui/Menu';

import Field from 'Components/Field';
import Form  from 'Components/Form';

const style = theme => ({
	structure: {
		display:'-webkit-flex',
		flexDirection:'column'
	},
	row: {
		display:'-webkit-flex',
		flexDirection:'row',
		flexGrow: 1
	},
	Name: {
		margin: theme.spacing.unit,
		minWidth: 120,
		flexGrow: 1
	},
	Type: {
		margin:theme.spacing.unit,
		minWidth: 120,
		flexGrow: 0
	},
	grow: {
		flexGrow:1
	},
	flag: {
		color: theme.palette.primary['200'],
		alignSelf:'center'
	}
});

const types = [
	{Name: "Checkbox", Type: "checkbox"},
	{Name: "Text", Type: "text"},
	{Name: "Long Text", Type: "longtext"},
	{Name: "Address", Type: "address"},
	{Name: "Email", Type: "email"},
	{Name: "Phone", Type: "phone"},
	{Name: "Name (Person)", Type:"name"},
	{Name: "Option", Type:"reference"},
	{Name: "Officer Type", Type:"OfficerType"},
	{Name: "Office", Type: "office"}
];

class ConditionalStructure extends Component {
	render() {
		let {fields, value, model, form, onChange, options, classes, menu, parent, root} = this.props;
		return (			
			<div className={classes.structure}>		

			{value.map((item, index) => (<span key={index} className={classes.row}>
				
				{!item.Base && <Form form={form} nested className={classes.row}>
					<Field type="text" model={model('Name', index)} form={form} 
						label="Name" required unique={value.filter((v,i)=>i!==index).map(c=>c.Name)} onChange={onChange}/>
					<Field type="select" model={model('Type', index)} form={form}
						label="Type" required onChange={onChange} classes={{root: classes.menu}}>
							{types.map((type, i) => (<MenuItem key={i} value={type.Type}>{type.Name}</MenuItem>))}
					</Field>
					{item.Type === "reference" && <Field type="select" 
						model={model('LookupType', index)} form={form} label="Option Type"
						required onChange={onChange}>
						{options && options.map((o, i) => (
							<MenuItem key={i} value={o.ID}>{o.Name}</MenuItem>
						))}</Field>}
				</Form>}
				{item.Base && <span className={classes.row}>
					<Typography type='subheading' className={classes.Name}>{item.Name}</Typography>
					<Typography type="subheading" className={classes.Type}>{types.find(t=> t.Type === item.Type).Name}</Typography>
				</span>}
				<span className={classes.grow}></span>
				{item.Conditions && <Tooltip title="Has Conditions" className={classes.flag}><FlagIcon /></Tooltip>}
				<IconButton onClick={(e)=>{menu.showMenu(e, {item:item, index:index, parent:root, model:parent})}}><MoreVertIcon/></IconButton>
			</span>))}

			<Button raised color="primary" onClick={() => fields.push({})}>Add Custom Field</Button>
			</div>				
		)
	}
}

export default withStyles(style)(ConditionalStructure);