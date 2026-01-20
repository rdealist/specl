import { IssueAction, IssueActionContext } from "./types";

function canUseAi(context: IssueActionContext): boolean {
  return context.aiMode !== "disabled";
}

export function getIssueActions(context: IssueActionContext): IssueAction[] {
  const { issue } = context;

  const focusAction: IssueAction = {
    actionId: "FOCUS_FIELD",
    type: "manual",
    label: "Focus field",
    scope: "single",
    targetFieldPath: issue.fieldPath,
    analyticsEvent: "issue_action_focus_field",
  };

  if (issue.code === "REQUIRED_FIELD_MISSING") {
    return [focusAction];
  }

  if (issue.code === "DUPLICATE_REQUIREMENT_ID" || issue.code === "INVALID_ENUM_VALUE") {
    return [focusAction];
  }

  if (issue.code === "REQUIRED_REQ_FIELD_MISSING" || issue.code === "INVALID_ACCEPTANCE_ITEM") {
    const actions: IssueAction[] = [focusAction];
    if (canUseAi(context)) {
      actions.push({
        actionId: "AI_FILL_ACCEPTANCE_EDGE_SINGLE",
        type: "ai",
        taskType: "field_patch",
        label: "Fill acceptance and edge cases",
        scope: "single",
        targetFieldPath: issue.fieldPath,
        analyticsEvent: "issue_action_fill_acceptance_edge_single",
      });
    }
    return actions;
  }

  if (issue.code === "OPEN_QUESTIONS_EMPTY_BUT_RISKY") {
    if (!canUseAi(context)) {
      return [focusAction];
    }

    return [
      focusAction,
      {
        actionId: "AI_SUGGEST_OPEN_QUESTIONS",
        type: "ai",
        taskType: "field_patch",
        label: "Suggest open questions",
        scope: "single",
        targetFieldPath: issue.fieldPath,
        analyticsEvent: "issue_action_suggest_open_questions",
      },
    ];
  }

  if (issue.code === "FLOWS_STEP_NOT_CONTIGUOUS" || issue.code === "FLOWS_TOO_LONG") {
    const actions: IssueAction[] = [focusAction];
    actions.push({
      actionId: "RENUMBER_FLOW_STEPS",
      type: "manual",
      label: "Renumber flow steps",
      scope: "single",
      targetFieldPath: issue.fieldPath,
      analyticsEvent: "issue_action_renumber_flows",
    });

    if (canUseAi(context)) {
      actions.push({
        actionId: "AI_SUGGEST_FLOWS_SINGLE",
        type: "ai",
        taskType: "suggested_flows",
        label: "Generate suggested flow",
        scope: "single",
        targetFieldPath: issue.fieldPath,
        analyticsEvent: "issue_action_suggested_flows_single",
      });
    }

    return actions;
  }

  return [focusAction];
}
