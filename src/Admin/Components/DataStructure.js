import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
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

class DataStructure extends Component {
	
	render() {
		let {structure, model, form, onChange} = this.props;
		//structure = JSON.parse(structure) || [];
		return (			
			<div className={this.props.classes.structure}>
			{structure.map(item=>{
				switch(item.Type) {
				case "checkbox":
					return (<Field type="checkbox" model={`${model}[${item.Name}]`} form={form}
						key={item.Name} label={item.Name} onChange={onChange}/>);
				case "text":
					return (<Field type="text" model={`${model}[${item.Name.replace(/ /g,"_")}]`} form={form}
						key={item.Name} label={item.Name} onChange={onChange} required={item.Required}/>);
				default:
					return (<p key={item.Name}>{item.Name} - Unimplemented Type</p>)
				}
			})}
			</div>				
		)
	}
}

export default withStyles(style)(DataStructure);