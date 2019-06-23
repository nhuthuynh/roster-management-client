import React from 'react'

export default function AvailabilityNotification(props) {
    const { data: roster } = props
    return (
        <p>
            {
                roster && roster.fromDate && roster.toDate ? <b>{ `A roster from ${roster.fromDate} to ${roster.toDate} is made. Your update will affected after ${roster.toDate}` }</b> : null
            }
        </p>
    )
}
