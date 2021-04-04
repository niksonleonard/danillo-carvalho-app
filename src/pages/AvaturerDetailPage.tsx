import { Contact } from '@capacitor-community/contacts';
import { IonButton } from '@ionic/react';
import { AvatuerSvgShapeInitialState, Avaturer, AvaturerExternalReferencesData, AvaturerShapeData, generateSignUpLinkForAvaturer, getCurrentUniverseId, getSignUpLinkForAvaturer, KLUMFYSERVICES_SMARTPHONE_CONTACT_ID, SignUpLinkData } from '@klumfy/core';
import { KlumfyAvaturerCard } from '@klumfy/webcomponents';
import QRCode from 'qrcode.react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { LoadingPage, LoadingPageState } from './LoadingPage';
import './Tab3.css';

interface Params 
{
    contactId: string
}

interface Props extends RouteComponentProps
{
    contacts: Contact[],
    avaturers: Avaturer[]
    onAvaturerGenerated: () => Promise<any>
}

interface State extends LoadingPageState {
    contact?: Contact
    avaturer?: Avaturer
    universeId?: string
    signupLink?: SignUpLinkData
}

class AvaturerDetailPage extends LoadingPage<Props, State>
{
    state: State = {
        isLoadingSomething: false,
    }
    
    async componentDidMount()
    {
        const universeId = await getCurrentUniverseId()

        if (!universeId)
            throw new Error(`Could not possible get current universe`)

        const { contactId } = this.props.match.params as Params
        
        const contact = this.props.contacts
            .find(contact => contact.contactId === contactId)

        if (!contact)
            throw new Error('Contact requested do not exists')

        const avaturer = this.props.avaturers.find(avaturer => { 
            const externalReferences = avaturer.externalReferences
            if (!externalReferences)
                return false

                
            if (!externalReferences.hasOwnProperty(
                KLUMFYSERVICES_SMARTPHONE_CONTACT_ID))
                return false

            const reference = externalReferences[KLUMFYSERVICES_SMARTPHONE_CONTACT_ID]
            return reference.userId === contactId
        })

        let signupLink = undefined
        
        if(avaturer)
            signupLink = await getSignUpLinkForAvaturer(avaturer.id, 
                universeId) ?? undefined

        this.setState({
            contact,
            avaturer,
            universeId,
            signupLink
        })
    }

    async createAvaturer(universeId: string, contact: Contact)
    {
        const externalReference: AvaturerExternalReferencesData = {
            displayValue: contact.displayName!,
            serviceId: KLUMFYSERVICES_SMARTPHONE_CONTACT_ID,
            serviceName: KLUMFYSERVICES_SMARTPHONE_CONTACT_ID,
            showReference: false,
            userId: contact.contactId
        }
        const avaturerShape: AvaturerShapeData = { svgShape: AvatuerSvgShapeInitialState }
        const avaturer = new Avaturer(universeId, contact.displayName!, 
            avaturerShape, undefined, contact.displayName, undefined, 
            { [KLUMFYSERVICES_SMARTPHONE_CONTACT_ID]: externalReference })
        
        await avaturer.create()
        await this.createSignUp(universeId, avaturer)
    }

    async createSignUp(universeId: string, avaturer: Avaturer)
    {
        const signupLink = await generateSignUpLinkForAvaturer(avaturer.id, 
            universeId)
    
        this.setState({ avaturer, signupLink })
    }

    pageContentRender()
    {
        const { contact, universeId, avaturer, signupLink} = this.state

        if (!contact || !universeId)
            return <h1>Por favor agauarde</h1>

        if (!avaturer)
            return <>
                    <IonButton
                        onClick={() => this.createAvaturer(universeId, contact)}
                    >Criar Avaturer para {contact.displayName}</IonButton>
                </>

        if (signupLink)
            return (<>
                        <QRCode value={signupLink.signupLink} />
                        <IonButton 
                            onClick={() => 
                                navigator.clipboard.writeText(signupLink.signupLink)}
                            >Copiar Link</IonButton>
                    </>)
        else return (<IonButton
            onClick={() => this.createSignUp(universeId, avaturer)}
                >Criar matrícula para {contact.displayName}</IonButton>)

        return null
    }

    pageContent()
    {
        const { avaturer } = this.state
        return (
            <>
            {avaturer ? <KlumfyAvaturerCard avaturer={avaturer} /> : null}
            {this.pageContentRender()}
            </>)
    }
}

export default withRouter(AvaturerDetailPage)