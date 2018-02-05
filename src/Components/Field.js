import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from 'Store/actionTypes';
import * as utils from 'Services/value_utils';

import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import MaskedInput from 'react-text-mask';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import HelpIcon from 'material-ui-icons/Help';
import Tooltip from 'material-ui/Tooltip';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import * as validator from 'Services/Validation';
import { ChromePicker } from 'react-color'
import { DatePicker } from 'material-ui-pickers';

//gets our value from a combination of the 'form' prop passed in and our 'model' prop
//should bind the passed-in onChange handler
//determines the input to display based on the type

const style = (theme) => ({
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	double: {
		minWidth: 360
	},
	address: {
		display:'block'
	},
	grow: {
		flex: 1,
		width:'100%'
	},
	line : {
		display:'flex',
		width:'100%'
	},
	short : {
		width:40,
		margin:theme.spacing.unit
	},
	state: {
		textTransform:'uppercase'
	},
	select: {
		justifyContent: 'flex-end'
	},
	errorText: {
		color:'red'
	},
	block: {
		display: '-webkit-flex'
	},
	help: {
		color: theme.palette.primary['200']
	},
	wrap: {
		flexWrap: 'wrap',
		alignItems: 'center'
	},
	swatch: {
		minWidth: 45,
		minHeight: 45,
		marginLeft: theme.spacing.unit * 2,
		borderRadius: 5,
		boxShadow: "0px 1px 2px 0px grey"
	}
});

class PhoneField extends Component {
	render() {
		return (<MaskedInput 
			mask={(rawvalue) => rawvalue.length < 15 ? 
				['(',/[1-9]/,/\d/,/\d/,')',' ', /\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/] :
				['(',/[1-9]/,/\d/,/\d/,')',' ', /\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/, ' ','x',/\d/,/\d/,/\d/,/\d/]}
			guide={false} showMask={false} {...this.props} />
		);
	}
}

class ZipField extends Component {
	render() {
		return <MaskedInput
			mask={(rawvalue) => rawvalue.length < 6 ?
				[/\d/,/\d/,/\d/,/\d/,/\d/]:
				[/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/]}
			guide={false} showMask={false} {...this.props} />
	}
}

