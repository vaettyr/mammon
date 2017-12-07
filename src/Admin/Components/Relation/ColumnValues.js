import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MenuItem } from 'material-ui/Menu';
import Field from 'Components/Field';

class ColumnValues extends Component {
	
	handleChange(model, value, valid, onChange) {
		if(value.some(i=>i==="*"||i==="!"||i===null)) {
			value = value.filter(i => (i === null && !value.some(x=>x==="!"||x==="*")) || (i === "!" && !value.some(x=> x=== "*")) || i === "*");
		}
		onChange(model, value, valid);
	}
	
	render() {
		let { column, model, onChange, form, data, officertypes} = this.props;
		switch(column.Type) {
		case "checkbox":
			return <Field type="select" label="Values" model={model} onChange={onChange} form={form} required multiple>
				<MenuItem value={1}>True</MenuItem>
				<MenuItem value={-1}>False</MenuItem>
			</Field>;
		case "OfficerType":
			return <Field type="select" model={model} 
				onChange={(model, value, valid) => {this.handleChange(model, value, valid, onChange)}}
				form={form} required multiple label="Values">
				<MenuItem value={null}></MenuItem>
				{officertypes.map((type, index) => (
					<MenuItem key={index} value={type.ID}>{type.Name}</MenuItem>
				))}
				<MenuItem value="!">All Other Values</MenuItem>
				<MenuItem value="*">All Values</MenuItem>
			</Field>
		case "reference":
			return <Field type="select" model={model}
			onChange={(model, value, valid) => {this.handleChange(model, value, valid, onChange)}}
			form={form} required multiple label="Values">
			<MenuItem value={null}></MenuItem>
			{data.map((type, index) => (
				<MenuItem key={index} value={type.ID}>{type.Name}</MenuItem>
			))}
			<MenuItem value="!">All Other Values</MenuItem>
			<MenuItem value="*">All Values</MenuItem>
		</Field>
		default:
			return null;
		}
	}
}

const mapState = (state, ownProps) => ({
	officertypes: state.data['OfficerTypes'] ? state.data.OfficerTypes.data : [],
	data: ownProps.column && ownProps.column.Type === 'reference' && ownProps.column.LookupType ?
		state.data[state.data.LookupType.data.find(x => x.ID === ownProps.column.LookupType).Name].data : []
});

export default connect(mapState)(ColumnValues);