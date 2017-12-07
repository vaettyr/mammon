import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui-icons/MoreVert';
import Lock from 'material-ui-icons/Lock';
import Paper from 'material-ui/Paper';

import ItemMenu, { withMenu } from 'Components/ItemMenu';
import OptionTypeForm from './OptionTypeForm';
import OptionForm from './OptionForm';

import PermissionItem from 'Auth/Components/PermissionItem';

const styles = theme => ({
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
	},
	button: {
		margin: 5,
		width:'calc(100% - 10px)'
	},
	selected: {
		backgroundColor:theme.palette.primary['200']
	},
	
	'@media (min-width:0px) and (orientation: landscape)': {
		drawer: {
			height: 'calc(100vh - '+theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight+'px)'
		}
	},
	'@media (min-width:600px)': {
		drawer: {
			height: 'calc(100vh - '+theme.mixins.toolbar['@media (min-width:600px)'].minHeight+'px)'
		}
	}	
});
class index extends Component {
	
	constructor(props) {
		super(props);
		this.setTable = this.props.setTable.bind(this);
	}
	
	accessData(data) {
		return this.props.data[data]?this.props.data[data].data : [];
	}
	
	componentDidMount() {
		//fire off request for option types
		this.props.getData('LookupType');
	}
	
	render() {
		let { menu, classes } = this.props;
		return (
		<Paper className={classes.root}>
			<Toolbar className={classes.toolbar}>Options</Toolbar>
			<div className={classes.main}>
			<Drawer type="permanent" classes={{paper: classes.drawer}}>
				<List>
					<PermissionItem permission="LookupType" flag="Create">
						<Button raised={true} color="accent" className={classes.button}
							onClick={this.props.startNewOption}>+ New Option
						</Button>
					</PermissionItem>
					<Divider />
					{this.props['LookupType'] && this.props['LookupType'].map((type, index) => { return (
						<div key={type.Name}><ListItem button onClick={() => {this.setTable(type.Name, type.ID)}}
								className={this.props.activeTable===type.Name?this.props.classes.selected:""}>
							<ListItemText primary={type.Name} secondary={type.Description}/>
							<ListItemSecondaryAction>
								{!type.SystemOnly?(
								<PermissionItem permission="LookupType" flag="Update|Delete">
									<IconButton aria-label="edit" onClick={(e)=>{menu.showMenu(e, {type:"LookupType", item: type}, "options")}}>
										<MoreVert />
									</IconButton>	
								</PermissionItem>
								):(
								<IconButton aria-label="locked" disabled>
									<Lock />
								</IconButton>
								)}							
							</ListItemSecondaryAction>
						</ListItem><Divider/></div>)}
					)}	
				
				</List>
			</Drawer>
			{this.props[this.props.activeTable] && (
			<Drawer type="permanent" classes={{paper: this.props.classes.drawer}}>
				<List>
				<PermissionItem permission="Lookup" flag="Create">
					<Button onClick={()=>this.props.editOption()} raised={true} color="accent" className={this.props.classes.button}>+ New {this.props.activeTable}</Button>
				</PermissionItem>
				<Divider />
				{this.props[this.props.activeTable].map((item, index) => {return (
						<div key={item.Name}><ListItem className={index === this.props.index?classes.selected:""}>
							<ListItemText primary={item.Name} secondary={item.Value} />
							<ListItemSecondaryAction>
								{!item.SystemOnly?(
								<PermissionItem permission="Lookup" flag="Update|Delete">
									<IconButton aria-label="edit" onClick={(e)=>{menu.showMenu(e, {type:"Lookup", item:item, index: index}, "options")}}>
										<MoreVert />
									</IconButton>	
								</PermissionItem>
								):(
								<IconButton aria-label="locked" disabled>
									<Lock />
								</IconButton>
								)}							
							</ListItemSecondaryAction>
						</ListItem><Divider /></div>
					)}
				)}		
					
				</List>
			</Drawer>)}
			{this.props.edit && !this.props.activeTable && <OptionTypeForm isNew={this.props.edit!=="EDIT"} onSubmit={(data) => {this.props.onSaveOptionType(data)}}/>}
			{this.props.activeTable && this.props.edit && <OptionForm optionType={this.props.activeTable} onSubmit={(data)=>{this.props.onSaveOption(data)}}/>}
			</div>
			<ItemMenu menu={menu}>
				{menu.ref && menu.ref.type === "LookupType" && <PermissionItem permission="LookupType" flag="Update">	
					<MenuItem onClick={() => this.props.editType(menu.ref.item)}>Edit</MenuItem>
				</PermissionItem>}
				{menu.ref && menu.ref.type === "LookupType" && <PermissionItem permission="LookupType" flag="Delete">
					<MenuItem onClick={() => this.props.deleteType(menu.ref.item)}>Delete</MenuItem>
				</PermissionItem>}
				{menu.ref && menu.ref.type === "Lookup" && <PermissionItem permission="Lookup" flag="Update">	
					<MenuItem onClick={() => this.props.editOption(menu.ref.index, menu.ref.item)}>Edit</MenuItem>
				</PermissionItem>}		
				{menu.ref && menu.ref.type === "Lookup" && <PermissionItem permission="Lookup" flag="Delete">
					<MenuItem onClick={() => this.props.deleteEntry(menu.ref.item)}>Delete</MenuItem>
				</PermissionItem>}
			</ItemMenu>
		</Paper>
		);
	}
}
export default withMenu("options")(withStyles(styles)(index));