import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import AppHeader from '../common/AppHeader'
import Roster from '../roster/roster'
import Home from '../home/home'
import Register from '../employee/register'
import Login from '../employee/login'
import NotFound from '../common/NotFound'
import { Layout, notification } from 'antd'
import LoadingIndicator from '../common/LoadingIndicator'
import PrivateRoute from '../common/PrivateRoute';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

const { Content } = Layout

notification.config({
    placement: 'topRight',
    top: 70,
    duration: 3,
}); 

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        }
    }

    loadCurrentUser() {
        this.setState({
          isLoading: true
        });
        getCurrentUser().then(response => {
            this.setState({
                currentUser: response,
                isAuthenticated: true,
                isLoading: false
            });
        }).catch(error => {
            this.setState({
                isLoading: false
            });  
        });
    }    

    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout = (redirectTo="/", notificationType="success", description="You're successfully logged out.") => {
        localStorage.removeItem(ACCESS_TOKEN)
    
        this.setState({
            currentUser: null,
            isAuthenticated: false
        })
    
        this.props.history.push(redirectTo);
        
        notification[notificationType]({
            message: 'CEMS',
            description: description,
        })
      }

    handleLogin = () => {
        notification.success({
            message: 'CEMS',
            description: "You're successfully logged in.",
        })
        this.loadCurrentUser()
        this.props.history.push("/")
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
        }

        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated} 
                currentUser={this.state.currentUser} 
                onLogout={this.handleLogout} />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/" render={(props) => <Home {...props} />} />
                            <Route path="/register" component={Register} />
                            <Route path="/login" render={(props) => <Login onLogin={this.handleLogin} {...props} />} />
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/roster" component={Roster} handleLogout={this.handleLogout}/>
                            <Route component={ NotFound } />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        )
    }
}
export default withRouter(App);