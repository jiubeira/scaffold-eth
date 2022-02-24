import { Button, List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";

import { MetadataEvent, Topic } from "./MetadataEvent";

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export let foundPoolIds = [];
export function fillPoolIds(events) {
  foundPoolIds = events.map((event) => {
    return event.args.poolId;
  });
}

export default function Events({ contracts, contractName, eventName, localProvider, startBlock, topicFilter, poolIdFilter }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);
  fillPoolIds(events);

  let filteredEvents = events.filter((event) => {
    return Topic[event.args.topic] == topicFilter;
  });

  if (poolIdFilter != null) {
    filteredEvents = filteredEvents.filter((event) => {
      return foundPoolIds[poolIdFilter] == event.args.poolId;
    });
  }

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Events:</h2>
      <List
        bordered
        dataSource={filteredEvents}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
              <MetadataEvent txHash={item.transactionHash} fontSize={16} blockExplorer="https://kovan.etherscan.io/"
                  data={item.args.data} topic={item.args.topic} id={item.args.id}/>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
