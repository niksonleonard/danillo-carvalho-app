import { Contact } from '@capacitor-community/contacts';
import { IonAvatar, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonSearchbar } from '@ionic/react';
import { Avaturer, KLUMFYSERVICES_SMARTPHONE_CONTACT_ID } from '@klumfy/core';
import { KlumfyAvaturerShape } from '@klumfy/webcomponents';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { AppRoutes } from '../App';
import { LoadingPage, LoadingPageState } from './LoadingPage';
import './Tab2.css';

interface Props extends RouteComponentProps {
    contacts: Contact[]
    avaturers: Avaturer[]
}

interface State extends LoadingPageState {
    searchText?: string
    avaturerContacts: ContactAvaturer[]
}

interface ContactAvaturer
{
    avaturer?: Avaturer,
    contact: Contact
}

class ContactListPage extends LoadingPage<Props, State>
{

    constructor(props: Props, state: State)
    {
        super(props, state)

        const avaturerContacts: ContactAvaturer[] = props.contacts
            .map(contact => {
                const avaturer = props.avaturers.find(avaturer => {
                    const ref = avaturer.externalReferences
                    if(!ref || !ref[KLUMFYSERVICES_SMARTPHONE_CONTACT_ID]) 
                        return null

                    return ref[KLUMFYSERVICES_SMARTPHONE_CONTACT_ID].userId
                        ===  contact.contactId
                })

                return {
                    contact: contact,
                    avaturer
                }
            })

        this.state = {
            isLoadingSomething: false,
            title: 'Contatos',
            avaturerContacts
        }
    }

    ionList = React.createRef<HTMLIonListElement>()

    async goAvaturerDetails(contactId: string)
    {
        await this.ionList.current?.closeSlidingItems()
        this.props.history.push(AppRoutes.avaturerDetails(contactId))
    }

    async createMission(contactId: string)
    {
        await this.ionList.current?.closeSlidingItems()
        this.props.history.push(AppRoutes.createMission(contactId))
    }

    setSearchText(searchText: string)
    {
        this.setState({ searchText })
    }

    pageContent()
    {
        const { searchText, avaturerContacts } = this.state

        let contacts = avaturerContacts.filter(avaturerContact => {
            const contact = avaturerContact.contact
            if(!searchText)
                return true

            if (contact.displayName!.startsWith(searchText))
                return true

            return false
        })
        .sort((a,b) => {
            if(!a.contact.displayName ||  !b.contact.displayName)
                return 1

            return a.contact.displayName > b.contact.displayName ? 1 : 0
        })

        return (
            <>
            <IonSearchbar value={searchText} onIonChange={e => this.setSearchText(e.detail.value!)}></IonSearchbar>
            <IonList ref={this.ionList} >
                {contacts.map(contact => {
                    return (
                    <IonItemSliding key={contact.contact.contactId}  >
                        <IonItem >
                            <IonAvatar slot="start">
                                {contact.avaturer 
                                ? <KlumfyAvaturerShape shape={contact.avaturer.shape} />
                                : <img src={contact.contact.photoThumbnail} />}
                            </IonAvatar>
                            <IonLabel>{contact.contact.displayName}</IonLabel>
                        </IonItem>
                        <IonItemOptions side="end">
                            {contact.avaturer 
                                ? <IonItemOption onClick={() => this.createMission(contact.contact.contactId)}
                                    >Criar Agendamento</IonItemOption>
                                : null}
                            <IonItemOption onClick={() => this.goAvaturerDetails(contact.contact.contactId)}
                                >Avaturer</IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                    )
                })}
            </IonList>
            </>)
    }
}

export default withRouter(ContactListPage)
