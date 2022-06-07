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
            // Only initialize the account if it hasn't already been initialized

            let capability = account.getCapability<&{RichEntitledFuck.RichEntitledFuckCollectionPublic}>(RichEntitledFuck.CollectionPublicPath)

            if(capability == nil) {
              // Create a new empty collection
              let collection <- RichEntitledFuck.createEmptyCollection()
        
              // store the empty REF Collection in account storage
              account.save<@NonFungibleToken.Collection>(<-collection, to: RichEntitledFuck.CollectionStoragePath)

              // create a public capability for the Collection
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
      <div class="control p-5">
        <button class="button is-dark" onClick={initAccount}>Pray for Privilege</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div class="control p-5">
        <button onClick={fcl.logIn} class="button is-dark">Log In</button>
      </div>
    )
  }

  return (
    <div class="refs">
      <Head>
        <title>Rich Entitled Fucks</title>
        <meta name="description" content="Web3 for the truly deserving" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div class="container main">
  
        <section class="section">

          <div class="columns">
              <div class="column">
                <img src="ref_logo.png" width="25%"/>
              </div>
              <div class="column is-one-quarter">
                {user.loggedIn
                  ? <AuthedState />
                  : <UnauthenticatedState />
                }
              </div>
          </div>
        </section>
        <section class="section">
          <div class="columns">
            <div class="column">
              <h1 class="title">Welcome to Rich Entitled Fucks</h1> 
              <p class="is-family-secondary pb-5">REFs is a collection of 100 Rich Entitled Fuck NFTs, 
              unique digital collectibles living on the Flow blockchain.
              Your Rich Entitled Fuck NFT doubles as your Rich Entitled 
              Fuck membership card, and grants you access to members-only 
              benefits.</p>

              <h2 class="title">Exclusive Distribution</h2>
              <p class="is-family-secondary pb-5">Every Rich Entitled Fuck is cheap, but is reserved exclusively for people who already own
              or have been gifted a Rich Entitled Fuck. Membership costs the same for everyone, but you do
              have to deserve it.</p> 

              <h2 class="title">The Specs</h2>
              <p class="is-family-secondary pb-5">Each Rich Entitled Fuck is unique and programatically generated to accurately represent
              homogenously diverse traits found in the breeding pool of the elite in gender as well as 
              skin, eye and hair color. Each Rich Entitled Fuck also comes with fun and possibly rare
              facial accessories to signal your unique identity All Rich Entitled Fucks are rich and entitled,
              but some are rarer than others.</p>

              <p class="is-family-secondary pb-5">
              The fucks are stored on the Flow blockchain and hosted on IPFS. Purchasing a REF costs 1 FLOW. 
              Accessing the members-only area requires Rich Entitled Fucks to be signed into their digital wallet.</p> 
              <h2 class="title">Welcome to the Club</h2>
              <p class="is-family-secondary pb-5">When you buy a Rich Entitled Fuck, you are not simply buying an avatar or a provably rare piece of art.
              You are gaining membership access to a club whose benefits and offerings are immense but will not change much
              over time. Your Rich Entitled Fuck might be able to serve as your digital identity, and possibly open digital doors for you.
              We would rather not give specifics.
            </p>
            </div>

            <div class="column is-one-quarter">
              <img src="ref_32.png" class="image p-5"/>
              <img src="ref_52.png" class="image p-5"/>
            </div>
          </div>
        </section>
      </div>
      <div class="footer has-text-centered">
        Copy, right?
      </div>
  </div>


  )
}
