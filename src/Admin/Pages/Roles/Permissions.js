import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

const style = (theme) => ({
	nested: {
		paddingLeft: theme.spacing.unit * 3
	}
});

class Permissions extends Component {
	
	expanded(expanded, depth, index) {
		return expanded ? expanded.some(i=>i.depth===depth&&i.index===index) : false;
	}
	
	hasPermission(permission, data) {
		return data ? data.some(p => p.Permission === permission.ID && !p.remove) : false;
	}
	
	hasFlag(permission, flag, data) {
		let per = data.find(p=> p.Permission === permission.ID);
		if(per && per.Flags) {
			let flags = JSON.parse(per.Flags);
			return flags.some(f => f === flag);
		} else {
			return false;
		}
	}
	
	renderFlags(permission, enabled) {
		if(permission.Flags) {
			let flags = JSON.parse(permission.Flags);
			let { data, toggleFlag } = this.props;
			return(<span>
				{flags.map((flag, index) => (
					<FormControlLabel label={flag} key={index}
						control={<Checkbox checked={this.hasFlag(permission, flag, data) && enabled} 
						onChange={() => toggleFlag(permission, flag)}
						disabled={!enabled}/>} />
				))}
			</span>);
		}
	}
	
	renderPermission(permission, index, depth, permissions, rolepermissions, parentDisabled) {
		let sub = permissions.filter(p=>p.Parent === permission.ID);
		let { classes, onExpand, expanded, data, togglePermission } = this.props;
		let hasPermission = this.hasPermission(permission, data);
		return (<span key={index}>
			<ListItem style={{marginLeft: depth * 32}} button={sub.length>0}
				onClick={() => {sub.length>0 && onExpand(depth, index)}} divider>
				{sub.length > 0 ? this.expanded(expanded, depth, index) ? <ExpandLess /> : <ExpandMore />:<span className={classes.nested}/>}
				<ListItemText disableTypography primary={<Typography type="title">{permission.Alias || permission.Name}</Typography>} secondary={this.renderFlags(permission, hasPermission && !parentDisabled)}/>
				<ListItemSecondaryAction>
					<Switch disabled={parentDisabled} checked={hasPermission && !parentDisabled} onChange={()=>{togglePermission(permission)}}/>
				</ListItemSecondaryAction>
			</ListItem>
			{sub.length > 0 && <Collapse in={this.expanded(expanded, depth, index)} transitionDuration="auto"> 
				{sub.sort((a,b) => parseInt(a.DisplayOrder, 10) < parseInt(b.DisplayOrder, 10) ? -1: 1).map((p,i) => this.renderPermission(p, i, depth+1, permissions, rolepermissions, !hasPermission||parentDisabled))}
			</Collapse>}
		</span>);
	}
	
	render() {
		let { permissions, rolepermissions } = this.props;
		return (<List>
			{permissions && permissions.filter(p => p.Parent === "0")
				.map((p, i)=>this.renderPermission(p,i,0,permissions,rolepermissions))}
		</List>);
	}
}

const toggleExpand = (depth, index) => {
	return function(dispatch, getState) {
		let state = getState().page.Permissions;
		if(state && state.expanded) { state = state.expanded } else {state = []}
		let exists = state.some(i=>i.depth===depth&&i.index===index);
		let expanded = [...state];
		if (exists) {
			expanded.splice(expanded.findIndex(i=>i.index===index&&i.depth===depth), 1);
		} else {
			expanded.push({depth: depth, index: index});
		}
		dispatch({type:actions.PAGE_UPDATE, page: "Permissions", expanded: expanded});
	}
}

const togglePermission = (permission) => {
	return function(dispatch, getState) {
		//update the data of the page and set it appropriately
		let {data, role} = getState().page.Permissions;
		let exists = data.some(p=>p.Permission === permission.ID);
		let permissions = [...data];
		if(exists) {
			//see if it's flagged for delete
			let per = permissions.find(p=>p.Permission === permission.ID);
			if(per.remove) { per.remove = !per.remove; } else { per.remove = true;}
			per.dirty = true;
		} else {
			permissions.push({Permission: permission.ID, Role: role.ID});
		}
		dispatch({type:actions.PAGE_UPDATE, page: "Permissions", data: permissions});	
	}
}

const toggleFlag = (permission, flag) => {
	return function(dispatch, getState) {
		let {data} = getState().page.Permissions;
		let permissions = [...data];
		let per = permissions.find(p => p.Permission === permission.ID);
		let flags = per.Flags ? JSON.parse(per.Flags) : [];
		let exists = flags.some(f => f === flag);
		if(exists) {
			flags.splice(flags.indexOf(flag), 1);
		} else {
			flags.push(flag);
		}
		per.Flags = JSON.stringify(flags);
		per.dirty = true;
		dispatch({type:actions.PAGE_UPDATE, page: "Permissions", data: permissions});
	}
}

const mapState = (state) => ({
	expanded: state.page.Permissions ? state.page.Permissions.expanded : [],
	data: state.page.Permissions ? state.page.Permissions.data: []
});

const mapDispatch = (dispatch) => { return {
	onExpand: (depth, index) => dispatch(toggleExpand(depth, index)),
	togglePermission: (permission) => dispatch(togglePermission(permission)),
	toggleFlag: (permission, flag) => dispatch(toggleFlag(permission, flag))
}};

export default connect(mapState, mapDispatch)(withStyles(style)(Permissions));