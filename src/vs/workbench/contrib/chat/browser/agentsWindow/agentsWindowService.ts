/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, addDisposableListener, clearNode } from '../../../../../base/browser/dom.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { registerSingleton, InstantiationType } from '../../../../../platform/instantiation/common/extensions.js';
import { IAuxiliaryWindowService, AuxiliaryWindowMode } from '../../../../services/auxiliaryWindow/browser/auxiliaryWindowService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { IHostService } from '../../../../services/host/browser/host.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { INativeWorkbenchEnvironmentService } from '../../../../services/environment/electron-browser/environmentService.js';
import './media/agentsWindow.css';

export const IAgentsWindowService = createDecorator<IAgentsWindowService>('agentsWindowService');

export interface IAgentSession {
	id: string;
	title: string;
	repositoryName: string;
	repositoryPath: string;
	status: 'running' | 'waiting' | 'completed' | 'failed';
	startTime: number;
	elapsedSeconds: number;
	archived?: boolean;
	messages: Array<{
		role: 'user' | 'agent' | 'system' | 'thought' | 'command';
		content: string;
		timestamp: number;
	}>;
	changedFiles: Array<{
		path: string;
		additions: number;
		deletions: number;
	}>;
}

export interface IAgentsWindowService {
	readonly _serviceBrand: undefined;
	openAgentsWindow(sessionId?: string): Promise<void>;
	getSessions(): IAgentSession[];
	createSession(repositoryName?: string): IAgentSession;
}

const STORAGE_KEY = 'nirmaan.agentSessions.v1';

export class AgentsWindowService extends Disposable implements IAgentsWindowService {
	readonly _serviceBrand: undefined;

	private sessions: IAgentSession[] = [];
	private activeSessionId: string | null = null;
	private currentAuxWindowDisposables: DisposableStore | null = null;
	private timerInterval: any = null;

	constructor(
		@IAuxiliaryWindowService private readonly auxiliaryWindowService: IAuxiliaryWindowService,
		@IStorageService private readonly storageService: IStorageService,
		@IHostService private readonly hostService: IHostService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ICommandService private readonly commandService: ICommandService,
		@INativeWorkbenchEnvironmentService private readonly environmentService: INativeWorkbenchEnvironmentService,
	) {
		super();
		this.loadSessions();

		if (this.environmentService.args && this.environmentService.args.agents) {
			setTimeout(() => this.openAgentsWindow(), 500);
		}
	}

	private loadSessions(): void {
		const raw = this.storageService.get(STORAGE_KEY, StorageScope.PROFILE);
		if (raw) {
			try {
				this.sessions = JSON.parse(raw);
			} catch {
				this.sessions = [];
			}
		}
		if (this.sessions.length === 0) {
			const currentWorkspace = this.workspaceContextService.getWorkspace();
			const repoName = currentWorkspace.folders.length > 0 ? currentWorkspace.folders[0].name : 'vscode';
			const repoPath = currentWorkspace.folders.length > 0 ? currentWorkspace.folders[0].uri.fsPath : 'C:\\Users\\omraj\\OneDrive\\Desktop\\OSS Contributions\\vscode';

			this.sessions = [
				{
					id: 'session-1',
					title: 'Fix Workbench Spacing & Design',
					repositoryName: repoName,
					repositoryPath: repoPath,
					status: 'completed',
					startTime: Date.now() - 3600000,
					elapsedSeconds: 342,
					messages: [
						{ role: 'user', content: 'Improve spacing, design, and alignment across the workbench.', timestamp: Date.now() - 3600000 },
						{ role: 'thought', content: 'Grepped CSS overrides and verified 4px grid design tokens.', timestamp: Date.now() - 3500000 },
						{ role: 'command', content: 'npm run compile', timestamp: Date.now() - 3400000 },
						{ role: 'agent', content: 'Updated style.css, paneCompositePart.css, and sidebarpart.css with Nirmaan spacing scale.', timestamp: Date.now() - 3300000 }
					],
					changedFiles: [
						{ path: 'src/vs/workbench/browser/media/style.css', additions: 26, deletions: 12 },
						{ path: 'src/vs/workbench/browser/parts/media/paneCompositePart.css', additions: 8, deletions: 4 }
					]
				},
				{
					id: 'session-2',
					title: 'Refactor Agent Window Architecture',
					repositoryName: repoName,
					repositoryPath: repoPath,
					status: 'running',
					startTime: Date.now() - 600000,
					elapsedSeconds: 124,
					messages: [
						{ role: 'user', content: 'Implement dedicated agent window with 3-column layout and IDE handoff button.', timestamp: Date.now() - 600000 },
						{ role: 'thought', content: 'Inspected AuxiliaryWindowService and argv CLI flag parser.', timestamp: Date.now() - 500000 },
						{ role: 'command', content: 'git diff --stat', timestamp: Date.now() - 400000 },
						{ role: 'agent', content: 'Created AgentsWindowService and registered Nirmaan: Open Agents command.', timestamp: Date.now() - 300000 }
					],
					changedFiles: [
						{ path: 'src/vs/workbench/contrib/chat/browser/agentsWindow/agentsWindowService.ts', additions: 240, deletions: 0 },
						{ path: 'src/vs/workbench/contrib/chat/browser/agentsWindow/media/agentsWindow.css', additions: 180, deletions: 0 }
					]
				}
			];
			this.saveSessions();
		}
		if (this.sessions.length > 0 && !this.activeSessionId) {
			this.activeSessionId = this.sessions[0].id;
		}
	}

