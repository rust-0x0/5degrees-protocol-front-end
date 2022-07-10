import React, { useEffect, useState } from 'react'
import { Table, Grid, Label, Image } from 'semantic-ui-react'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [previousAddress, setPreviousAddress] = useState('')
  const { api, keyring, contract, currentAccount } = useSubstrateState()
  const accounts = keyring.getPairs()
  const [followings, setFollowings] = useState([])

  useEffect(() => {
    let unsub = null

    const asyncFetch = async () => {
      let followingsMap = []
      if (currentAccount == null||contract==null) {
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
          let {unsubs, output } = await contract['hexSpace'].query['balanceOf'](
            currentAccount.address,
            { value: 0, gasLimit: -1 },
            currentAccount.address,
            account.address
          )
          unsub=unsubs
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
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Grid.Column>
  )
}
