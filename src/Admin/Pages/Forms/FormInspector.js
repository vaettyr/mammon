import React, { Component } from 'react';
import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';
import { withStyles } from 'material-ui/styles';

const spacing = 64;

const style = (theme) => ({
	offset: {
		top:(spacing/-3)+"px"
	},
	container: {
		position:'relative',
		padding:theme.spacing.unit/2
	},
	selected: {
		backgroundColor:theme.palette.primary['200']
	}
});

class FormInspector extends Component {
	
	renderContent(content, collapsible, classes, select, active, level, path, index, name) {
		switch(content.Type) {
		case "Page":
		case "Header":
		case "Footer":
		case "Repeater":
		case "Container":
			return <div key={index} style={{marginLeft:level>0?spacing/2+"px":"",zIndex:199-level}} 
				className={[classes.container, (level > 0)?classes.offset:''].join(' ')}>
				<div><CollapseToggle expanded={collapsible.expanded} item={content.ID} 
					onClick={()=>{collapsible.onExpand(content.ID)}} more="-" less="+"/>
					<span onClick={()=>{select(content, path)}} className={(active.ID === content.ID) ? classes.selected: ''}>{ name? name: content.Layout?content.Layout:content.Type}</span>
				</div>
				<Collapsible expanded={collapsible.expanded} item={content.ID}>
					{content.Children && content.Children.map((child, index) => this.renderContent(child, collapsible, classes, select, active, level+1, path+".Children["+index+"]", index))}
				</Collapsible>
			</div>;
		default:
			return <div style={{marginLeft:level>0?spacing+"px":"", zIndex:200-level}} key={index} className={[classes.container, (active.ID === content.ID) ? classes.selected: ''].join(' ')}
					onClick={()=>{select(content, path)}}>
				{content.Type}
			</div>;
		}
	}
	
	render() {
		let { root, collapsible, classes, select, active, index } = this.props;
		let path = root.Type === "Page" ? "Pages[" + index + "]" : root.Type;
		let name = root.Type === "Page" ? "Page " + (index + 1) : root.Type;
		return this.renderContent(root, collapsible, classes, select, active, 0, path, 0, name);
	}
}

export default withStyles(style)(withCollapsible("FormTemplate")(FormInspector));