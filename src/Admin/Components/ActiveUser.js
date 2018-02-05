import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Menu, { MenuItem } from 'material-ui/Menu';
import {ListItemAvatar, ListItemText } from 'material-ui/List';

import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import * as http from 'axios';


const style = theme => ({
	badge: {
		display:'flex',
		flexDirection:'row',
		alignItems:'center'
	},
	margin: {
		marginLeft: theme.spacing.unit
	}
});
class ActiveUser extends Component {
	
	getAgents() {
		let agent = sessionStorage.getItem("agent");
		let agents = sessionStorage.getItem("agents");
		agent = JSON.parse(agent);
		return {
			agent,
			agents: JSON.parse(agents).filter(item => item['UserAgent.ID'] !== agent['UserAgent.ID'])
		}
	}
	
	render() {
		let {agent, agents} = this.getAgents();
		let { classes } = this.props;
		return (<div className={classes.badge}>
			{agent['UserAgent.Avatar'] ? <Avatar src={agent['UserAgent.Avatar']} />: 
	        <Avatar><AccountCircleIcon /></Avatar>}
			<Typography color="inherit" className={classes.margin} type="subheading">
				{agent['UserAgent.FirstName']}
			</Typography>
			{agents.length && <IconButton color="inherit"  onClick={(e)=>{this.props.showMenu(e,'agents')}}>
				<KeyboardArrowDownIcon/>
			</IconButton>}
			<Menu id="agents" anchorEl={this.props.agentsMenu.anchor} 
				open={this.props.agentsMenu.open||false} onClose={() => {this.props.hideMenu('agents')}}>
				{agents.map((item, index) =>(
					<MenuItem key={index} onClick={()=>{this.props.setAgent(item, this.props.history)}}>
						<ListItemAvatar>
							{item['UserAgent.Avatar'] ?  
		                    <Avatar src={item['UserAgent.Avatar']} />: 
		                    <Avatar><AccountCircleIcon /></Avatar>}
		                </ListItemAvatar>
						
						<ListItemText
							primary={item['Role.Name']}
							secondary={`${item['UserAgent.Prefix']} ${item['UserAgent.FirstName']} ${item['UserAgent.MiddleName']} ${item['UserAgent.LastName']} ${item['UserAgent.Suffix']}`} />
					</MenuItem>
				))}
			</Menu>
		</div>);
	}
}

const setAgent = (agent, history) => {
	return function(dispatch, getState) {
		dispatch({type:actions.HIDE_MENU, menu: 'agents'});
		http.post(process.env.REACT_APP_API + 'Authorization.php?setagent', {agent: agent['UserAgent.ID'], token: sessionStorage.getItem("token")})
		.then(response => {
			sessionStorage.setItem('agent', JSON.stringify(agent));
    		sessionStorage.setItem('permissions', JSON.stringify(response.data['permissions']));
    		sessionStorage.setItem('token', response.data['token']);
    		history.push(agent["Workspace.Path"]);
		})
		.catch(error => {
			debugger;
		});
	}
}

const mapState = state => ({
	agentsMenu: state.menu.agents || {}
});

const mapDispatch = dispatch => {return {
	hideMenu: () => dispatch({type:actions.HIDE_MENU, menu: 'agents'}),
	showMenu: (event, menu) => dispatch({type:actions.SHOW_MENU, menu:menu, anchor:event.target}),
	setAgent: (agent, history) => dispatch(setAgent(agent, history))
}};

export default connect(mapState, mapDispatch)(withRouter(withStyles(style)(ActiveUser)));