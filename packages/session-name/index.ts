/**
 * Exposes session naming as an LLM-callable tool so skills can instruct
 * the agent to name sessions automatically.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
	pi.registerTool({
		name: "set_session_name",
		label: "Set Session Name",
		description:
			"Set a short, descriptive name for the current session. " +
			"Use when starting work on an issue, PR review, triage, or any " +
			"identifiable workflow. The name appears in the session selector " +
			"for easy resumption.",
		parameters: Type.Object({
			name: Type.String({
				description:
					"Short session name, e.g. 'issue-142-sbom-timeout', " +
					"'pr-review-1138', 'triage-may-2026'",
			}),
		}),
		async execute(_toolCallId, params) {
			pi.setSessionName(params.name);
			return {
				content: [{ type: "text", text: `Session named: ${params.name}` }],
				details: {},
			};
		},
	});
}
