/** Shared Agent ↔ Client UI surface protocol (LiveKit data channel + RPC). */

export const AGENT_UI_TOPIC = 'agent_ui';
export const AGENT_UI_REPLY_TOPIC = 'agent_ui_reply';

/** LiveKit RPC: show a page card (returns immediately after display). */
export const SHOW_UI_RPC = 'show_ui';

/** LiveKit RPC: agent requests hangup. */
export const END_CALL_RPC = 'end_call';

/** Data-channel fallback for hangup. */
export const AGENT_HANGUP_TOPIC = 'agent_hangup';

export type AgentUiActionStyle = 'primary' | 'secondary' | 'danger' | 'ghost';

export type AgentUiChoice = {
  id: string;
  label: string;
};

export type AgentUiAction = {
  id: string;
  label: string;
  style?: AgentUiActionStyle;
};

/** Agent → client: show a prompt on the page. */
export type AgentUiPrompt = {
  id: string;
  title?: string;
  markdown?: string;
  choices?: AgentUiChoice[];
  /** Allow selecting multiple choices before confirming via an action. */
  multiple?: boolean;
  actions?: AgentUiAction[];
  dismissible?: boolean;
};

/** Client → agent: user response. */
export type AgentUiReply = {
  id: string;
  /** action id, or 'dismiss', or 'choice' when only choices were tapped (single). */
  actionId?: string;
  /** Selected choice id(s). */
  choiceIds?: string[];
  dismissed?: boolean;
};
