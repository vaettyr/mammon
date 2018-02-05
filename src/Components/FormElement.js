import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import * as styleHelper from 'Services/RenderStyle';

const style = (theme) => ({
	selected: {
		backgroundColor:theme.palette.primary['100'],
		borderStyle:'dashed',
		borderWidth:2,
		borderColor:theme.palette.primary['200']
	},
	footer: {
		position:'absolute',
		bottom:0,
		width:'100%'
	},
	page: {
		display:'block'
	}
});

class FormElement extends Component {
	
	setLayoutStyle( content ) {
		return {
			display:content.Display,
			position:content.Position, 
			top:content.Top,
			bottom:content.Bottom,
			left:content.Left,
			right:content.Right,
			width:content.Width,
			height:content.Height
		};
	}
	
	render() {
		let { content, classes, selected, select, path } = this.props;
		switch (content.Type) {
		case "Page":
		case "Header":
		case "Footer":
		case "Repeater":
		case "Container":
			return (
				<span className={[content.Type === 'Page' ? classes.page: '', content.Type === 'Footer' ? classes.footer : '', selected.ID === content.ID ? classes.selected: ''].join(' ')} 
					style={{...this.setLayoutStyle(content), ...styleHelper.renderStyle(content)}}
					onClick={(e)=>{select(content, path, e)}}>
					{content.Children && content.Children.map((child, index) => <FormElement content={child} key={index} classes={classes} selected={selected} select={select} path={path+".Children["+index+"]"}/>)}
				</span>
			);
		case "Text":
			return (<span className={[selected.ID === content.ID ? classes.selected: ''].join(' ')} 
				style={{...this.setLayoutStyle(content), ...styleHelper.renderStyle(content)}}
				onClick={(e) => {select(content, path, e)}}>{content.Text?content.Text:"Placeholder Static Text"}</span>);
		case "Data":
			return(<span className={[selected.ID === content.ID ? classes.selected: ''].join(' ')} 
					style={{...this.setLayoutStyle(content), ...styleHelper.renderStyle(content)}}
					onClick={(e) => {select(content, path, e)}}>{(content.Label || content.Field)?'':'Placeholder Data'}{content.Label} {content.Field?"["+content.Field+"]":""}</span>);
		case "Image":
			return(<img className={[selected.ID === content.ID ? classes.selected: ''].join(' ')} 
					style={{...this.setLayoutStyle(content), ...styleHelper.renderStyle(content)}}
					src={content.Source} alt="Placeholder"
					onClick={(e) => {select(content, path, e)}}/>);
			default:
				return (<span className={[selected.ID === content.ID ? classes.selected: ''].join(' ')} 
						style={{...this.setLayoutStyle(content), ...styleHelper.renderStyle(content)}}
						onClick={(e) => {select(content, path, e)}}>{content.Type}</span>);
		}
	}
}

export default withStyles(style)(FormElement);