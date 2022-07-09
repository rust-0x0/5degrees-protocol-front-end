import React, { useState } from 'react'
import { Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({
    addressTo: '',
    addressFrom: '',
    tokenId: '',
  })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { addressTo, addressFrom, tokenId } = formState

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
      <h1>TransferFrom</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select from available addresses"
            fluid
            selection
            search
            options={availableAccounts}
            state="addressFrom"
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
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Select from available token id"
            fluid
            selection
            search
            options={availableAccounts}
            state="tokenId"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="AddressFrom"
            type="text"
            placeholder="AddressFrom"
            value={addressFrom}
            state="addressFrom"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="AddressTo"
            type="text"
            placeholder="AddressTo"
            value={addressTo}
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="TokenId"
            type="text"
            placeholder="TokenId"
            value={tokenId}
            state="tokenId"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="safeTransferFrom"
            type="SIGNED-TXC"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'hexSpace',
              callable: 'safeTransferFrom',
              inputParams: [addressFrom, addressTo, tokenId, 1, ''],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
