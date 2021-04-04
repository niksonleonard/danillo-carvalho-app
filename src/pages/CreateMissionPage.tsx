import { Contact } from '@capacitor-community/contacts';
import DateFnsUtils from '@date-io/date-fns';
import { IonButton } from '@ionic/react';
import { Avaturer, getCurrentUniverseAvanturers, getCurrentUniverseId, getSchools, KLUMFYSERVICES_SMARTPHONE_CONTACT_ID, Mission, MissionType, School } from '@klumfy/core';
import { Grid, MenuItem, Select } from '@material-ui/core';
import {
    KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { AppRoutes } from '../App';
import { requestAppointmentCreationAction } from '../models/actions/AppointmentActions';
import { RootActions } from '../models/store';
import { LoadingPage } from './LoadingPage';
import './Tab3.css';


interface Params 
{
    contactId: string
}

interface Props extends RouteComponentProps
{
    contacts: Contact[]
    onCreated: () => Promise<any>
}

interface State {
    isLoadingSomething: boolean
    selectedDate: MaterialUiPickersDate
    schoolId?: string
    avaturer?: Avaturer
    schools?: School[]
}

class CreateMissionPageComponent extends LoadingPage<PropsFromRedux, State>
{
    state: State = {
        isLoadingSomething: false,
        selectedDate: new Date()
    }

    async componentDidMount()
    {
        this.setState({ isLoadingSomething: true })
        const { contactId } = this.props.match.params as Params
        const avaturers = await getCurrentUniverseAvanturers()

        const avaturer = avaturers.find(avaturer => {
            const externalref = avaturer.externalReferences
            if (!externalref || !externalref[KLUMFYSERVICES_SMARTPHONE_CONTACT_ID])
                return null

            return externalref[KLUMFYSERVICES_SMARTPHONE_CONTACT_ID].userId 
                === contactId
        })

        const schools = await getSchools()

        this.setState({
            avaturer,
            schools,
            schoolId: schools[0].id,
            isLoadingSomething: false
        })
    }

    handleDateChange(value: MaterialUiPickersDate)
    {
        this.setState({ selectedDate: value })
    }

    handleChangeSchool(value: React.ChangeEvent<any>)
    {
        const schoolId = value.target.value
        this.setState({ 
            schoolId
        })
    }

    async createAppointment()
    {
        const { selectedDate, schoolId, avaturer } = this.state
        this.setState({ isLoadingSomething: true })

        if (!selectedDate || !schoolId)
            throw new Error(`Date, Time and School must be filled`)

        const universeId = await getCurrentUniverseId()
        if (!universeId)
            throw new Error('Error get critical data about universe')

        const mission = new Mission(universeId, schoolId, 
            `Agendamento - ${avaturer?.name}`, [avaturer!], [], 
            MissionType.ToDo)

        mission.schedule = {
            due: selectedDate.getTime()
        }

        await mission.create()
        await this.props.onCreated()
        this.props.history.push(AppRoutes.missionList())

        this.setState({ isLoadingSomething: false })
    }

    pageContent()
    {
        const { selectedDate, schools, schoolId } = this.state

        if (!selectedDate || !schools)
            return <></>

        return (<>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container direction="column" spacing={1} >
                        <Grid item>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Dia"
                                format="MM/dd/yyyy"
                                value={selectedDate}
                                onChange={(date) => this.handleDateChange(date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            </Grid>
                            <Grid item>
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Horário"
                                    value={selectedDate}
                                    onChange={(date) => this.handleDateChange(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </Grid>
                            <Grid item>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    required
                                    label="Escola"
                                    placeholder="Escola"
                                    value={schoolId}
                                    onChange={(value) => this.handleChangeSchool(value)}
                                    >
                                        {schools.map(school => <MenuItem value={school.id}>{school.name}</MenuItem>)}
                                </Select>
                            </Grid>
                            <Grid item>
                                <IonButton onClick={() => this.createAppointment()} >Salvar</IonButton>
                            </Grid>
                            </Grid>
                    </MuiPickersUtilsProvider>
                </>
            );
    }
}

function mapDispatchToProps(dispatch: Dispatch<RootActions>)
{
    return {
        requestAppointmentCreation: (contactId: string, at: number ) => dispatch(
            requestAppointmentCreationAction(contactId, at))
    }
}

const connector = connect(undefined, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector> & Props

const CreateAppointmentPage = connector(CreateMissionPageComponent)
export default  withRouter(CreateAppointmentPage)