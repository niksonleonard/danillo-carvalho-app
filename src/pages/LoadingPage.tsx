import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { CircularProgress } from '@material-ui/core';
import React from 'react';
import '../components/ExploreContainer.css';

interface LoadingPageState
{
    isLoadingSomething: boolean
} 

export class LoadingPage<T = {}, S extends LoadingPageState = { isLoadingSomething: false }> extends React.Component<T, S>
{
    constructor(props: T, state: S)
    {
        super(props, state)
        this.state = {
            ...state,
            isLoadingSomething: false
        }
    }

    addLoadingProccess(proccess: Promise<any>)
    {
        proccess.then(() => this.setState({
            ...this.state,
            isLoadingSomething: false 
        }))
        this.setState({
            ...this.state,
            isLoadingSomething: true 
        })
    }
    
    render()
    {
        return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 1</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 1</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {this.state.isLoadingSomething
                    ? <div className="container">
                        <CircularProgress />
                    </div>
                    : this.props.children}
            </IonContent>
          </IonPage>
          )
    }
}