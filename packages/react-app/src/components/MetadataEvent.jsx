import { Button, Skeleton, Typography } from "antd";
import React, { useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";

// changed value={address} to address={address}

const { Text } = Typography;

/** 
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <MetadataEvent
    txHash={txHash}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
**/

const blockExplorerLink = (txHash, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}tx/${txHash}`;
export const Topic = ['Tokenomics', 'Performance', 'General', 'Support'];

export function MetadataEvent(props) {
  const [commentSectionActive, setCommentSectionActive] = useState(false);

  const { currentTheme } = useThemeSwitcher();
  const txHash = props.value || props.txHash;
  const etherscanLink = blockExplorerLink(txHash, props.blockExplorer);
  let displayTxHash = txHash?.substr(0, 5) + "..." + txHash?.substr(-4);

  if (!txHash) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }
  const commentSection = commentSectionActive ? <h2>Comment Section</h2> : <div></div>;

  return (
    <div style={{width: "100%"}}>
      <span style={{ verticalAlign: "middle", innerWidth: "100%"}}>
        <div style={{display: "table-cell"}}>
          <div style={{display: "flex"}}>
            <a
              style={{ color: currentTheme === "light" ? "#222222" : "#ddd" }}
              target="_blank"
              href={etherscanLink}
              rel="noopener noreferrer"
            >
              <Blockies seed={txHash.toLowerCase()} size={8} scale={2} />
            </a>
            <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>
              {'[' + Topic[props.topic] + '] '}
            </div>
          </div>
        </div>
        <div>
          {props.data}
        </div>
      </span>
      <Button onClick={() => setCommentSectionActive(!commentSectionActive)}>
        Comment
      </Button>
      {commentSection}
    </div>
  );
}
