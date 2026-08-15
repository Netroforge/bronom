# Web3 wallet architecture

Status: design proposal, not implemented
Last reviewed: 2026-08-14

## Decision

Bronom should begin as a secure wallet bridge, not as a new seed-phrase wallet.

The first implementation should expose a standards-compatible provider to websites, keep permissions and review UI in Bronom's trusted shell, and forward signing to a wallet the human already controls through WalletConnect. Agents may inspect, prepare, simulate, explain, and cancel requests from their own tab group. They must never approve a connection, signature, transaction, chain addition, or durable delegation.

This gives agents useful Web3 debugging and transaction-preparation abilities without putting private keys in Bronom or MCP. A local smart-account wallet can be evaluated later, after the provider, approval, simulation, audit, and recovery boundaries are mature.

## Non-negotiable safety properties

- Seed phrases and private keys never enter a website renderer, MCP response, log, screenshot, debug report, clipboard, or ordinary profile file.
- The page-facing provider is treated as adversarial input. Every method, parameter, origin, chain, account, and response is validated and bounded in the main process.
- No signing or broadcast occurs without a fresh, explicit human approval. Navigating to another origin, closing the source tab, changing the request, or timing out invalidates the approval.
- An MCP tab-group ID provides attribution and routing, not wallet authorization. Wallet authority is based on origin, account, chain, method, policy, and human consent.
- `eth_accounts` is empty until the human grants that origin access. Disconnecting an origin immediately emits `accountsChanged` with an empty list.
- Unknown wallet methods fail closed with EIP-1193 error `4200`. Unauthorized methods use `4100`; human rejection uses `4001`.
- Raw `eth_sign` is disabled. Typed signing uses EIP-712 and refuses a domain chain ID that differs from the selected chain.
- Added chains and RPC endpoints require explicit approval, HTTPS, an exact `eth_chainId` match, bounded metadata, and a visible privacy warning.
- If protected OS storage is unavailable, persistent wallet sessions are disabled rather than stored with weak encryption.

These boundaries follow EIP-1193's guidance that the provider contains no private data and remains isolated, rate-limited, and validated even when the page controls its JavaScript object: <https://eips.ethereum.org/EIPS/eip-1193>.

## Recommended first architecture

```text
Untrusted dapp in WebContentsView
  window.ethereum + EIP-6963 announcement
              |
              v
Minimal page provider / dedicated wallet preload
  request(), on(), removeListener()
              |
              v
Typed, sender-checked IPC
              |
              v
Main-process Wallet Broker
  origin binding
  method classifier and limits
  permission store
  pending-request queue
  RPC validation and simulation
  audit metadata
       |                     |
       v                     v
Trusted Bronom review UI     External wallet adapter
human approve/reject         WalletConnect first
```

The website `WebContentsView` remains sandboxed with Node integration disabled and context isolation enabled. A dedicated wallet preload exposes only the small EIP-1193 surface; it must not expose raw `ipcRenderer` or a generic `send` method. Electron explicitly recommends narrow, argument-filtered bridge methods for untrusted remote content: <https://www.electronjs.org/docs/latest/tutorial/context-isolation> and <https://www.electronjs.org/docs/latest/tutorial/security>.

The provider should announce itself through EIP-6963 and retain `window.ethereum` only as a legacy fallback. EIP-6963 avoids collisions between injected providers and defines the `eip6963:announceProvider` / `eip6963:requestProvider` lifecycle: <https://eips.ethereum.org/EIPS/eip-6963>.

Do not depend on installing MetaMask or another Chrome Web Store extension inside Electron. Electron supports only a subset of extension APIs, only unpacked extensions, and explicitly does not promise arbitrary Chrome-extension compatibility: <https://www.electronjs.org/docs/latest/api/extensions>.

## Wallet adapters

### Phase-one adapter: external wallet

Use WalletConnect App SDK / Universal Connector so Bronom acts as the application-side client and relays approved requests to an existing wallet. It supports an EIP-1193-style provider and broad wallet compatibility, but requires a WalletConnect project ID and origin allowlist: <https://docs.walletconnect.network/app-sdk/javascript/installation>.

Store WalletConnect session secrets only through Bronom's existing `safeStorage`-backed encrypted-vault pattern. Persist non-secret metadata separately:

- adapter type;
- account addresses approved for display;
- CAIP-10 account identifiers;
- chain IDs;
- origin permissions;
- connection timestamps and revocation state.

### Later adapters

1. Hardware or native desktop wallet transports, each behind the same broker interface.
2. Watch-only accounts for balances, transaction construction, and simulation without signing.
3. Smart accounts with narrowly bounded execution permissions.
4. Local EOA custody only after an independent threat model, recovery design, external security review, platform code signing, and explicit product decision. It should not be the default.

## Permission model

Permissions are global browser-profile state because cookies, origins, and wallet connections are global. Each permission is keyed by:

