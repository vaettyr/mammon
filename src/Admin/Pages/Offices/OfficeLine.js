import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';

import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import JurisdictionLine from './JurisdictionLine';
import DistrictLine from './DistrictLine';
import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';


const style = (theme) => ({
	nested: {
		paddingLeft: theme.spacing.unit * 3
	}
});

class OfficeLine extends Component {
	
	render() {
		let {office, jurisdictionType, districts, collapsible, jurisdictions, menu} = this.props;
		return (<span>
			<ListItem divider={collapsible.isExpanded(office.ID)}>
				{(jurisdictionType || districts.length>0) && <ListItemIcon>
					<CollapseToggle expanded={collapsible.expanded} item={office.ID} onClick={()=>{collapsible.onExpand(office.ID)}}/></ListItemIcon>}
				<ListItemText primary={office.Name} inset
					secondary={`${jurisdictionType !== undefined ? jurisdictionType.Name : ''} ${office.NonPartisan ? '(Non-Partisan)':''}`}/>
				<ListItemSecondaryAction>
					<IconButton onClick={(e)=>{menu.showMenu(e, {office: office}, "office")}}><MoreVertIcon/></IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			{(jurisdictionType || districts.length > 0) && <Collapsible expanded={collapsible.expanded} item={office.ID}>
				{jurisdictions.map((jurisdiction, index) =>(<JurisdictionLine key={index} office={office} jurisdiction={jurisdiction} menu={menu} last={index===jurisdictions.length-1}/>))}
				{!jurisdictionType && districts.map((district, index) => (<DistrictLine key={index} district={district} menu={menu} last={index===districts.length-1}/>))}
			</Collapsible>}			
		</span>);
	}
}
	
const mapState = (state, ownProps) => ({
	jurisdictionType: state.data.JurisdictionTypes ? state.data.JurisdictionTypes.data.find(j=>j.ID === ownProps.office.JurisdictionType) : undefined,
	jurisdictions: state.data.Jurisdictions && ownProps.office.JurisdictionType ? state.data.Jurisdictions.data.filter(j=>j.JurisdictionType === ownProps.office.JurisdictionType):[],
	districts : state.data.Offices ? 
		state.data.Offices.data.filter(o=>o.Office === ownProps.office.ID)
			.sort((a,b)=>(a.DisplayOrder<b.DisplayOrder ? -1: 1)): []
});

export default withCollapsible("Offices")(connect(mapState)(withStyles(style)(OfficeLine)));