import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import HelpIcon from 'material-ui-icons/Help';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import CheckBoxIcon from 'material-ui-icons/CheckBox';
import CheckBoxOutlineBlankIcon from 'material-ui-icons/CheckBoxOutlineBlank';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import Field from 'Components/Field';
import Form from 'Components/Form';
import OfficeSelector from 'Components/OfficeSelector';
import Conditions from 'Services/Conditions';


const style = (theme) => ({
	subsection: {
		display: '-webkit-flex',
		flexWrap:'wrap'
	},
	nobreak : {
		whiteSpace: 'pre'
	},
	address: {
		flexBasis: '100%'
	},
	text: {
		flex: 1
	},
	phone: {
		flex:'1 0 120px'
	},
	email: {
		flex: 1
	},
	office: {
		flex: 1,
		display:'flex'
	},
	checkbox: {
		flex: 1
	},
	flag: {
		color: theme.palette.primary['200']
	},
	missing: {
		opacity: 0.35
	}, 
	error: {
		color: 'red'
	}
});

class RegistrationSection extends Component {
	formatModel(model, root) {
		return root ? root.replace(/\W/g, '_') + "[" + model.replace(/\W/g, '_') + "]" : model.replace(/\W/g, '_');
	}
	formatEntry(item, type, options, officertypes) {
		switch(type.Type) {
			case 'checkbox':
				return item ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>;
			case 'name':
				return item ?  `${item.Last}, ${item.First} ${item.Middle?item.Middle:''}` : '';
			case 'address':
				return item ? `${item.Line1} ${item.Line2?`
${item.Line2}`:''}
${item.City}, ${item.State} ${item.Zip}` : '';
			case 'OfficerType':
				return item ? officertypes.find(t => t.ID === item).Name : '';
			default:
				return item;
		}
	}
	getFilteredEntries(column, filter, options, officertypes) {
		if(column.Type === "OfficerType") {
			return officertypes.filter(t => filter.values.some(v => v === t.ID)).map(f=>f.Name).join(' or ');
		} else {
			return 'some lookup types';
		}
	}
	isOverLimit(index, errors) {
		return errors && errors.filter(e => parseInt(e.max, 10) < e.count).map(f => f.indices).some(s => s.some(t => t === index));
	}
	render() {
		let { classes, section, registration, data, options, menu, editListItem, onChange,
				hidden, label, helpText, errors, officertypes, Offices, Jurisdictions } = this.props; //optional, disabled,
		if(!hidden) {
			return (<span>
				<Typography type="headline">
					{label || section.Name}
					{helpText && <Tooltip title={helpText} className={classes.flag}><HelpIcon/></Tooltip>}
				</Typography>				
				<Form nested className={classes.subsection} form="Registration">
				{section.Type === 'flat' && section.Contents.map((item, index) => {
					let {Type} = item;
					switch(Type) {
						case 'checkbox':
							return <Conditions className={classes[Type]} key={index} structure={registration.Structure} model={this.formatModel(item.Name, section.Name)}>
										<Field key={index} label={item.Name} type={item.Type} model={this.formatModel(item.Name, section.Name)}/>
									</Conditions>;
						case 'select':
							return <Conditions className={classes[Type]} key={index} data={data} structure={registration.Structure} model={this.formatModel(item.Name, section.Name)}
										options={options ? options.filter(i => i.LookupType === item.LookupType) : []}>
								<Field key={index} label={item.Name} type="select" model={this.formatModel(item.Name, section.Name)}/></Conditions>;
						case 'office':
							return <Conditions className={classes[Type]} key={index} data={data} structure={registration.Structure} model={this.formatModel(item.Name, section.Name)}>
									<OfficeSelector data={data} Offices={Offices} Jurisdictions={Jurisdictions} prefix={item.Name!=="Office"?item.Name:undefined} model={this.formatModel(section.Name)}/>
								</Conditions>;
						default:
							return <Conditions className={classes[Type]} key={index} structure={registration.Structure} model={this.formatModel(item.Name, section.Name)}>
										<Field key={index} label={item.Name} type={item.Type} model={this.formatModel(item.Name, section.Name)} priority={item.Type!=='address'?1:0}/>
								</Conditions>;
					}						
				})}
				{section.Type === 'list' && <span>
					<Table className={classes.nobreak}>
						<TableHead><TableRow>
							{section.Contents.map((item,index)=><TableCell key={index}>{item.Name}</TableCell>)}
							<TableCell></TableCell>
						</TableRow></TableHead>
						<TableBody>
							{errors && errors.isValid && errors.error.filter(e=> e.count<parseInt(e.min,10)).map((requirement, index) => (
								<TableRow key={index} className={[classes.missing, classes.error].join(' ')}>{section.Contents.map((column, index) => (<TableCell key={index}>
									{requirement.filters.some(f=>f.column.Name===column.Name) ? this.getFilteredEntries(column, requirement.filters.find(f=>f.column.Name===column.Name), options, officertypes):' '}</TableCell>))}
									<TableCell className={classes.error}>Required Entry</TableCell>
								</TableRow>
							))}				
							{data && data[section.Name] && data[section.Name].length > 0 && data[section.Name].map((entry, i) => <TableRow key={i} className={this.isOverLimit(i, errors.error)?classes.error:''}>
								{section.Contents.map((heading, r) => <TableCell key={r}>{this.formatEntry(entry[this.formatModel(heading.Name)], heading, options, officertypes)}</TableCell>)}
							<TableCell><IconButton onClick={(e) => menu.showMenu(e, {item: entry, section: section, index: i, callback: onChange}, "Registration")}><MoreVertIcon/></IconButton></TableCell>
							</TableRow>)}
						</TableBody>
					</Table>
					<Button raised onClick={()=>editListItem({}, section, undefined, onChange)} color="primary">Add {section.Name}</Button>
				</span>}
				</Form>
				<Divider/>
			</span>);
		}
	}
}

const mapState = (state, ownProps) => ({
	options : state.data.Options ? state.data.Options.data : [],
	officertypes: state.data.OfficerTypes ? state.data.OfficerTypes.data : [],
	errors : state.validator[ownProps.form] ? state.validator[ownProps.form][ownProps.section.Name] : {}
});

export default connect (mapState)(withStyles(style)(RegistrationSection));