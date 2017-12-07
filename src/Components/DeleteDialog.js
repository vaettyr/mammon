import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Divider from 'material-ui/Divider';

import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';
import withDataService from 'Services/DataService';


const style = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	warningText: {
		marginBottom: theme.spacing.unit * 2
	}
});

class DeleteDialog extends Component {
	showColumn(column) {
		return ['Name', 'Value', 'Description', 'DisplayOrder'].some(c => c === column);
	}
	
	render() {
		let { classes, open, close, proceed, conflicts, collapsible } = this.props;
		return(
			<Dialog open={open} onRequestClose={close}>
				<DialogTitle>Delete Warning</DialogTitle>
				<DialogContent className={classes.container}>				
					{(conflicts.references && Object.keys(conflicts.references).length > 0) && <span>
						<Typography type="subheading" className={classes.warningText}>
							The record you are attempting to delete is referenced by the following other records:
						</Typography>
						{Object.keys(conflicts.references).map((ref, i) =>(<span key={i}>							
						<Typography type="title"><CollapseToggle expanded={collapsible.expanded} item={"R"+i} onClick={()=>{collapsible.onExpand("R"+i)}}/>{ref}</Typography>
						<Collapsible expanded={collapsible.expanded} item={"R"+i}>
						<Table>
							<TableHead>
								<TableRow>
									{Object.keys(conflicts.references[ref][0]).map((column, j) => (
										this.showColumn(column) && <TableCell key={j}>{column}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
							{conflicts.references[ref].map((row, index)=>(
								<TableRow key={index}>
									{Object.keys(row).map((item, k) => (
										this.showColumn(item) && <TableCell key={k}>{row[item]}</TableCell>
									))}
								</TableRow>
							))}
							</TableBody>
						</Table>
						</Collapsible>
						<Divider/>
					</span>))}
					</span>}
					{(conflicts.children && Object.keys(conflicts.children).length > 0) && <span>
					<Typography type="subheading" className={classes.warningText}>
						{conflicts.references && Object.keys(conflicts.references).length > 0 ? 'Additionally, t' : 'T'}he following records are dependent on the record you are attempting to delete, and will be deleted with it:
					</Typography>
						{Object.keys(conflicts.children).map((child, i) =>(<span key={i}>				
						<Typography type="title"><CollapseToggle expanded={collapsible.expanded} item={"C"+i} onClick={()=>{collapsible.onExpand("C"+i)}}/>{child}</Typography>
							<Collapsible expanded={collapsible.expanded} item={"C"+i}>
							<Table>
								<TableHead>
									<TableRow>
										{Object.keys(conflicts.children[child][0]).map((column, j) => (
											this.showColumn(column) && <TableCell key={j}>{column}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
								{conflicts.children[child].map((row, index)=>(
									<TableRow key={index}>
										{Object.keys(row).map((item, k) => (
											this.showColumn(item) && <TableCell key={k}>{row[item]}</TableCell>
										))}
									</TableRow>
								))}
								</TableBody>
							</Table>
							</Collapsible>
							<Divider/>
						</span>))}
					</span>}				
				</DialogContent>
				<DialogActions>
					<Button onClick={close}>Cancel</Button>
					<Button onClick={proceed}>Delete Anyway</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

const continueDelete = (props) => {
	return function (dispatch, getState) {
		let { cache, dialog } = getState();
		let data = dialog.find(d => d.name === "delete");
		//delete all the other records we retrieved
		var totalcount = Object.keys(data.data.children).reduce((sum, key) => sum + data.data.children[key].length, 0);
		
		//execute the cache
		const postDelete = () => {
			cache.forEach(action => {
				dispatch({type:actions.CACHE_POP});
				action(true); //force a 'hard' delete (doesn't check, but still a soft delete)
			});	
			//finally, hide the dialog
			dispatch({type: actions.HIDE_DIALOG, name: 'delete'});	
		}
		
		Object.keys(data.data.children).forEach(table => {
			data.data.children[table].forEach(child => {
				//table, alias, data, index, callback, postponeClean, force
				props.deleteData(table, child, function() {
					totalcount--;
					if(totalcount === 0) {
						postDelete();
					}
				}, true, true);
			});			
		})

	}
}

const mapState = (state) => ({
	open: state.dialog && state.dialog.some(d => d.name === "delete"),
	conflicts : state.dialog && state.dialog.some(d => d.name === "delete") ? state.dialog.find(d => d.name === "delete").data : {}
});

const mapDispatch = (dispatch, ownProps) => { return {
	close: () => dispatch({type: actions.HIDE_DIALOG, name: "delete"}),
	proceed: () => dispatch(continueDelete(ownProps))
}}
	
export default withDataService()(withCollapsible("delete")(connect(mapState, mapDispatch)(withStyles(style)(DeleteDialog))));