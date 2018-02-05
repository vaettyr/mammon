import React, { Component } from 'react';

import Collapsible, { withCollapsible, CollapseToggle } from 'Components/Collapsible';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import SelectorList from 'Components/SelectorList';
import Divider from 'material-ui/Divider';
import { MenuItem } from 'material-ui/Menu';
import FormInspector from './FormInspector';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

import CheckBoxOutlineBlankIcon from 'material-ui-icons/CheckBoxOutlineBlank';
import ShortTextIcon from 'material-ui-icons/ShortText';
import TextFormatIcon from 'material-ui-icons/TextFormat';
import InsertPhotoIcon from 'material-ui-icons/InsertPhoto';
import ContentCopyIcon from 'material-ui-icons/ContentCopy';
import ContentCutIcon from 'material-ui-icons/ContentCut';
import ContentPasteIcon from 'material-ui-icons/ContentPaste';
import NoteAddIcon from 'material-ui-icons/NoteAdd';
import ClearIcon from 'material-ui-icons/Clear';
import SaveIcon from 'material-ui-icons/Save';
import PlaylistAddIcon from 'material-ui-icons/PlaylistAdd';
import UndoIcon from 'material-ui-icons/Undo';
import RedoIcon from 'material-ui-icons/Redo';

import Form from 'Components/Form';
import Field from 'Components/Field';
import Page from '../Page';
import FormElement from 'Components/FormElement';
import LayoutOptions from './LayoutOptions';
import StyleOptions from './StyleOptions';
import * as styleHelper from 'Services/RenderStyle';

const style = (theme) => ({
	drawer: {
		position: 'initial',
		minHeight: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)',
		height: 'fit-content',
		overflow:'visible'
	},
	paper: {
		position:'relative',
		height: 0, 
		marginBottom:theme.spacing.unit*2
	},
	toolbar: {
		backgroundColor: theme.palette.primary['600']
	},
	spacer: {
		display:'-webkit-flex',
		flexGrow:1
	},
	inspector: {
		minWidth:'15%',
		maxWidth:'20%'
	},
	fullWidth: {
		width: '100%',
		padding: theme.spacing.unit
	},
	pageContent: {
		width:'100%',
		display:'block',
		position:'relative'
	},
	pageBuffer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width:'100%',
		height:'100%',
		display:'flex'
	},
	pageFix: {
		display:'block',
		position:'relative',
		height:'100%'
	},
	toggle: {
		display:'-webkit-flex',
		flexDirection:'row',
		justifyContent:'start',
		alignItems:'center'
	}
});

const sizes = [
	{Dim: "8.5x11", Name: "Letter (Portrait)"},
	{Dim: "11x8.5", Name: "Letter (Landscape)"},
	{Dim: "8.5x14", Name: "Legal (Portrait)"},
	{Dim: "14x8.5", Name: "Legal (Landscape)"},
	{Dim: "Custom", Name: "Custom"}
];

const contentTypes = {
	container: {Type:'Container', Children:[]},
	text: {Type:'Text', Text:''},
	data: {Type:'Data', Field: ''},
	repeater: {Type:'Repeater', Source: '', Children:[]},
	image: {Type:'Image', Source: ''}
}

class index extends Component {

	setPaperDimensions(template) {
		if(template && template.Size !=='Custom') {
			let width = parseFloat(template.Size.substring(0, template.Size.indexOf('x')));
			let height = parseFloat(template.Size.substring(template.Size.indexOf('x') + 1));
			if(width > 0 && height > 0) {
				return (( height/width ) * 100 ) + '%';
			}			
		} else if(template && template.Height && template.Width) {
			let width = parseFloat(template.Width);
			let height = parseFloat(template.Height);
			if(width > 0 && height > 0) {
				return (( height/width ) * 100 ) + '%';
			}			
		}
	}
	
