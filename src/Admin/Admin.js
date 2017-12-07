import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import reducer from 'Store/reducer';
import * as actions from 'Store/actionTypes';
import * as http from 'axios';

import { withStyles } from 'material-ui/styles';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blueGrey } from 'material-ui/colors';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import Options from './Pages/Options/Options';
import Offices from './Pages/Offices/Offices';
import Roles from './Pages/Roles/Roles';
import Jurisdictions from './Pages/Jurisdictions/Jurisdictions';
import CommitteeTypes from './Pages/CommitteeTypes/CommitteeTypes';
import OfficerTypes from './Pages/OfficerTypes/OfficerTypes';

import NavMenu from 'Components/NavMenu';
import LoginService from 'Auth/Pages/Login/Login';
import PermissionRoute from 'Auth/Components/PermissionRoute';
import PermissionItem from 'Auth/Components/PermissionItem';
import ActiveUser from './Components/ActiveUser';
import DeleteDialog from 'Components/DeleteDialog';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { PersistGate } from 'redux-persist/es/integration/react';

const styles = theme => ({
	root: {
		width: '100%',
		minHeight: '100vh',
		background: theme.palette.background.contentFrame
	},
	flex: {
		flex: 1
	},
	margin: {
		marginLeft: theme.spacing.unit
	}		
});

const middlewares = [thunk];
if(process.env.NODE_ENV !== "production") {
	middlewares.push(createLogger());
}

class Admin extends Component { 

	constructor(props) {
		super(props);
		
		this.url = this.props.computedMatch.url;
		
		this.configure = [
			{display:"Options", path:`${this.url}/Options`, permission:"Lookup|LookupType"},
			{display: "Offices", path:`${this.url}/Offices`, permission:"Office"},
			{display: "Roles", path:`${this.url}/Roles`, permission:"Role"},
			{display: "Jurisdictions", path:`${this.url}/Jurisdictions`, permission:"JurisdictionType|Jurisdiction"},
			{display: "Committee Types", path:`${this.url}/CommitteeTypes`, permission:"CommitteeType"},
			{display: "Officer Types", path:`${this.url}/OfficerTypes`, permission:"OfficerType"},
			{display: "Filing Schedules", path:"", permission:"FilingSchedule"},
			{display: "Transactions", path:"", permission:"TransactionType"},
			{display: "Reports", path:"", permission:"Report"},
			{display: "Notifications", path:"", permission:"Notification"},
			{display: "Fees", path:"", permission:"Fee"},
			{display: "Environment", path:"", permission:"Environment"}
		]
		
		let p_reducer = persistReducer({key: 'mammon', storage, whitelist: ['data']}, reducer);
		this.store = createStore(p_reducer, applyMiddleware(...middlewares));
		this.persistor = persistStore(this.store);
			
		this.authHandler = this.authHandler.bind(this);
		
		http.interceptors.request.use((config) => {
			return {...config, headers: {...config.headers, Authorization: sessionStorage.getItem('token')}};
		});

		http.interceptors.response.use((response) => {
			//strip out any auth data and return the body of the response
			if(response.data && response.data.data) {
				if(response.data.refresh) {
					sessionStorage.setItem("token", response.data.refresh);
				}
				if(response.data.data) {
					response.data = response.data.data;
				}				
			}
			return response;
		}, this.authHandler);
	}
	
	authHandler(error) {
		var admin = this;
		if(error.response && error.response.status) {
			switch(error.response.status) {
			case 401: //unauthorized
				admin.store.dispatch({type:actions.SHOW_DIALOG, name:'login', source: admin.props.history.location.pathname});
				break;
			default:
				console.log(error.response);
				break;
			}
		}
		return Promise.reject(error);
	}
	
	render() {
		return (
				<Provider store={this.store}>
					<PersistGate persistor={this.persistor}>
						<MuiThemeProvider theme={createMuiTheme({ palette: { primary: blueGrey}})}>
						  	<div className={this.props.classes.root}>
								<AppBar position="static" color="primary">
						      		<Toolbar>
						      			<Typography type="title" color="inherit">
						      				Admin
						      			</Typography>
						      			{ !this.props.computedMatch.isExact && <Typography className={this.props.classes.margin} type="subheading" color="inherit">{this.props.location.pathname.replace(this.props.computedMatch.path+"/", "")}</Typography>}
						      			<span className={this.props.classes.flex}></span>
						      			
						      			<PermissionItem permission="Configure">
						      				<NavMenu id="conMenu" color="inherit" content={this.configure} displayName="Configure" />
						      			</PermissionItem>
					      				<ActiveUser />
	
						      		</Toolbar>
						      	</AppBar>
						      	<PermissionRoute path={`${this.url}/Options`} component={Options} permission="LookupType|Lookup"/>
					      		<PermissionRoute path={`${this.url}/Offices`} component={Offices} permission="Office"/>
					      		<PermissionRoute path={`${this.url}/Roles`} component={Roles} permission="Role"/>
				      			<PermissionRoute path={`${this.url}/Jurisdictions`} component={Jurisdictions} permission="Jurisdiction|JurisdictionType"/>
					      		<PermissionRoute path={`${this.url}/CommitteeTypes`} component={CommitteeTypes} permission="CommitteeType"/>
					      		<PermissionRoute path={`${this.url}/OfficerTypes`} component={OfficerTypes} permission="OfficerType"/>
			      				<LoginService/>
				      			<DeleteDialog />
					      	</div>
				      	</MuiThemeProvider>
			      	</PersistGate>
		      	</Provider>
		  );	
	}
}

export default withRouter(withStyles(styles)(Admin));