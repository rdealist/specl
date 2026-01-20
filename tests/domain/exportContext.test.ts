import { describe, it, expect } from "vitest";

import { buildExportContext } from "../../src/domain/context/exportContext";

const fieldsJson = {
  meta: { title: "Export Spec", platform: ["web"], productType: "tool" },
  problem: { background: "Background", problemStatement: "Problem" },
  goals: {
    goalsTable: [{ goal: "Goal", metric: "Metric", target: "Target" }],
    nonGoals: [],
  },
  scope: { inScope: ["Scope"], outScope: [], assumptions: [], openQuestions: [] },
  requirements: {
    requirements: [
      {
        id: "FEATURE-P0",
        title: "Requirement",
        priority: "P0",
        userStory: "As a user...",
        acceptance: [{ given: "g", when: "w", then: "t" }],
        edgeCases: ["Edge"],
      },
    ],
  },
};

describe("buildExportContext", () => {
  it("builds a schema-valid context", () => {
    const result = buildExportContext({
      documentId: "doc-1",
      updatedAt: new Date("2026-01-01T00:00:00Z").toISOString(),
      fieldsJson,
      language: "zh",
      source: "manual",
      profile: "standard",
    });

    expect(result.valid).toBe(true);
    expect(result.context.schemaVersion).toBe("0.1");
    expect(result.context.requirements.length).toBe(1);
  });
});
