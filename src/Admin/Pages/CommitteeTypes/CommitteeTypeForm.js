import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography'
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Tooltip from 'material-ui/Tooltip';
import FlagIcon from 'material-ui-icons/Flag';
import ViewDayIcon from 'material-ui-icons/ViewDay';

import ConditionalStructure from 'Admin/Components/ConditionalStructure';
import Form from 'Components/Form';
import Field from 'Components/Field';
import FieldList from 'Components/FieldList';
import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';

import Relation from 'Admin/Components/Relation';
import Limit from 'Admin/Components/Limit';
import ItemMenu, { withMenu } from 'Components/ItemMenu';
import ErrorTip from 'Components/ErrorTip';

import withDataService from 'Services/DataService';

//import * as base from './defaultStructure.json';

const style = (theme) => ({
	paper: {
		margin:10,
		padding:10
	},
	form: {
		display: '-webkit-flex',
		flexDirection: 'column'
	},
	spacer: {
		flexGrow: 1
	},
	itemRow: {
	    display: '-webkit-flex',
    	alignItems: 'center'
	},
	inline: {
		display:'-webkit-flex'
	},
	error: {
		color: 'red'
	},
	divider: {
		marginTop: theme.spacing.unit*4
	},
	flag: {
		alignSelf: 'center',
		color: theme.palette.primary['200']
	}
});

class CommitteeTypeForm extends Component {
	componentDidMount() {
		this.props.getData("LookupType");
		//prevaluate
	}
	
	flattenStructure(structure) {
		let str = [];
		if(structure) {
			structure.forEach((item, index) => {
				switch(item.Type) {
				case "flat":
					item.Contents.filter((element, index) => 
						!(['text', 'longtext', 'phone', 'address', 'email', 'name']
						.some(i => i === element.Type)))
						.forEach(t => str.push({...t, root: item.Name}));
					break;
					default:
						break;
				}
			});
		}
		return str;
	}
	
	sections(structure, index) {
		return structure.filter((item, i) => i !== index).map((item) => item.Name);
	}
	
	containsErrors(section, errors) {
		return Object.keys(errors).some(item => item.includes(section) && errors[item].isValid);
	}
	
	render() {
		let { classes, options, data, collapsible, menu, valid, errors, saveType } = this.props;
		return (<Paper className={classes.paper}>
			<Form className={classes.form} form="CommitteeType">				
				<Field model="Name" type="text" label="Name" required/>
				{data.Structure && data.Structure.map((section, index) => (
					<span key={index}>	
						<div className={classes.itemRow}>
						<CollapseToggle className={this.containsErrors("Structure["+index+"]", errors) ? classes.error : ''} expanded={collapsible.expanded} item={section.Name} onClick={()=>{collapsible.onExpand(section.Name)}}/>
						{section.Base && <Typography type="title" className={[classes.inline, (this.containsErrors('Structure['+index+']', errors) ? classes.error: '')].join(' ')}>{section.Name}</Typography>}
						{!section.Base && <Form form="CommitteeType" nested className={classes.inline}>
							<Field type="text" label="Section Name" unique={this.sections(data.Structure, index)} model={"Structure["+index+"].Name"} required />
							<Field type="select" label="Type" model={"Structure["+index+"].Type"} required>
								<MenuItem value="flat">Basic</MenuItem>
								<MenuItem value="list">List</MenuItem>
							</Field>
						</Form>}
						<span className={classes.spacer}></span>
						{section.Limits && <Tooltip title="Has Limits" className={classes.flag}><ViewDayIcon /></Tooltip>}
						{section.Conditions && <Tooltip title="Has Conditions" className={classes.flag}><FlagIcon /></Tooltip>}
						<IconButton><MoreVertIcon onClick={(e) => menu.showMenu(e, {item:section, index:index, parent: data.Structure, model:"Structure"})}/></IconButton>
						</div>
						<Collapsible expanded={collapsible.expanded} item={section.Name}>
							<Form form="CommitteeType" nested>	
								<FieldList model={"Structure["+index+"].Contents"} component={ConditionalStructure} options={options} menu={menu} root={data.Structure[index]}/>
							</Form>
							<Divider className={classes.divider}/>
						</Collapsible>					
					</span>
				))}	
				<Relation columns={this.flattenStructure(data.Structure)}/>
				<Limit columns={this.flattenStructure(data.Structure)}/>
				<ItemMenu menu={menu}>
					{menu.ref && menu.ref.index > 0 && <MenuItem onClick={() => this.props.moveItem(menu.ref.index, menu.ref.model, -1)}>Move Up</MenuItem>}
					{menu.ref && ((!menu.ref.parent.Contents && menu.ref.index < menu.ref.parent.length - 1) || (menu.ref.parent.Contents && menu.ref.index < menu.ref.parent.Contents.length - 1)) && 
						<MenuItem onClick={() => this.props.moveItem(menu.ref.index, menu.ref.model, 1)}>Move Down</MenuItem>}
					}
					{menu.ref && !menu.ref.item.Base && <MenuItem onClick={() => this.props.removeItem(menu.ref.index, menu.ref.model)}>Delete</MenuItem>}
					<MenuItem onClick={() => {this.props.editRelation(menu.ref.item, menu.ref.model+"["+menu.ref.index+"].Conditions", menu.ref.parent)}}>{menu.ref && menu.ref.item && menu.ref.item.Conditions ? 'Edit Conditions' : 'Add Conditions'}</MenuItem>
					{(menu.ref && menu.ref.item && menu.ref.item.Type === 'list') && <MenuItem onClick={()=>{this.props.editLimit(menu.ref.item, menu.ref.model+"["+menu.ref.index+"].Limits")}}>{menu.ref && menu.ref.item && menu.ref.item.Limits ? 'Edit Limits' : 'Add Limits'}</MenuItem>}
					{(menu.ref && menu.ref.item && menu.ref.item.Conditions) && <MenuItem onClick={() => this.props.removeRelation(menu.ref.model+"["+menu.ref.index+"].Conditions")}>Remove Conditions</MenuItem>}
				</ItemMenu>
				<Button raised color="primary" onClick={this.props.addSection}>Add Custom Section</Button>		
				<ErrorTip errors={errors}
					filter={(item) => true}
					replace={[[/Structure\[(\d+)\]/g, (match, i) => 'Section "' + (data.Structure[i].Name || (parseInt(i, 10)+1)) +'" '],[/[[\]]/g," "],[/\./g,''],[/Contents/g, "Item"]]}>
					<Button raised color="primary" disabled={valid} onClick={()=>{saveType(data)}}>Save</Button>
				</ErrorTip>
				
			</Form>			
		</Paper>);		
	}
}

