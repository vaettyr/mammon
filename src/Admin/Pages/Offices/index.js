import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Drawer from 'material-ui/Drawer';
import Toolbar from 'material-ui/Toolbar';

import ItemMenu, { withMenu } from 'Components/ItemMenu';
import { MenuItem } from 'material-ui/Menu';
import OfficeForm from './OfficeForm';
import OfficeLine from './OfficeLine';

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
	},
	button: {
		margin: 5,
		width:'calc(100% - 10px)'
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
	
	componentDidMount() {
		this.props.getData("Office", "Offices");
		this.props.getData("JurisdictionType", "JurisdictionTypes");
		this.props.getData("Jurisdiction", "Jurisdictions");
	}
	
	render() {
		let { classes, onEditOffice, editOffice, offices, onDeleteOffice, onEditDistrict, menu } = this.props;
		return (<Paper className={classes.root}>
			<Toolbar className={classes.toolbar}>Options</Toolbar>
				<div className={classes.main}>
					<Drawer type="permanent" classes={{paper: classes.drawer}}>
						<List>
							<Button raised color="primary" onClick={() => {onEditOffice({})}}>+ Add Office</Button>
							{offices.map((office, index) => (<OfficeLine key={index} 
								office={office} onEdit={onEditOffice} id={office.ID}
								onDelete={onDeleteOffice} menu={menu}
								onEditDistrict={(district) => {onEditDistrict(office, district)}}/>))}
						</List>
					</Drawer>
					<ItemMenu menu={menu}>
						{menu.ref && !menu.ref.jurisdiction && <MenuItem onClick={()=>onEditOffice(menu.ref)}>Edit</MenuItem>}
						{menu.ref && !menu.ref.jurisdiction && <MenuItem onClick={()=>{onDeleteOffice(menu.ref);}}>Delete</MenuItem>}
						{menu.ref && ((menu.ref.HasDistricts && (!menu.ref.JurisdictionType || menu.ref.JurisdictionType === "0")) || menu.ref.jurisdiction) &&
							<MenuItem onClick={()=>onEditDistrict(menu.ref, {})}>Add District</MenuItem>
						}
					</ItemMenu>
					{editOffice && <OfficeForm />}
				</div>
		</Paper>);
	}
}

export default withMenu("Offices")(withStyles(style)(index));