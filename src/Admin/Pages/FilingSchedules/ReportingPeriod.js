import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import { withStyles } from 'material-ui/styles';
import Form from 'Components/Form';
import Field from 'Components/Field';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import * as validator from 'Services/Validation';
import { getValue } from 'Services/value_utils';

const style = (theme) => ({
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	short: {
		margin: theme.spacing.unit,
		minWidth:60
	},
	forceShort: {
		margin: theme.spacing.unit,
		width:60
	},
	body: {
		flexBasis:'100%',
		flexDirection:'row',
		display:'flex',
		overflowX:'auto'
	},
	dateType: {
		margin:theme.spacing.unit,
		padding:theme.spacing.unit,
		backgroundColor:theme.palette.primary['200'],
		borderColor:theme.palette.primary['400'],
		borderStyle:'solid',
		borderWidth:1
	},
	card: {
		padding:theme.spacing.unit,
		margin:theme.spacing.unit,
		flexShrink:0,
		display:'flex',
		flexDirection:'row'
	},
	errorText: {
		color:'red'
	},
	button: {
		alignSelf:'center'
	}
});

const dateTypes = [
	{name:"Month - Day", value:'MonthDay'},
	{name:"Filing Cycle", value:'FilingCycleOffsetAmount'},
	{name:"Election", value:'ElectionOffsetAmount'},
	{name:"Registration", value:'RegistrationOffsetAmount'}
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class ReportingPeriod extends Component {
	render() {
		let { value, filtered, classes, model, form, data, fields, menu } = this.props;
		return (
			<div className={classes.body}>
				{filtered((template, index) => (
					<Card className={classes.card} key={index}>
						<Form form={form} nested>
							<Field type="text" model={model("Name", index)} form={form} key={index} label="Name" required/>
							<div>Report Type: Unimplemented currently</div>
							<div>Notification Schedule: also unimplemented</div>
							<DateType model={model("Start", index)} data={data} label="Period Start" start/>
							<DateType model={model("End", index)} data={data} label="Period End" required/>
							<DateType model={model("Due", index)} data={data} label="Due" required/>
						</Form>
						<IconButton onClick={(e)=>{menu.showMenu(e, {root:value, fields, index})}}><MoreVertIcon/></IconButton>
					</Card>
				))}
				<Button raised color="primary" className={classes.button}
					onClick={()=>{fields.push({})}}>Add Reporting Period</Button>
			</div>
		);
	}
}

class DateTypeBase extends Component {
	handleTypeChange(model, value, required, onChange) {
		let transformed = null;
		switch(value) {
			case "MonthDay":
				transformed = "{\"Month\":\"\",\"Day\":\"\"}";
				break;
			case "ElectionOffsetAmount":
				transformed = "{\"Election\":\"\",\"Offset\":\"\",\"Amount\":\"\"}";
				break;
			case "FilingCycleOffsetAmount":
				transformed = "{\"FilingCycle\":\"\",\"Offset\":\"\",\"Amount\":\"\"}";
				break;
			case "RegistrationOffsetAmount":
				transformed = "{\"Registration\":\"\",\"Offset\":\"\",\"Amount\":\"\"}";
				break;
			case "Amount":
				transformed = "{\"Amount\":\"\"}";
				break;
			default:
				break;
		}
		let valid = validator.valid({required})(value);
		onChange(model, transformed, {Type: valid});
	}
	
	handleContentChange(model, data, key, value, required, onChange) {
		let source = getValue(model, data);
		source = JSON.parse(source);
		source[key] = value;
		source = JSON.stringify(source);
		let valid = validator.valid({required})(value);
		onChange(model, source, {[key]: valid});
	}
	
	componentDidMount() {
		let { initialize, model, data, required } = this.props;
		let { valuetype } = this.getValue(data, model);
		let valid = validator.valid({required})(valuetype);
		initialize(valid, "Type");
	}
	
	componentDidUpdate(lastProps) {
		//determine if we need to revalidate here
		let { data, model, required, initialize } = this.props;
		
		let { valuetype, source } = this.getValue(data, model);
		let last = this.getValue(lastProps.data, lastProps.model);
		
		if(valuetype !== last.valuetype) {
			let valid = {Type: validator.valid({required})(valuetype)};
			Object.keys(source).forEach((key) => {
				valid[key] = validator.valid({required:true})(source[key]);
			});
			initialize(valid);
		}
		if(valuetype === 'MonthDay' && source.Month !== last.source.Month) {
			let valid = validator.valid({required:true})(source.Day);
			initialize(valid, 'Day');
		}
	}
	
	daySuffix(day) {
		switch(day) {
		case 1:
			return day+"st";
		case 2:
			return day+"nd";
		case 3:
			return day+"rd";
			default:
				return day+"th";
		}
	}
	getValue(data, model) {
		let valuetype = '';
		let source = {};
		if(data) {
			source = getValue(model, data);
			if(source) {
				try{
					source = JSON.parse(source);
					valuetype = Object.keys(source).reduce((str,val)=>(str+val), "");					
				} catch (ex) { }
			}
		}
		return {valuetype, source};
	}
	render() {
		let { model, onChange, data, classes, label, required, error, start } = this.props;
		let { valuetype, source } = this.getValue(data, model);
		let days = [];
		if(source) {
			let count = source["Month"] === 2 ? 28 : [4,6,9,11].includes(source["Month"]) ? 30 : 31;
			for(var i=0;i<count;i++) {
				days.push(i+1);
			}
		}
		return(
			<div className={classes.dateType}>
				<Typography type="heading">{label}</Typography>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor={model}>Date Type</InputLabel>
					<Select autoWidth={true} onChange={(event) => {this.handleTypeChange(model, event.target.value, required, onChange)}}
						 value={valuetype} input={<Input id={model} error={error.Type && error.Type.isValid}/>}>
						 <MenuItem value={null}></MenuItem>
						 {!start && <MenuItem value={"Amount"}>Period Start</MenuItem>}
						 {dateTypes.map((datetype, index) => (
							 <MenuItem key={index} value={datetype.value}>{datetype.name}</MenuItem>
						 ))}
					</Select>
					{error.Type && error.Type.isValid && <FormHelperText className={classes.errorText}>{error.Type.error}</FormHelperText>}
				 </FormControl>
				 {valuetype === 'MonthDay' && <FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Month"}>Month</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "Month", event.target.value, true, onChange)}}
						 value={source["Month"]||""} error={error.Month && error.Month.isValid} input={<Input id={model+"Month"} />}>
						 <MenuItem value={null}></MenuItem>
						 {months.map((month, index) => (
							 <MenuItem key={index} value={index + 1}>{month}</MenuItem>
						 ))}
					</Select>
					{error.Month && error.Month.isValid && <FormHelperText className={classes.errorText}>{error.Month.error}</FormHelperText>}
				</FormControl>}
				{valuetype === 'MonthDay' && source["Month"] && <FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Day"}>Day</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "Day", event.target.value, true, onChange)}}
						 value={source["Day"]||""} error={error.Day && error.Day.isValid} input={<Input id={model+"Day"} />}>
						 <MenuItem value={null}></MenuItem>
						 {days.map((day) => (<MenuItem key={day} value={day}>{this.daySuffix(day)}</MenuItem>))}
					</Select>
					{error.Day && error.Day.isValid && <FormHelperText className={classes.errorText}>{error.Day.error}</FormHelperText>}
				</FormControl>}
				{valuetype && valuetype !== 'MonthDay' && <FormControl className={classes.forceShort}>
					<InputLabel htmlFor={model+"Amount"}>{valuetype !== 'Amount' ? 'Days' : 'Days After'}</InputLabel>
					<Input id={model+"Amount"} type='number' error={error.Amount && error.Amount.isValid} value={source["Amount"]||""}
						onChange={(event) => { this.handleContentChange(model, data, "Amount", event.target.value, true, onChange)}} />
					{error.Amount && error.Amount.isValid && <FormHelperText className={classes.errorText}>{error.Amount.error}</FormHelperText>}
				</FormControl>}
				{valuetype && valuetype !== 'MonthDay' && valuetype !== 'Amount' && <FormControl className={classes.short}>
					<InputLabel htmlFor={model+"Offset"}>From</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "Offset", event.target.value, true, onChange)}}
						 value={source["Offset"]||""} error={error.Offset && error.Offset.isValid} input={<Input id={model+"Offset"} />}>
						 <MenuItem value={null}></MenuItem>
						 <MenuItem value={-1}>Before</MenuItem>
						 <MenuItem value={1}>After</MenuItem>
					</Select>
					{error.Offset && error.Offset.isValid && <FormHelperText className={classes.errorText}>{error.Offset.error}</FormHelperText>}
				</FormControl>}
				{valuetype === 'ElectionOffsetAmount' && <FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Date"}>Election</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "Election", event.target.value, true, onChange)}}
						 value={source["Election"]||""} error={error.Election && error.Election.isValid} input={<Input id={model+"Date"} />}>
						 <MenuItem value={null}></MenuItem>
						 <MenuItem value="Primary">Primary</MenuItem>
						 <MenuItem value="PrimaryRunoff">Primary Runoff</MenuItem>
						 <MenuItem value="General">General</MenuItem>
						 <MenuItem value="GeneralRunoff">General Runoff</MenuItem>
					</Select>
					{error.Election && error.Election.isValid && <FormHelperText className={classes.errorText}>{error.Election.error}</FormHelperText>}
				</FormControl>}
				{valuetype === 'FilingCycleOffsetAmount' && <FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Date"}>Date</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "FilingCycle", event.target.value, true, onChange)}}
						 value={source["FilingCycle"]||""} error={error.FilingCycle && error.FilingCycle.isValid} input={<Input id={model+"Date"} />}>
						 <MenuItem value={null}></MenuItem>
						 <MenuItem value="Start">Start of Cycle</MenuItem>
						 <MenuItem value="End">End of Cycle</MenuItem>
					</Select>
					{error.FilingCycle && error.FilingCycle.isValid && <FormHelperText className={classes.errorText}>{error.FilingCycle.error}</FormHelperText>}
				</FormControl>}
				{valuetype === 'RegistrationOffsetAmount' && <FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Date"}>Date</InputLabel>
					<Select autoWidth={true} onChange={(event) => { this.handleContentChange(model, data, "Registration", event.target.value, true, onChange)}}
						 value={source["Registration"]||""} error={error.Registration && error.Registration.isValid} input={<Input id={model+"Date"} />}>
						 <MenuItem value={null}></MenuItem>
						 <MenuItem value="Start">Date of Registration</MenuItem>
						 <MenuItem value="End">Date of Termination</MenuItem>
					</Select>
					{error.Registration && error.Registration.isValid && <FormHelperText className={classes.errorText}>{error.Registration.error}</FormHelperText>}
				</FormControl>}
			</div>
		);
	}
}
const mapState = (state, ownProps) => ({
	error: state.validator[ownProps.form] && ownProps.model ? getValue(ownProps.model, state.validator[ownProps.form]) : {}
});
	
const mapDispatch = (dispatch, ownProps) => { return {
	initialize: (error,  sub) => dispatch({type: actions.VALIDATOR_SET_ERROR, form: ownProps.form, key: ownProps.model + ((sub)?'.'+sub:''), error: error})
}}
const DateType = connect(mapState, mapDispatch)(withStyles(style)(DateTypeBase));

export default withStyles(style)(ReportingPeriod);