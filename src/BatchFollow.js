import React, { useState } from 'react'
import { Form, Input, Grid, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'
import TransferFrom from './TransferFrom'

import Metrics from './Metrics'
export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ addressesTo: '' })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { addressesTo } = formState

  const { keyring, contract } = useSubstrateState()
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
      <Metrics />
      <h1> Approval of the Contract </h1>
      <TxButton
        label="approval"
        type="SIGNED-TXC"
        setStatus={setStatus}
        attrs={{
          palletRpc: 'erc1155',
          callable: contract && contract['erc1155']&& contract['erc1155'].abi.messages[10].method,
          inputParams: [contract && contract['hexSpace'].address,true],
          paramFields: [true],
        }}
      />
      <div style={{ overflowWrap: 'break-word' }}>
        {contract && contract['erc1155'] && contract['erc1155'].abi.messages[10].method}
      </div>
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
              palletRpc: 'hexSpace',
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
              palletRpc: 'hexSpace',
              callable: 'burnBatch',
              inputParams: [addressesTo],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
      <TransferFrom />
    </Grid.Column>
  )
}
