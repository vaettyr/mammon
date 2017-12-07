import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import index from './index';
import withDataService from 'Services/DataService';

const onEditRole = (role, getData) => {
	return function(dispatch, getState) {
		dispatch({type:actions.PAGE_UPDATE, page: "Roles", role: {...role}});
		getData("RolePermission", "RolePermission"+role.ID, {Role: role.ID},
			function() {
				let data = getState().data["RolePermission"+role.ID].data;
				dispatch({type:actions.PAGE_UPDATE, page: "Permissions", data: [...data], role: role});
			});
	}
}

const onCreateRole = () => {
	return function (dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page: "Roles", role: {Workspace: '', Name: ''}});
		dispatch({type: actions.PAGE_UPDATE, page: "Permissions", data: [], role: {}});
	}
}

const onSave = (props) => {
	return function(dispatch, getState) {
		let {Roles, Permissions} = getState().page;
		let {Permission} = getState().data;
		
		var status = {count: Permissions.data.length, complete: 0};
		
		if(Roles.role.ID === undefined) {
			props.createData("Role", "Roles", Roles.role, undefined, (response) => {
				dispatch({type:actions.PAGE_UPDATE, page: "Roles", role: response.data});
				Permissions.data.forEach(p=>{
					if(p.Role === undefined) {
						p.Role = response.data.ID;
					}
				});
				Roles.role = response.data;
				savePermissions();
			});
		} else {
			props.saveData("Role", Roles.role, undefined, (response) => {
				dispatch({type:actions.PAGE_UPDATE, page: "Roles", role: response.data[0]});
				savePermissions();
			});
		}
		
		function savePermissions () {
			Permission.data.filter(p=>p.Parent==="0").forEach(p=>{
				let per = Permissions.data.find(r=>r.Permission === p.ID);
				if(per) {
					updateRolePermission(per, true, status);
				}			
			});
		}
				
		function checkComplete(status) {
			status.complete++;
			if(status.complete === status.count) {
				dispatch({type:actions.CLEAN_DATA, table: "RolePermission"+Roles.role.ID});
				let newData = getState().data["RolePermission"+Roles.role.ID].data;				
				dispatch({type:actions.PAGE_UPDATE, page: "Permissions", data: newData, role: Roles.role});
			}
		}
		
		function updateRolePermission(rolepermission, hasParent, status) {		
			if(!rolepermission.ID && hasParent) {
				props.createData("RolePermission", "RolePermission"+Roles.role.ID, rolepermission, undefined, () => {checkComplete(status)});
			} else if(rolepermission.remove || !hasParent) {
				props.deleteData("RolePermission", rolepermission, () => {checkComplete(status)}, true);
				hasParent = false;
			} else if(rolepermission.dirty){
				props.saveData("RolePermission", rolepermission, undefined, () => {checkComplete(status)});
			} else {
				checkComplete(status);
			}
			Permission.data.filter(p=>p.Parent===rolepermission.Permission).forEach(p=>{
				let per = Permissions.data.find(r=>r.Permission === p.ID);
				if(per) {
					updateRolePermission(per, hasParent, status);
				}
			});
		}		
		
	}
}

const onHandleChange = (value, type) => {
	return function(dispatch, getState) {
		dispatch({type: actions.PAGE_UPDATE, page: "Roles", role: {...getState().page.Roles.role, [type]: value}});
	}
}

const mapState = (state, props) => ({
	activeRole: state.page.Roles ? state.page.Roles.role : undefined,
	workspaces: state.data.Workspace ? state.data.Workspace.data : [],
	permissions: state.data.Permission && state.page.Roles ? state.data.Permission.data.filter(p=>p.Workspace === state.page.Roles.role.Workspace) : [],
	rolepermissions: state.page.Roles && state.page.Roles.role.ID && state.data["RolePermission"+state.page.Roles.role.ID] ? state.data["RolePermission"+state.page.Roles.role.ID].data : []
});

const mapDispatch = (dispatch, props) => { return {
	onEditRole: (role) => {dispatch(onEditRole(role, props.getData))},
	onCreateRole: () => {dispatch(onCreateRole())},
	saveRole: () => {dispatch(onSave(props))},
	handleChange: (event, type) => {dispatch(onHandleChange(event.target.value, type))}
}};

export default withDataService()(connect(mapState, mapDispatch)(index));