// Re-export shim: the audit-agent owns this module. The subagent mount keeps
// a single source of truth at agents/audit-agent/agent/lib/safe_fetch.ts.
// Long term this mount becomes a remote agent; until then the shim holds.
export * from "../../../../../audit-agent/agent/lib/safe_fetch.js";
