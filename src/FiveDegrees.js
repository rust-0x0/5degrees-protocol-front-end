import React, { useState } from 'react'
import { Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ addressesTo:  '' })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { addressesTo } = formState

  const { keyring } = useSubstrateState()
  const accounts = keyring.getPairs()

  const availableAccounts = []
  accounts.map(account => {
    return availableAccounts.push({
      key: account.meta.name,
      text: account.meta.name,
      value: account.address,
    })
  })

  return (
    <Grid.Column width={8}>
      <h1>Batch Follow or Unfollow</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Multiple Select from available addresses"
            fluid
            multiple
            selection
            search
            options={availableAccounts}
            state="addressesTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Multiple To"
            type="text"
            placeholder="addresses"
            value={addressesTo}
            state="addressesTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
         <TxButton
            label="Batch Follow"
            type="SIGNED-TXC"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'fiveDegrees',
              callable: 'mintBatch',
              inputParams: [addressesTo],
              paramFields: [true],
            }}
          />
          <TxButton
            label="Batch Unfollow"
            type="SIGNED-TXC"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'fiveDegrees',
              callable: 'burnBatch',
              inputParams: [addressesTo],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
