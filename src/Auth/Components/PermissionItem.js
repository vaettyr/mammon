import React, { Component } from 'react';

class PermissionItem extends Component {
	
	hasPermission(permission, flag) {
		let userPermissions = sessionStorage.getItem("permissions");
		if(!userPermissions) { return false; }
		userPermissions = JSON.parse(userPermissions);
		permission = permission.split("|");
		let activePermissions = userPermissions.filter(per => permission.includes(per.Permission));
		if(activePermissions.length < 1) { return false; }
		if(!flag) { return true; }
		flag = flag.split("|");
		activePermissions = activePermissions.filter(per => 			
			per.Flags && per.Flags.some(uFlag => flag.indexOf(uFlag) >= 0)
		);
		return activePermissions.length > 0;
	}
	
	constructor(props) {
		super(props);
		this.state = {hasPermission: false};
	}
	
	componentWillMount() {
		//set visibility at this point
		this.setState({hasPermission: this.hasPermission(this.props.permission, this.props.flag)});
	}
	render() {
		//check the permissions in session storage before we render anything
		let props = this.props;
		let permissions = sessionStorage.getItem("permissions");
		if(permissions) {permissions = JSON.parse(permissions);}
		//if(this.hasPermission(props.permission, props.flag)){
		if(this.state.hasPermission){
			return (<div>{props.children}</div>);
		} else {
			return null;
		}		
	}
}

export default PermissionItem;