import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import Form from 'Components/Form';
import Field from 'Components/Field';
import DataStructure from 'Admin/Components/DataStructure';

const styles = (theme) => ({
	paper: {
		margin:10,
		padding:10
	},
	form: {
		display: '-webkit-flex',
		flexDirection: 'column'
	}
});

class OptionForm extends Component {

	render() {
		let {structure} = this.props;
		return (
			<Paper className={[this.props.classes.paper, this.props.classes.form].join(' ')}>
				{this.props.isNew ? "New " : "Edit "}{structure.Name}
				<Form form={structure.Name} className={this.props.classes.form}>
					<Field type="text" model="Name" label="Name" required/>
					<Field type="text" model="Value" label="Value" />
					<DataStructure model="Data" structure={structure.Structure} />
				</Form>
				<Button onClick={() => this.props.onSubmit(this.props.data)}>{this.props.isNew?"Create":"Save Changes"}</Button>
			</Paper>
		);
	}
}

const mapState = (state, ownProps) => ({
	structure: state.data['LookupType'].data.filter(item => item.Name === ownProps.optionType)[0],
	data: state.form[ownProps.optionType]
});
	

export default connect(mapState)(withStyles(styles)(OptionForm));