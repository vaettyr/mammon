import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width:200
	}
});

class index extends Component {
	state = { password: '', username: '', showPassword: false };
	
	constructor() {
		super();
		this.handlerChange = this.handleChange.bind(this);
	}
	
	handleChange = prop => event => {
		this.setState({ [prop]: event.target.value });
	}
	
	handleMouseDownPassword = event => {
		event.preventDefault();
	}
	
	handleClickShowPassword = event => {
		this.setState({ showPassword: !this.state.showPassword });
	}
	
	render() {
		return (
			<Dialog open={this.props.open} onClose={() => {this.props.requestClose(this.props.history)}}>
				<DialogTitle>Sign In</DialogTitle>
				<DialogContent className={this.props.classes.container}>
					<TextField id="username" label="User Name" className={this.props.classes.textField}
						required={true} value={this.state.username} onChange={this.handleChange('username')}/>
					<FormControl>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input id="password" type={this.state.showPassword ? 'text' : 'password'}
							required={true}
							value={this.state.password} onChange={this.handleChange('password')}
							endAdornment={
								<InputAdornment position="end">
									<IconButton onClick={this.handleClickShowPassword}
										onMouseDown={this.handleMouseDownPassword}>
										{this.state.showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {this.props.onSignIn(this.state.username, this.state.password, this.props.history, this.props.source)}}>Sign In</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withRouter(withStyles(styles)(index));