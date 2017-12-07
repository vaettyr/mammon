import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

import * as actions from 'Store/actionTypes';

class Collapsible extends Component {
	
	expanded(expanded, item) {
		return expanded ? expanded.some(i => i === item) : false;
	}
	
	render() {
		let { expanded, item, ...rest } = this.props;
		return (<Collapse in={this.expanded(expanded,item)} transitionDuration="auto" {...rest}></Collapse>)
	}
}

class CollapseToggle extends Component {
	expanded(expanded, item) {
		return expanded ? expanded.some(i=>i===item) : false;
	}
	render() {
		let {expanded, item, onClick, className} = this.props;
		return (<IconButton onClick={onClick} className={className}>
			{this.expanded(expanded, item) ? <ExpandMore/>:<ExpandLess/>}
		</IconButton>);
	}
}

const withCollapsible = (page) => {
	return function(WrappedComponent) {
		//declare the class
		class withCollapsible extends Component {
			render() {
				return <WrappedComponent {...this.props}/>;
			}
		}

		const onExpand = (item) => {
			return function(dispatch, getState) {
				let state = getState().page[page];
				let expanded = state && state.expanded ? [...state.expanded] : [];
				if(expanded.some(i=>i===item)) {
					expanded.splice(expanded.findIndex(i=>i===item), 1);
				} else {
					expanded.push(item);
				}
				dispatch({type:actions.PAGE_UPDATE, page: page, expanded: expanded});
			}
		}
		
		const mapState = (state, ownProps) => ({
			expanded: state.page[page] && state.page[page].expanded ? state.page[page].expanded : [],
			isExpanded: (item) => { return state.page[page] && state.page[page].expanded ? state.page[page].expanded.some(i=>i===item):false;}
		});
		
		const mapDispatch = (dispatch, ownProps) => { return {
			onExpand: (item) => dispatch(onExpand(item))
		}};
		
		const mergeProps = (stateProps, dispatchProps, ownProps) => { return {
			...ownProps,
			collapsible: {...stateProps, ...dispatchProps}
		}};
		
		return connect(mapState, mapDispatch, mergeProps)(withCollapsible);
	}
}
export default Collapsible;
export { withCollapsible };
export { CollapseToggle };