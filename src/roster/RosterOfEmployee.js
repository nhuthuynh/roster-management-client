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
            currentDate: moment(),
            roster: {
                fromDate: moment(),
                toDate: moment(),
                createDate: moment()
            },
            shiftList: {},
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
        let rosterDate = this.getRosterDates()
        
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        loadRoster(rosterDate.fromDate, rosterDate.toDate, shopOwnerId).then((roster)=> {
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

    getRosterDates (date) {
        if (!date) date = new Date()
        const { firstDate, lastDate } = getFirstAndLastDayOfWeek(date, false)
        return {
            fromDate: getDate(firstDate),
            toDate: getDate(lastDate)
        }
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
        let rosterDates = this.getRosterDates(date)
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        this.setState((prevState) => ({
            ...prevState,
            currentDate: date,
            isLoading: true
        }))

        loadRoster(rosterDates.fromDate, rosterDates.toDate, shopOwnerId).then((roster) => {
            this.setState((prevState) => ({
                ...prevState,
                roster,
                events: this.convertStringToDateInShiftList(roster.shiftList),
                isLoading: false
            }))
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Roster',
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