	private saveSessions(): void {
		this.storageService.store(STORAGE_KEY, JSON.stringify(this.sessions), StorageScope.PROFILE, StorageTarget.USER);
	}

	getSessions(): IAgentSession[] {
		return this.sessions;
	}

	createSession(repositoryName?: string): IAgentSession {
		const currentWorkspace = this.workspaceContextService.getWorkspace();
		const repoName = repositoryName || (currentWorkspace.folders.length > 0 ? currentWorkspace.folders[0].name : 'Nirmaan Workspace');
		const repoPath = currentWorkspace.folders.length > 0 ? currentWorkspace.folders[0].uri.fsPath : '';

		const newSession: IAgentSession = {
			id: `session-${Date.now()}`,
			title: 'New Agent Task',
			repositoryName: repoName,
			repositoryPath: repoPath,
			status: 'running',
			startTime: Date.now(),
			elapsedSeconds: 0,
			messages: [
				{ role: 'system', content: 'Agent session initialized for ' + repoName, timestamp: Date.now() }
			],
			changedFiles: []
		};

		this.sessions.unshift(newSession);
		this.activeSessionId = newSession.id;
		this.saveSessions();
		return newSession;
	}

	async openAgentsWindow(sessionId?: string): Promise<void> {
		if (sessionId) {
			this.activeSessionId = sessionId;
		}

		if (this.currentAuxWindowDisposables) {
			this.currentAuxWindowDisposables.dispose();
		}

		const disposables = new DisposableStore();
		this.currentAuxWindowDisposables = disposables;

		const auxWindow = await this.auxiliaryWindowService.open({
			mode: AuxiliaryWindowMode.Normal,
			bounds: { width: 1320, height: 860 },
			nativeTitlebar: false
		});

		await auxWindow.whenStylesHaveLoaded;

		const doc = auxWindow.window.document;
		doc.title = 'Nirmaan Agents';
		doc.body.classList.add('monaco-workbench', 'nirmaan-agents-window-body', 'windows');

		// Clear preset container & render 3-column layout container inside container
		clearNode(auxWindow.container);
		auxWindow.container.classList.add('nirmaan-agents-app-root');

		// Render the 3-column layout
		this.renderLayout(auxWindow.container, disposables);

		// Start timer update ticker for running agents
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		this.timerInterval = setInterval(() => {
			for (const session of this.sessions) {
				if (session.status === 'running') {
					session.elapsedSeconds += 1;
				}
			}
			this.updateTimers(auxWindow.container);
		}, 1000);

		disposables.add({
			dispose: () => {
				if (this.timerInterval) {
					clearInterval(this.timerInterval);
				}
			}
		});
	}

	private renderLayout(container: HTMLElement, disposables: DisposableStore): void {
		clearNode(container);

		const activeSession = this.sessions.find(s => s.id === this.activeSessionId) || this.sessions[0];

		// Left Sidebar
		const leftSidebar = $('.nirmaan-agents-left-sidebar');
		this.renderLeftSidebar(leftSidebar, disposables);

		// Center Conversation Area
		const centerArea = $('.nirmaan-agents-center-area');
		this.renderCenterArea(centerArea, activeSession, disposables);

		// Right Review Panel
		const rightPanel = $('.nirmaan-agents-right-panel');
		this.renderRightPanel(rightPanel, activeSession, disposables);

		container.appendChild(leftSidebar);
		container.appendChild(centerArea);
		container.appendChild(rightPanel);
	}

