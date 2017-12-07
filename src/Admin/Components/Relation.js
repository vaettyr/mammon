import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Dialog, { DialogContent, DialogTitle, DialogActions } from 'material-ui/Dialog';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Tooltip from 'material-ui/Tooltip';
//import HelpIcon from 'material-ui-icons/Help';
import PlaylistAddIcon from 'material-ui-icons/PlaylistAdd';
import ViewColumnIcon from 'material-ui-icons/ViewColumn';
import CancelIcon from 'material-ui-icons/Cancel';
import Form from 'Components/Form';

import ItemMenu, { withMenu } from 'Components/ItemMenu';
import { MenuItem } from 'material-ui/Menu';
import ItemProperties from './Relation/ItemProperties';
import ColumnValues from './Relation/ColumnValues';

//we pass in a list of all available columns
//we also pass in a list of available values (maybe)

//we pass in the colum that this one is for, which determines which properties we can set
//options are;
/*
 * required
 * visible
 * enabled (?)
 * values (for options)
 * 
 * for list entries we can set minimums and maximums based on criteria
 */
const style = (theme) => ({
	dialog: {
		maxWidth:'90%'
	},
	item: {
		backgroundColor: theme.palette.primary['200']
	},
	flag: {
		color: theme.palette.primary['200'],
		alignSelf:'center'
	}
})

class Relation extends Component {
	
	filterColumns(column, relation, item) {
		return relation && relation.columns ?
			!relation.columns.some(c => c.Name === column.Name) && column.Name !== item.Name:
			column.Name !== item.Name;
	}
	
	filterItemContents(item, relation, target) {
		let prohibited = ['text', 'longtext', 'phone', 'address', 'email', 'name'];
		return relation && relation.columns ? item.Contents
				.filter(i => !prohibited.some(p => p === i.Type) && i !== target && !relation.columns.some(c => c.Name === i.Name && c.list))
				.map(i => ({...i, list: item.Name})):
			item.Contents.filter(i => !prohibited.some(p => p === i.Type) && i !== target)
				.map(i => ({...i, list: item.Name}));
	}
	
	render() {
		let {columns, item, parent, relation, menu, model, addColumn, addRow, open, close, save, classes, onChange, 
			removeRow, moveRow, removeColumn} = this.props;
		let filteredColumns = columns? columns.filter(c => this.filterColumns(c, relation, item)) : [];
		if(parent && parent.Type === 'list') {
			filteredColumns = filteredColumns.concat(this.filterItemContents(parent, relation, item));
		}
		if(model) {
		return(
		<Dialog open={open} onRequestClose={close} classes={{paper: classes.dialog}}>
			<DialogTitle>
				Edit Conditions
			</DialogTitle>
			<DialogContent>
				{filteredColumns.length > 0 && <Tooltip title="Add Column">
						<IconButton onClick={(e)=>{menu.showMenu(e, {type:'column'}, "Relation")}}><ViewColumnIcon/></IconButton>
					</Tooltip>}
				{(relation.columns || item) && <Tooltip title="Add Row">
						<IconButton onClick={()=>addRow((relation.columns) ? relation.columns.length : 0)}><PlaylistAddIcon/></IconButton>
					</Tooltip>}
				
					<Table>
						<TableHead>
							<TableRow>						
								{(relation && relation.columns) ? 
										relation.columns.map((column, index) => (<TableCell key={index}>
										{column.Name}{column.list && ` (${column.list})`}
											<IconButton className={classes.flag} onClick={()=>{removeColumn(column, index, relation.rows)}}><CancelIcon/></IconButton>
										</TableCell>)):null}
								{item ? <TableCell className={classes.item}><Typography type="title">{parent.Name ? `${parent.Name} - ` : ''} {item.Name}</Typography></TableCell>:null}
								<TableCell className={classes.item}/>
							</TableRow>
						</TableHead>
						{(relation && relation.rows) ? (<TableBody>
							{relation.rows.map((row, rowindex) => (<TableRow key={rowindex}>
								{row ? row.filter((c,i) => i > 0).map((item, index) => <TableCell key={index}>
									<Form form="Relation" nested>
									<ColumnValues onChange={onChange} form="Relation" column={relation.columns[index]} 
									model={"rows["+rowindex+"]["+(index+1)+"]"}/>
									</Form>
								</TableCell>) : null}	
								{row ? <TableCell className={classes.item }>
									<Form form="Relation" nested>
									<ItemProperties item={item} onChange={onChange} 
										form="Relation" model={"rows["+rowindex+"][0]"}/>
									</Form>
								</TableCell> : null}
								<TableCell className={classes.item}>
									<IconButton onClick={(e)=> menu.showMenu(e, {row, rowindex, size:relation.rows.length}, "Relation")}><MoreVertIcon/></IconButton>
								</TableCell>
							</TableRow>))}
						</TableBody>):null}
					</Table>
			</DialogContent>
			<DialogActions>
				<Button raised color="primary" onClick={save}>Save</Button><Button raised onClick={close}>Cancel</Button>
			</DialogActions>
			<ItemMenu menu={menu}>
				{menu.ref && menu.ref.type === 'column' && filteredColumns.map((column, index)=>(
				<MenuItem key={index} onClick={() => addColumn(column, relation.rows)}>{column.Name}{column.list && ` (${column.list})`}</MenuItem>
				))}
				{menu.ref && menu.ref.rowindex === 0 && menu.ref.size > 1 && <MenuItem onClick={()=>{moveRow(menu.ref.rowindex, 1)}}>Move Down</MenuItem>}
				{menu.ref && menu.ref.rowindex === (menu.ref.size - 1) && menu.ref.size > 1 && <MenuItem onClick={()=>{moveRow(menu.ref.rowindex, -1)}}>Move Up</MenuItem>}
				{menu.ref && menu.ref.row && <MenuItem onClick={()=>{removeRow(menu.ref.rowindex)}}>Delete</MenuItem>}
			</ItemMenu>
		</Dialog>);
		} else { return null;}
	}
}

