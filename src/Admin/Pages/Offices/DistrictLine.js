import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles'
import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

const style = (theme) => ({
	
});

class DistrictLine extends Component {
	render() {
		let { district, menu, last } = this.props;
		return(<ListItem divider={last}>
			<ListItemText inset primary={district.Name}/>
			<ListItemSecondaryAction><IconButton onClick={(e)=>{menu.showMenu(e, {office: district}, "district")}}><MoreVertIcon/></IconButton></ListItemSecondaryAction>
		</ListItem>);
	}
}

export default withStyles(style)(DistrictLine);