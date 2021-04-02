import { authReducer, avaturerAuthSaga, AvaturerAuthState } from '@klumfy/webcomponents';
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { AppointmentActions } from "./actions/AppointmentActions";
import { ContactsActions } from "./actions/ContactActions";
import { appointmentsReducers } from "./reducers/AppointmentsReducer";


export type RootActions = ContactsActions | AppointmentActions

export interface RootState {
    auth: AvaturerAuthState
}
// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

export const appReducers = combineReducers({
    appointments: appointmentsReducers,
    auth: authReducer,
})

// mount it on the Store
const store = createStore(
    appReducers,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// then run the saga
sagaMiddleware.run(avaturerAuthSaga)

export default store