export type ExportProfile = "lean" | "standard" | "detailed";

interface PruneOptions {
  profile: ExportProfile;
  includeFlowsInLean?: boolean;
}

function pruneRequirementLean(requirement: Record<string, any>, includeFlows: boolean) {
  const base = {
    id: requirement.id,
    title: requirement.title,
    priority: requirement.priority,
    userStory: requirement.userStory,
    acceptance: requirement.acceptance,
    edgeCases: requirement.edgeCases,
  } as Record<string, any>;

  if (includeFlows && requirement.flows) {
    base.flows = { main: requirement.flows?.main ?? [] };
  }

  return base;
}

function pruneRequirementStandard(requirement: Record<string, any>) {
  const pruned = {
    id: requirement.id,
    title: requirement.title,
    priority: requirement.priority,
    userStory: requirement.userStory,
    description: requirement.description,
    flows: requirement.flows,
    acceptance: requirement.acceptance,
    edgeCases: requirement.edgeCases,
    dependencies: requirement.dependencies,
    trackingRefs: requirement.trackingRefs,
    codingNotes: requirement.codingNotes,
  } as Record<string, any>;

  if (pruned.flows && pruned.flows.main) {
    pruned.flows = { main: pruned.flows.main, alternatives: pruned.flows.alternatives };
  }

  return pruned;
}

function dropEmptyOptionals(context: Record<string, any>) {
  const optionalFields = ["journeys", "tracking", "nfr", "release", "glossary", "changeLog"];
  for (const key of optionalFields) {
    const value = context[key];
    if (value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) {
      delete context[key];
      continue;
    }
    if (typeof value === "object" && value !== null && Object.keys(value).length === 0) {
      delete context[key];
    }
  }
}

export function pruneByProfile(context: Record<string, any>, options: PruneOptions): Record<string, any> {
  const output = JSON.parse(JSON.stringify(context)) as Record<string, any>;
  const { profile, includeFlowsInLean } = options;

  if (profile === "lean") {
    delete output.journeys;
    delete output.tracking;
    delete output.nfr;
    delete output.release;
    delete output.changeLog;
    output.requirements = (output.requirements ?? []).map((req: Record<string, any>) =>
      pruneRequirementLean(req, Boolean(includeFlowsInLean))
    );
  }

  if (profile === "standard") {
    delete output.release;
    delete output.changeLog;
    output.requirements = (output.requirements ?? []).map((req: Record<string, any>) =>
      pruneRequirementStandard(req)
    );
  }

  if (profile === "detailed") {
    output.requirements = (output.requirements ?? []).map((req: Record<string, any>) =>
      pruneRequirementStandard(req)
    );
  }

  dropEmptyOptionals(output);
  return output;
}
