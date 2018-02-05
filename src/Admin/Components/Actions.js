import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import { withStyles } from 'material-ui/styles';
import withDataService from 'Services/DataService';
import ItemMenu, { withMenu } from 'Components/ItemMenu';
import Form from 'Components/Form';
import FieldList from 'Components/FieldList';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import ActionItem from './ActionItem';
import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';

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

class Actions extends Component {
	
	render() {
		let { triggers, form, menu, actionTypes, classes, addSequence, data, getData, source, 
				collapsible, moveSequence, removeSequence } = this.props;
		return (<div>
			<h2>Actions</h2>
			{triggers && triggers.map((trigger, index) => (<div key={index}>
				<CollapseToggle expanded={collapsible.expanded} item={trigger.Name} onClick={()=>{collapsible.onExpand(trigger.Name)}}/>
				<span>{trigger.Name}</span>
				<Collapsible expanded={collapsible.expanded} item={trigger.Name}>
					<Form form={form} nested className={classes.action}>	
						<FieldList model={"Actions["+trigger.Name+"]"} actionTypes={actionTypes} root={"Actions."+trigger.Name} menu={menu} data={data} dataSource={source.ID} getData={getData} component={ActionItem} />
					</Form>				
					<Button raised color="primary" onClick={(e) => menu.showMenu(e, {Name: trigger.Name, type:'add'})}>Add Action</Button>
				</Collapsible>
			</div>))}
			<ItemMenu menu={menu}>
				{menu.ref && menu.ref.type === 'add' && actionTypes && actionTypes.map((type, index) => (
					<MenuItem key={index} onClick={() => {addSequence(form, menu.ref.Name, type)}}>{type.Name}</MenuItem>))}
				{menu.ref && menu.ref.type === 'edit' && menu.ref.index > 0 && <MenuItem onClick={() => moveSequence(form, menu.ref.index, menu.ref.model, -1)}>Move Up</MenuItem>}
				{menu.ref && menu.ref.type === 'edit' && menu.ref.index < (menu.ref.length - 1) && <MenuItem onClick={() => moveSequence(form, menu.ref.index, menu.ref.model, 1)}>Move Down</MenuItem>}
				{menu.ref && menu.ref.type === 'edit' && <MenuItem onClick={()=>{removeSequence(form, menu.ref.index, menu.ref.model)}}>Delete</MenuItem>}
			</ItemMenu>
		</div>);
	}
}

const mapState = (state, ownProps) => ({
	data: state.data
})

const mapDispatch = (dispatch, ownProps) => { return {
	addSequence: (form, trigger, action) => dispatch({type: actions.FORM_LIST_ADD, item: {Action: action.Handler, Name: action.Name, Parameters:{}}, form: form, key: "Actions["+trigger+"]"}),
	removeSequence: (form, index, model) => dispatch({type:actions.FORM_LIST_REMOVE, index: index, form: form, key: model}),
	moveSequence: (form, index, model, direction) => dispatch({type:actions.FORM_LIST_SORT, key: model, form: form, from:index, to:index+direction}),
	
}}

export default withCollapsible("Actions")(withMenu("Actions")(withDataService()(withStyles(style)(connect(mapState, mapDispatch)(Actions)))));