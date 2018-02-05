import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Dialog, { DialogContent, DialogTitle } from 'material-ui/Dialog';
import List, {
	  ListItem,
	  ListItemAvatar,
	  ListItemText
	} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import Divider from 'material-ui/Divider';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap'
	}
});

class Agents extends Component {
	
	render() {
		return (
			<Dialog open={this.props.open} onClose={() => {this.props.onRequestClose(this.props.history)}}>
				<DialogTitle>Choose Account</DialogTitle>
				<DialogContent className={this.props.classes.container}>
				<List>
					{this.props.agents.map((agent, index) => 
					<div key={index}>
						<ListItem button onClick={() => this.props.setAgent(agent, this.props.history)}>
							<ListItemAvatar>
								{agent['UserAgent.Avatar'] ?  
			                    <Avatar src={agent['UserAgent.Avatar']} />: 
			                    <Avatar><AccountCircleIcon /></Avatar>}
			                </ListItemAvatar>
							
							<ListItemText
								primary={agent['Role.Name']}
								secondary={`${agent['UserAgent.Prefix']} ${agent['UserAgent.FirstName']} ${agent['UserAgent.MiddleName']} ${agent['UserAgent.LastName']} ${agent['UserAgent.Suffix']}`} />
						</ListItem>
						{index < this.props.agents.length - 1 && <Divider />}
					</div>
					)}
				</List>
				</DialogContent>
			</Dialog>
		);
	}
}

export default withRouter(withStyles(styles)(Agents));