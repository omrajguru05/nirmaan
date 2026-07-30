# Nirmaan

**An AI IDE, built in the open.**

Nirmaan is a dark-first, developer-native editor forked from [VS Code](https://github.com/microsoft/vscode) — rebranded and redesigned from the core up. Same editing foundation. New product identity. Built for the agent era.

> Deploy agents like you deploy apps. Write code like the editor was made for it.

**Built by [@NotOmRajguru](https://twitter.com/NotOmRajguru)** · [GitHub](https://github.com/omrajguru05/nirmaan)

---

## What's different

- **Nirmaan, not Code — OSS** — product name, protocol, and install identity are ours
- **Wisp design language** — near-black surfaces (`#000` / `#0a0a0a`), `#ededed` text, accent blue `#006efe` only where it earns it
- **Geist-first typography** — Geist Sans for UI, Geist Mono for the editor
- **Core tokens, not a theme skin** — colors and fonts live in the workbench defaults, not a user theme you can toggle off

```
src/vs/base/common/nirmaanDesignTokens.ts   ← design language source of truth
```

## Status

Early. Public. Shipping in the open.

Star the repo, follow [@NotOmRajguru](https://twitter.com/NotOmRajguru), and watch what we build next.

## Build from source

Same flow as Code — OSS:

```bash
git clone https://github.com/omrajguru05/nirmaan.git
cd nirmaan
npm install
npm run watch
# in another terminal
./scripts/code.sh   # macOS / Linux
./scripts/code.bat  # Windows
```

See [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) for the full VS Code development workflow.

## Upstream

Nirmaan is based on [microsoft/vscode](https://github.com/microsoft/vscode) (MIT).

We keep `upstream` pointed at Microsoft's repo and build product on top. Upstream fixes and features can be merged forward as we go.

## License

Copyright for Microsoft VS Code portions: Microsoft Corporation.  
Nirmaan product branding and design language: Om Rajguru ([@NotOmRajguru](https://twitter.com/NotOmRajguru)).

Licensed under the [MIT](LICENSE.txt) license.
