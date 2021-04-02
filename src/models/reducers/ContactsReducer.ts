import { SET_CONTACTS_STATE } from "../actions/ContactActions";
import { RootActions } from "../store";

export interface ContactsState
{
    contacts: []
}

const INITIAL_STATE: ContactsState = {
    contacts: []
}

export function contactReducers(state: ContactsState = INITIAL_STATE, 
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