const onSave = (data, props) => {
	return function(dispatch, getState) {
		if(data.ID === undefined) {
			props.createData("CommitteeType", "CommitteeTypes", data, undefined, function(response) {
				debugger;
				//clear form and deselect?
			});
		} else {
			props.saveData("CommitteeType", data, undefined, function(response) {
				debugger;
				//clear form and deselect?
			});
		}
	}
}

const mapState = (state, ownProps) => ({
	options: state.data && state.data.LookupType ? state.data.LookupType.data : [],
	data: state.form && state.form.CommitteeType ? state.form.CommitteeType: {},
	errors: state.validator["CommitteeType"] || {},
	valid: state.validator && state.validator["CommitteeType"] ? Object.keys(state.validator["CommitteeType"]).some(item => state.validator["CommitteeType"][item].isValid) : false
})

const editRelation = (item, model, parent) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_SET_VALUES, form: "Relation", values: item.Conditions});
		dispatch({type: actions.SHOW_DIALOG, name: "Relation", model:model, item:item, parent: parent});
	}
}

const editLimit = (item, model) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_SET_VALUES, form: "Limit", values: item.Conditions});
		dispatch({type: actions.SHOW_DIALOG, name: "Limit", model:model, item:item});
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	addSection: () => dispatch({type: actions.FORM_LIST_ADD, item: {Contents:[]}, form: "CommitteeType", key: "Structure"}),
	editRelation: (item, model, parent) => dispatch(editRelation(item, model, parent)),
	editLimit: (item, model) => dispatch(editLimit(item, model)),
	removeRelation: (key) => dispatch({type: actions.FORM_SET_VALUE, form:"CommitteeType", key:key, value: undefined}),
	removeItem: (index, model) => dispatch({type:actions.FORM_LIST_REMOVE, index: index, form: "CommitteeType", key: model}),
	moveItem: (index, model, direction) => dispatch({type:actions.FORM_LIST_SORT, key: model, form: "CommitteeType", from:index, to:index+direction}),
	saveType: (data) => dispatch(onSave(data, ownProps))
}}
export default withDataService()(withMenu("CommitteeType")(withCollapsible("CommitteeType")(connect(mapState, mapDispatch)(withStyles(style)(CommitteeTypeForm)))));