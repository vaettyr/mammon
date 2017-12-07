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
import ViewWeekIcon from 'material-ui-icons/ViewWeek';
import CancelIcon from 'material-ui-icons/Cancel';

import Form from 'Components/Form';
import Field from 'Components/Field';
import ItemMenu, { withMenu } from 'Components/ItemMenu';
import { MenuItem } from 'material-ui/Menu';
import ColumnValues from './Relation/ColumnValues';

const style = (theme) => ({
	dialog: {
		maxWidth:'90%'
	},
	item: {
		backgroundColor: theme.palette.primary['200']
	},
	column: {
		backgroundColor: theme.palette.secondary['200']
	},
	itemProps: {
		display: '-webkit-flex',
		flexDirection: 'row'
	},
	flag: {
		color: theme.palette.primary['200'],
		alignSelf:'center'
	}
});

class Limit extends Component {
	//returns a list of available columns (items from outside of this group)
	filterColumns(column, limit, item) {
		return limit && limit.columns ?
			!limit.columns.some(c => c.Name === column.Name) && column.Name !== item.Name:
			column.Name !== item.Name;
	}
	//returns a list of available filters (items from inside of this group)
	filterItemContents(item, limit) {
		let prohibited = ['text', 'longtext', 'phone', 'address', 'email', 'name'];
		if(!item || !item.Contents) {
			return [];
		}
		return limit && limit.filters ? item.Contents
				.filter(i => !prohibited.some(p => p === i.Type) && !limit.filters.some(c => c.Name === i.Name && c.list))
				.map(i => ({...i, list: item.Name})):
			item.Contents.filter(i => !prohibited.some(p => p === i.Type))
				.map(i => ({...i, list: item.Name}));
	}
	
	render() {
		let {columns, item, limit, menu, model, addColumn, addFilter, addRow, open, close, save, classes, onChange, 
			removeRow, moveRow, removeColumn, removeFilter} = this.props;
			
		let filteredColumns = columns? columns.filter(c => this.filterColumns(c, limit, item)) : [];
		let filters = this.filterItemContents(item, limit);
		
		if(model) {
		return(
		<Dialog open={open} onRequestClose={close} classes={{paper: classes.dialog}}>
			<DialogTitle>Edit Limits</DialogTitle>
			<DialogContent>
			
				{filteredColumns.length > 0 && <Tooltip title="Add Column">
						<IconButton onClick={(e)=>{menu.showMenu(e, {type:'column'}, "Limit")}}><ViewColumnIcon/></IconButton>
					</Tooltip>}
				{filters.length > 0 && <Tooltip title="Add Filter">
						<IconButton onClick={(e)=>{menu.showMenu(e, {type:'filter'}, "Limit")}}><ViewWeekIcon/></IconButton>
					</Tooltip>}			
				{(limit.columns || item) && <Tooltip title="Add Row">
						<IconButton onClick={()=>addRow((limit.columns) ? limit.columns.length : 0, (limit.filters) ? limit.filters.length : 0)}><PlaylistAddIcon/></IconButton>
					</Tooltip>}
				
					<Table>
						<TableHead>
							<TableRow>						
								{(limit && limit.columns) ? 
										limit.columns.map((column, index) => (<TableCell key={index} className={classes.column}>
										{column.Name}{column.list && ` (${column.list})`}
											<IconButton className={classes.flag} onClick={()=>{removeColumn(column, index, limit.rows)}}><CancelIcon/></IconButton>
										</TableCell>)):null}
								{(limit && limit.filters) ?
										limit.filters.map((filter, index) => (<TableCell key={index}>
										{filter.Name}
											<IconButton className={classes.flag} onClick={()=>{removeFilter(filter, index, limit.rows)}}><CancelIcon/></IconButton>
										</TableCell>)) : null}
								{item ? <TableCell className={classes.item}><Typography type="title">{item.Name}</Typography></TableCell>:null}
								<TableCell className={classes.item}/>
							</TableRow>
						</TableHead>
						{(limit && limit.rows) ? (<TableBody>
							{limit.rows.map((row, rowindex) => (<TableRow key={rowindex}>
								{row && row.columns ? row.columns.map((item, index) => <TableCell key={index} className={classes.column}>
									<Form form="Limit" nested>
									<ColumnValues onChange={onChange} form="Limit" column={limit.columns[index]} 
									model={"rows["+rowindex+"].columns["+index+"]"}/>
									</Form>
								</TableCell>) : null}	
								{row && row.filters ? row.filters.map((item, index) => <TableCell key={index}>
									<Form form="Limit" nested>
									<ColumnValues onChange={onChange} form="Limit" column={limit.filters[index]} 
									model={"rows["+rowindex+"].filters["+index+"]"}/>
									</Form>
								</TableCell>) : null}
								{row ? <TableCell className={classes.item }>
									<Form form="Limit" nested className={classes.itemProps}>
										<Field type="number" model={"rows["+rowindex+"].min"} label="Minimum"/>
										<Field type="number" model={"rows["+rowindex+"].max"} label="Maximum"/>
									</Form>
								</TableCell> : null}
								<TableCell className={classes.item}>
									<IconButton onClick={(e)=> menu.showMenu(e, {row, rowindex, size:limit.rows.length}, "Limit")}><MoreVertIcon/></IconButton>
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
					<MenuItem key={index} onClick={() => addColumn(column, limit.rows)}>{column.Name}{column.list && ` (${column.list})`}</MenuItem>
				))}
				{menu.ref && menu.ref.type === 'filter' && filters.map((filter, index) => (
					<MenuItem key={index} onClick={() => addFilter(filter, limit.rows)}>{filter.Name}</MenuItem>
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
		dispatch({type: actions.FORM_LIST_ADD, item: column, form: "Limit", key: "columns"});
		if(rows) {
			rows.forEach((row, index) => {
				dispatch({type: actions.FORM_LIST_ADD, item: [], form: "Limit", key: "rows["+index+"].columns"});
			});
		}
	}
}

const addFilter = (filter, rows) => {
	return function (dispatch, getState) {
		dispatch({type: actions.FORM_LIST_ADD, item: filter, form:"Limit", key:"filters"});
		if(rows) {
			rows.forEach((row, index) => {
				dispatch({type: actions.FORM_LIST_ADD, item: [], form: "Limit", key: "rows["+index+"].filters"});
			});
		}
	}
}

const removeColumn = (column, index, rows) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, key: "columns", form:"Limit", index: index});
		if(rows) {
			rows.forEach((row, rowIndex) => {
				dispatch({type: actions.FORM_LIST_REMOVE, index: index, form:"Limit", key:"rows["+rowIndex+"].columns"});
			})
		}
	}
}

const removeFilter = (filter, index, rows) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, key: "filters", form:"Limit", index: index});
		if(rows) {
			rows.forEach((row, rowIndex) => {
				dispatch({type: actions.FORM_LIST_REMOVE, index: index, form:"Limit", key:"rows["+rowIndex+"].filters"});
			})
		}
	}
}
	