const addColumn = (column, rows) => {
	return function (dispatch, getState) {
		dispatch({type: actions.FORM_LIST_ADD, item: column, form: "Relation", key: "columns"});
		if(rows) {
			rows.forEach((row, index) => {
				dispatch({type: actions.FORM_LIST_ADD, item: [], form: "Relation", key: "rows["+index+"]"});
			});
		}
	}
}

const removeColumn = (column, index, rows) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, key: "columns", form:"Relation", index: index});
		if(rows) {
			rows.forEach((row, rowIndex) => {
				dispatch({type: actions.FORM_LIST_REMOVE, index: index + 1, form:"Relation", key:"rows["+rowIndex+"]"});
			})
		}
	}
}

const addRow = (size) => {
	return function (dispatch, getState) {
		let newRow = [{Properties:[], Values:[]}];
		for(var i=0; i<size; i++) {
			newRow.push([]);
		}
		dispatch({type: actions.FORM_LIST_ADD, item:newRow, form: "Relation", key: "rows"});
	}
}

const removeRow = (index) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, form: "Relation", key:"rows", index});
	}
}

const mapState = (state, ownProps) => {
	let dialog = state.dialog && state.dialog.some(d => d.name === "Relation") ? state.dialog.find(d => d.name === "Relation") : false;
	let open = !!dialog;
	let model = dialog ? dialog.model : false;
	let item = dialog ? dialog.item : false;
	let parent = dialog ? dialog.parent: false;
	//put this in it's own form
	let relation = state.form && state.form["Relation"] ? state.form.Relation: {};
	//let relation = model ? model.replace(/\[(\w+)\]/g, '.$1').split('.').reduce((root, prop) => root && root[prop] ? root[prop] : '', state.form[ownProps.form]) : {rows:[[{Properties:[]}]]};
	return { open, relation, model, item, parent }
}

const saveRelation = (form) => {
	return function(dispatch, getState) {
		let dialog = getState().dialog.find(d => d.name === "Relation");
		dispatch({type: actions.FORM_SET_VALUE, form: form, key: dialog.model, value: getState().form.Relation});
		dispatch({type: actions.HIDE_DIALOG, name: "Relation"});
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	close: () => dispatch({type: actions.HIDE_DIALOG, name: "Relation"}),
	save: () => dispatch(saveRelation(ownProps.form)),
	addColumn: (column, rows) => dispatch(addColumn(column, rows)),
	removeColumn: (column, index, rows) => dispatch(removeColumn(column, index, rows)),
	addRow: (size) => dispatch(addRow(size)),
	moveRow: (index, direction) => dispatch({type:actions.FORM_LIST_SORT, key: "rows", form: "Relation", from:index, to:index+direction}),
	removeRow: (index) => dispatch(removeRow(index))
}}

export default connect(mapState, mapDispatch)(withMenu("Relation")(withStyles(style)(Relation)));