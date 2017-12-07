import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui-icons/MoreVert';
import Lock from 'material-ui-icons/Lock';
import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

import PermissionItem from 'Auth/Components/PermissionItem';
import withDataService from 'Services/DataService';

import isEqual from 'lodash/isEqual';

const style = (theme) => ({
	selected : {
		backgroundColor:theme.palette.primary['200']
	}
})

class SelectorList extends Component {
	
	componentDidMount() {
		this.props.getData(this.props.table, this.props.alias, this.props.query);
	}
	
	componentWillUpdate(nextProps, nextState) {
		if(nextProps.table !== this.props.table || nextProps.alias !== this.props.alias
			|| !isEqual(nextProps.query, this.props.query)) {
			this.props.getData(nextProps.table, nextProps.alias, nextProps.query);
		}
	}
	
	dataset(set, filter) {
		if(filter !== undefined) {
			return set.filter((item) => filter(item));
		} else {
			return set;
		}
	}
	
	render() {
		let { permission, table, alias, primaryText, secondaryText, icon, displayText,
			lockItem, onEdit, onDelete, onSelect, onCreate, menu, filter, setIndex, classes } = this.props;
		return (
		<List>
			{onCreate && <Button raised color="primary" onClick={onCreate}>+ New {displayText || alias || table}</Button>}
			{this.props[alias] && this.dataset(this.props[alias], filter).map((item, index) => { return (
				<div key={index}>
					<ListItem button={onSelect !== undefined} className={index===setIndex?classes.selected:''}
						onClick={() => onSelect && onSelect(item, index)}>
						{ icon && <Avatar>
							{React.createElement(icon)}
						</Avatar>}
						<ListItemText primary={item[primaryText]} secondary={item[secondaryText]}/>					
						{ (lockItem || onEdit || onDelete) && 
							<ListItemSecondaryAction>
								{(lockItem && item[lockItem]) && <IconButton aria-label="locked" disabled><Lock /></IconButton>}
								{((onEdit || onDelete) && (!lockItem || !item[lockItem])) && 
									<PermissionItem permission={permission} flag="Update|Delete">
										<IconButton onClick={(e)=>{menu.showMenu(e, {item, index})}}>
											<MoreVert/>
										</IconButton>
									</PermissionItem>}
							</ListItemSecondaryAction>}
					</ListItem>
					<Divider/>
				</div>)}
			)}	
			{(onEdit || onDelete) && 
			<Menu id={alias} open={menu.open} onRequestClose={menu.hideMenu} anchorEl={menu.anchor}>
				{onEdit && <PermissionItem permission={permission} flag="Update">
					<MenuItem onClick={() => {menu.onEdit(menu.item.item, menu.item.index)}}>Edit</MenuItem>
				</PermissionItem>}
				{onDelete && <PermissionItem permission={permission} flag="Delete">
					<MenuItem onClick={() => {menu.onDelete(menu.item.item, menu.item.index)}}>Delete</MenuItem>
				</PermissionItem>}
			</Menu>}
		</List>);
	}
}

const onEdit = (item, index, menu, edit) => {
	return function(dispatch, getState) {
		dispatch({type:actions.HIDE_MENU, menu: menu});
		edit(item, index);
	}
}

const onDelete = (item, menu, remove) => {
	return function(dispatch, getState) {
		dispatch({type:actions.HIDE_MENU, menu: menu});
		remove(item);
	}
}

const mapState = (state, props) => ({
	open: state.menu[props.alias] ? state.menu[props.alias].open : false,
	anchor: state.menu[props.alias] ? state.menu[props.alias].anchor: {},
	item: state.menu[props.alias] ? state.menu[props.alias].ref: {}
});

const mapDispatch = (dispatch, props) => { return {
	showMenu: (event, item) => dispatch({type:actions.SHOW_MENU, menu: props.alias, ref: item, anchor: event.target}),
	hideMenu: () => dispatch({type:actions.HIDE_MENU, menu: props.alias}),
	onEdit: (item, index) => dispatch(onEdit(item, index, props.alias, props.onEdit)),
	onDelete: (item) => dispatch(onDelete(item, props.alias, props.onDelete))
}};

const merge = (state, dispatch, props) => ({
	...props,
	menu: {...state, ...dispatch}
});

export default withStyles(style)(connect(mapState, mapDispatch, merge) (withDataService()(SelectorList)));