import React, { Component } from 'react';
import './App.css';
import {
    Route,
    withRouter,
    Switch
} from 'react-router-dom';
import AppHeader from '../common/AppHeader'
import Roster from '../roster/roster'
import NotFound from '../common/NotFound'
import { Layout } from 'antd'
import LoadingIndicator from '../common/LoadingIndicator'
const { Content } = Layout


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
        }

        return (
            <Layout className="app-container">
                <AppHeader />
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/" render={(props) => <Roster {...props} />}>
                            </Route>
                            <Route component={ NotFound }></Route>
                        </Switch>
                    </div>
                </Content>
            </Layout>
        )
    }
}
export default withRouter(App);