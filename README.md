# nirmaan

yo. i'm [om](https://twitter.com/NotOmRajguru) and i'm building an ai ide.

forked vscode, ripped out the microsoft branding, and started wiring in my own design language (dark, minimal, terminal-y). that's it for now. early as hell.

repo: [omrajguru05/nirmaan](https://github.com/omrajguru05/nirmaan)

## download

install nirmaan from [github releases](https://github.com/omrajguru05/nirmaan/releases):

- **windows (x64)** — `.exe` installer
- **windows (arm64)** — `.exe` installer
- **macos (universal)** — intel and apple silicon

## what exists

- renamed the product to **nirmaan** (app id, protocol, data folder, the whole thing)
- core design tokens live in `src/vs/base/common/nirmaanDesignTokens.ts` — not a theme you can peel off
- near-black ui, `#006efe` accent only where it matters, geist fonts if you've got them installed
- still boots like vscode. because under the hood it still is.

## next (tiny, doable)

- [x] add a real logo / logomark
- [x] ship a custom app icon (windows + mac)
- [ ] welcome / empty state that actually says nirmaan
- [ ] strip leftover "code - oss" / vscode strings from the chrome
- [ ] basic agent chat panel scaffold (nothing fancy yet)

## run it

```bash
git clone https://github.com/omrajguru05/nirmaan.git
cd nirmaan
npm install
npm run watch
./scripts/code.bat   # windows
# ./scripts/code.sh  # mac/linux
```

## notes

upstream is [microsoft/vscode](https://github.com/microsoft/vscode). mit. i'll pull from them when it makes sense.

built in public. follow along on [@NotOmRajguru](https://twitter.com/NotOmRajguru).

wanna reach me: [omrajguru.com/contact](https://omrajguru.com/contact) or connect@omrajguru.com