```text
(origin, wallet adapter, account, chain, capability)
```

The tab ID and group ID are recorded as request provenance but do not grant authority. Two agent groups visiting the same origin may observe the same already-connected account, just as they share that origin's cookies; every signing request still receives its own human review.

Implement `wallet_getPermissions` and `wallet_requestPermissions` with origin-bound caveats based on EIP-2255: <https://eips.ethereum.org/EIPS/eip-2255>. The initial capabilities should be limited to:

- view one or more selected accounts;
- use one or more selected chains;
- request a transaction review;
- request `personal_sign` review;
- request `eth_signTypedData_v4` review.

Permission approval never means silent signing. It only allows the origin to place a bounded request in the review queue.

## Request classification

| Class | Examples | Default handling |
| --- | --- | --- |
| Local provider state | `eth_chainId`, permitted `eth_accounts` | Return bounded broker state |
| Read-only RPC | balances, blocks, receipts, `eth_call`, gas estimation | Forward to the configured HTTPS RPC with rate and response limits |
| Connection / permissions | `eth_requestAccounts`, `wallet_requestPermissions` | Trusted human approval |
| Chain changes | `wallet_switchEthereumChain`, `wallet_addEthereumChain` | Trusted human approval and chain/RPC validation |
| Signatures | `personal_sign`, `eth_signTypedData_v4` | Decode, simulate where possible, then trusted human approval in the external wallet |
| Transactions | `eth_sendTransaction`, `wallet_sendCalls` | Normalize, simulate, explain, then trusted human approval |
| Dangerous / ambiguous | `eth_sign`, unknown methods, malformed requests | Reject by default |

EIP-712 makes typed data inspectable but does not provide replay protection by itself. The review UI must show the domain, chain, verifying contract, primary type, and all meaningful values; it must reject an active-chain mismatch: <https://eips.ethereum.org/EIPS/eip-712>.

For `wallet_addEthereumChain`, independently verify that each HTTPS RPC reports the requested chain ID and never trust requester-provided icons or metadata as authority. EIP-3085 explicitly calls out malicious endpoints, privacy leakage, metadata validation, and explicit consent: <https://eips.ethereum.org/EIPS/eip-3085>.

## Trusted review UI

Add a global wallet pill to the top application toolbar, beside the profile and MCP status. It opens a right-docked Wallet Center by default and can use the existing left/top/bottom/separate-window placement system for management views.

Signing approval itself must be a trusted, non-page surface that cannot be covered by the website. It shows:

- requesting origin, tab title, and tab group;
- wallet, account, chain, and network RPC;
- action type in plain language;
- native value and estimated fees;
- decoded contract method and arguments when known;
- token/NFT transfers, approvals, operator grants, and unlimited allowances;
- simulation result and state changes, with a clear warning when simulation is incomplete;
- exact typed-message domain and fields;
- **Reject** and a deliberate hold-to-confirm or second-step **Approve in wallet** action.

Only one request is actively reviewable at a time. Other requests queue visibly with origin and group labels. Requests expire after a short bounded interval and never merge, auto-repeat, or inherit approval from an earlier request.

## Simulation and RPC privacy

The MVP can provide deterministic baseline checks with the selected RPC:

- `eth_call` at the latest block;
- `eth_estimateGas`;
- nonce, balance, fee, chain-ID, and contract-code checks;
- ABI decoding from local/user-approved metadata;
- common ERC-20/ERC-721/ERC-1155 transfer and approval warnings.

This is not a guarantee that execution is safe or that state will remain unchanged. The UI must say whether simulation succeeded, reverted, was unsupported, or used incomplete metadata. Third-party simulation or phishing services may be offered later as explicit opt-ins because they reveal origin, account, calldata, IP address, and behavioral metadata.

## MCP contract

Wallet tools should be a separate `Wallet` category and remain group-scoped:

- `browser_wallet_status`: connected adapter, permitted public accounts/chains, and pending count for the caller's group.
- `browser_wallet_requests`: sanitized pending/completed request metadata from the caller's group.
- `browser_wallet_simulate`: simulate a bounded transaction draft without signing or broadcasting.
- `browser_wallet_propose`: place a normalized transaction or typed-message draft in the human review queue.
- `browser_wallet_cancel`: cancel a still-pending request created from the caller's group.
- `browser_request_user_attention`: continue to notify the human that wallet review is required.

There must be no MCP `approve`, `sign`, `export`, `seed`, `private_key`, or unrestricted raw-RPC tool. MCP responses never return WalletConnect session secrets, encrypted vault contents, recovery material, or unredacted sensitive signing payloads. A signature produced after human approval goes only to the requesting website/provider flow; MCP receives status and transaction hash when applicable.

## Persistence and clearing

Use separate stores:

