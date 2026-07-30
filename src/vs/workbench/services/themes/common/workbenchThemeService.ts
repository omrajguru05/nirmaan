/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Event } from '../../../../base/common/event.js';
import { Color } from '../../../../base/common/color.js';
import { IColorTheme, IThemeService, IFileIconTheme, IProductIconTheme } from '../../../../platform/theme/common/themeService.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { isBoolean, isString } from '../../../../base/common/types.js';
import { IconContribution, IconDefinition } from '../../../../platform/theme/common/iconRegistry.js';
import { ColorScheme, ThemeTypeSelector } from '../../../../platform/theme/common/theme.js';

export const IWorkbenchThemeService = refineServiceDecorator<IThemeService, IWorkbenchThemeService>(IThemeService);

export const THEME_SCOPE_OPEN_PAREN = '[';
export const THEME_SCOPE_CLOSE_PAREN = ']';
export const THEME_SCOPE_WILDCARD = '*';

export const themeScopeRegex = /\[(.+?)\]/g;

export enum ThemeSettings {
	COLOR_THEME = 'workbench.colorTheme',
	FILE_ICON_THEME = 'workbench.iconTheme',
	PRODUCT_ICON_THEME = 'workbench.productIconTheme',
	COLOR_CUSTOMIZATIONS = 'workbench.colorCustomizations',
	TOKEN_COLOR_CUSTOMIZATIONS = 'editor.tokenColorCustomizations',
	SEMANTIC_TOKEN_COLOR_CUSTOMIZATIONS = 'editor.semanticTokenColorCustomizations',

	PREFERRED_DARK_THEME = 'workbench.preferredDarkColorTheme',
	PREFERRED_LIGHT_THEME = 'workbench.preferredLightColorTheme',
	PREFERRED_HC_DARK_THEME = 'workbench.preferredHighContrastColorTheme', /* id kept for compatibility reasons */
	PREFERRED_HC_LIGHT_THEME = 'workbench.preferredHighContrastLightColorTheme',
	DETECT_COLOR_SCHEME = 'window.autoDetectColorScheme',
	DETECT_HC = 'window.autoDetectHighContrast',

	SYSTEM_COLOR_THEME = 'window.systemColorTheme'
}

export enum ThemeSettingDefaults {
	COLOR_THEME_DARK = 'Default Dark Modern',
	COLOR_THEME_LIGHT = 'Default Light Modern',
	COLOR_THEME_HC_DARK = 'Default High Contrast',
	COLOR_THEME_HC_LIGHT = 'Default High Contrast Light',

	COLOR_THEME_DARK_OLD = 'Default Dark+',
	COLOR_THEME_LIGHT_OLD = 'Default Light+',

	FILE_ICON_THEME = 'vs-seti',
	PRODUCT_ICON_THEME = 'Default',
}

