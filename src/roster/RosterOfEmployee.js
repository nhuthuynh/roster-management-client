import React, { Component } from 'react';
import { loadRoster } from '../util/APIUtils';
import { getDate, getFirstAndLastDayOfWeek } from '../util/helper';
import { notification } from 'antd';
import BigCalendar from '@nhuthuynh/react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'

moment.utc()
class RosterOfEmployee extends Component {
    constructor() {
        super()
        this.state = {
            events: [],
            isLoading: false,
            roster: {
                fromDate: new Date(),
                toDate: new Date(),
                createDate: new Date()
            },
            shiftList: {}
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))
        let dates = getFirstAndLastDayOfWeek(new Date(), false)
        
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId).then((roster)=> {
            this.setState((prevState) => ({
                ...prevState,
                roster,
                events: this.convertStringToDateInShiftList(roster.shiftList),
                isLoading: false
            })) 
        }).catch((error) => {
            notification.error({
                message: 'CEMS',
                description: error
            })
        })
    }

    convertStringToDateInShiftList = (shiftList) => {
        return shiftList.map((shift, index) => ({
            ...shift,
            start: new Date(shift.start),
            end: new Date(shift.end),
            index
        }))
    }

    onNavigate = (date, view) => {
        this.setState((prevState) => ({
            isLoading: true
        }))
        let firstAndLastDate = getFirstAndLastDayOfWeek(date, false)
        
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        loadRoster(getDate(firstAndLastDate.firstDate), getDate(firstAndLastDate.lastDate), shopOwnerId).then((roster) => {
            this.setState((prevState) => ({
                ...prevState,
                roster,
                events: this.convertStringToDateInShiftList(roster.shiftList),
                isLoading: false
            }))
        }).catch((error) => {
            notification.error({
                message: 'Roster',
                description: error,
                duration: 2
            });
        });
    }

    render() {
        return (
            <div className="desc">
                    <BigCalendar
                        selectable={false}
                        localizer={BigCalendar.momentLocalizer(moment)}
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView={BigCalendar.Views.WEEK}
                        views={[BigCalendar.Views.WEEK]}
                        onNavigate={this.onNavigate}
                    />
            </div>
        );
    }
}
export default RosterOfEmployee;