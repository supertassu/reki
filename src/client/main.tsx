import './main.css'
import 'react-hot-loader'

import React from 'react'
import { render } from 'react-dom'
import moment from 'moment'

import {
  App,
  Homepage,
  ParticipantDetailsPage,
  ParticipantListPage,
  UserManagementPage,
  AuditLogPage,
} from './components'
import { RestfulResource } from './RestfulResource'
import createMatcher from 'feather-route-matcher'
import { ErrorProvider } from './errors'

moment.locale('fi')

const participantResource = RestfulResource('/api/participants')
const participantDateResource = RestfulResource('/api/participantDates')
const optionResource = RestfulResource('/api/options')

const routes = createMatcher({
  '/participants': () => (
    <ParticipantListPage
      optionResource={optionResource}
      participantDateResource={participantDateResource}
      participantResource={participantResource}
    />
  ),
  '/participants/:id': (params: { id: string }) => (
    <ParticipantDetailsPage
      participantResource={participantResource}
      {...params}
    />
  ),
  '/admin': UserManagementPage,
  '/audit': AuditLogPage,
  '*': Homepage,
})

const { page: RouteComponent, params }: any = routes(location.pathname)

render(
  <ErrorProvider>
    <App>
      <RouteComponent {...params} />
    </App>
  </ErrorProvider>,
  document.getElementById('app'),
)
