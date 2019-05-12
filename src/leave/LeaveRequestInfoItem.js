import React from 'react'
import { LEAVE_STATUS_VALUES } from '../constants'

export default function LeaveRequestInfoItem(props) {
    const { item } = props
    return (
        <li>
            <p><span>Leave start date</span> <span>{item.fromDate}</span></p>
            <p><span>Leave end date</span> <span>{item.toDate}</span></p>
            <p><span>Number of off dates</span> <span>{item.numberOfOffDates}</span></p>
            <p><span>Status</span> <span>{LEAVE_STATUS_VALUES[item.status]}</span></p>
        </li>
    )
}