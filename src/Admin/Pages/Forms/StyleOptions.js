import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';

import Form from 'Components/Form';
import FieldList from 'Components/FieldList';
import StyleItem from './StyleItem';


const style = (theme) => ({
	container: {
		display:'flex',
		flexWrap:'wrap'
	}
});

class StyleOptions extends Component {
	render() {
		let { classes, form, element } = this.props;
		return (<span><Form form={form} className={classes.container} nested>
			<FieldList model={"Data"+(element.path?"."+element.path:"")+".Style"} component={StyleItem} path={element.path}/>			
		</Form>
		</span>);
	}
}


export default withStyles(style)(StyleOptions);