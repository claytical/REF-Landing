import Head from 'next/head'
import "../flow/config";
import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button } from 'react-bulma-components';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {

  const [user, setUser] = useState({loggedIn: null})
  const [name, setName] = useState('')
  const [transactionStatus, setTransactionStatus] = useState(null) // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), [])


  const initAccount = async () => {
    const transactionId = await fcl.mutate({
      cadence: `
        import NonFungibleToken from 0x1d7e57aa55817448
        import RichEntitledFuck from 0xb71ce4a34453d097


        transaction {
          prepare(account: AuthAccount) {


          let refReceiver = account.getCapability<&{NonFungibleToken.Receiver}>(/public/RichEntitledFuckCollection)
          
            if(!refReceiver.check()) {

              // Create a public Receiver capability to the REF Collection
              account.link<&RichEntitledFuck.Collection{NonFungibleToken.CollectionPublic, RichEntitledFuck.RichEntitledFuckCollectionPublic}>
                   (/public/RichEntitledFuckCollection, target: /storage/RichEntitledFuckCollection)

              account.save<@NonFungibleToken.Collection>(<-RichEntitledFuck.createEmptyCollection(), to: RichEntitledFuck.CollectionStoragePath)

              account.link<&{NonFungibleToken.Receiver}>(RichEntitledFuck.CollectionPublicPath, target: RichEntitledFuck.CollectionStoragePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })

    const transaction = await fcl.tx(transactionId).onceSealed()
    console.log(transaction)
  }

  const AuthedState = () => {
    return (
      <div className="control p-5">
        <button className="button is-dark" onClick={initAccount}>Pray for Privilege</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div className="control p-5">
        <button onClick={fcl.logIn} className="button is-dark">Connect Wallet</button>
      </div>
    )
  }

  return (
    <div className="refs">
      <Head>
        <title>Rich Entitled Fucks</title>
        <meta name="description" content="Web3 for the truly deserving" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container main">
  
        <section className="section">

          <div className="columns">
              <div className="column">
                <img src="ref_logo.png" width="25%"/>
              </div>
              <div className="column is-one-quarter">
                {user.loggedIn
                  ? <AuthedState />
                  : <UnauthenticatedState />
                }
              </div>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column">
              <h1 className="title">Welcome to Rich Entitled Fucks</h1> 
              <p className="is-family-secondary pb-5">REFs is a collection of 100 Rich Entitled Fuck NFTs, 
              unique digital collectibles living on the Flow blockchain.
              Your Rich Entitled Fuck NFT doubles as your Rich Entitled 
              Fuck membership card, and grants you access to members-only 
              benefits.</p>

              <h2 className="title">Exclusive Distribution</h2>
              <p className="is-family-secondary pb-5">Every Rich Entitled Fuck is cheap, but is reserved exclusively for people who already own
              or have been gifted a Rich Entitled Fuck. Membership costs the same for everyone, but you do
              have to deserve it.</p> 

              <h2 className="title">The Specs</h2>
              <p className="is-family-secondary pb-5">Each Rich Entitled Fuck is unique and programatically generated to accurately represent
              homogenously diverse traits found in the breeding pool of the elite in gender as well as 
              skin, eye and hair color. Each Rich Entitled Fuck also comes with fun and possibly rare
              facial accessories to signal your unique identity All Rich Entitled Fucks are rich and entitled,
              but some are rarer than others.</p>

              <p className="is-family-secondary pb-5">
              The fucks are stored on the Flow blockchain and hosted on IPFS. Purchasing a REF costs 1 FLOW. 
              Accessing the members-only area requires Rich Entitled Fucks to be signed into their digital wallet.</p> 
              <h2 className="title">Welcome to the Club</h2>
              <p className="is-family-secondary pb-5">When you buy a Rich Entitled Fuck, you are not simply buying an avatar or a provably rare piece of art.
              You are gaining membership access to a club whose benefits and offerings are immense but will not change much
              over time. Your Rich Entitled Fuck might be able to serve as your digital identity, and possibly open digital doors for you.
              We would rather not give specifics.
            </p>
            </div>

            <div className="column is-one-quarter">
              <img src="ref_32.png" className="image p-5"/>
              <img src="ref_52.png" className="image p-5"/>
            </div>
          </div>
        </section>
      </div>
      <div className="footer has-text-centered">
        Copy, right?
      </div>
  </div>


  )
}
