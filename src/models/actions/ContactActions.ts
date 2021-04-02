import { Action } from 'redux'
import { Contact } from '@capacitor-community/contacts'

export const REQUEST_CONTACTS = 'REQUEST_CONTACTS'
export const SET_CONTACTS_STATE = 'SET_CONTACTS_STATE'

export interface RequestContacts extends Action<'REQUEST_CONTACTS'> {}
export interface SetContactsState extends Action<'SET_CONTACTS_STATE'> { contacts: Contact[] }

export type ContactsActions = RequestContacts | SetContactsState

export function requestContactsActions()
    : RequestContacts
{
    return {
        type: REQUEST_CONTACTS
    }
}

export function setContactsStateActions(contacts: Contact[])
    : SetContactsState
{
    return {
        type: SET_CONTACTS_STATE,
        contacts
    }
}