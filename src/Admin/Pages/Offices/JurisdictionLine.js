import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';
import DistrictLine from './DistrictLine';

const style = (theme) => ({
	nested: {
		paddingLeft: theme.spacing.unit * 3
	}
});

class JurisdictionLine extends Component {
	
	render() {
		let { office, jurisdiction, last, districts, collapsible, menu } = this.props;
		return (<span><ListItem divider={last || collapsible.isExpanded(office.ID+"_"+jurisdiction.ID)}>
		{(districts.length > 0) && <ListItemIcon>
			<CollapseToggle expanded={collapsible.expanded} item={office.ID+"_"+jurisdiction.ID} onClick={()=>{collapsible.onExpand(office.ID+"_"+jurisdiction.ID)}}/></ListItemIcon>}
			<ListItemText inset primary={jurisdiction.Name} />
			{office.HasDistricts && <ListItemSecondaryAction>
				<IconButton onClick={(e)=>{menu.showMenu(e, {office: office, jurisdiction: jurisdiction}, "jurisdiction")}}><MoreVertIcon/></IconButton>
			</ListItemSecondaryAction>}
		</ListItem>
		<Collapsible expanded={collapsible.expanded} item={office.ID+"_"+jurisdiction.ID}>
			{districts.map((district, index) => (<DistrictLine key={index} jurisdiction={jurisdiction} district={district} menu={menu} last={index===districts.length-1}/>))}
		</Collapsible>
		</span>);
	}
}

const mapState = (state, ownProps) => ({
	districts: state.data.Offices ? 
		state.data.Offices.data.filter(o=>o.Office === ownProps.office.ID && o.Jurisdiction === ownProps.jurisdiction.ID)
			.sort((a,b)=>(a.DisplayOrder<b.DisplayOrder ? -1: 1)): []
});

export default withCollapsible("OfficeJurisdiction")(connect(mapState)(withStyles(style)(JurisdictionLine)));