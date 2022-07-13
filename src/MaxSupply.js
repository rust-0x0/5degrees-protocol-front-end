import React, { useState } from 'react'
import { Form, Input, Button, Grid } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'

export default function Main(props) {
  const { maxSupply } = props
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ newMax: '' })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { newMax } = formState

  //   const { currentAccount } = useSubstrateState()
  return (
    <Grid.Column width={8}>
      <h1>MaxSupply</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label="MaxSupply"
            type="text"
            placeholder="MaxSupply"
            value={maxSupply}
            state="newMax"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button.Group>
            <TxButton
              label="Increase Max Supply"
              type="SIGNED-TXC"
              setStatus={setStatus}
              attrs={{
                palletRpc: 'hexSpace',
                callable: 'increaseMaxSupply',
                inputParams: [newMax],
                paramFields: [true],
              }}
            />
            <Button.Or />
            <TxButton
              label="Decrease Max Supply"
              type="SIGNED-TXC"
              setStatus={setStatus}
              attrs={{
                palletRpc: 'hexSpace',
                callable: 'decreaseMaxSupply',
                inputParams: [newMax],
                paramFields: [true],
              }}
            />
          </Button.Group>
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
