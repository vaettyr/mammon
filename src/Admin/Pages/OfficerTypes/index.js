import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';

import SelectorList from 'Components/SelectorList';
import OfficerTypeForm from './OfficerTypeForm';
import Page from '../Page';


const style = (theme) => ({
	drawer: {
		position: 'initial',
		height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)'
	}
});

class index extends Component {
	render() {
		let {classes, page, onEdit, onDelete} = this.props;
		return (
			<Page pageName="Officer Types">
				<Drawer type="permanent" classes={{paper: classes.drawer}}>
					<SelectorList table="OfficerType" alias="OfficerTypes" primaryText="Name" 
						permission="OfficerType" displayText="Officer Type" 
						onEdit={(item) => {onEdit(item)}}
						onCreate={() => {onEdit({})}}
						onDelete={(item) => {onDelete(item)}}/>
				</Drawer>
				{(page && page.editType !== undefined) && <OfficerTypeForm/>}
			</Page>
		);
	}
}

export default withStyles(style)(index);