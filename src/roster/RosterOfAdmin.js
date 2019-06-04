import React, { Component } from 'react'
import { loadRoster, createRoster, loadEmployeeApprovedLeaveRequests, loadWorkingEmployees, loadAvailabilitiesByRosterDatesAndEmployeeId } from '../util/APIUtils';
import { getDate, getFirstAndLastDayOfWeek } from '../util/helper';
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
            currentDate: moment(),
            roster: {
                fromDate: moment(),
                toDate: moment(),
                createDate: moment()
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
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))
        let rosterDate = this.getRosterDates()
        
        const { currentUser } = this.props
        const shopOwnerId = getShopOwnerId(currentUser)

        Promise.all([loadRoster(rosterDate.fromDate, rosterDate.toDate, shopOwnerId), loadWorkingEmployees(shopOwnerId)]).then(([roster, employees])=> {
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

    getRosterDates (date) {
        if (!date) date = new Date()
        const { firstDate, lastDate } = getFirstAndLastDayOfWeek(date, false)
        return {
            fromDate: getDate(firstDate),
            toDate: getDate(lastDate)
        }
    }

    convertStringToDateInShiftList (shiftList) {
        return shiftList.map((shift, index) => ({
            ...shift,
            start: new Date(shift.start),
            end: new Date(shift.end),
            index
        }))
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
        let { roster, events, currentDate } = this.state;
        let rosterDates = this.getRosterDates(currentDate)
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
        roster.fromDate = rosterDates.fromDate
        roster.toDate = rosterDates.toDate
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
        let rosterDates = this.getRosterDates(date)
        const shopOwnerId = getShopOwnerId(this.props.currentUser)
        
        this.onChangeEmployee(0)
        this.setState((prevState) => ({
            ...prevState,
            currentDate: date,
            isLoading: true
        }))

        loadRoster(rosterDates.fromDate, rosterDates.toDate, shopOwnerId)
            .then((roster) => {
                this.setState((prevState) => ({
                    ...prevState,
                    roster: roster ? roster : {},
                    events: this.convertStringToDateInShiftList(roster.shiftList),
                    isLoading: false
                }))
        }).catch((error) => {
            notification.error({
                message: 'CEMS - Roster',
                description: error,
                duration: 2
            })

            this.setState((prevState) => ({
                ...prevState,
                isLoading: false
            }))
        })
    }

    resetCalendar = () => this.setState((prevState) => ({
        ...prevState,
        selectedEmployeeId: 0,
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

        const { currentDate: date } = this.state
        const rosterDates = this.getRosterDates(date)
        
        this.setState((prevState) => ({
            ...prevState,
            isLoading: true
        }))
        
        this.loadAvailabilitiesAndLeaveRequest(rosterDates.toDate, employeeId).then(([availabilities, acceptedLeaveRequests]) => {
            this.setState((prevState) => ({
                ...prevState,
                isLoading: false,
                isCalendarClickable: true,
                selectedEmployeeId: employeeId,
                businessHours: this.buildBusinessHoursFromAvailabilities(availabilities || []),
                disabledDays: this.buildDisableDaysFromLeaveRequests(acceptedLeaveRequests || []),
            }))
        }).catch((error) => notification.error({
            message: 'CEMS - Roster Management',
            description: `Error: ${(error && error.message)}`
        }))
    }

    loadAvailabilitiesAndLeaveRequest = (toDate, employeeId) => {
        return Promise.all([loadAvailabilitiesByRosterDatesAndEmployeeId(toDate, employeeId), loadEmployeeApprovedLeaveRequests(employeeId)])
    }
    validateEachAvailabilityDay = (businessHours, availability) => {
        let { available, day, endHour, endMinute, startHour, startMinute } = availability
        endHour = endHour === 0 ? 23 : endHour
        endMinute = endMinute === 0 ? 59 : endMinute
        if (available) {
            if (
                (startHour === endHour && startMinute === endMinute) || 
                (startHour === endHour && startMinute > endMinute)) {
                    return businessHours
                }
                    
        } else {
            endHour = 23
            endMinute = 59
        }
        

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