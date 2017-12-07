import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

class PermissionRoute extends Component {
	
	authenticated(workspace, permission) {
		let authenticated = sessionStorage.getItem("token") !== null;
		if(workspace && authenticated) {
			//check the workspace
			let permissions = sessionStorage.getItem("permissions");
			if(permissions) {
				permissions = JSON.parse(permissions);
				//if we have a permission, check for that, otherwise check the workspace
				if(permission) {
					permission = permission.split("|");
					let activePermissions = permissions.filter(per => permission.includes(per.Permission));
					authenticated = activePermissions.length > 0;
				}			
				//authenticated = permissions.some(per => permission? per.Permission === permission: per.Workspace === workspace);
				//authenticated = permissions.some(per => per.Workspace === workspace);
			} else {
				authenticated = false;
			}
		}
		return authenticated
	}
	
	render() {
		var {component, permission, ...rest} = this.props;
		//set up a new component and pass it to the returned route object
		return (<Route {...rest} component={(props) => {
			return this.authenticated(rest.path, permission) ? 
				React.createElement(component, rest) : 
				(<Redirect to='/' from={props.location.pathname}/>)
		}} />);
	}
	
}

export default PermissionRoute;