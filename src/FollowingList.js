import React, { useEffect, useState } from 'react'
import { Table, Grid, Label, Image, Button } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [previousAddress, setPreviousAddress] = useState('')
  const { api, keyring, contract, currentAccount } = useSubstrateState()
  const accounts = keyring.getPairs()
  const [followings, setFollowings] = useState([])
  const txResHandler = ({ status }) =>
    status.isFinalized
      ? console.log(
          `😉Transaction Block hash: ${status.asFinalized.toString()}`
        )
      : console.log(`Transaction status: ${status.type}`)

  const txErrHandler = err =>
    console.log(`😞 Transaction Failed: ${err.toString()}`)

  const initTestData = async accounts => {
    let i = 0
    let images = [
      '309789.svg',
      '637488.png',
      '265806.svg',
      '1173886.svg',
      '1579748.svg',
      '1491444.svg',
      '1973525.svg',
      '1526764.svg',
      '1296788.svg',
    ]
    for (let account of accounts) {
      console.log(account)
      setStatus(`Current contract transaction status`)
      let image =
        'https://img.cryptokitties.co/0x06012c8cf97bead5deae237070f9587f8e7a266d/' +
        images[i]
      i++
      let properties = ''
      let callable = 'setInfo'
      let palletRpc = 'hexSpace'
      let paras = [account.meta.name, image, properties]
      try {
        const { gasRequired } = await contract[palletRpc].query[callable](
          account.address,
          { value: 0, gasLimit: -1 },
          ...paras
        )
        let gas = gasRequired.addn(1)
        // setStatus(`Current gas status: ${gas}`)
        const { hash } = await contract[palletRpc].tx[callable](
          { value: 0, gasLimit: gas },
          ...paras
        )
          .signAndSend(account, txResHandler)
          .catch(txErrHandler)
        console.log(hash)
      } catch (e) {
        console.error(e)
      }
    }
  }
  useEffect(() => {
    let unsub = null
    const asyncFetch = async () => {
      let followingsMap = []
      if (currentAccount == null || contract == null) {
        return
      }
      for (let account of accounts) {
        if (account.address === currentAccount.address) {
          continue
        }
        let { output } = await contract['hexSpace'].query['baseInfo'](
          currentAccount.address,
          { value: 0, gasLimit: -1 },
          account.address
        )
        let name = output[0]
        let image = output[1]
        let followed = false
        {
          let { unsubs, output } = await contract['hexSpace'].query[
            'balanceOf'
          ](
            currentAccount.address,
            { value: 0, gasLimit: -1 },
            currentAccount.address,
            account.address
          )
          unsub = unsubs
          followed = Number(output.toString()) > Number(0)
        }
        followingsMap.push({
          address: account.address,
          name: name,
          image: image,
          following: followed,
        })
      }
      setFollowings(followingsMap)
      setPreviousAddress(currentAccount.address)
    }

    asyncFetch()

    return () => {
      unsub && unsub()
    }
  }, [
    api,
    accounts,
    contract,
    currentAccount,
    previousAddress,
    setPreviousAddress,
    setFollowings,
  ])
  const initInfo = async () => {
    await initTestData(accounts)
  }
  return (
    <Grid.Column>
      <h1>Followings</h1>
      {followings.length === 0 ? (
        <Label basic color="yellow">
          No followings to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Name</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="right">
                <strong>Image</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Action</strong>
              </Table.Cell>
            </Table.Row>
            {followings.map(account => (
              <Table.Row key={account.address}>
                <Table.Cell width={3} textAlign="right">
                  {account.name}
                </Table.Cell>
                <Table.Cell width={3} textAlign="right">
                  <Image src={account.image} size="mini" />
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {account.address}
                  </span>
                </Table.Cell>
                <Table.Cell width={10}>
                  {!account['following'] ? (
                    <TxButton
                      label="Follow"
                      type="SIGNED-TXC"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'hexSpace',
                        callable: 'mint',
                        inputParams: [account.address],
                        paramFields: [true],
                      }}
                    />
                  ) : (
                    <TxButton
                      label="Unfollow"
                      type="SIGNED-TXC"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'hexSpace',
                        callable: 'burn',
                        inputParams: [account.address],
                        paramFields: [true],
                      }}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <Button
        basic
        circular
        label="InitNFTProfileimagesForTestAccountsOnDevMode"
        size="mini"
        color="grey"
        floated="right"
        onClick={async () => await initInfo()}
      />
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Grid.Column>
  )
}
