import { connect } from 'react-redux';
import index from './index';
import * as http from 'axios';
import * as actions from 'Store/actionTypes';
//import * as aliases from 'Store/aliases';

const setAgent = (agent, history) => {
	return function(dispatch, getState) {
		dispatch({type: actions.UPDATE_DIALOG, name: 'agents', busy: true});
		http.post(process.env.REACT_APP_API + 'Authorization.php?setagent', {agent: agent['UserAgent.ID'], token: sessionStorage.getItem("token")})
			.then(response => {
				sessionStorage.setItem('agent', JSON.stringify(agent));
        		sessionStorage.setItem('permissions', JSON.stringify(response.data['permissions']));
        		sessionStorage.setItem('token', response.data['token']);
        		history.push(agent["Workspace.Path"]);
			})
			.catch(error => {
				debugger;
			});
	}
}

const onClose = (history) => {
	return function(dispatch, getState) {
		dispatch({type: actions.HIDE_DIALOG, name: 'agents'});
		history.push("/");
	}
}
const mapStateToProps = (state, ownProps) => ({
	open: state.dialog.some(item => item.name === 'agents'),
	busy: state.dialog.some(item => item.name === 'agents' && item.busy),
	agents: state.dialog.some(item => item.name === 'agents') ? state.dialog.find(item => item.name === 'agents').agents : []
});

const mapDispatchToProps = (dispatch, getState) => {
	return {
		onRequestClose: (history) => dispatch(onClose(history)),
		setAgent: (agent, history) => dispatch(setAgent(agent, history))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(index);