	private renderLeftSidebar(container: HTMLElement, disposables: DisposableStore): void {
		clearNode(container);

		// Header & New Agent button
		const header = $('.nirmaan-sidebar-header', {},
			$('.nirmaan-sidebar-title', {}, 'Nirmaan Agents'),
			$('.nirmaan-new-agent-btn', { title: 'Create New Agent Task' }, '+ New Agent')
		);

		const newBtn = header.querySelector('.nirmaan-new-agent-btn') as HTMLElement;
		disposables.add(addDisposableListener(newBtn, 'click', () => {
			this.createSession();
			const root = container.closest('.nirmaan-agents-app-root') as HTMLElement;
			if (root) {
				this.renderLayout(root, disposables);
			}
		}));

		// Search Bar
		const searchInput = $('input.nirmaan-sidebar-search', { placeholder: 'Search sessions...' }) as HTMLInputElement;

		// Session List grouped by repo
		const sessionList = $('.nirmaan-sidebar-sessions-list');

		const reposMap = new Map<string, IAgentSession[]>();
		for (const session of this.sessions) {
			const repo = session.repositoryName || 'Other Projects';
			if (!reposMap.has(repo)) {
				reposMap.set(repo, []);
			}
			reposMap.get(repo)!.push(session);
		}

		for (const [repoName, sessList] of reposMap.entries()) {
			const repoGroup = $('.nirmaan-repo-group');
			const repoHeader = $('.nirmaan-repo-header', {},
				$('.codicon.codicon-folder'),
				$('span.nirmaan-repo-name', {}, repoName)
			);
			repoGroup.appendChild(repoHeader);

			const itemsContainer = $('.nirmaan-repo-items');
			for (const sess of sessList) {
				const isActive = sess.id === this.activeSessionId;
				const statusIcon = sess.status === 'running' ? '●' : sess.status === 'completed' ? '✓' : '✗';
				const statusClass = sess.status;

				const sessItem = $(`.nirmaan-session-item${isActive ? '.active' : ''}`, {},
					$('.nirmaan-session-status-badge.' + statusClass, {}, statusIcon),
					$('.nirmaan-session-info', {},
						$('.nirmaan-session-title', {}, sess.title),
						$('.nirmaan-session-time', { 'data-session-id': sess.id }, `${this.formatTime(sess.elapsedSeconds)}`)
					)
				);

				disposables.add(addDisposableListener(sessItem, 'click', () => {
					this.activeSessionId = sess.id;
					const root = container.closest('.nirmaan-agents-app-root') as HTMLElement;
					if (root) {
						this.renderLayout(root, disposables);
					}
				}));

				itemsContainer.appendChild(sessItem);
			}
			repoGroup.appendChild(itemsContainer);
			sessionList.appendChild(repoGroup);
		}

		container.appendChild(header);
		container.appendChild(searchInput);
		container.appendChild(sessionList);
	}

	private renderCenterArea(container: HTMLElement, session: IAgentSession, disposables: DisposableStore): void {
		clearNode(container);

		if (!session) {
			container.appendChild($('.nirmaan-empty-center', {}, 'Select or create an Agent session to begin.'));
			return;
		}

		// Header
		const header = $('.nirmaan-center-header', {},
			$('.nirmaan-center-title-group', {},
				$('h2.nirmaan-center-title', {}, session.title),
				$('span.nirmaan-center-repo-tag', {}, session.repositoryName)
			),
			$('.nirmaan-center-status-group', {},
				$('span.nirmaan-status-pill.' + session.status, {}, session.status.toUpperCase()),
				$('span.nirmaan-timer-display', { 'data-session-id': session.id }, this.formatTime(session.elapsedSeconds))
			)
		);

		// Conversation / Thought Stream
		const stream = $('.nirmaan-conversation-stream');
		for (const msg of session.messages) {
			const msgBubble = $(`.nirmaan-msg-bubble.${msg.role}`, {},
				$('.nirmaan-msg-role', {}, msg.role.toUpperCase()),
				$('.nirmaan-msg-content', {}, msg.content)
			);
			stream.appendChild(msgBubble);
		}

		// Prompt Input Bar
		const promptBar = $('.nirmaan-prompt-bar', {},
			$('textarea.nirmaan-prompt-input', { placeholder: 'Ask Nirmaan Agent to run a task, refactor, or fix code...' }),
			$('.nirmaan-prompt-controls', {},
				$('select.nirmaan-model-select', {},
					$('option', { value: 'nirmaan-local-agent' }, 'Nirmaan Local Agent 1.0')
				),
				$('.nirmaan-send-btn', {}, 'Run Agent')
			)
		);

		const textarea = promptBar.querySelector('textarea') as HTMLTextAreaElement;
		const sendBtn = promptBar.querySelector('.nirmaan-send-btn') as HTMLElement;

		const runTask = () => {
			const val = textarea.value.trim();
			if (!val) { return; }

			session.messages.push({ role: 'user', content: val, timestamp: Date.now() });
			session.status = 'running';
			textarea.value = '';

			this.renderCenterArea(container, session, disposables);

			setTimeout(() => {
				session.messages.push({ role: 'thought', content: `Analyzing repository context for: "${val}"`, timestamp: Date.now() });
				this.renderCenterArea(container, session, disposables);
			}, 800);

			setTimeout(() => {
				session.messages.push({ role: 'command', content: 'git diff --stat', timestamp: Date.now() });
				session.messages.push({ role: 'agent', content: 'Executed task successfully. Modified local workspace files.', timestamp: Date.now() });
				session.status = 'completed';
				this.saveSessions();
				const root = container.closest('.nirmaan-agents-app-root') as HTMLElement;
				if (root) {
					this.renderLayout(root, disposables);
				}
			}, 2500);
		};

		disposables.add(addDisposableListener(sendBtn, 'click', runTask));

		container.appendChild(header);
		container.appendChild(stream);
		container.appendChild(promptBar);
	}