export const COLOR_THEME_DARK_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#111111',
	'activityBar.activeBorder': '#006efe',
	'activityBar.background': '#000000',
	'activityBar.border': '#1a1a1a',
	'activityBar.foreground': '#ededed',
	'activityBar.inactiveForeground': '#666666',
	'activityBarBadge.background': '#006efe',
	'activityBarBadge.foreground': '#ededed',
	'badge.background': '#3a3a3a',
	'badge.foreground': '#ededed',
	'button.background': '#ededed',
	'button.border': '#FFFFFF12',
	'button.foreground': '#000000',
	'button.hoverBackground': '#ffffff',
	'button.secondaryBackground': '#111111',
	'button.secondaryForeground': '#ededed',
	'button.secondaryHoverBackground': '#1a1a1a',
	'chat.slashCommandBackground': '#00367466',
	'chat.slashCommandForeground': '#0090ff',
	'chat.editedFileForeground': '#ffae00',
	'checkbox.background': '#111111',
	'checkbox.border': '#2a2a2a',
	'debugToolBar.background': '#000000',
	'descriptionForeground': '#a0a0a0',
	'dropdown.background': '#111111',
	'dropdown.border': '#2a2a2a',
	'dropdown.foreground': '#ededed',
	'dropdown.listBackground': '#0a0a0a',
	'editor.background': '#0a0a0a',
	'editor.findMatchBackground': '#ffae0066',
	'editor.foreground': '#ededed',
	'editor.inactiveSelectionBackground': '#111111',
	'editor.selectionHighlightBackground': '#006efe26',
	'editorGroup.border': '#1a1a1a',
	'editorGroupHeader.tabsBackground': '#000000',
	'editorGroupHeader.tabsBorder': '#1a1a1a',
	'editorGutter.addedBackground': '#00ac3a',
	'editorGutter.deletedBackground': '#f13242',
	'editorGutter.modifiedBackground': '#006efe',
	'editorIndentGuide.activeBackground1': '#3a3a3a',
	'editorIndentGuide.background1': '#1a1a1a',
	'editorLineNumber.activeForeground': '#ededed',
	'editorLineNumber.foreground': '#666666',
	'editorOverviewRuler.border': '#000000',
	'editorWidget.background': '#111111',
	'errorForeground': '#f13242',
	'focusBorder': '#006efe',
	'foreground': '#ededed',
	'icon.foreground': '#ededed',
	'input.background': '#111111',
	'input.border': '#2a2a2a',
	'input.foreground': '#ededed',
	'input.placeholderForeground': '#666666',
	'inputOption.activeBackground': '#006efe66',
	'inputOption.activeBorder': '#006efe',
	'keybindingLabel.foreground': '#ededed',
	'list.activeSelectionIconForeground': '#ededed',
	'list.dropBackground': '#003674',
	'menu.background': '#0a0a0a',
	'menu.border': '#2a2a2a',
	'menu.foreground': '#ededed',
	'menu.selectionBackground': '#006efe',
	'menu.separatorBackground': '#1a1a1a',
	'notificationCenterHeader.background': '#0a0a0a',
	'notificationCenterHeader.foreground': '#ededed',
	'notifications.background': '#0a0a0a',
	'notifications.border': '#1a1a1a',
	'notifications.foreground': '#ededed',
	'panel.background': '#000000',
	'panel.border': '#1a1a1a',
	'panelInput.border': '#1a1a1a',
	'panelTitle.activeBorder': '#006efe',
	'panelTitle.activeForeground': '#ededed',
	'panelTitle.inactiveForeground': '#a0a0a0',
	'peekViewEditor.background': '#0a0a0a',
	'peekViewEditor.matchHighlightBackground': '#ffae0066',
	'peekViewResult.background': '#0a0a0a',
	'peekViewResult.matchHighlightBackground': '#ffae0066',
	'pickerGroup.border': '#2a2a2a',
	'ports.iconRunningProcessForeground': '#00ac3a',
	'progressBar.background': '#006efe',
	'quickInput.background': '#0a0a0a',
	'quickInput.foreground': '#ededed',
	'settings.dropdownBackground': '#111111',
	'settings.dropdownBorder': '#2a2a2a',
	'settings.headerForeground': '#ededed',
	'settings.modifiedItemIndicator': '#006efe',
	'sideBar.background': '#000000',
	'sideBar.border': '#1a1a1a',
	'sideBar.foreground': '#ededed',
	'sideBarSectionHeader.background': '#000000',
	'sideBarSectionHeader.border': '#1a1a1a',
	'sideBarSectionHeader.foreground': '#ededed',
	'sideBarTitle.foreground': '#ededed',
	'statusBar.background': '#000000',
	'statusBar.border': '#1a1a1a',
	'statusBar.debuggingBackground': '#006efe',
	'statusBar.debuggingForeground': '#ededed',
	'statusBar.focusBorder': '#006efe',
	'statusBar.foreground': '#ededed',
	'statusBar.noFolderBackground': '#0a0a0a',
	'statusBarItem.focusBorder': '#006efe',
	'statusBarItem.prominentBackground': '#3a3a3a66',
	'statusBarItem.remoteBackground': '#006efe',
	'statusBarItem.remoteForeground': '#ededed',
	'tab.activeBackground': '#0a0a0a',
	'tab.activeBorder': '#0a0a0a',
	'tab.activeBorderTop': '#006efe',
	'tab.activeForeground': '#ededed',
	'tab.border': '#1a1a1a',
	'tab.hoverBackground': '#0a0a0a',
	'tab.inactiveBackground': '#000000',
	'tab.inactiveForeground': '#a0a0a0',
	'tab.lastPinnedBorder': '#2a2a2a',
	'tab.selectedBackground': '#111111',
	'tab.selectedBorderTop': '#0090ff',
	'tab.selectedForeground': '#edededa0',
	'tab.unfocusedActiveBorder': '#0a0a0a',
	'tab.unfocusedActiveBorderTop': '#1a1a1a',
	'tab.unfocusedHoverBackground': '#0a0a0a',
	'terminal.foreground': '#ededed',
	'terminal.inactiveSelectionBackground': '#111111',
	'terminal.tab.activeBorder': '#006efe',
	'textBlockQuote.background': '#111111',
	'textBlockQuote.border': '#2a2a2a',
	'textCodeBlock.background': '#0a0a0a',
	'textLink.activeForeground': '#0090ff',
	'textLink.foreground': '#006efe',
	'textPreformat.background': '#3a3a3a',
	'textPreformat.foreground': '#ededed',
	'textSeparator.foreground': '#1a1a1a',
	'titleBar.activeBackground': '#000000',
	'titleBar.activeForeground': '#ededed',
	'titleBar.border': '#1a1a1a',
	'titleBar.inactiveBackground': '#0a0a0a',
	'titleBar.inactiveForeground': '#a0a0a0',
	'welcomePage.progress.foreground': '#006efe',
	'welcomePage.tileBackground': '#111111',
	'widget.border': '#2a2a2a'
};

