import logo from './logo.svg';
import './App.css';

import Home from './Components/home.js'
import Decidr from './Components/decidr.js'
import RBL from './Components/rbl.js'
import Login from './Components/login.js'
import SignUp from './Components/signup.js'

import Header from './Components/header.js'

import { HashRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Header/>
                <Switch>
                    <Route path='/' exact component={Home}/>
                    <Route path='/decidr' component={Decidr}/>
                    <Route path='/rbl' component={RBL}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/signup' component={SignUp}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
