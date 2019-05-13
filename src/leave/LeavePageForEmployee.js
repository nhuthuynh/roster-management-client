import React from 'react'

export default function LeavePageForEmployee(props) {
    const { leaveInfo, 
        fromDate, openToDate, onDisabledFromDate, onFromDateChange, handleStartOpenChange,
        toDate, onDisabledToDate, onToDateChange, handleEndOpenChange,
        onSubmitLeaveRequest,
        saveNoteRef } = props
        
    return (
        <div className="page-body">
            <LeaveInfo data={leaveInfo} />
            <LeaveSubmissionForm 
                fromDate={fromDate} 
                openToDate={openToDate} 
                onDisabledFromDate={onDisabledFromDate} 
                onDisabledToDate={onDisabledToDate} 
                toDate={toDate}
                onSubmit={onSubmitLeaveRequest}
                saveNoteRef={saveNoteRef}
                onFromDateChange={onFromDateChange} 
                onToDateChange={onToDateChange}
                handleStartOpenChange={handleStartOpenChange} 
                handleEndOpenChange={handleEndOpenChange} />
        </div>
        
    )
}