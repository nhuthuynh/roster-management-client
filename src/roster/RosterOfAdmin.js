import React, { Component } from 'react'
import { loadRoster, createRoster, loadEmployeeApprovedLeaveRequests, loadAvailabilities, loadWorkingEmployees } from '../util/APIUtils';
import { getHoursAndMinuteOfDate, getSmallerDate, getDate, switchPositionBetweenDayAndMonth, getFirstAndLastDayOfWeek } from '../util/helper';
import { Button, notification } from 'antd'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'
import dates from '../util/dates'
import { DAYS_IN_WEEK_IN_VALUES } from '../constants'
import EmployeeSelection from '../common/EmployeesSelection'

class RosterOfAdmin extends Component {
    constructor() {
        super()
        this.state = {
            employees: [],
            events: [],
            isLoading: false,
            isEmployeeSelectable: false,
            isCalendarClickable: false,
            selectedEmployeeId: 0,
            roster: {
                fromDate: new Date(),
                toDate: new Date(),
                createDate: new Date()
            },
            shiftList: {},
            businessHours: [],
            disabledDays: []
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

        Promise.all([loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId), loadWorkingEmployees(shopOwnerId)]).then((values)=> {
                this.setState({
                roster: values[0] ? values[0] : {},
                events: values[0] && values[0]["shiftList"] ? this.convertStringToDateInShiftList(values[0]["shiftList"]) : [],
                employees: values[1] ? [{ id: 0, firstName: '', lastName: '' }].concat(values[1]) : {},
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
        let { events, roster, shiftList, employees, selectedEmployeeId } = this.state;

        if (!selectedEmployeeId) return

        let selectedEvents = {}
        let employee = employees.find((emp) => emp.id === selectedEmployeeId)

        selectedEvents = {
            start,
            end,
            title: `${employee.firstName} ${employee.lastName}`
        }

        events.push(selectedEvents)

        roster.fromDate = roster.fromDate ? getSmallerDate(selectedEvents.start, roster.fromDate) : getDate(selectedEvents.start)
        roster.toDate = roster.toDate ? getSmallerDate(selectedEvents.end, roster.toDate) : getDate(selectedEvents.end)
        roster.createdDate = getDate(new Date())

        if(!shiftList[getDate(selectedEvents.start)]) {
            shiftList[getDate(selectedEvents.start)] = []
        }
        shiftList[getDate(selectedEvents.start)].push({
            "startTime": getHoursAndMinuteOfDate(selectedEvents.start),
            "endTime": getHoursAndMinuteOfDate(selectedEvents.end),
            "note": "",
            "employeeId": selectedEmployeeId
        })

        this.setState((prevState) => ({
            ...prevState,
            events,
            roster,
            shiftList
        }))
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

    resetCalendar = () => this.setState((prevState) => ({
        ...prevState,
        isLoading: false,
        isCalendarClickable: false,
        businessHours: [],
        disabledDays: []
    }))  

    onChangeEmployee = (employeeId) => {
        if (this.state.selectedEmployeeId === employeeId) return

        if (employeeId === 0) {
            this.resetCalendar()
            return
        }

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
                    selectedEmployeeId: employeeId,
                    businessHours: this.buildBusinessHoursFromAvailabilities(values[0] ? values[0] : []),
                    disabledDays: this.buildDisableDaysFromLeaveRequests(values[1] ? values[1] : []),
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
    validateEachAvailabilityDay = (businessHours, availability) => {
        let { available, day, endHour, endMinute, startHour, startMinute } = availability
        
        if (!available || 
            (startHour === endHour && startMinute === endMinute && startHour !== 0 && startMinute !== 0) || (
                startHour > endHour) || 
                (startHour === endHour && startMinute > endMinute)) 
                return businessHours
        
        if (startHour === 0 && startMinute === 0 && endHour === 0 && endMinute === 0) {
            endHour = 23
            endMinute = 59
        }

        if (Array.isArray(businessHours)) 
            businessHours.push({
                dow: [DAYS_IN_WEEK_IN_VALUES[day.toLowerCase()]],
                start: `${startHour}:${startMinute}`,
                end: `${endHour}:${endMinute}`
            })

        return businessHours
    }

    buildBusinessHoursFromAvailabilities = (availabilities) => {
        return availabilities && availabilities.length === 0 ? [] : availabilities.reduce(this.validateEachAvailabilityDay, [])
    }

    buildDisableDaysFromLeaveRequests = (leaveRequests) => {
        return leaveRequests && leaveRequests.length === 0 ? [] : leaveRequests.reduce(this.validateEachLeaveRequests, [])
    }

    validateEachLeaveRequests = (disabledDays, leaveRequest) => {
        let { fromDate, toDate } = leaveRequest
        fromDate = new Date(switchPositionBetweenDayAndMonth(fromDate))
        toDate =  new Date(switchPositionBetweenDayAndMonth(toDate))
        let diff = dates.diff(fromDate, toDate, 'day')
        if (diff === 0) {
            disabledDays.push(fromDate)
        } else {
            disabledDays.push(fromDate)
            for (let increaseDay = 1; increaseDay < diff; increaseDay++) {
                let startDisableDay = dates.startOf(fromDate, 'day')
                let nextDisableDay = dates.add(startDisableDay, increaseDay, 'day')
                disabledDays.push(nextDisableDay)
            }
            disabledDays.push(toDate)
        }

        return disabledDays
    }

    render() {
        const { onChangeEmployee, timeSelect, onNavigate, saveRoster } = this
        const { events, isCalendarClickable, businessHours, employees, selectedEmployeeId, disabledDays } = this.state
        
        return (
                <div className="desc">
                    <EmployeeSelection data={employees} onDataChange={onChangeEmployee} value={selectedEmployeeId}/>
                    <BigCalendar
                        selectable={isCalendarClickable}
                        localizer={BigCalendar.momentLocalizer(moment)}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView={BigCalendar.Views.WEEK}
                        views={[BigCalendar.Views.WEEK]}
                        onSelectSlot={timeSelect}
                        onNavigate={onNavigate}
                        businessHours={businessHours}
                        disabledDays={disabledDays}
                    />
                    <Button className="go-back-btn" type="primary" size="large" onClick={saveRoster}>Save roster</Button>
                </div>
        );
    }
}
export default RosterOfAdmin