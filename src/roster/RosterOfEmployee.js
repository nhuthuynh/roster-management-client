import React, { Component } from 'react';
import { loadRoster } from '../util/APIUtils';
import { getDate, switchPositionBetweenDayAndMonth, getFirstAndLastDayOfWeek } from '../util/helper';
import './roster.css';
import './react-big-calendar.css';
import { notification } from 'antd';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'


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

        loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId).then((value)=> {
            if (value)
                this.setState((prevState) => ({
                    ...prevState,
                    roster: value,
                    events: value["shiftList"] ? this.convertStringToDateInShiftList(value["shiftList"]) : [],
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
        if (!shiftList) return;

        return shiftList.map((el) => {
            return {
                ...el,
                start: new Date(switchPositionBetweenDayAndMonth(el.start)),
                end: new Date(switchPositionBetweenDayAndMonth(el.end))
            }
        });
    }

    onNavigate = (date, view) => {
        let dates = getFirstAndLastDayOfWeek(date, false);
        this.setState({
            isLoading: true
        })
        const { currentUser } = this.props
        const shopOwnerId = currentUser.shopOwnerId ? currentUser.shopOwnerId : currentUser.id
        loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId).then((roster) => {
            this.setState({
                roster: roster ? roster : {},
                events: roster.shiftList ? this.convertStringToDateInShiftList(roster.shiftList) : [],
                isLoading: false
            })
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
                        defaultView="week"
                        views={{week:true}}
                        onNavigate={this.onNavigate}
                    />
            </div>
        );
    }
}
export default RosterOfEmployee;