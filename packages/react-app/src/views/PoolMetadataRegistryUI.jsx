import { Button, Card, DatePicker, Divider, Input, Progress, Select, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";

import { Address, Balance, Events } from "../components";
import { Topic } from "../components/MetadataEvent";
import { foundPoolIds } from "../components/Events";

const { Option } = Select;

export default function PoolMetadataRegistryUI({
  address,
  mainnetProvider,
  localProvider,
  tx,
  readContracts,
  writeContracts,
  contractName,
  eventName,
}) {
  const [newPoolId, setNewPoolId] = useState("loading...");
  const [newTopic, setNewTopic] = useState("loading...");
  const [newContentData, setNewContentData] = useState("loading...");

  const [newTopicFilter, setNewTopicFilter] = useState(Topic[0]);
  const [newPoolIdFilter, setNewPoolIdFilter] = useState(null);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2 style={{fontWeight: "bold"}}>Pool metadata registry control panel</h2>
        <h3>Create metadata</h3>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input placeholder="bytes32 poolId" style={{marginBottom: 3}}
            onChange={e => {
              setNewPoolId(e.target.value);
            }}
          />
          <Input placeholder="uint8 topic" style={{marginBottom: 3}}
            onChange={e => {
              setNewTopic(e.target.value);
            }}
          />
          <Input placeholder="string data" style={{marginBottom: 3}}
            onChange={e => {
              setNewContentData(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              /* look how you call setPurpose on your contract: */
              /* notice how you pass a call back for tx updates too */
              const result = tx(writeContracts.PoolMetadataRegistry.createContent(newPoolId, newTopic, newContentData), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Create content!
          </Button>
        </div>
        <Divider />
        Your Contract Address:
        <Address
          address={readContracts && readContracts.PoolMetadataRegistry ? readContracts.PoolMetadataRegistry.address : null}
          ensProvider={mainnetProvider}
          fontSize={16}
        />
        <Divider />
      </div>

      <Select defaultValue={Topic[0]} style={{ width: 120 }} onChange={setNewTopicFilter}>
        <Option value={Topic[0]}>{Topic[0]}</Option>
        <Option value={Topic[1]}>{Topic[1]}</Option>
        <Option value={Topic[2]}>{Topic[2]}</Option>
        <Option value={Topic[3]}>{Topic[3]}</Option>
      </Select>
      <Select defaultValue={foundPoolIds.length == 0 ? '' : foundPoolIds[0]} style={{ width: 120 }} onChange={setNewPoolIdFilter}>
        {
          foundPoolIds.map((item, i) => {
            return <Option value={i}>{item.substr(0, 5) + "..." + item.substr(-4)}</Option>;
          })
        }
      </Select>
      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName={contractName}
        eventName={eventName}
        localProvider={localProvider}
        startBlock={1}
        topicFilter={newTopicFilter}
        poolIdFilter={newPoolIdFilter}
      />
    </div>
  );
}
