import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import { withStyles } from 'material-ui/styles';
import Structure from 'Admin/Components/Structure';
import Form from 'Components/Form';
import Field from 'Components/Field';
import FieldList from 'Components/FieldList';

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

class OptionTypeForm extends Component {

	render() {
		//let {handleSubmit} = this.props;
		return (
			<Paper className={[this.props.classes.paper, this.props.classes.form].join(' ')}>
				{this.props.isNew ? "New Option Type" : "Edit Option Type"}
				<Form form="optionType" className={this.props.classes.form}>
					<Field type="text" model="Name" label="Name" required/>
					<Field type="text" model="Description" label="Description" multiline rows="2"/>
					<p>Structure</p>
					<FieldList model="Structure" component={Structure}/>
				</Form>
				<Button onClick={() => this.props.onSubmit(this.props.data)}>{this.props.isNew?"Create":"Save Changes"}</Button>
			</Paper>
		);
	}
}

const mapState = (state, ownProps) => ({
	data: state.form['optionType']
});
	

export default connect(mapState)(withStyles(styles)(OptionTypeForm));