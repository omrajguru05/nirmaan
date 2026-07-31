/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Nirmaan core design language.
 *
 * Dark-first, terminal-native, and minimal.
 * These tokens are the product defaults — not an optional theme overlay.
 * Prefer importing from here when adding Nirmaan-branded UI surfaces.
 */

export const NirmaanFonts = {
	heading: '"Relative Sans", "Geist", "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
	sans: '"Relative Rounded", "Geist", "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
	mono: '"Relative Mono", "Geist Mono", "Cascadia Code", Consolas, "Courier New", monospace',
	monoMac: '"Relative Mono", "Geist Mono", Menlo, Monaco, "Courier New", monospace',
	monoLinux: '"Relative Mono", "Geist Mono", "Droid Sans Mono", "monospace", monospace',
} as const;

export const NirmaanDark = {
	bg1: '#000000',
	bg2: '#0a0a0a',
	bg3: '#111111',
	border1: '#1a1a1a',
	border2: '#2a2a2a',
	border3: '#3a3a3a',
	text1: '#ededed',
	text2: '#a0a0a0',
	text3: '#666666',
	textDisabled: '#3a3a3a',
	accent: '#006efe',
	accentHover: '#0090ff',
	accentMuted: '#003674',
	success: '#00ac3a',
	error: '#f13242',
	warning: '#ffae00',
	/** Primary CTA fill on dark surfaces */
	buttonPrimaryBg: '#ededed',
	buttonPrimaryFg: '#000000',
	buttonPrimaryHover: '#ffffff',
	whiteA10: '#ffffff12',
	whiteA20: '#ffffff21',
} as const;

export const NirmaanLight = {
	bg1: '#ffffff',
	bg2: '#f9f9f9',
	bg3: '#f4f4f4',
	border1: '#e8e8e8',
	border2: '#d4d4d4',
	border3: '#b4b4b4',
	text1: '#111111',
	text2: '#555555',
	text3: '#999999',
	textDisabled: '#cccccc',
	accent: '#006efe',
	accentHover: '#0057d0',
	accentMuted: '#eaf6ff',
	success: '#009432',
	error: '#e2162a',
	warning: '#ff9300',
	/** Primary CTA fill on light surfaces */
	buttonPrimaryBg: '#111111',
	buttonPrimaryFg: '#ffffff',
	buttonPrimaryHover: '#000000',
} as const;
