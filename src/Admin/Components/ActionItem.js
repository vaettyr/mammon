import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography'
import Field from 'Components/Field';
import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

const style = theme => ({
	action: {
		display:'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems:'baseline'
	},
	block: {
		marginLeft: theme.spacing.unit * 6
	}
});

class ActionItem extends Component {
	
	render() {
		let { value, classes, model, form, onChange, menu, root, actionTypes, data, getData, dataSource} = this.props;
		return (			
			<div className={classes.block}>	
			{value.map((item, index) => (<div key={index}>
			<Typography type="title">{index + 1}: {item.Name}</Typography>
			<div className={classes.action}> <Typography type="subheading">Parameters</Typography>
				{this.renderAction(item, index, actionTypes, form, model, onChange, data, getData, dataSource)}
				<IconButton onClick={(e)=>{menu.showMenu(e, {type: 'edit', model: root, item: item, index: index, length:value.length})}}><MoreVertIcon/></IconButton>
				</div>			
			</div>))}
			</div>
		);
	}
	
	renderAction(item, i, actionTypes, form, model, onChange, data, getData, dataSource) {
		if(!actionTypes || !actionTypes.some(t => t.Name === item.Name)) {
			return [];
		}
		let type = actionTypes.find(t => t.Name === item.Name);
		return type.Parameters.filter(t => (t.Type !== 'Default')).map((param, index) => {
			switch(param.Type) {
			case 'Enum':
				return (<Field type="select" model={model("Parameters." + param.Name, i)} form={form} key={index}
					label={param.Name} required onChange={onChange}>
					{param.Options.map((option, i) => (<MenuItem key={i} value={option}>{option}</MenuItem>))}
				</Field>);
			case 'Bool':
				return (<Field type="checkbox" model={model("Parameters." + param.Name, i)} form={form} key={index}
				label={param.Name} onChange={onChange}/>);
			case 'Table':
				if(!data || !data[param.Alias]) {
					getData(param.Table, param.Alias, {DataSource: dataSource});
					return (<span key={index}>{param.Name}: No options available</span>);
				}
				let options = data[param.Alias].data.filter(o => o.DataSource === dataSource);
				return (<Field type="select" model={model("Parameters." + param.Name, i)} form={form} key={index}
					label={param.Name} required onChange={onChange}>
					{options.map((option, i) => (<MenuItem key={i} value={option.ID}>{option.Name}</MenuItem>))}
				</Field>);
				default:
					return(<span>Unimplemented type</span>);
			}
		});
	}
	
	
}

const mapState = (state, ownProps) => ({
	data: state.data
})

const mapDispatch = (dispatch, ownProps) => { return {
	addSequence: (form, trigger, action) => dispatch({type: actions.FORM_LIST_ADD, item: {Action: action.Handler, Name: action.Name, Parameters:{}}, form: form, key: "Actions["+trigger+"]"}),
}}

export default withStyles(style)(connect(mapState, mapDispatch)(ActionItem));