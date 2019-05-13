import React, { Component } from 'react';
import { loadRoster, createRoster, loadWorkingEmployees } from '../util/APIUtils';
import { getHoursAndMinuteOfDate, getSmallerDate, getDate, switchPositionBetweenDayAndMonth, getFirstAndLastDayOfWeek } from '../util/helper';
import './roster.css';
import './react-big-calendar.css';
import { Button, List, Affix, notification } from 'antd';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'


class RosterOfAdmin extends Component {
    constructor() {
        super()
        this.state = {
            employees: [],
            events: [],
            isLoading: false,
            isEmployeeSelectable: false,
            isCalendarClickable: true,
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
        this.setState({
            isLoading: true
        });
        let dates = getFirstAndLastDayOfWeek(new Date(), false);
        
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        Promise.all([loadWorkingEmployees(shopOwnerId), loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId)]).then((values)=> {
            this.setState({
                employees: values[0],
                roster: values[1] ? values[1] : {},
                events: values[1] && values[1]["shiftList"] ? this.convertStringToDateInShiftList(values[1]["shiftList"]) : [],
                isLoading: false
            })
        }).catch((error) => {
            notification.error({
                message: 'CEMS',
                description: error
            });
        });
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

    timeSelect = ({ start, end }) => {
        this.enableSelectEmployee();
        this.setState({
            events:[
                ...this.state.events,
                {
                    start,
                    end,
                    title: "Please select an employee"
                }
            ]
        });
        notification.info({
            message: 'Roster',
            description: 'Please select an employee for the selected shift!',
            duration: 2
        });
    }
    enableSelectEmployee = () => {
        this.setState({
            isCalendarClickable: false,
            isEmployeeSelectable: true
        })
    }
    disableSelectEmployee = () => {
        this.setState({
            isCalendarClickable: true,
            isEmployeeSelectable: false
        })
    }
    selectEmployee = (employee) => {
        let { events, roster, shiftList } = this.state;
        if (events.length > 0) {
            let selectedEvents = events[events.length - 1];

            selectedEvents.title = `${employee.firstName} ${employee.lastName}`;
            selectedEvents.employeeId = employee.id;
            events[events.length - 1] = selectedEvents;

            roster.fromDate = roster.fromDate ? getSmallerDate(selectedEvents.start, roster.fromDate) : getDate(selectedEvents.start);
            roster.toDate = roster.toDate ? getSmallerDate(selectedEvents.end, roster.toDate) : getDate(selectedEvents.end);
            roster.createdDate = getDate(new Date());

            if(!shiftList[getDate(selectedEvents.start)]) {
                shiftList[getDate(selectedEvents.start)] = [];
            }
            shiftList[getDate(selectedEvents.start)].push({
                "startTime": getHoursAndMinuteOfDate(selectedEvents.start),
                "endTime": getHoursAndMinuteOfDate(selectedEvents.end),
                "note": "",
                "employeeId": employee.id
            });

            this.setState({
                events,
                roster,
                shiftList
            });
        }
        this.disableSelectEmployee();
    }

    updateShiftList = () => {

        let { roster, events, shiftList } = this.state;

        if (!events || events.length === 0) return [];

        events.forEach(ev => {
            roster.fromDate = roster.fromDate ? getSmallerDate(ev.start, roster.fromDate) : getDate(ev.start);
            roster.toDate = roster.toDate ? getSmallerDate(ev.end, roster.toDate) : getDate(ev.end);

            if(!shiftList[getDate(ev.start)]) {
                shiftList[getDate(ev.start)] = [];
            }
            
            shiftList[getDate(ev.start)].push({
                "startTime": getHoursAndMinuteOfDate(ev.start),
                "endTime": getHoursAndMinuteOfDate(ev.end),
                "note": "",
                "employeeId": ev.id
            });
        });
        return shiftList;
    }

    saveRoster = () => {
        let { events, roster, shiftList } = this.state;
        let dates = getFirstAndLastDayOfWeek(new Date(), false);

        const { currentUser } = this.props
        const shopOwnerId = currentUser.shopOwnerId ? currentUser.shopOwnerId : currentUser.id

        if (events.length === 0 || shiftList.length === 0) {
            notification.error({
                message: 'Roster',
                description: 'Please select at least a shift and an employee for create roster!',
                duration: 5
            });
            return;
        }

        roster.shiftList = [];

        Object.keys(shiftList).forEach((key) => {
            roster.shiftList.push({
                date: key,
                employeeShifts: shiftList[key]
            })
        })

        roster.shopOwnerId = shopOwnerId
        roster.fromDate = getDate(dates.firstDate)
        roster.toDate = getDate(dates.lastDate)
        
        let promise;
        promise = createRoster(roster);

        this.setState({
            isLoading: true
        });

        promise.then(response => {
            if (response.success) {
                notification.success({
                    message: 'Roster',
                    description: 'Create roster successfully!',
                    duration: 5
                });
            } else {
                notification.error({
                    message: 'Roster',
                    description: response.message,
                    duration: 5
                })
            }

        }).catch(error => {
            notification.error({
                message: 'Roster',
                description: error,
                duration: 5
            })
        })

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
                        selectable={this.state.isCalendarClickable}
                        localizer={BigCalendar.momentLocalizer(moment)}
                        events={this.state.events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="week"
                        views={{week:true}}
                        onSelectSlot={this.timeSelect}
                        onNavigate={this.onNavigate}
                    />
                    <Affix style={{ position: 'absolute', top: 64, right: 10}} className={"employee-list-affix"}>
                        <h2>Employees</h2>
                        <List dataSource={this.state.employees} renderItem={item => (<List.Item><Button disabled={!this.state.isEmployeeSelectable} onClick={()=>{this.selectEmployee(item)}}>{ item.firstName }</Button></List.Item>)}/>
                    </Affix>
                    <Button className="go-back-btn" type="primary" size="large" onClick={this.saveRoster}>Save roster</Button>
                </div>
        );
    }
}
export default RosterOfAdmin;