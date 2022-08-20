import React, { useState } from 'react'
import { Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({
    addressesTo: '',
    addressesFrom: '',
    tokenIds: '',
  })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { addressesTo, addressesFrom, tokenIds } = formState

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
      <h1>BatchTransferFrom</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select from available addresses"
            fluid
            selection
            search
            options={availableAccounts}
            state="addressesFrom"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Select from available addresses"
            fluid
            selection
            search
            options={availableAccounts}
            state="addressesTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Multiple Select from available tokenIds"
            fluid
            multiple
            selection
            search
            options={availableAccounts}
            state="tokenIds"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="AddressFrom"
            type="text"
            placeholder="AddressFrom"
            value={addressesFrom}
            state="addressesFrom"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="AddressTo"
            type="text"
            placeholder="AddressTo"
            value={addressesTo}
            state="addressesTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="TokenIds"
            type="text"
            placeholder="TokenIds"
            value={tokenIds}
            state="tokenIds"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="safeBatchTransferFrom"
            type="SIGNED-TXC"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'hexSpace',
              callable: 'safeBatchTransferFromHex',
              inputParams: [addressesFrom, addressesTo, tokenIds],
              paramFields: [true,true,true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