class Field extends Component {
	constructor(props) {
		super(props);
		this.state = {suggestions:[], showPicker:false};
		this.setSuggestions = this.setSuggestions.bind(this);
		this.setShowPicker = this.setShowPicker.bind(this);
		this.handleSuffix = this.handleSuffix.bind(this);
	}
	setSuggestions(suggestions) {
		this.setState({suggestions: suggestions})
	}
	setShowPicker(show) {
		this.setState({showPicker: show});
	}
	handleSuffix (suffix, value, empty) {
		if(suffix) {
			value =  value.toString().replace(suffix, '');
		}
		if(empty) {
			value = value.toString().replace(empty, '');
		}
		return value;
	}
	handleChange(model, value, validators, onChange, suffix, empty) {
		let valid = validator.valid(validators)(value);
		if(value && suffix) { value = value+suffix; }
		if(!value && empty) { value = empty; }
		onChange(model, value, valid);
	}
	componentDidUpdate(lastProps) {
		//determine if we need to revalidate here
		let { value, options, required, type, initialize } = this.props;
		if(type === 'select') {
			//if options changed, revalidate
			if(value && options && lastProps.options && options.filter(o=>o.disabled).length !== lastProps.options.filter(o=>o.disabled).length) {				
				let valid = validator.valid({required, option: options.map(o=>({value:(o.value||o.Value||o.ID), disabled: o.disabled}))})(value);
				initialize(valid);
			}
		}
	}
	componentDidMount() {
		let { value, required, unique, initialize, prevalidate, type } = this.props;
		if(prevalidate || prevalidate === undefined) {
			//update to handle composite entries and special types
			switch(type) {
			case 'address':
				let line1 = validator.valid({required, unique})(value.Line1);
				initialize(line1, "Line1");
				let line2 = validator.valid({unique})(value.Line2);
				initialize(line2, "Line2");
				let city = validator.valid({required, unique})(value.City);
				initialize(city, "City");
				let state = validator.valid({required, unique})(value.State);
				initialize(state, "State");
				let zip = validator.valid({required, unique})(value.Zip);
				initialize(zip, "Zip");
				break;
			case 'name':
				let first = validator.valid({required, unique})(value.First);
				initialize(first, "First");
				let last = validator.valid({required, unique})(value.Last);
				initialize(last, "Last");
				break;
			case 'checkbox':
				//checkboxes are never required. What would that even mean?
				break;
				default:
					let valid = validator.valid({required, unique})(value);
					initialize(valid);
					break;
			}		
		}
	}
	render() {
		let {type, onChange, model, dispatch, classes, error, initialize, 
			required, unique, options, helpText, hidden, suffix, empty, ...rest} = this.props;
		let helper = helpText?<Tooltip title={helpText} className={classes.help}><HelpIcon/></Tooltip>:null;
		switch(type) {	
		case 'checkbox':
			return (<span className={classes.block}><FormControlLabel control={<Checkbox onChange={(event) => this.handleChange(model, event.target.checked?1:-1, {}, onChange)}
				checked={this.props.value===1||this.props.value===true} {...rest} value={this.props.value.toString()}/>} label={this.props.label}/>{helper}</span>);
		case 'select':
			let option = options ? options.map((o) => ({value: (o.value || o.Value || o.ID), disabled: o.disabled})) : false;
			//validate options
			return (<span className={classes.block}><FormControl className={classes.formControl} classes={{root: classes.select}}><Select autoWidth={true} 
				onChange={(event) => {this.handleChange(model, event.target.value, {required, unique, option}, onChange)}}
				error={error.isValid} {...rest} input={<Input id={model} />}>
					<MenuItem value={null}></MenuItem>
					{options ? options.map((option, index) => <MenuItem key={index} disabled={option.disabled} value={option.value||option.Value||option.ID}>{option.label||option.Name}</MenuItem>) : rest.children}	
				</Select>
				<InputLabel htmlFor={model}>{this.props.label}</InputLabel>
				{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}</FormControl>
				{helper}</span>);
		case 'date':
			return(<span className={classes.block}>
				
				<DatePicker onChange={(date)=>{this.handleChange(model, date, {required}, onChange)}}
				value={this.props.value||''} invalidLabel="" format={this.props.format||'MM[/]DD[/]YYYY'} error={error.isValid} {...rest}/>
				{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
				{helper}</span>);
		case 'phone':
			return(<span className={classes.block}><FormControl className={classes.formControl}>
			<InputLabel htmlFor={model}>{this.props.label}</InputLabel>
			<Input id={model} onChange={(event) => { this.handleChange(model, event.target.value, {required, phone:true}, onChange)}} 
				inputComponent={PhoneField} error={error.isValid} {...rest}/>
			{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
			</FormControl>{helper}</span>);
		case 'email':
			return (<span className={classes.block}><FormControl className={[classes.formControl, classes.double].join(' ')}>
			<InputLabel htmlFor={model}>{this.props.label}</InputLabel>
			<Input id={model} onChange={(event) => { this.handleChange(model, event.target.value, {required, unique, email: true}, onChange)}} 
				error={error.isValid} type='email' {...rest}/>
			{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
			</FormControl>{helper}</span>);
		case 'name':
			return (<span className={classes.address}>
			<Typography type="subheading">{this.props.label}</Typography>{helper}
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor={model+"First"}>First Name</InputLabel>
				<Input id={model+"First"} onChange={(event) => { this.handleChange(model+".First", event.target.value, {required, unique}, onChange)}} 
					error={error.First && error.First.isValid} type="text" {...rest} value={this.props.value.First||''} />
				{error.First && error.First.isValid && <FormHelperText className={classes.errorText}>{error.First.error}</FormHelperText>}
			</FormControl>
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor={model+"Middle"}>Middle Name</InputLabel>
				<Input id={model+"Middle"} onChange={(event) => { this.handleChange(model+".Middle", event.target.value, {}, onChange)}} 
					error={error.Middle && error.Middle.isValid} type="text" {...rest} value={this.props.value.Middle||''} />
				{error.Middle && error.Middle.isValid && <FormHelperText className={classes.errorText}>{error.Middle.error}</FormHelperText>}
			</FormControl>
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor={model+"Last"}>Last Name</InputLabel>
				<Input id={model+"Last"} onChange={(event) => { this.handleChange(model+".Last", event.target.value, {required, unique}, onChange)}} 
					error={error.Last && error.Last.isValid} type="text" {...rest} value={this.props.value.Last||''} />
				{error.Last && error.Last.isValid && <FormHelperText className={classes.errorText}>{error.Last.error}</FormHelperText>}
			</FormControl>
			</span>);
		case 'address':
			return (<span className={classes.address}>{helper}
				<Typography type="subheading">{this.props.label}</Typography>
				<FormControl className={classes.line}>
					<InputLabel htmlFor={model+"Line1"}>{this.props.label} Line 1</InputLabel>
					<Input id={model+"Line1"} onChange={(event) => { this.handleChange(model+".Line1", event.target.value, {required, unique}, onChange)}} 
						error={error.Line1 && error.Line1.isValid} type="text" {...rest} value={this.props.value.Line1||''} fullWidth/>
					{error.Line1 && error.Line1.isValid && <FormHelperText className={classes.errorText}>{error.Line1.error}</FormHelperText>}
				</FormControl>
				<FormControl className={classes.line}>
					<InputLabel htmlFor={model+"Line2"}>{this.props.label} Line 2</InputLabel>
					<Input id={model+"Line2"} onChange={(event) => { this.handleChange(model+".Line2", event.target.value, {secondline: (this.props.value || {})}, onChange)}} 
						error={error.Line2 && error.Line2.isValid} type="text" {...rest} value={this.props.value.Line2||''} fullWidth/>
					{error.Line2 && error.Line2.isValid && <FormHelperText className={classes.errorText}>{error.Line2.error}</FormHelperText>}
				</FormControl>
				<span className={classes.line}>
				<FormControl className={[classes.formControl, classes.grow].join(' ')}>
					<InputLabel htmlFor={model+"City"}>City</InputLabel>
					<Input id={model+"City"} onChange={(event) => { this.handleChange(model+".City", event.target.value, {required, unique}, onChange)}} 
						error={error.City && error.City.isValid} type="text" {...rest} value={this.props.value.City||''} fullWidth/>
					{error.City && error.City.isValid && <FormHelperText className={classes.errorText}>{error.City.error}</FormHelperText>}
				</FormControl>
				<FormControl className={classes.short}>
					<InputLabel htmlFor={model+"State"}>State</InputLabel>
					<Input id={model+"State"} className={classes.state} onChange={(event) => { this.handleChange(model+".State", event.target.value, {required, unique, state: true}, onChange)}} 
						error={error.State && error.State.isValid} type="text" {...rest} value={this.props.value.State||''} inputProps={{maxLength:2}}/>
					{error.State && error.State.isValid && <FormHelperText className={classes.errorText}>{error.State.error}</FormHelperText>}
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor={model+"Zip"}>Zip Code</InputLabel>
					<Input id={model+"Zip"} onChange={(event) => { this.handleChange(model+".Zip", event.target.value, {required, unique, zipcode: true}, onChange)}} 
						inputComponent={ZipField} error={error.Zip && error.Zip.isValid} type="text" {...rest} value={this.props.value.Zip||''} />
					{error.Zip && error.Zip.isValid && <FormHelperText className={classes.errorText}>{error.Zip.error}</FormHelperText>}
				</FormControl>
				</span>
			</span>);
		case 'autosuggest':
			return(<span className={classes.block}><Autosuggest 
					renderInputComponent={(inputProps)=>{
						const { classes, value, model, label, required, ref, ...rest } = inputProps;
						return (<FormControl>
							<TextField value={value} id={model} label={label} inputRef={ref}
								error={error.isValid}
								InputProps={{...rest}} />
							{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
						</FormControl>)
					}}
					inputProps={{
						value: this.props.value, 
						onChange:(e, { newValue })=>{this.handleChange(this.props.model, newValue, {required, unique}, this.props.onChange)},
						label: this.props.label,
						model, required, classes
					}}	
					renderSuggestion={(suggestion, {query, isHighlighted})=>{
						const matches = match(suggestion, query);
						const parts = parse(suggestion, matches);
						return (
							<MenuItem selected={isHighlighted} component="div">
								<div>
									{parts.map((part, index) => {
										return !part.highlight ? (
											<span key={index} style={{fontWeight:300}}>{part.text}</span>
										):(
											<strong key={index} style={{fontWeight:500}}>{part.text}</strong>	
										)
									})}								
								</div>
							</MenuItem>
						)
					}}
					renderSuggestionsContainer={(options)=>{
						const { containerProps, children } = options;
						return (
							<Paper {...containerProps} square>
								{children}
							</Paper>
						)
					}}
					suggestions={this.state.suggestions} 
					onSuggestionsFetchRequested={({value}) => this.setSuggestions(this.props.getSuggestions(value))}
					onSuggestionsClearRequested={()=> this.setSuggestions([])}
					getSuggestionValue={(item)=>{return item;}}
					theme={{suggestionsList:{listStyleType: 'none', margin: 0, padding: 0}}}/>{helper}</span>)
		case 'color':
			return (<span className={[classes.block, classes.wrap].join(' ')}>
						<InputLabel>{this.props.label}</InputLabel>
						<span className={classes.swatch} style={{backgroundColor: this.props.value}} onClick={(e)=>this.setShowPicker(!this.state.showPicker)}/>
						{this.state.showPicker && <ChromePicker color={this.props.value} disableAlpha={true} onChangeComplete={(color, event) => { this.handleChange(model, color.hex, {required}, onChange)}}/>}
					</span>);
		case 'number':
			return (<span className={classes.block}><FormControl className={[classes.formControl, this.props.priority ? classes.grow: ''].join(' ')}>
				<InputLabel htmlFor={model}>{this.props.label}</InputLabel>
				<Input id={model} type='number' 
					onChange={(event) => { this.handleChange(model, event.target.value, {required, unique}, onChange, suffix, empty)}} 
				error={error.isValid} {...rest} value={this.handleSuffix(suffix, this.props.value, empty)}/>
				{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
				</FormControl>{helper}</span>);
		default:
			return (<span className={classes.block}><FormControl className={[classes.formControl, this.props.priority ? classes.grow: ''].join(' ')}>
				<InputLabel htmlFor={model}>{this.props.label}</InputLabel>
				<Input id={model} onChange={(event) => { this.handleChange(model, event.target.value, {required, unique}, onChange)}} 
				error={error.isValid} type={type} {...rest}/>
				{error.isValid && <FormHelperText className={classes.errorText}>{error.error}</FormHelperText>}
				</FormControl>{helper}</span>);
		}
	}
}

const mapState = (state, ownProps) => ({
	value: ownProps.model ? ownProps.model.replace(/\[(\w+)\]/g, '.$1').split('.').reduce((root, prop) => root && root[prop] ? root[prop] : '', state.form[ownProps.form]):'',
	error: state.validator[ownProps.form] && ownProps.model ? utils.getValue(ownProps.model, state.validator[ownProps.form]) : {}
});
const mapDispatch = (dispatch, ownProps) => { return {
	initialize: (error,  sub) => dispatch({type: actions.VALIDATOR_SET_ERROR, form: ownProps.form, key: ownProps.model + ((sub)?'.'+sub:''), error: error})
}}

export default withStyles(style)(connect(mapState, mapDispatch)(Field));