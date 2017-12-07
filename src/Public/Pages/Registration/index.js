import React, { Component } from 'react'
import withDataService from 'Services/DataService';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, { DialogContent, DialogTitle, DialogActions } from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';

import ItemMenu, { withMenu } from 'Components/ItemMenu';
import Field from 'Components/Field';
import Form from 'Components/Form';
import Conditions from 'Services/Conditions';
import RegistrationSection from 'Public/Components/RegistrationSection';
import ErrorTip from 'Components/ErrorTip';
import Paper from 'material-ui/Paper';

const style = (theme) => ({
	registrationform: {
		margin: theme.spacing.unit * 4,
		padding: theme.spacing.unit * 4
	},
	section: {
		display:'-webkit-flex',
		flexDirection:'column',
		flexWrap: 'wrap',
		maxWidth:660,
		marginTop: theme.spacing.unit * 4
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	}
});

class index extends Component {
	componentDidMount() {
		this.props.getData("CommitteeType", "CommitteeTypes");
		//get officer types and all options
		this.props.getData("OfficerType", "OfficerTypes");
		this.props.getData("Lookup", "Options");
		this.props.setForm({});
	}
	formatModel(model, root) {
		return root ? root.replace(/\W/g, '_') + "[" + model.replace(/\W/g, '_') + "]" : model.replace(/\W/g, '_');
	}
	showCreateAccount(data, officertypes) {
		if(data.OfficerType !== undefined) {
			let type = officertypes.find((t) => (t.ID === data.OfficerType));
			return type.CreateAccount === "0";
		} else {
			return false;
		}
	}
	render() {
		let { registration, data, classes, editListItem, removeListItem, openListItem, closeListItem, listType, lineData, saveLineItem,
				menu, officertypes, callback, options, valid, errors, lineErrors, lineValid, saveRegistration, createData } = this.props;
		return <Paper className={classes.registrationform}>
			<Form form="Registration"> 
				{registration && <Typography type="display1" color="primary">{registration.Name} Registration</Typography>}
				{registration && registration.Structure && registration.Structure.map((section, index) => (
					
					<Conditions key={index} className={classes.section} structure={registration.Structure}
						model={this.formatModel(section.Name)}>
						<RegistrationSection section={section} registration={registration} data={data} menu={menu} editListItem={editListItem}/>						
					</Conditions>
				))}
			</Form>
			<Dialog open={openListItem} onRequestClose={closeListItem}>
				<DialogTitle>{lineData && lineData.index ? 'Add New ' : 'Edit ' }{listType.Name}</DialogTitle>
				<DialogContent className={this.props.classes.container}>
					<Form form="RegistrationListItem">
					{listType.Contents && listType.Contents.map((item, index) => {
						let {Type} = item;
						//update this to include office and combine selects into a single type
						switch(Type) {
							case 'checkbox':
								return <Conditions className={classes[Type]} key={index} structure={listType.Contents} 
											model={this.formatModel(item.Name)} data={{data, sub: listType.Name}}>
											<Field label={item.Name} type={item.Type} model={this.formatModel(item.Name)}/>
										</Conditions>;
							case "OfficerType":
								return <Form key={index} form="RegistrationListItem" nested>
										<Conditions className={classes[Type]} key={index} structure={listType.Contents} 
											options={officertypes} model={this.formatModel(item.Name)}
											data={{data, sub: listType.Name}}>
											<Field label={item.Name} type="select" model={this.formatModel(item.Name)} />
										</Conditions>
										{this.showCreateAccount(lineData, officertypes) && <Field label="Create Account" type="checkbox" model="CreateAccount" helpText="If checked, this user will receive account credentials and be able to log into the system and work on behalf of this committee."/>}
										</Form>;
							case "Lookup":
								return <span>derp</span>;
							case 'reference':
								return <Conditions className={classes[Type]} key={index} structure={listType.Contents} 
											model={this.formatModel(item.Name)} data={{data, sub: listType.Name}}
											options={options ? options.filter(i => i.LookupType === item.LookupType) : []}>
									<Field key={index} label={item.Name} type="select" model={this.formatModel(item.Name)}/></Conditions>;
							default:
								return <Conditions className={classes[Type]} key={index} structure={listType.Contents} 
											model={this.formatModel(item.Name)} data={{data, sub: listType.Name}}>
											<Field key={index} label={item.Name} type={item.Type} model={this.formatModel(item.Name)} priority={item.Type!=='address'?1:0}/>
									</Conditions>;
						}						
					})}
					</Form>
				</DialogContent>
				<DialogActions>
					<Button raised onClick={closeListItem}>Cancel</Button>
					<ErrorTip errors={lineErrors} filter={(item) => true} replace={[[/[[\]]/g," "],[/\./g,' '],[/_/g, ' ']]}>
						<Button raised disabled={lineValid}color="primary" onClick={()=>saveLineItem(lineData, listType, callback)}>Save</Button>	
					</ErrorTip>
				</DialogActions>
			</Dialog>
			<ItemMenu menu={menu}>
				<MenuItem onClick={()=>editListItem(menu.ref.item, menu.ref.section, menu.ref.index)}>Edit</MenuItem>
				<MenuItem onClick={()=>removeListItem( menu.ref.section, menu.ref.index, menu.ref.callback)}>Delete</MenuItem>
			</ItemMenu>
			<ErrorTip errors={errors} filter={(item) => true} replace={[[/[[\]]/g," "],[/\./g,' '],[/_/g, ' ']]}>
				<Button raised color="primary" disabled={valid} onClick={()=>saveRegistration(data, registration, createData)}>Submit</Button>
			</ErrorTip>
		</Paper>;
	}
}

export default withMenu('Registration')(withStyles(style)(withDataService('PublicDataService.php')(index)));