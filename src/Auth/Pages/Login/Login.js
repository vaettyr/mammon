import { connect } from 'react-redux';
import index from './index';
import * as actions from 'Store/actionTypes'
import * as CryptoJS from 'crypto-js';
import * as http from 'axios';

const mapStateToProps = state => {
	return {		
		open: state.dialog.some(item => item.name === 'login'),
		busy: state.dialog.some(item => item.name === 'login' && item.busy),
		source: state.dialog.some(item => item.name === 'login') ? state.dialog.find(item => item.name === 'login').source : null
	}
}
const _getCipherKey = () => {
	return http.get(process.env.REACT_APP_API + 'Authorization.php');
}
const _encrypt = ( username, password, cipher ) => {
	cipher = cipher.substring(1, 37).replace(/-/gi, '');
    var key = CryptoJS.enc.Utf8.parse(cipher.substring(0, 16));
    var settings = {
            iv: CryptoJS.enc.Utf8.parse(cipher.substring(16, 32)),
            mode: CryptoJS.mode.CBC
        };
    var uid = CryptoJS.AES.encrypt(username, key, settings);
    var pw = CryptoJS.AES.encrypt(password, key, settings);
    return http.post(process.env.REACT_APP_API + 'Authorization.php', {UserName: uid.toString(), Password: pw.toString()});
}
//update source to come from state
const signIn = (username, password, history, source) => {

	  return function (dispatch, getState) {
		  dispatch({type: actions.UPDATE_DIALOG, name: 'login', busy: true});
		  return _getCipherKey()
			.then(response => _encrypt(username, password, response.data.CipherKey))
			.then(response => {
				dispatch({type: actions.UPDATE_DIALOG, name: 'login', busy: false});
				sessionStorage.setItem('agents', JSON.stringify(response.data['agents']));
				sessionStorage.setItem('token', response.data['token']);
	        	//if there's only one agent, redirect
	        	if(response.data.agents.length === 1 || source) {
	        		sessionStorage.setItem('agent', JSON.stringify(response.data['agents'][0]));
	        		sessionStorage.setItem('permissions', JSON.stringify(response.data['permissions']));
	        		history.push(source || response.data.agents[0]["Workspace.Path"]);
	        		if(source) {
	        			//set a refresh state
	        			//check for a cached action
	        			let { cache } = getState();
	        			cache.forEach(action => {
	        				dispatch({type:actions.CACHE_POP});
	        				action();
	        			});
	        		}
	        	} else {
	        		//we need to show a user-selection dialog and pass it the agents data
	        		dispatch({type: actions.SHOW_DIALOG, name: 'agents', agents: response.data.agents});
	        	}
				dispatch({type: actions.HIDE_DIALOG, name: 'login'});
	        })
	        .catch(error => {
	        	debugger;
	        });
	  };
	}

const onClose = (history) => {
	return function (dispatch, getState) {
		//we have not successfully logged in
		dispatch({type: actions.HIDE_DIALOG, name: 'login'});
		history.push("/");
	}
}

const mapDispatchToProps = (dispatch, getState) => {
	return {
		requestClose: (history) => {dispatch(onClose(history))},
		onSignIn: (username, password, history, source) => { dispatch(signIn(username, password, history, source))}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(index);