export const COLOR_THEME_LIGHT_INITIAL_COLORS = {
	'actionBar.toggledBackground': '#e8e8e8',
	'activityBar.activeBorder': '#006efe',
	'activityBar.background': '#f9f9f9',
	'activityBar.border': '#e8e8e8',
	'activityBar.foreground': '#111111',
	'activityBar.inactiveForeground': '#999999',
	'activityBarBadge.background': '#006efe',
	'activityBarBadge.foreground': '#FFFFFF',
	'badge.background': '#d4d4d4',
	'badge.foreground': '#111111',
	'button.background': '#111111',
	'button.border': '#0000001a',
	'button.foreground': '#FFFFFF',
	'button.hoverBackground': '#000000',
	'button.secondaryBackground': '#f4f4f4',
	'button.secondaryForeground': '#111111',
	'button.secondaryHoverBackground': '#e8e8e8',
	'chat.slashCommandBackground': '#eaf6ff',
	'chat.slashCommandForeground': '#0057d0',
	'chat.editedFileForeground': '#ff9300',
	'checkbox.background': '#FFFFFF',
	'checkbox.border': '#d4d4d4',
	'descriptionForeground': '#555555',
	'diffEditor.unchangedRegionBackground': '#f9f9f9',
	'dropdown.background': '#FFFFFF',
	'dropdown.border': '#d4d4d4',
	'dropdown.foreground': '#111111',
	'dropdown.listBackground': '#FFFFFF',
	'editor.background': '#FFFFFF',
	'editor.foreground': '#111111',
	'editor.inactiveSelectionBackground': '#eaf6ff',
	'editor.selectionHighlightBackground': '#006efe26',
	'editorGroup.border': '#e8e8e8',
	'editorGroupHeader.tabsBackground': '#f9f9f9',
	'editorGroupHeader.tabsBorder': '#e8e8e8',
	'editorGutter.addedBackground': '#009432',
	'editorGutter.deletedBackground': '#e2162a',
	'editorGutter.modifiedBackground': '#006efe',
	'editorIndentGuide.activeBackground1': '#b4b4b4',
	'editorIndentGuide.background1': '#d4d4d4',
	'editorLineNumber.activeForeground': '#111111',
	'editorLineNumber.foreground': '#999999',
	'editorOverviewRuler.border': '#e8e8e8',
	'editorSuggestWidget.background': '#f9f9f9',
	'editorWidget.background': '#f9f9f9',
	'errorForeground': '#e2162a',
	'focusBorder': '#006efe',
	'foreground': '#111111',
	'icon.foreground': '#555555',
	'input.background': '#FFFFFF',
	'input.border': '#d4d4d4',
	'input.foreground': '#111111',
	'input.placeholderForeground': '#999999',
	'inputOption.activeBackground': '#eaf6ff',
	'inputOption.activeBorder': '#006efe',
	'inputOption.activeForeground': '#000000',
	'keybindingLabel.foreground': '#111111',
	'list.activeSelectionBackground': '#eaf6ff',
	'list.activeSelectionForeground': '#111111',
	'list.activeSelectionIconForeground': '#111111',
	'list.focusAndSelectionOutline': '#006efe',
	'list.hoverBackground': '#f4f4f4',
	'menu.border': '#d4d4d4',
	'menu.selectionBackground': '#006efe',
	'menu.selectionForeground': '#ffffff',
	'notebook.cellBorderColor': '#e8e8e8',
	'notebook.selectedCellBackground': '#eaf6ff80',
	'notificationCenterHeader.background': '#FFFFFF',
	'notificationCenterHeader.foreground': '#111111',
	'notifications.background': '#FFFFFF',
	'notifications.border': '#e8e8e8',
	'notifications.foreground': '#111111',
	'panel.background': '#f9f9f9',
	'panel.border': '#e8e8e8',
	'panelInput.border': '#e8e8e8',
	'panelTitle.activeBorder': '#006efe',
	'panelTitle.activeForeground': '#111111',
	'panelTitle.inactiveForeground': '#555555',
	'peekViewEditor.matchHighlightBackground': '#ff930066',
	'peekViewResult.background': '#FFFFFF',
	'peekViewResult.matchHighlightBackground': '#ff930066',
	'pickerGroup.border': '#e8e8e8',
	'pickerGroup.foreground': '#555555',
	'ports.iconRunningProcessForeground': '#009432',
	'progressBar.background': '#006efe',
	'quickInput.background': '#f9f9f9',
	'quickInput.foreground': '#111111',
	'searchEditor.textInputBorder': '#d4d4d4',
	'settings.dropdownBackground': '#FFFFFF',
	'settings.dropdownBorder': '#d4d4d4',
	'settings.headerForeground': '#111111',
	'settings.modifiedItemIndicator': '#006efe',
	'settings.numberInputBorder': '#d4d4d4',
	'settings.textInputBorder': '#d4d4d4',
	'sideBar.background': '#f9f9f9',
	'sideBar.border': '#e8e8e8',
	'sideBar.foreground': '#111111',
	'sideBarSectionHeader.background': '#f9f9f9',
	'sideBarSectionHeader.border': '#e8e8e8',
	'sideBarSectionHeader.foreground': '#111111',
	'sideBarTitle.foreground': '#111111',
	'statusBar.background': '#f9f9f9',
	'statusBar.border': '#e8e8e8',
	'statusBar.debuggingBackground': '#e2162a',
	'statusBar.debuggingForeground': '#FFFFFF',
	'statusBar.focusBorder': '#006efe',
	'statusBar.foreground': '#111111',
	'statusBar.noFolderBackground': '#f9f9f9',
	'statusBarItem.compactHoverBackground': '#d4d4d4',
	'statusBarItem.errorBackground': '#e2162a',
	'statusBarItem.focusBorder': '#006efe',
	'statusBarItem.hoverBackground': '#0000000f',
	'statusBarItem.prominentBackground': '#d4d4d466',
	'statusBarItem.remoteBackground': '#006efe',
	'statusBarItem.remoteForeground': '#FFFFFF',
	'tab.activeBackground': '#FFFFFF',
	'tab.activeBorder': '#FFFFFF',
	'tab.activeBorderTop': '#006efe',
	'tab.activeForeground': '#111111',
	'tab.border': '#e8e8e8',
	'tab.hoverBackground': '#FFFFFF',
	'tab.inactiveBackground': '#f9f9f9',
	'tab.inactiveForeground': '#999999',
	'tab.lastPinnedBorder': '#d4d4d4',
	'tab.selectedBackground': '#ffffffa5',
	'tab.selectedBorderTop': '#0057d0',
	'tab.selectedForeground': '#111111b3',
	'tab.unfocusedActiveBorder': '#FFFFFF',
	'tab.unfocusedActiveBorderTop': '#e8e8e8',
	'tab.unfocusedHoverBackground': '#FFFFFF',
	'terminal.foreground': '#111111',
	'terminal.inactiveSelectionBackground': '#eaf6ff',
	'terminal.tab.activeBorder': '#006efe',
	'terminalCursor.foreground': '#006efe',
	'textBlockQuote.background': '#f9f9f9',
	'textBlockQuote.border': '#e8e8e8',
	'textCodeBlock.background': '#f4f4f4',
	'textLink.activeForeground': '#0057d0',
	'textLink.foreground': '#006efe',
	'textPreformat.background': '#0000001F',
	'textPreformat.foreground': '#111111',
	'textSeparator.foreground': '#e8e8e8',
	'titleBar.activeBackground': '#f9f9f9',
	'titleBar.activeForeground': '#111111',
	'titleBar.border': '#e8e8e8',
	'titleBar.inactiveBackground': '#f4f4f4',
	'titleBar.inactiveForeground': '#999999',
	'welcomePage.tileBackground': '#f4f4f4',
	'widget.border': '#e8e8e8'
};

