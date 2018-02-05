import React, { Component } from 'react';
import * as http from 'axios';
import { Route } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducer from 'Store/reducer';
import * as actions from 'Store/actionTypes';

import LoginService from 'Auth/Pages/Login/Login';
import AgentSelect from 'Auth/Pages/AgentSelect/AgentSelect';
import RegistrationTypeDialog from './Pages/Registration/RegistrationTypeDialog';
import Registration from './Pages/Registration/Registration';

const styles = theme => ({
	root: {
		marginTop: theme.spacing.unit * 3,
		width: '100%'
	},
	flex: {
		flex: 1
	}
});

const middlewares = [thunk];
if(process.env.NODE_ENV !== "production") {
	middlewares.push(createLogger());
}

class Public extends Component { 
	
	constructor(props) {
		super(props);
		this.store = createStore(reducer, applyMiddleware(...middlewares));
		
		http.interceptors.response.use((response) => {
			if(response.data && response.data.data) {
				if(response.data.data) {
					response.data = response.data.data;
				}				
			}
			return response;
		});
	}
	
	handleClickOpen = () => {
		this.store.dispatch({type:actions.SHOW_DIALOG, name:'login'});
	}
	
	handleRegister = () => {
		this.store.dispatch({type:actions.SHOW_DIALOG, name:'register'});
	}
	
	render() {
		return (
				<Provider store={this.store}> 
					<div>
					<AppBar position="static" color="primary" className={this.props.classes.root}>
			      		<Toolbar>
			      			<Typography type="title" color="inherit" className={this.props.classes.flex}>
			      				Mammon
			      			</Typography>
			      				<Button onClick={this.handleRegister}  color="inherit">Register</Button>
			      				<Button onClick={this.handleClickOpen} color="inherit">Sign In</Button>
			      			<LoginService />
			      			<AgentSelect />
			      			<RegistrationTypeDialog/>
			      		</Toolbar>
			      	</AppBar>	
			      	<Route path="/Registration/:ID" component={Registration}/>
			      	</div>
		      	</Provider>
		  );	
	}
}

export default withStyles(styles)(Public);