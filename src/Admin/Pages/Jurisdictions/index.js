import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';

import SelectorList from 'Components/SelectorList';
import JurisdictionType from './JurisdictionType';
import Jurisdiction from './Jurisdiction';

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
})

class index extends Component {
	
	render() {
		let {classes, activeType, editType, editJurisdiction} = this.props;
		return (<Paper className={classes.root}>
				<Toolbar className={classes.toolbar}>Jurisdictions</Toolbar>
				<div className={classes.main}>
					<Drawer type="permanent" classes={{paper: classes.drawer}}>
						<SelectorList table="JurisdictionType" alias="JurisdictionTypes" primaryText="Name" 
							permission="JurisdictionType" secondaryText="Description" displayText="Jurisdiction Type"
							onSelect={(item) => {this.props.onSetJurisdictionType(item)}}
							onEdit={(item) => {this.props.onEditJurisdictionType(item)}}
							onCreate={()=>{this.props.onEditJurisdictionType({})}}
							onDelete={(item) => {this.props.onDeleteJurisdictionType(item);}}/>
					</Drawer>
					{editType && <JurisdictionType />}
					{activeType && <Drawer type="permanent" classes={{paper: classes.drawer}}>
						<SelectorList table="Jurisdiction" alias="Jurisdictions" primaryText="Name"
							permission="Jurisdiction" filter={(item)=>(item.JurisdictionType===activeType.ID)}
							displayText={activeType.Name}
							onCreate={()=>{this.props.onEditJurisdiction({})}}
							onEdit={(item)=>{this.props.onEditJurisdiction(item)}}
							onDelete={(item)=>{this.props.onDeleteJurisdiction(item)}}/>
					</Drawer>}
					{editJurisdiction && <Jurisdiction jurisdictionType={activeType} />}
				</div>
		</Paper>);
	}
}

export default withStyles(style)(index);