	componentDidMount() {
		//get all officer types and all lookup values
		let { getData } = this.props;
		getData("DataSource", "DataSources");

	}
	render() {
		let { classes, page, selectForm, newForm, deleteForm, selectElement, content, insertElement, cutElement, copyElement, pasteElement, 
			insertPage, deleteElement, collapsible, save, valid, dataSources } = this.props;
		let paperDim = this.setPaperDimensions(content.Data);
		return (
				<Page pageName="Forms">
				<Drawer type="permanent" classes={{paper: classes.drawer}}>
					<SelectorList table="Form" alias="Forms" primaryText="Name" 
						permission="Form" displayText="Form" setIndex={page.index}
						onEdit={(item, index)=>{selectForm(item, index)}}
						onCreate={()=>{newForm()}}
						onDelete={(item, index)=>{deleteForm(item, index)}}/>
				</Drawer>
				
				{content.Data !== undefined && <div className={classes.fullWidth}>
					<Toolbar className={classes.toolbar}>
						<Tooltip title="Save"><div><IconButton disabled={valid} onClick={()=>{save(content)}}><SaveIcon/></IconButton></div></Tooltip>
						<Tooltip title="Undo"><IconButton><UndoIcon/></IconButton></Tooltip>
						<Tooltip title="Redo"><IconButton><RedoIcon/></IconButton></Tooltip>
						<span className={classes.spacer}></span>
						<Tooltip title="Insert Page"><IconButton onClick={()=>{insertPage()}}><NoteAddIcon/></IconButton></Tooltip>
						<Tooltip title="Insert Container"><IconButton onClick={()=>{insertElement(contentTypes.container, "Form", page.activeElement)}}><CheckBoxOutlineBlankIcon/></IconButton></Tooltip>
						<Tooltip title="Insert Static Text"><IconButton onClick={()=>{insertElement(contentTypes.text, "Form", page.activeElement)}}><ShortTextIcon/></IconButton></Tooltip>
						<Tooltip title="Insert Data"><IconButton onClick={()=>{insertElement(contentTypes.data, "Form", page.activeElement)}}><TextFormatIcon/></IconButton></Tooltip>
						<Tooltip title="Insert Repeater"><IconButton onClick={()=>{insertElement(contentTypes.repeater, "Form", page.activeElement)}}><PlaylistAddIcon/></IconButton></Tooltip>
						<Tooltip title="Insert Image"><IconButton onClick={()=>{insertElement(contentTypes.image, "Form", page.activeElement)}}><InsertPhotoIcon/></IconButton></Tooltip>
						<span className={classes.spacer}></span>
						<Tooltip title="Delete"><div><IconButton disabled={!page.activeElement} onClick={()=> {deleteElement(page.activeElement)}}><ClearIcon/></IconButton></div></Tooltip>
						<Tooltip title="Cut"><div><IconButton disabled={!page.activeElement} onClick={()=> {cutElement(page.activeElement)}}><ContentCutIcon/></IconButton></div></Tooltip>
						<Tooltip title="Copy"><div><IconButton disabled={!page.activeElement} onClick={()=> {copyElement(page.activeElement)}}><ContentCopyIcon/></IconButton></div></Tooltip>
						<Tooltip title="Paste"><div><IconButton disabled={!page.clipboard} onClick={()=> {pasteElement(page.clipboard, page.activeElement)}}><ContentPasteIcon/></IconButton></div></Tooltip>
					</Toolbar>
					
					{content.Data.Pages && content.Data.Pages.map((p, i) => (<Paper key={i} className={classes.paper} style={{paddingTop:paperDim}} onClick={()=> {selectElement()}}>
						<div className={classes.pageBuffer}>
						<div className={classes.pageContent} style={{...styleHelper.renderStyle(content.Data)}}>
							<span className={classes.pageFix}>
							<FormElement content={content.Data.Header||{}} selected={page.activeElement||{}} select={selectElement} path="Header"/>
							<FormElement content={p||{}} selected={page.activeElement||{}} select={selectElement} path={"Pages["+i+"]"}/>
							<FormElement content={content.Data.Footer||{}} selected={page.activeElement||{}} select={selectElement} path="Footer"/>							
							</span>
						</div>
						</div>
					</Paper>))}
					
				</div>}
				
				{content.Data !== undefined && <Drawer type="permanent" className={classes.inspector} classes={{paper: classes.drawer}} anchor="right">					
					<div className={classes.toggle}><CollapseToggle expanded={collapsible.expanded} item="Form"
						onClick={()=>{collapsible.onExpand("Form")}} />
						<Typography type="title">Form</Typography>
					</div>
					<Collapsible expanded={collapsible.expanded} item="Form">
						<Form form="Form">
							<Field type="text" label="Form Name" model="Name" required priority="1"/>
							<Field type="select" model="Data.Size" label="Form Size" required>
								{sizes.map((size, i) => (<MenuItem key={i} value={size.Dim}>{size.Name}</MenuItem>))}
							</Field>
							{content.Data.Size==='Custom' && <Field type="number" label="Width" model="Data.Width" required />}
							{content.Data.Size==='Custom' && <Field type="number" label="Height" model="Data.Height" required />}
							<Field type="select" label="Data Source" model="DataSource" required>
								{dataSources.map((source, i) => (<MenuItem key={i} value={source.ID}>{source.Name}</MenuItem>))}
							</Field>
							<StyleOptions form="Form" element={content.Data} data={content.Data}/>
						</Form>
					</Collapsible>					
					<Divider/>
					
					{page.activeElement && <div>
						{(page.activeElement.Type === 'Text' || page.activeElement.Type === 'Data' || page.activeElement.Type === 'Image' || page.activeElement.Type === 'Repeater') && <div>
							<div className={classes.toggle}>
								<CollapseToggle expanded={collapsible.expanded} item="Content" onClick={()=>{collapsible.onExpand("Content")}}/>
								<Typography type="title">{page.activeElement.Type}</Typography>							
							</div>
							<Collapsible expanded={collapsible.expanded} item="Content">
								{page.activeElement.Type === 'Text' && <Form form="Form">
									<Field type="textarea" label="Text" model={"Data."+page.activeElement.path+".Text"}/>
								</Form>}
								{page.activeElement.Type === 'Data' && <Form form="Form">
									<Field type="text" label="Field" model={"Data."+page.activeElement.path+".Field"}/>
									<Field type="text" label="Label" model={"Data."+page.activeElement.path+".Label"}/>
									<Field type="text" label="Format" model={"Data."+page.activeElement.path+".Format"}/>
								</Form>}
								{page.activeElement.Type === 'Repeater' && <Form form="Form">
									<Field type="text" label="Source" model={"Data."+page.activeElement.path+".Source"}/>
									<Field type="select" label="Direction" model={"Data."+page.activeElement.path+".Direction"}>
										<MenuItem value="vertical">Vertical</MenuItem>
										<MenuItem value="horizontal">Horizontal</MenuItem>
									</Field>
								</Form>}
								{page.activeElement.Type === 'Image' && <Form form="Form">
									<Field type="text" label="Source" model={"Data."+page.activeElement.path+".Source"}/>
								</Form>}
							</Collapsible>
							<Divider/>
						</div>}
						<div className={classes.toggle}>
							<CollapseToggle expanded={collapsible.expanded} item="Layout" onClick={()=>{collapsible.onExpand("Layout")}}/>
							<Typography type="title">Layout</Typography>	
						</div>
						<Collapsible expanded={collapsible.expanded} item="Layout">
							<LayoutOptions form="Form" element={page.activeElement}/>
						</Collapsible>
						<Divider/>
						<div className={classes.toggle}>
							<CollapseToggle expanded={collapsible.expanded} item="Style" onClick={()=>{collapsible.onExpand("Style")}}/>
							<Typography type="title">Style</Typography>	
						</div>
						<Collapsible expanded={collapsible.expanded} item="Style">
							<StyleOptions form="Form" element={page.activeElement} data={page.activeElement}/>
						</Collapsible>
						<Divider/>
					</div>}	
					<div className={classes.toggle}>
						<CollapseToggle expanded={collapsible.expanded} item="Navigator" onClick={()=>{collapsible.onExpand("Navigator")}}/>
						<Typography type="title">Navigator</Typography>	
					</div>
					<Collapsible expanded={collapsible.expanded} item="Navigator">
						{content.Data.Header && <FormInspector root={content.Data.Header} select={selectElement} active={page.activeElement||{}}/>}
						{content.Data.Footer && <FormInspector root={content.Data.Footer} select={selectElement} active={page.activeElement||{}}/>}
						{content.Data.Pages && content.Data.Pages.map((p, i) => (<FormInspector key={i} root={p} index={i} select={selectElement} active={page.activeElement||{}}/>))}
					</Collapsible>
				</Drawer>}
				
			</Page>
		);
	}
}

export default withCollapsible("Form")(withStyles(style)(index));