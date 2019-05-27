import React, { Component } from 'react'
import { loadRoster, createRoster, loadEmployeeApprovedLeaveRequests, loadAvailabilities, loadWorkingEmployees } from '../util/APIUtils';
import { getDate, switchPositionBetweenDayAndMonth, getFirstAndLastDayOfWeek } from '../util/helper';
import { Button, notification, Popconfirm } from 'antd'
import BigCalendar from '@nhuthuynh/react-big-calendar'
import moment from 'moment'
import { getShopOwnerId } from '../util/helper'
import dates from '../util/dates'
import { DAYS_IN_WEEK_IN_VALUES } from '../constants'
import EmployeeSelection from '../common/EmployeesSelection'

moment.utc()
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

        Promise.all([loadRoster(getDate(dates.firstDate), getDate(dates.lastDate), shopOwnerId), loadWorkingEmployees(shopOwnerId)]).then(([roster, employees])=> {
                this.setState((prevState) => ({
                ...prevState,
                roster,
                events: this.convertStringToDateInShiftList(roster.shiftList),
                employees: [{ id: 0, firstName: '', lastName: '' }].concat(employees) || [],
                isLoading: false
            }))
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Roster',
                description: `${(error && error.message ? error.message : 'There some errors loading data!')}`
            });
        });
    }

    convertStringToDateInShiftList (shiftList) {
        return shiftList && shiftList.length > 0 && shiftList.map((shift, index) => ({
            ...shift,
            start: new Date(shift.start),
            end: new Date(shift.end),
            index
        })) || []
    }

    checkWhetherSelectedEventIsOvelapped (selectedEvent, events) {
        if (!selectedEvent || !events) return 

        
    }

    timeSelect = ({ start, end }) => {
        let { events, roster, employees, selectedEmployeeId } = this.state;
        
        if (!selectedEmployeeId) return

        let selectedEvents = {}
        let employee = employees.find((emp) => emp.id === selectedEmployeeId)

        selectedEvents = {
            start,
            end,
            "title": `${employee.firstName} ${employee.lastName}`,
            "employeeId": selectedEmployeeId,
            index: events.length
        }

        events.push(selectedEvents)
        
        this.setState((prevState) => ({
            ...prevState,
            events,
            roster,
        }))
    }

    saveRoster = () => {
        let { roster, events } = this.state;
        let firstAndLastDateOfWeek = getFirstAndLastDayOfWeek(new Date(), false)
        let shiftList = {}
        const shopOwnerId = getShopOwnerId(this.props.currentUser)

        roster.shiftList = []

        events.forEach(event => {
            const { start, end, employeeId } = event
            const date = getDate(start)
            
            shiftList[date] = !shiftList[date] ? [] : shiftList[date]
            
            shiftList[date].push({
                "start": start,
                "end": end,
                "note": "",
                "employeeId": employeeId,
            })
        })

        Object.keys(shiftList).forEach((key) => {
            roster.shiftList.push({
                date: key,
                employeeShifts: shiftList[key]
            })
        })

        roster.shopOwnerId = shopOwnerId
        roster.fromDate = getDate(firstAndLastDateOfWeek.firstDate)
        roster.toDate = getDate(firstAndLastDateOfWeek.lastDate)
        roster.createdDate = getDate(new Date())
        
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))

        createRoster(roster).then(response => {
            if (response.success) {
                notification.success({
                    message: 'CEMS - Roster',
                    description: 'Create roster successfully!',
                    duration: 5
                })
                this.setState((prevState) => ({
                    ...prevState,
                    isLoading: false
                }))
            } else {
                notification.error({
                    message: 'CEMS - Roster',
                    description: `${(response && response.message ? response.message : 'Failed to create roster!')}`,
                    duration: 5
                })
            }

        }).catch(error => notification.error({
            message: 'CEMS - Roster',
            description: `${(error && error.message ? error.message : 'Failed to create roster!')}`,
            duration: 5
        }))

    }

    onNavigate = (date, view) => {
        let firstAndLastDate = getFirstAndLastDayOfWeek(date, false)
        const shopOwnerId = getShopOwnerId(this.props.currentUser)
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))

        loadRoster(getDate(firstAndLastDate.firstDate), getDate(firstAndLastDate.lastDate), shopOwnerId).then((roster) => {
            this.setState((prevState) => ({
                ...prevState,
                roster: roster ? roster : {},
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
        fromDate = getDate(fromDate)
        toDate =  getDate(toDate)
        let diff = dates.diff(fromDate, toDate, 'day')
        if (diff === 0) {
            disabledDays.push(fromDate)
        } else {
            //disabledDays.push(fromDate)
            disabledDays = dates.range(fromDate, toDate)
            //disabledDays.push(toDate)
        }

        return disabledDays
    }

    // filter seleted event by index and re-index remaining events
    removeEvent = (event) => {
        const { events } = this.state
        
        let newEvents = events.filter(ev => ev.index !== event.index).map((ev, index) => ({ ...ev, index }))

        this.setState(prevState => ({
            ...prevState,
            events: newEvents            
        }))
    }

    render() {
        const { onChangeEmployee, timeSelect, onNavigate, saveRoster, onSelectEvent } = this
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
                    onSelectEvent={onSelectEvent}
                    components={{
                        event: Event.bind(this)
                    }}
                    />
                <Button className="btn-save-roster" type="primary" size="large" onClick={saveRoster}>Save roster</Button>
            </div>
        );
    }
}

function Event({event}) {
    return (
        <Popconfirm title="Do you want to delete this shift？" okText="Yes" cancelText="No" onConfirm={() => this.removeEvent(event)}>
            <div className="event-title-container">{event.title}</div>
        </Popconfirm>
    )
  }

export default RosterOfAdmin