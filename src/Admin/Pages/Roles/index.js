import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';

import * as Validation from 'Services/Validation';
import Permissions from './Permissions';
import SelectorList from 'Components/SelectorList';

const style = (theme) => ({
	drawer: {
		position: 'initial',
		height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)'
	},
	root: {
		display: 'flex',
		flexDirection:'column',
		margin: theme.spacing.unit
	},
	toolbar: {
		display:'flex',
		background: theme.palette.primary['200']
	},
	main: {
		display:'flex',
		flexDirection:'row'
	}
});

class index extends Component {
	
	componentDidMount() {
		this.props.getData('Permission', 'Permission');
		this.props.getData('Workspace', 'Workspace');
	}
	
	render() {
		let { classes, activeRole, permissions, rolepermissions, saveRole, handleChange, workspaces } = this.props;
		return (<Paper className={classes.root}>
			<Toolbar className={classes.toolbar}>Roles</Toolbar>
			<div className={classes.main}>
				<Drawer type="permanent" classes={{paper: classes.drawer}}>
					<SelectorList table="Role" alias="Roles" primaryText="Name" 
						permission="Role"
						icon={AccountCircleIcon} lockItem="SystemOnly"
						onSelect={(item) => {this.props.onEditRole(item);}}
						onEdit={(item) => {this.props.onEditRole(item);}}
						onDelete={(item) => {debugger;}}
						onCreate={()=>{this.props.onCreateRole();}}/>
				</Drawer>
				{activeRole!==undefined && <div>
					<FormControl>
						<InputLabel htmlFor="rolename">Role</InputLabel>
					<Input id="rolename" onChange={(e) => handleChange(e, 'Name')} 
						value={activeRole.Name} error={Validation.required(activeRole.Name)}/>
					</FormControl>
					<FormControl>
			          <InputLabel htmlFor="Workspace">Workspace</InputLabel>
			          <Select
			            value={activeRole.Workspace}
			          	error={Validation.required(activeRole.Workspace)}
			            onChange={(e) => handleChange(e, 'Workspace')}
			            input={<Input id="workspace" />}>
			            <MenuItem value="">
			              <em></em>
			            </MenuItem>
			            {workspaces.map((w, i) => (
			            	<MenuItem key={i} value={w.ID}>{w.Name}</MenuItem>
			            ))}			       
			          </Select>
			        </FormControl>
					<Permissions permissions={permissions} rolepermissions={rolepermissions} />
					<Button raised color='primary' disabled={activeRole.Name === '' || activeRole.Workspace === ''} onClick={saveRole}>Save Role</Button>
				</div>}
				
				{!activeRole && <p>This page will allow a user to edit Roles and the permisison assigned to them.
				Maybe they can also create new users from here (unlikely) or assign a default role
				to a given officer type (though that will probably be in the commitee type configuration)
				</p>}
			</div>	
		</Paper>);
	}
}

export default withStyles(style)(index);