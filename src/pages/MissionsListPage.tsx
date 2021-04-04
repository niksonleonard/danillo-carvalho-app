import { Contact } from '@capacitor-community/contacts';
import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react';
import { Mission } from '@klumfy/core';
import { add } from 'ionicons/icons';
import { RouteComponentProps, withRouter } from 'react-router';
import { LoadingPage } from './LoadingPage';
import './Tab2.css';

interface Props extends RouteComponentProps
{
    contacts: Contact[]
    missions: Mission[]
}

interface State
{
    isLoadingSomething: boolean
    title: string
}

class MissionsListPage extends LoadingPage<Props, State>
{
    state: State = {
        isLoadingSomething: true,
        title: 'Agendamentos'
    }

    async componentDidMount()
    {
        var start = new Date()
        start.setHours(0,0,0,0)

        this.setState({ isLoadingSomething: false })
    }

    goToCreateAppointment(contactId: string = '')
    {
        this.props.history.push(`/createAppointment/${contactId}`)
    }

    renderAppointment(mission: Mission)
    {
        const schedulle = mission.schedule!
        const avaturer = mission.avaturers.length > 0 
            ? mission.avaturers[0]
            :undefined

        const dateTime = new Date(schedulle.due!)
        return (
            <IonItem key={mission.id} >
                <IonLabel>{`${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`}</IonLabel>
                <IonLabel>{avaturer?.name}</IonLabel>
                <IonLabel>{mission.title}</IonLabel>
            </IonItem>
        )
    }

    pageContent() {
        let { missions } = this.props

        missions = missions.filter(mission => mission.schedule)
        // missions = missions.filter(mission => mission.schedule!.due! >= start.getTime())

        return (
            <>
                <IonFab vertical="top" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => this.goToCreateAppointment()} >
                    <IonIcon icon={add} />
                </IonFabButton>
                </IonFab>
                <IonList>
                    {missions.map(appointment => {
                        return this.renderAppointment(appointment)
                    })}
                </IonList>
            </>
        );
    }
};

export default withRouter(MissionsListPage);
