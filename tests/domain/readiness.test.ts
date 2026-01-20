import { describe, it, expect } from "vitest";

import { evaluateReadiness } from "../../src/domain/readiness/evaluateReadiness";
import { TemplateSchema } from "../../src/domain/readiness/types";

const template: TemplateSchema = {
  sections: [
    { key: "meta", fields: [{ key: "title", required: true }] },
    { key: "problem", fields: [{ key: "problemStatement", required: true }] },
    { key: "requirements", fields: [{ key: "requirements", required: true }] },
  ],
  readinessRules: {
    requireFields: ["meta.title", "problem.problemStatement", "requirements.requirements"],
    requirePerRequirement: ["id", "title", "priority", "userStory", "acceptance", "edgeCases"],
  },
};

describe("evaluateReadiness", () => {
  it("flags missing required fields", () => {
    const result = evaluateReadiness({ meta: {} }, template);
    expect(result.isReady).toBe(false);
    expect(result.blockingIssues.length).toBeGreaterThan(0);
  });

  it("passes with required fields and requirements", () => {
    const fieldsJson = {
      meta: { title: "Test" },
      problem: { problemStatement: "Problem" },
      requirements: {
        requirements: [
          {
            id: "FEATURE-P0",
            title: "Export",
            priority: "P0",
            userStory: "As a user...",
            acceptance: [{ given: "g", when: "w", then: "t" }],
            edgeCases: ["Edge"],
          },
        ],
      },
      scope: { openQuestions: [] },
    };

    const result = evaluateReadiness(fieldsJson, template);
    expect(result.isReady).toBe(true);
    expect(result.blockingIssues.length).toBe(0);
  });

  it("detects duplicate requirement ids", () => {
    const fieldsJson = {
      meta: { title: "Test" },
      problem: { problemStatement: "Problem" },
      requirements: {
        requirements: [
          {
            id: "FEATURE-P0",
            title: "Export",
            priority: "P0",
            userStory: "As a user...",
            acceptance: [{ given: "g", when: "w", then: "t" }],
            edgeCases: ["Edge"],
          },
          {
            id: "FEATURE-P0",
            title: "Export 2",
            priority: "P1",
            userStory: "As a user...",
            acceptance: [{ given: "g", when: "w", then: "t" }],
            edgeCases: ["Edge"],
          },
        ],
      },
      scope: { openQuestions: [] },
    };

    const result = evaluateReadiness(fieldsJson, template);
    const duplicate = result.blockingIssues.find((issue) => issue.code === "DUPLICATE_REQUIREMENT_ID");
    expect(duplicate).toBeTruthy();
  });
});
