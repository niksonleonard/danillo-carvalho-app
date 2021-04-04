import { Contact } from '@capacitor-community/contacts';
import { Plugins } from "@capacitor/core";
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,

    IonTabBar,
    IonTabButton,
    IonTabs,
    isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import { Avaturer, getAvanturersByUniverseId, getCurrentUniverseId, getMissions, Mission } from '@klumfy/core';
import { KlumfyAvaturerLogin, RootState } from '@klumfy/webcomponents';
import { calendar, people } from 'ionicons/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import AvaturerDetailPage from './pages/AvaturerDetailPage';
import ContactListPage from './pages/ContactListPage';
import CreateMissionPage from './pages/CreateMissionPage';
import MissionsListPage from './pages/MissionsListPage';
/* Theme variables */
import './theme/variables.css';

const  { Contacts } = Plugins;

interface AppState {
    contacts?: Contact[]
    avaturers?: Avaturer[]
    missions?: Mission[]
}

export class AppRoutes 
{
    static avaturerDetails = (contactId: string = ':contactId') => 
        `/avaturerDetails/${contactId}`

    static missionList = () => 
        `/missionList`

    static contactList = () => 
        `/contactList`

    static createMission = (contactId: string = ':contactId') => 
        `/createMission/${contactId}`
}

export let WebMockContacts: Contact[] = [{
    contactId: '12345',
    emails: [],
    phoneNumbers: [],
    displayName: "Fulano da Silva",
    photoThumbnail: 'assets/icon/icon.png'
},
{
    contactId: '24323423',
    emails: [],
    phoneNumbers: [],
    displayName: "Geroncia Almenida",
    photoThumbnail: 'assets/icon/icon.png'
}]

class App extends React.Component<PropsFromRedux, AppState>
{
    state: AppState = {}

    async componentDidMount()
    {
        if (isPlatform("mobile"))
        {
            await (Contacts.getPermissions())
            const contacts = (await Contacts.getContacts()).contacts
            this.setState({ contacts })
        } else {
            const contacts: Contact[] = WebMockContacts
            this.setState({ contacts })
        }
    }

    async realoadData()
    {
        const universeId = await getCurrentUniverseId()

        if (!universeId)
            throw new Error(`Could not possible get current universe`)

        let missions = await getMissions()
        const avaturers = await getAvanturersByUniverseId(universeId)

        this.setState({
            missions,
            avaturers
        })
    }

    render() {
        const { contextAvaturer } = this.props
        const { contacts, missions, avaturers } = this.state

        if (!contextAvaturer)
            return <KlumfyAvaturerLogin />

        if (!contacts || !missions || !avaturers) {
            this.realoadData()
            return <h2>Por favor aguarde</h2>
        }
        
        return (
            <IonApp>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                        <Route path={AppRoutes.missionList()}>
                                <MissionsListPage missions={missions} contacts={contacts}/>
                        </Route>
                        <Route path="/contactList">
                                <ContactListPage avaturers={avaturers}  contacts={contacts} />
                        </Route>
                        <Route path={AppRoutes.createMission()}>
                            <CreateMissionPage contacts={contacts} onCreated={async () => await this.realoadData()} />
                        </Route>
                        <Route path={AppRoutes.avaturerDetails()}>
                            <AvaturerDetailPage onAvaturerGenerated={async () => await this.realoadData()} avaturers={avaturers} contacts={contacts} />
                        </Route>
                        <Route exact path="/">
                            <Redirect to={AppRoutes.missionList()} />
                        </Route>
                        </IonRouterOutlet>
                            <IonTabBar slot="bottom">
                                <IonTabButton tab="tab1" href={AppRoutes.missionList()}>
                                    <IonIcon icon={calendar} />
                                    <IonLabel>Agendamentos</IonLabel>
                                </IonTabButton>
                                <IonTabButton tab="tab2" href={AppRoutes.contactList()}>
                                    <IonIcon icon={people} />
                                    <IonLabel>Contatos</IonLabel>
                                </IonTabButton>
                            </IonTabBar>
                    </IonTabs>
                </IonReactRouter>
            </IonApp>
            );
    }
}

function mapStateToProps(state: RootState)
{
    const { contextAvaturer } = state.auth
    return { contextAvaturer }
}

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

export default connect(mapStateToProps)(App);