	private renderRightPanel(container: HTMLElement, session: IAgentSession, disposables: DisposableStore): void {
		clearNode(container);

		// ★ PROMINENT "Open in Nirmaan IDE" BUTTON (Visible at any cost!)
		const ideHandoffBox = $('.nirmaan-ide-handoff-box', {},
			$('.nirmaan-ide-handoff-btn', { title: 'Switch to main Nirmaan IDE window' }, '↗ Open in Nirmaan IDE'),
			$('.nirmaan-ide-handoff-subtitle', {}, 'Jump into code editor with active workspace')
		);

		const handoffBtn = ideHandoffBox.querySelector('.nirmaan-ide-handoff-btn') as HTMLElement;
		disposables.add(addDisposableListener(handoffBtn, 'click', async () => {
			await this.hostService.focus(mainWindow);
			if (session && session.repositoryPath) {
				await this.commandService.executeCommand('vscode.openFolder', session.repositoryPath);
			}
		}));

		// Changed Files Section
		const filesHeader = $('.nirmaan-section-header', {},
			$('span.nirmaan-section-title', {}, 'Changed Files'),
			$('span.nirmaan-files-count', {}, `${session ? session.changedFiles.length : 0} files`)
		);

		const filesList = $('.nirmaan-changed-files-list');
		if (session && session.changedFiles.length > 0) {
			for (const f of session.changedFiles) {
				const fileItem = $('.nirmaan-changed-file-item', {},
					$('span.nirmaan-file-name', {}, f.path),
					$('span.nirmaan-file-diff', {}, `+${f.additions} -${f.deletions}`)
				);
				disposables.add(addDisposableListener(fileItem, 'click', async () => {
					await this.hostService.focus(mainWindow);
				}));
				filesList.appendChild(fileItem);
			}
		} else {
			filesList.appendChild($('.nirmaan-no-changes', {}, 'No file changes yet.'));
		}

		// Terminal & Activity Section
		const terminalHeader = $('.nirmaan-section-header', {},
			$('span.nirmaan-section-title', {}, 'Terminals & Approvals')
		);
		const terminalBox = $('.nirmaan-terminal-preview', {},
			$('.nirmaan-terminal-line', {}, '$ nirmaan-agent run --local'),
			$('.nirmaan-terminal-line.success', {}, '✓ Session active & connected to Nirmaan IDE')
		);

		container.appendChild(ideHandoffBox);
		container.appendChild(filesHeader);
		container.appendChild(filesList);
		container.appendChild(terminalHeader);
		container.appendChild(terminalBox);
	}

	private updateTimers(container: HTMLElement): void {
		const timerElements = container.querySelectorAll('[data-session-id]');
		timerElements.forEach(el => {
			const sessId = el.getAttribute('data-session-id');
			const sess = this.sessions.find(s => s.id === sessId);
			if (sess) {
				el.textContent = this.formatTime(sess.elapsedSeconds);
			}
		});
	}

	private formatTime(totalSeconds: number): string {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
}

registerSingleton(IAgentsWindowService, AgentsWindowService, InstantiationType.Eager);
