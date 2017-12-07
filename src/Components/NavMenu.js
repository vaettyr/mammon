import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import * as actions from 'Store/actionTypes';

import PermissionItem from 'Auth/Components/PermissionItem';

const style = theme => ({
	
});

class NavMenu extends Component {
	render() {	
		let { id, content, displayName, showMenu, hideMenu, nav, menu, history, staticContext, ...rest } = this.props;
		return (<div>
			<Button onClick={(e) => showMenu(e, id)} {...rest}>{displayName}</Button>
			<Menu id={id} open={menu.open} anchorEl={menu.anchor}
				onRequestClose={()=>{hideMenu(id)}}>
				{content.map((item, index) => (
					item.permission ?	
					<PermissionItem key={index} permission={item.permission}>
						<MenuItem onClick={()=>{nav(item.path, history)}}>{item.display}</MenuItem>
					</PermissionItem>:
					<MenuItem key={index} onClick={()=>{nav(item.path, history)}}>{item.display}</MenuItem>
				))}
			</Menu>
		</div>);
	}
}

const goTo = (path, history) => {
	return function(dispatch) {
		dispatch({type:"NAV_EVENT", target: path});
		history.push(path);
	}
}
const mapState = (state, props) => ({
	menu: state.menu[props.id] || {}
});

const mapDispatch = dispatch => { return {
	showMenu: (event, menu) => dispatch({type: actions.SHOW_MENU, menu: menu, anchor: event.target }),
	hideMenu: (menu) => dispatch({type:actions.HIDE_MENU, menu: menu}),
	nav: (path, history) => dispatch(goTo(path, history))
}};

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(NavMenu)));