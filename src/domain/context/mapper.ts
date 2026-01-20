type ContextLanguage = "zh" | "en";

type ContextSource = "manual" | "ai_assisted" | "imported";

export interface MapContextInput {
  documentId: string;
  updatedAt: string;
  fieldsJson: Record<string, any>;
  language: ContextLanguage;
  source: ContextSource;
}

function mapGoals(goalsTable: Array<Record<string, unknown>> | undefined) {
  if (!Array.isArray(goalsTable)) return [];
  return goalsTable.map((row) => ({
    goal: String(row.goal ?? ""),
    metric: String(row.metric ?? ""),
    baseline: row.baseline ? String(row.baseline) : undefined,
    target: row.target ? String(row.target) : undefined,
    timeWindow: row.timeWindow ? String(row.timeWindow) : undefined,
  }));
}

export function mapDocumentToContext(input: MapContextInput) {
  const { documentId, updatedAt, fieldsJson, language, source } = input;

  const meta = fieldsJson.meta ?? {};
  const problem = fieldsJson.problem ?? {};
  const goals = fieldsJson.goals ?? {};
  const scope = fieldsJson.scope ?? {};
  const journeys = fieldsJson.journeys ?? {};
  const requirements = fieldsJson.requirements ?? {};
  const tracking = fieldsJson.tracking ?? {};
  const nfr = fieldsJson.nfr ?? {};
  const release = fieldsJson.release ?? {};
  const glossary = fieldsJson.glossary ?? {};
  const changeLog = fieldsJson.changeLog ?? {};

  return {
    schemaVersion: "0.1",
    meta: {
      id: documentId,
      title: meta.title ?? "",
      language,
      platform: meta.platform ?? [],
      productType: meta.productType,
      updatedAt,
      source,
    },
    problem: {
      background: problem.background ?? "",
      problemStatement: problem.problemStatement ?? "",
      targetUsers: problem.targetUsers ?? [],
      constraints: problem.constraints ?? [],
    },
    goals: {
      goals: mapGoals(goals.goalsTable ?? goals.goals ?? []),
      nonGoals: goals.nonGoals ?? [],
    },
    scope: {
      inScope: scope.inScope ?? [],
      outScope: scope.outScope ?? [],
      assumptions: scope.assumptions ?? [],
      openQuestions: scope.openQuestions ?? [],
    },
    journeys: {
      primary: journeys.primaryJourney ?? journeys.primary ?? [],
      secondary: journeys.secondary ?? [],
    },
    requirements: requirements.requirements ?? [],
    tracking: {
      events: tracking.events ?? [],
    },
    nfr: {
      items: nfr.items ?? [],
    },
    release: {
      plan: release.plan ?? [],
      monitoring: release.monitoring ?? [],
      rollback: release.rollback ?? [],
    },
    glossary: {
      terms: glossary.terms ?? [],
    },
    changeLog: {
      summary: changeLog.summary ?? "",
      changes: changeLog.changes ?? [],
    },
  };
}
