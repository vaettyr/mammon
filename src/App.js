import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PermissionRoute from 'Auth/Components/PermissionRoute';

import Public from './Public/Public';
import Admin from './Admin/Admin';

class App extends Component { 
  render() {
	    return (
      	<Router>
      		<Switch>
      			<PermissionRoute path="/CFAdmin" component={Admin}/>
      			<Route path="/" component={Public} />
      		</Switch>
      	</Router>
	    );
	  }
}

export default App;