export interface IWorkbenchTheme {
	readonly id: string;
	readonly label: string;
	readonly extensionData?: ExtensionData;
	readonly description?: string;
	readonly settingsId: string | null;
}

export interface IWorkbenchColorTheme extends IWorkbenchTheme, IColorTheme {
	readonly settingsId: string;
	readonly tokenColors: ITextMateThemingRule[];
}

export interface IColorMap {
	[id: string]: Color;
}

export interface IWorkbenchFileIconTheme extends IWorkbenchTheme, IFileIconTheme {
}

export interface IWorkbenchProductIconTheme extends IWorkbenchTheme, IProductIconTheme {
	readonly settingsId: string;

	getIcon(icon: IconContribution): IconDefinition | undefined;
}

export type ThemeSettingTarget = ConfigurationTarget | undefined | 'auto' | 'preview';


export interface IWorkbenchThemeService extends IThemeService {
	readonly _serviceBrand: undefined;
	setColorTheme(themeId: string | undefined | IWorkbenchColorTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchColorTheme | null>;
	getColorTheme(): IWorkbenchColorTheme;
	getColorThemes(): Promise<IWorkbenchColorTheme[]>;
	getMarketplaceColorThemes(publisher: string, name: string, version: string): Promise<IWorkbenchColorTheme[]>;
	readonly onDidColorThemeChange: Event<IWorkbenchColorTheme>;

	getPreferredColorScheme(): ColorScheme | undefined;

	setFileIconTheme(iconThemeId: string | undefined | IWorkbenchFileIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchFileIconTheme>;
	getFileIconTheme(): IWorkbenchFileIconTheme;
	getFileIconThemes(): Promise<IWorkbenchFileIconTheme[]>;
	getMarketplaceFileIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchFileIconTheme[]>;
	readonly onDidFileIconThemeChange: Event<IWorkbenchFileIconTheme>;

	setProductIconTheme(iconThemeId: string | undefined | IWorkbenchProductIconTheme, settingsTarget: ThemeSettingTarget): Promise<IWorkbenchProductIconTheme>;
	getProductIconTheme(): IWorkbenchProductIconTheme;
	getProductIconThemes(): Promise<IWorkbenchProductIconTheme[]>;
	getMarketplaceProductIconThemes(publisher: string, name: string, version: string): Promise<IWorkbenchProductIconTheme[]>;
	readonly onDidProductIconThemeChange: Event<IWorkbenchProductIconTheme>;
}

export interface IThemeScopedColorCustomizations {
	[colorId: string]: string;
}

export interface IColorCustomizations {
	[colorIdOrThemeScope: string]: IThemeScopedColorCustomizations | string;
}

export interface IThemeScopedTokenColorCustomizations {
	[groupId: string]: ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface ITokenColorCustomizations {
	[groupIdOrThemeScope: string]: IThemeScopedTokenColorCustomizations | ITextMateThemingRule[] | ITokenColorizationSetting | boolean | string | undefined;
	comments?: string | ITokenColorizationSetting;
	strings?: string | ITokenColorizationSetting;
	numbers?: string | ITokenColorizationSetting;
	keywords?: string | ITokenColorizationSetting;
	types?: string | ITokenColorizationSetting;
	functions?: string | ITokenColorizationSetting;
	variables?: string | ITokenColorizationSetting;
	textMateRules?: ITextMateThemingRule[];
	semanticHighlighting?: boolean; // deprecated, use ISemanticTokenColorCustomizations.enabled instead
}

export interface IThemeScopedSemanticTokenColorCustomizations {
	[styleRule: string]: ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface ISemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedSemanticTokenColorCustomizations | ISemanticTokenRules | boolean | undefined;
	enabled?: boolean;
	rules?: ISemanticTokenRules;
}

export interface IThemeScopedExperimentalSemanticTokenColorCustomizations {
	[themeScope: string]: ISemanticTokenRules | undefined;
}

export interface IExperimentalSemanticTokenColorCustomizations {
	[styleRuleOrThemeScope: string]: IThemeScopedExperimentalSemanticTokenColorCustomizations | ISemanticTokenRules | undefined;
}

export type IThemeScopedCustomizations =
	IThemeScopedColorCustomizations
	| IThemeScopedTokenColorCustomizations
	| IThemeScopedExperimentalSemanticTokenColorCustomizations
	| IThemeScopedSemanticTokenColorCustomizations;

export type IThemeScopableCustomizations =
	IColorCustomizations
	| ITokenColorCustomizations
	| IExperimentalSemanticTokenColorCustomizations
	| ISemanticTokenColorCustomizations;

export interface ISemanticTokenRules {
	[selector: string]: string | ISemanticTokenColorizationSetting | undefined;
}

export interface ITextMateThemingRule {
	name?: string;
	scope?: string | string[];
	settings: ITokenColorizationSetting;
}

export interface ITokenColorizationSetting {
	foreground?: string;
	background?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
}

export interface ISemanticTokenColorizationSetting {
	foreground?: string;
	fontStyle?: string; /* [italic|bold|underline|strikethrough] */
	bold?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	italic?: boolean;
}

export interface ExtensionData {
	extensionId: string;
	extensionPublisher: string;
	extensionName: string;
	extensionIsBuiltin: boolean;
}

export namespace ExtensionData {
	export function toJSONObject(d: ExtensionData | undefined): any {
		return d && { _extensionId: d.extensionId, _extensionIsBuiltin: d.extensionIsBuiltin, _extensionName: d.extensionName, _extensionPublisher: d.extensionPublisher };
	}
	export function fromJSONObject(o: any): ExtensionData | undefined {
		if (o && isString(o._extensionId) && isBoolean(o._extensionIsBuiltin) && isString(o._extensionName) && isString(o._extensionPublisher)) {
			return { extensionId: o._extensionId, extensionIsBuiltin: o._extensionIsBuiltin, extensionName: o._extensionName, extensionPublisher: o._extensionPublisher };
		}
		return undefined;
	}
	export function fromName(publisher: string, name: string, isBuiltin = false): ExtensionData {
		return { extensionPublisher: publisher, extensionId: `${publisher}.${name}`, extensionName: name, extensionIsBuiltin: isBuiltin };
	}
}

export interface IThemeExtensionPoint {
	id: string;
	label?: string;
	description?: string;
	path: string;
	uiTheme?: ThemeTypeSelector;
	_watch: boolean; // unsupported options to watch location
}
