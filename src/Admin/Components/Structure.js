import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import Field from 'Components/Field';

const style = theme => ({
	structure: {
		display:'-webkit-flex',
		flexDirection:'column'
	},
	row: {
		display:'-webkit-flex',
		flexDirection:'row'
	}
});

const types = [
	{Name: "Checkbox", Type: "checkbox"},
	{Name: "Text", Type: "text"},
	{Name: "Long Text", Type: "longtext"},
	{Name: "Address", Type: "address"},
	{Name: "Email", Type: "email"},
	{Name: "Phone", Type: "phone"},
	{Name: "Individual", Type:"name"},
	{Name: "Option", Type:"reference"}
];

class Structure extends Component {
	render() {
		let {fields, value, model, form, onChange, options} = this.props;
		return (			
			<div className={this.props.classes.structure}>
			<Button onClick={() => fields.push({})}>Add Custom Field</Button>
			{value.map((item, index) => (
				<div className={this.props.classes.row} key={index}>
					<IconButton onClick={()=>fields.remove(index)}><DeleteIcon/></IconButton>
					<Field type="text" model={model('Name', index)} form={form} 
						label="Name" required onChange={onChange}/>
					<Field type="select" model={model('Type', index)} form={form}
						label="Type" required onChange={onChange}>
						{types.map((type, i) => (<MenuItem key={i} value={type.Type}>{type.Name}</MenuItem>))}
					</Field>
					{item.Type === "reference" && <Field type="select" 
						model={model('LookupType', index)} form={form} label="Option Type"
						required onChange={onChange}>
						{options && options.map((o, i) => (
							<MenuItem key={i} value={o.ID}>{o.Name}</MenuItem>
						))}
					</Field>}
					{item.Type !== "checkbox" && (<Field type="checkbox" model={model('Required', index)} form={form}
						label="Required" onChange={onChange}/>)}			
				</div>
			))}
			</div>				
		)
	}
}

export default withStyles(style)(Structure);