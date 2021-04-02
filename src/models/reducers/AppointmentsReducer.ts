import { SET_CONTACTS_STATE } from "../actions/ContactActions";
import { RootActions } from "../store";

export interface Appointment
{
    contactId: string
    title: string
    at: number
}

export interface AppointmentsState
{
    appointments: Appointment[]
}

const INITIAL_STATE: AppointmentsState = {
    appointments: []
}

export function appointmentsReducers(state: AppointmentsState = INITIAL_STATE, 
    action: RootActions)
{
    switch(action.type)
    {
        case SET_CONTACTS_STATE :
            return {
                ...state,
                contacts: action.contacts
            }
        default: 
            return state
    }
}