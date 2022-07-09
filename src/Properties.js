import React, { useEffect, useState } from 'react'
import { Table, Grid, Button, Input, Label } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'
import MaxSupply from './MaxSupply'
import BatchTransferFrom from './BatchTransferFrom'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const { contract, currentAccount } = useSubstrateState()
  const [info, setInfo] = useState({
    name: '',
    image: '',
    maxSupply: 2022,
    properties: {},
  })
  const [formState, setFormState] = useState({ key: '', value: '' })
  const [previousAddress, setPreviousAddress] = useState('')
  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))
  const onChangeInfo = (_, data) =>
    setInfo(prev => ({ ...prev, [data.state]: data.value }))

  const { key, value } = formState
  const { name, image, maxSupply, properties } = info
  useEffect(() => {
    let unsub = null

    const asyncFetch = async () => {
      if (
        currentAccount == null ||
        currentAccount.address === previousAddress
      ) {
        return
      }
      let { output } = await contract['hexSpace'].query['info'](
        currentAccount.address,
        {
          value: 0,
          gasLimit: -1,
        },
        currentAccount.address
      )
      let _info = JSON.parse(output.toString())
      _info.properties =
        _info.properties === '' || _info.properties.length === 0
          ? {}
          : JSON.parse(_info.properties)
      setInfo(prev => ({ ...prev, ..._info }))
      setPreviousAddress(currentAccount.address)
    }

    asyncFetch()

    return () => {
      unsub && unsub()
    }
  }, [
    contract,
    currentAccount,
    info,
    setInfo,
    previousAddress,
    setPreviousAddress,
  ])
  const addExtraInfo = () => {
    let p = properties
    p[key] = value
    setInfo(prev => ({ ...prev, properties: p }))
    setStatus(JSON.stringify(p))
  }
  const removeExtraInfo = key2 => {
    let p = properties
    delete p[key2]
    setInfo(prev => ({ ...prev, properties: p }))
    setStatus(JSON.stringify(p))
  }
  return (
    <Grid.Column>
      <h1>Base Info</h1>
      <Input
        placeholder="name"
        fluid
        type="text"
        label="name"
        state="name"
        value={name}
        onChange={onChangeInfo}
      />
      <Input
        placeholder="image"
        fluid
        type="text"
        label="image"
        state="image"
        value={image}
        onChange={onChangeInfo}
      />
      <h1>Properties</h1>
      {Object.keys(properties).length === 0 ? (
        <Label basic color="yellow">
          No properties to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Key</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Value</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Value</strong>
              </Table.Cell>
            </Table.Row>
            {Object.keys(properties).map(property => (
              <Table.Row key={property}>
                <Table.Cell width={3} textAlign="right">
                  {property}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {properties && properties[property] && properties[property]}
                  </span>
                </Table.Cell>
                <Table.Cell width={10}>
                  {' '}
                  <Button
                    basic
                    circular
                    label="Remove"
                    size="mini"
                    color="grey"
                    floated="right"
                    onClick={() => removeExtraInfo(property)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <Input
        placeholder="key"
        fluid
        type="text"
        label="key"
        state="key"
        onChange={onChange}
      />
      <Input
        placeholder="value"
        fluid
        type="text"
        label="value"
        state="value"
        onChange={onChange}
      />

      <Button
        key={2}
        basic
        circular
        label="Add"
        size="mini"
        color="grey"
        floated="right"
        onClick={addExtraInfo}
      />
      <TxButton
        label="Save on chain"
        type="SIGNED-TXC"
        setStatus={setStatus}
        attrs={{
          palletRpc: 'hexSpace',
          callable: 'setInfo',
          inputParams: [name, image, JSON.stringify(properties)],
          paramFields: [true, true, true],
        }}
      />
      <MaxSupply maxSupply={maxSupply} />
      <div style={{ hidden: 'hidden', overflowWrap: 'break-word' }}>
        {status}
      </div>
      <BatchTransferFrom />
    </Grid.Column>
  )
}
