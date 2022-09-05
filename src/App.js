import React, { createRef } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import AccountSelector from './AccountSelector'
import BlockNumber from './BlockNumber'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import FollowingList from './FollowingList'
import BatchFollow from './BatchFollow'
import Properties from './Properties'
import Events from './Events'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const contextRef = createRef()
  //   const loaderRef = createRef()
  // const loaderRef = React.useRef(null);
  const CustomLoader = React.forwardRef((props, ref) => {
    return (
      <Loader {...props} ref={ref}>
        {props.children}
      </Loader>
    )
  })
  const CustomDimmer = React.forwardRef((props, ref) => {
    return (
      <Dimmer {...props} ref={ref}>
        {props.children}
      </Dimmer>
    )
  })

  const loader = text => (
    <CustomDimmer active>
      <CustomLoader size="small">{text}</CustomLoader>
    </CustomDimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <FollowingList />
          </Grid.Row>
          <Grid.Row>
            <BatchFollow />
            <Properties />
          </Grid.Row>
          <Grid.Row>
            <Events />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
