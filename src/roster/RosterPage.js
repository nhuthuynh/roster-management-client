import React, { Component } from 'react';
import RosterOfAdmin from './RosterOfAdmin'
import RosterOfEmployee from './RosterOfEmployee'
import { EMPLOYEE_ROLES } from '../constants'
import './react-big-calendar.css'
import './roster.css'

class Roster extends Component {

    render() {
        const { currentUser } = this.props
        return (
            <div className="roster-container container">
                <h1 className="title">
                    Roster Management
                </h1>
                {
                    currentUser.role !== EMPLOYEE_ROLES.admin ? <RosterOfEmployee {...this.props} /> : <RosterOfAdmin {...this.props} />
                }
            </div>
        );
    }
}
export default Roster;