import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';

const style = (theme) => ({
	drawer: {
		position: 'initial',
		height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)'
	},
	root: {
		display: 'flex',
		flexDirection:'column',
		margin: theme.spacing.unit
	},
	toolbar: {
		display:'flex',
		background: theme.palette.primary['200']
	},
	main: {
		display:'flex',
		flexDirection:'row'
	}
});

class Page extends Component {
	render() {
		let {classes, pageName, children} = this.props;
		return (<Paper className={classes.root}>
				<Toolbar className={classes.toolbar}>{pageName}</Toolbar>
				<div className={classes.main}>
					{children}
				</div>
		</Paper>);
	}
}
export default withStyles(style)(Page);