- `wallet-connections.json`: encrypted session material through OS secure storage;
- `wallet-permissions.json`: origin/account/chain capability metadata;
- `wallet-activity.jsonl`: bounded, metadata-only audit events without signatures or full calldata/message bodies.

Clearing ordinary site data does not silently destroy wallet recovery/session state. Privacy & data should list wallet connections and origin permissions per website, with explicit **Disconnect wallet** and **Forget wallet permissions** actions. **Clear all** must enumerate wallet effects before confirmation.

## Failure and race handling

- Bind every request to the source `webContents` ID, tab ID, origin, top-level frame, navigation generation, and group ID.
- Reject subframe signing and connection requests in the MVP.
- Re-check the current top-level origin immediately before approval and immediately before returning a result.
- Reject when the tab navigates, closes, crashes, changes group, or loses its matching request generation.
- Deduplicate only exact transport retries with a short-lived request ID; never deduplicate based solely on calldata.
- Rate-limit per origin and globally. Cap parameters, nested typed-data depth, arrays, strings, calldata, ABI metadata, and response sizes.
- Pause new MCP commands for the source group while the human approval surface is active, matching Bronom's saved-password safety pattern.

## Delivery phases

### Phase 0 — security spike

- Prototype an EIP-1193/EIP-6963 provider in a sandboxed test `WebContentsView`.
- Prove request/event behavior before application scripts run.
- Threat-model page, preload, main-process, WalletConnect, RPC, logging, and MCP boundaries.
- Add hostile-page tests for prototype tampering, forged origins, oversized payloads, navigation races, iframe requests, and request floods.

Exit criterion: a reviewed provider bridge with no signing implementation.

### Phase 1 — external wallet MVP

- WalletConnect external-wallet pairing.
- Origin-scoped account connection and disconnect.
- Read-only RPC and chain state.
- Human-reviewed `personal_sign`, EIP-712 signing, and EVM transactions.
- Global Wallet Center and per-site wallet controls.
- No agent-created transaction proposals yet.

Exit criterion: common EVM dapps connect and sign only after trustworthy human review.

### Phase 2 — agent workflow

- Group-scoped status, pending-request inspection, simulation, proposal, cancellation, and attention tools.
- Security-filtered debug report integration.
- Test dapp plus malicious-dapp fixtures in Docker headless CI; approval paths use deterministic test adapters, never real keys.

Exit criterion: an agent can diagnose and prepare a Web3 flow but cannot approve or extract signing authority.

### Phase 3 — stronger transaction understanding

- Verified ABI/contract metadata.
- Token allowance and operator warnings.
- Optional third-party simulation/reputation adapters with privacy disclosure.
- Batch calls and account-abstraction compatibility.

### Phase 4 — bounded delegation research

Evaluate smart-account execution permissions only after the earlier phases are stable. ERC-7715 defines chain-specific permissions with adjustable scopes and expiry rules, and warns that wallets must correctly enforce limited permissions and clearly present phishing risk: <https://eips.ethereum.org/EIPS/eip-7715>.

Any delegated agent authority must include at minimum:

- explicit account and chain;
- contract and method allowlists;
- per-transaction and cumulative value limits;
- token-specific allowances;
- short expiry;
- human-visible revocation;
- immutable audit trail;
- automatic rejection outside the exact policy.

Delegation is not part of the MVP and must never be inferred from a tab group, MCP connection, or previous approval.

## Test strategy

- Unit tests for method classification, EIP-1193 errors, chain validation, permission matching, expiry, normalization, redaction, rate limits, and request invalidation.
- Contract tests against a local deterministic EVM node and a purpose-built dapp fixture.
- Malicious fixtures for cross-origin navigation, iframes, popup races, duplicate IDs, prototype mutation, massive typed data, phishing chain metadata, and delayed replies.
- Integration tests with an in-process fake wallet adapter; no CI secret or funded key.
- Docker/Xvfb Electron tests for provider discovery, connect/reject, review visibility, group attribution, restart, disconnect, and clearing permissions.
- Manual interoperability matrix for ethers, viem/wagmi, EIP-6963 selectors, WalletConnect-compatible wallets, and representative dapps on testnets.
- Independent security review before enabling mainnet signing by default.

## Product decisions still required

1. EVM-only MVP or a chain-neutral CAIP data model from day one. Recommendation: EVM UI first, CAIP-compatible internal identifiers.
2. Bronom-operated WalletConnect project ID versus user-supplied ID. Recommendation: Bronom-operated ID for usability, with an advanced override and documented metadata exposure.
3. Which RPC endpoints ship by default and what telemetry/privacy terms apply. Recommendation: a very small audited list plus custom HTTPS endpoints.
4. Whether a human may persist account access per origin or must reconnect every launch. Recommendation: persist encrypted sessions but make origin permissions reviewable and revocable.
5. Whether agent proposals launch in Phase 1 or Phase 2. Recommendation: Phase 2, after human dapp flows and request invalidation are proven.
