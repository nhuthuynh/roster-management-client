import React, { Component } from 'react';
import { loadRoster, createRoster, loadEmployeeApprovedLeaveRequests, loadAvailabilities } from '../util/APIUtils';
import { getHoursAndMinuteOfDate, getSmallerDate, getDate, switchPositionBetweenDayAndMonth, getFirstAndLastDayOfWeek } from '../util/helper';
import { Button, notification } from 'antd';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'
import EmployeeSelection from '../common/EmployeesSelection'

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

        loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId).then((values)=> {
                this.setState({
                roster: values ? values : {},
                events: values && values["shiftList"] ? this.convertStringToDateInShiftList(values["shiftList"]) : [],
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

    onChangeEmployee = (employeeId) => {
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))
        Promise.all([loadAvailabilities(employeeId), loadEmployeeApprovedLeaveRequests(employeeId)]).then((values) => {
            if (values && values[0] && values[1]) {
                this.setState((prevState) => ({
                    ...prevState,
                    isLoading: false,
                    isCalendarClickable: true,
                    businessHours: this.buildBusinessHours(values[0])
                }))
            } else {
                notification.error({
                    message: 'CEMS - Roster Management',
                    description: 'There is an error!'
                })
            }
        }).catch((error) => notification.error({
            message: 'CEMS - Roster Management',
            description: `Error: ${(error && error.message)}`
        }))
    }

    buildBusinessHours = (availabilities) => {
        return availabilities && availabilities.length === 0 ? [] : availabilities.map((item, index) => ({  }))
    }

    render() {
        const { onChangeEmployee, timeSelect, onNavigate, saveRoster } = this
        const { events, isCalendarClickable, businessHours } = this.state
        const { currentUser } = this.props
        return (
                <div className="desc">
                    <EmployeeSelection onChangeEmployee={onChangeEmployee} currentUser={currentUser} />
                    <BigCalendar
                        selectable={isCalendarClickable}
                        localizer={BigCalendar.momentLocalizer(moment)}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="week"
                        views={{week:true}}
                        onSelectSlot={timeSelect}
                        onNavigate={onNavigate}
                        businessHours={[{
                            dow: [0, 1, 2, 3, 4, 5, 6], // Sunday, Monday, Tuesday, Wednesday...
                            start: "08:30", // 8am
                            end: "12:30" // 12pm
                          }, {
                            dow: [0, 1, 2], // Sunday, Monday, Tuesday, Wednesday...
                            start: "14:30", // 2pm
                            end: "20:00" // 8pm
                          }]}
                    />
                    <Button className="go-back-btn" type="primary" size="large" onClick={saveRoster}>Save roster</Button>
                </div>
        );
    }
}
export default RosterOfAdmin;