import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import '../components/ExploreContainer.css';

export interface LoadingPageState
{
    isLoadingSomething: boolean,
    title?: string
} 

export abstract class LoadingPage<T extends RouteComponentProps, S extends LoadingPageState = { isLoadingSomething: false }> extends React.Component<T, S>
{
    title: string = ''

    constructor(props: T, state: S)
    {
        super(props, state)
        this.state = {
            ...state,
            isLoadingSomething: false,
            title: ''
        }
    }

    abstract pageContent(): JSX.Element
    

    turOnLoading()
    {
        this.setState({ isLoadingSomething: true})
    }

    turOffLoading()
    {
        this.setState({ isLoadingSomething: false})
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
        <IonPage  >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{this.state.title}</IonTitle>
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
                    : <div className="container">{this.pageContent()}</div>}
            </IonContent>
          </IonPage>
          )
    }
}