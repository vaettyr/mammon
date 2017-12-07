import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import Menu from 'material-ui/Menu';

const withMenu = (menu) => {
	return function(WrappedComponent) {
		class withMenu extends Component {
			render() {
				return (<WrappedComponent {...this.props} />);
			}
		}
		
		const mapState = (state, ownProps) => ({
			menu: state.menu && state.menu[menu] ? state.menu[menu] : {},
			id: menu
		});
		
		const mapDispatch = (dispatch, ownProps) => { return {
			showMenu: (event, item) => {dispatch({type:actions.SHOW_MENU, menu: menu, anchor: event.target, ref: item})},
			hideMenu: () => {dispatch({type:actions.HIDE_MENU, menu: menu})}
		}}
		
		const mergeProps = (stateProps, dispatchProps, ownProps) => ({
			...ownProps,
			menu: {...stateProps.menu, ...dispatchProps, id: stateProps.id}
		})
		
		return connect(mapState, mapDispatch, mergeProps)(withMenu);
	}
}

class ItemMenu extends Component {
	render() {
		let { children, menu, ...rest } = this.props;
		
		const bindOnClick = (subs) => {
			return React.Children.map(subs, (child) => {
				if(child && child.props) {
					if(child.props.onClick) {
						return React.cloneElement(child, {onClick: () => {child.props.onClick(); menu.hideMenu();}});
					} else if (child.props.children) {
						return React.cloneElement(child, {children: bindOnClick(child.props.children)});
					} else {
						return child;
					}
				} else {
					return child;
				}
			});
		};
		return (<Menu {...rest} onRequestClose={menu.hideMenu} id={menu.id} 
			open={menu.open} anchorEl={menu.anchor}>{bindOnClick(this.props.children)}</Menu>);
	}
}

export default ItemMenu;
export { withMenu };