const addRow = (colsize, filtersize) => {
	return function (dispatch, getState) {
		let newRow = {columns:[], filters:[]};
		for(var i=0; i<colsize; i++) {
			newRow.columns.push([]);
		}
		for(var f=0; f<filtersize; f++) {
			newRow.filters.push([]);
		}
		dispatch({type: actions.FORM_LIST_ADD, item:newRow, form: "Limit", key: "rows"});
	}
}

const removeRow = (index) => {
	return function(dispatch, getState) {
		dispatch({type: actions.FORM_LIST_REMOVE, form: "Limit", key:"rows", index});
	}
}

const mapState = (state, ownProps) => {
	let dialog = state.dialog && state.dialog.some(d => d.name === "Limit") ? state.dialog.find(d => d.name === "Limit") : false;
	let open = !!dialog;
	let model = dialog ? dialog.model : false;
	let item = dialog ? dialog.item : false;
	let limit = state.form && state.form["Limit"] ? state.form.Limit: {};
	return { open, limit, model, item }
}

const saveLimit = (form) => {
	return function(dispatch, getState) {
		let dialog = getState().dialog.find(d => d.name === "Limit");
		dispatch({type: actions.FORM_SET_VALUE, form: form, key: dialog.model, value: getState().form.Limit});
		dispatch({type: actions.HIDE_DIALOG, name: "Limit"});
	}
}

const mapDispatch = (dispatch, ownProps) => { return {
	close: () => dispatch({type: actions.HIDE_DIALOG, name: "Limit"}),
	save: () => dispatch(saveLimit(ownProps.form)),
	
	addColumn: (column, rows) => dispatch(addColumn(column, rows)),
	addFilter: (filter, rows) => dispatch(addFilter(filter, rows)),
	removeColumn: (column, index, rows) => dispatch(removeColumn(column, index, rows)),
	removeFilter: (filter, index, rows) => dispatch(removeFilter(filter, index, rows)),
	addRow: (colsize, filtersize) => dispatch(addRow(colsize, filtersize)),
	moveRow: (index, direction) => dispatch({type:actions.FORM_LIST_SORT, key: "rows", form: "Limit", from:index, to:index+direction}),
	removeRow: (index) => dispatch(removeRow(index))
}}

export default connect(mapState, mapDispatch)(withMenu("Limit")(withStyles(style)(Limit)));