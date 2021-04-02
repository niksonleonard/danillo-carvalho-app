import { Action } from "redux"

export const REQUEST_CREATE_APPOINTMENT = 'REQUEST_CREATE_APPOINTMENT'
export const SUCCESS_CREATE_APPOINTMENT = 'SUCCESS_CREATE_APPOINTMENT'

export interface RequestAppointmentCreation extends Action<'REQUEST_CREATE_APPOINTMENT'> 
{
    contactId: string, at: number
}

export interface SuccessAppointmentCreation extends Action<'SUCCESS_CREATE_APPOINTMENT'> 
{
}

export type AppointmentActions = RequestAppointmentCreation
    | SuccessAppointmentCreation

export function requestAppointmentCreationAction(contactId: string, at: number)
    : RequestAppointmentCreation
{
    return {
        type: REQUEST_CREATE_APPOINTMENT,
        contactId,
        at
    }
}

export function successAppointmentCreationAction()
    : SuccessAppointmentCreation
{
    return {
        type: SUCCESS_CREATE_APPOINTMENT
    }
}