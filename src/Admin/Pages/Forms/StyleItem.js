import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import Form from 'Components/Form';
import Field from 'Components/Field';

import ItemMenu, { withMenu } from 'Components/ItemMenu';

const style = (theme) => ({
	inline: {
		display: 'inline-block'
	},
	list: {
		display:"-webkit-flex",
		flexWrap:"wrap"
	}
});

const styleOptions = [
	{Label: "Text Color", Name: "color", Type: "color"},
	{Label: "Background Color", Name:"backgroundColor", Type: "color"},

	{Label: "Border", Name:"border", Type:"border"},
	{Label: "Padding", Name:"padding", Type: "side"},
	{Label: "Margin", Name:"margin", Type: "side"},
	
	{Label: "Border Radius", Name:"borderRadius", Type: "number"},
	
	{Label: "Font", Name:"fontFamily", Type:"enum", Enum:"fontfamily"},	
	{Label: "Font Size", Name:"fontSize", Type:"number"},
	{Label: "Font Weight", Name:"fontWeight", Type:"enum", Enum:"fontweight"},
	{Label: "Text Style", Name:"fontStyle", Type:"enum", Enum:"fontstyle"},
	
	{Label: "Text Alignment", Name:"textAlign", Type: "enum", Enum:"textalign"},
	{Label: "Text Decoration", Name:"textDecoration", Type: "enum", Enum: "textdecoration"},
	{Label: "Text Indentation", Name:"textIndent", Type: "number"},
	{Label: "Letter Spacing", Name:"letterSpacing", Type: "number"},
	{Label: "Word Spacing", Name:"wordSpacing", Type: "number"},
	{Label: "Line Height", Name:"lineHeight", Type: "number"}

]

const borderstyle = [
	{Name: "Dotted", Value:"dotted"},
	{Name: "Dashed", Value:"dashed"},
	{Name: "Solid", Value:"solid"},
	{Name: "Double", Value:"double"},
	{Name: "Groove", Value:"groove"},
	{Name: "Ridge", Value:"ridge"},
	{Name: "Inset", Value:"inset"},
	{Name: "Outset", Value:"outset"},
	{Name: "None", Value:"none"}
]

const textalign = [
	{Name: "Left", Value:"left"},
	{Name: "Right", Value:"right"},
	{Name: "Center", Value:"center"},
	{Name: "Justify", Value:"justify"}
]

const textdecoration = [
	{Name: "None", Value:"none"},
	{Name: "Overline", Value:"overline"},
	{Name: "Underline", Value:"underline"},
	{Name: "Strike Through", Value:"line-through"}
]

const fontstyle = [
	{Name: "Normal", Value:"normal"},
	{Name: "Italic", Value:"italic"}
]

const fontweight = [
	{Name: "Normal", Value:"none"},
	{Name: "Bold", Value:"bold"},
	{Name: "Bolder", Value:"bolder"},
	{Name: "Lighter", Value:"lighter"}
]

const fontfamily = [
	{Name: 'Georgia', Value: "Georgia, serif"},
	{Name: "Palatino", Value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif"},
	{Name: "Times New Roman", Value: "'Times New Roman', Times, serif"},
	{Name: "Arial", Value:"Arial, Helvetica, sans-serif"},
	{Name: "Arial Black", Value: "'Arial Black', Gadget, sans-serif"},
	{Name: "Comic Sans", Value:"'Comic Sans MS', cursive, sans-serif"},
	{Name: "Impact", Value: "Impact, Charcoal, sans-serif"},
	{Name: "Lucida", Value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"},
	{Name: "Tahoma", Value: "Tahoma, Geneva, sans-serif"},
	{Name: "Trebuchet", Value: "'Trebuchet MS', Helvetica, sans-serif"},
	{Name: "Verdana", Value: "Verdana, Geneva, sans-serif"},
	{Name: "Courier New", Value:"'Courier New', Courier, monospace"},
	{Name: "Lucida Console", Value:"'Lucida Console', Monaco, monospace"}
]

const enums = {
	borderstyle: borderstyle,
	textalign: textalign,
	textdecoration: textdecoration,
	fontfamily: fontfamily,
	fontstyle: fontstyle,
	fontweight: fontweight
}

class StyleItem extends Component {
	render() {
		let { fields, value, menu, form, path, classes } = this.props;
		let spath = path?"."+path:"";
		return (
			<div>
			{value.map((item, index)=>
				<div key={index}>
					{{
						'border':(<Form form={form} key={index} nested>
									<Form form={form} key={index} nested className={classes.list}>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Top"} label="Top"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Bottom"} label="Bottom"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Left"} label="Left"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Right"} label="Right"/>
									</Form>	
									<Field type='number' model={"Data"+spath+".Style["+index+"].Width"} label="Border Width" suffix="px"/>
									<Field type='select' model={"Data"+spath+".Style["+index+"].Style"} label="Border Style">
										{enums["borderstyle"].map((t, i) =>(<MenuItem key={i} value={t.Value}>{t.Name}</MenuItem>))}
									</Field>
									<Field type='color' model={"Data"+spath+".Style["+index+"].Color"} label="Border Color"/>
									
								</Form>),
						'side':(<Form form={form} key={index} nested>
									<Form form={form} key={index} nested className={classes.list}>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Top"} label="Top"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Bottom"} label="Bottom"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Left"} label="Left"/>
										<Field type='checkbox' model={"Data"+spath+".Style["+index+"].Sides.Right"} label="Right"/>
									</Form>	
									<Field type='number' model={"Data"+spath+".Style["+index+"].Value"} label={item.Label} suffix="px"/>								
								</Form>),
						'color':(<Form form={form} key={index} nested className={classes.inline}><Field type='color' model={"Data"+spath+".Style["+index+"].Value"} label={item.Label}/></Form>),
						'number':(<Form form={form} key={index} nested className={classes.inline}><Field type='number' model={"Data"+spath+".Style["+index+"].Value"} suffix="px" label={item.Label}/></Form>),
						'enum':(<Form form={form} key={index} nested className={classes.inline}><Field type='select' model={"Data"+spath+".Style["+index+"].Value"} label={item.Label}>
								{enums[item.Enum] && enums[item.Enum].map((t, i) =>(<MenuItem key={i} value={t.Value}>{t.Name}</MenuItem>))} 
								</Field></Form>)
					}[item.Type]}
					<IconButton onClick={()=>{fields.remove(index)}}><ClearIcon/></IconButton>
				</div>
			)}
			<Button onClick={(e)=>{menu.showMenu(e)}}>Add Style</Button>
			<ItemMenu menu={menu}>
				{styleOptions.filter(i => !value.some(v => v.Name === i.Name)).map((style, index) => <MenuItem key={index} onClick={()=>{fields.push(style)}}>
					{style.Label}
				</MenuItem>)}
			</ItemMenu>
			</div>
		);
	}
}
export default withMenu("FormStyle")(withStyles(style)(StyleItem));