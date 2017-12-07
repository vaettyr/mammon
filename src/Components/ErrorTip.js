import React, { Component } from 'react';
import Tooltip from 'material-ui/Tooltip';

class ErrorTip extends Component {
	
	filterErrors(errors, filter, replace) {
		let list = Object.keys(errors).filter(item => filter(item) && errors[item].isValid);
		let formatted = list.map(
			(item, index) => { 
				if(Array.isArray(errors[item].error)) {
					let list = errors[item].error.map((sub, i) => { return(<div key={i}>
						{(replace ? replace.reduce(
							(str, replacer) => (str.replace(replacer[0], replacer[1])), item) : item ) +
							(sub.min && parseInt(sub.min, 10) > parseInt(sub.count, 10) ? " is missing Required Entries" : " contains restricted Duplicate Entries")}
					</div>)});
					return <div key={index}>{list}</div>;
				} else {
					return (<div key={index}> {(replace ? replace.reduce(
					(str, replacer) => (str.replace(replacer[0], replacer[1])), item) : item )
				+ ((errors[item].error && errors[item].error.includes("Required"))?" is ":" ")  + errors[item].error}</div>);
				}
			});
		return formatted;
	}
	
	render() {
		let { errors, filter, replace, children, ...rest } = this.props;
		let formattedErrors = this.filterErrors(errors, filter, replace);
		return (<Tooltip title={formattedErrors} 
			disableTriggerFocus={formattedErrors.length === 0}
			disableTriggerHover={formattedErrors.length === 0}
			disableTriggerTouch={formattedErrors.length === 0}
			{...rest}>
			<span>{children}</span>
			</Tooltip>);
	}
}

export default ErrorTip;