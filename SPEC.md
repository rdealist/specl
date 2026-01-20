# Specl Product Specification (SPEC.md)

## 1. Scope and Goals
Specl is an online, structured PRD authoring tool for individual product managers. It enforces product-thinking checkpoints via strong-field constraints, supports AI-assisted completion, and exports a stable, machine-readable context for vibe coding.

Key goals:
- Produce stable, structured PRD context for coding agents.
- Enforce product-thinking completeness (goals, scope, acceptance, edge cases).
- Deterministic Chinese export; AI-assisted English export with repair and fallback.
- Open-source, self-hostable with simple Docker Compose setup.

Non-goals (v0.1):
- Third-party integrations (Jira/TAPD/Figma/GitHub).
- PDF/Word exports.
- Team collaboration beyond a single-user workspace model.

---

## 2. Architecture

### 2.1 Stack
- Frontend/Backend: Next.js (App Router) single-repo
- Database: PostgreSQL
- ORM: Prisma
- Containerization: Docker + Docker Compose
- AI Provider (default): Anthropic Claude

### 2.2 Authentication
- Method: Email + Password
- Workspace: Single personal workspace per user (ready to extend later)

### 2.3 Core Modules
- `domain/`: context mapping, validation, pruning, fieldPath resolution
- `ai/`: provider adapters, prompt templates, task handlers, repair
- `server/`: Prisma repo + service layer
- `app/`: editor UI, export UI, auth pages

---

## 3. Data Schema: prd.context.json v0.1

### 3.1 Top-level Fields (Fixed)
Required top-level fields:
- `schemaVersion`
- `meta`
- `problem`
- `goals`
- `scope`
- `requirements`
Optional top-level fields:
- `journeys`, `tracking`, `nfr`, `release`, `glossary`, `changeLog`

### 3.2 JSON Schema (v0.1, abridged but normative)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/prd-context.schema.json",
  "title": "PRD Context Schema",
  "type": "object",
  "additionalProperties": false,
  "required": ["schemaVersion", "meta", "problem", "goals", "scope", "requirements"],
  "properties": {
    "schemaVersion": { "type": "string", "const": "0.1" },
    "meta": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "title", "language", "updatedAt"],
      "properties": {
        "id": { "type": "string", "minLength": 1 },
        "title": { "type": "string", "minLength": 1 },
        "language": { "type": "string", "enum": ["zh", "en"] },
        "platform": {
          "type": "array",
          "items": { "type": "string", "enum": ["web", "ios", "android", "miniprogram", "desktop", "backend"] },
          "uniqueItems": true
        },
        "productType": {
          "type": "string",
          "enum": ["consumer", "business", "internal", "content", "ecommerce", "community", "tool", "other"]
        },
        "updatedAt": { "type": "string", "format": "date-time" },
        "source": { "type": "string", "enum": ["manual", "ai_assisted", "imported"] }
      }
    },
    "problem": {
      "type": "object",
      "additionalProperties": false,
      "required": ["background", "problemStatement"],
      "properties": {
        "background": { "type": "string" },
        "problemStatement": { "type": "string", "minLength": 1 },
        "targetUsers": { "type": "array", "items": { "type": "string" } },
        "constraints": { "type": "array", "items": { "type": "string" } }
      }
    },
    "goals": {
      "type": "object",
      "additionalProperties": false,
      "required": ["goals", "nonGoals"],
      "properties": {
        "goals": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["goal", "metric"],
            "properties": {
              "goal": { "type": "string", "minLength": 1 },
              "metric": { "type": "string", "minLength": 1 },
              "baseline": { "type": "string" },
              "target": { "type": "string" },
              "timeWindow": { "type": "string" }
            }
          }
        },
        "nonGoals": { "type": "array", "items": { "type": "string" } }
      }
    },
    "scope": {
      "type": "object",
      "additionalProperties": false,
      "required": ["inScope", "outScope", "openQuestions"],
      "properties": {
        "inScope": { "type": "array", "items": { "type": "string" } },
        "outScope": { "type": "array", "items": { "type": "string" } },
        "assumptions": { "type": "array", "items": { "type": "string" } },
        "openQuestions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "journeys": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "primary": { "type": "array", "items": { "$ref": "#/$defs/journeyStep" } },
        "secondary": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["name", "steps"],
            "properties": {
              "name": { "type": "string" },
              "steps": { "type": "array", "items": { "$ref": "#/$defs/journeyStep" } }
            }
          }
        }
      }
    },
    "requirements": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/requirement" }
    },
    "tracking": {
      "type": "object",
      "additionalProperties": false,
      "properties": { "events": { "type": "array", "items": { "$ref": "#/$defs/trackingEvent" } } }
    },
    "nfr": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["type", "requirement"],
            "properties": {
              "type": { "type": "string", "enum": ["performance", "availability", "security", "privacy", "accessibility", "other"] },
              "requirement": { "type": "string", "minLength": 1 }
            }
          }
        }
      }
    },
    "release": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "plan": { "type": "array", "items": { "type": "string" } },
        "monitoring": { "type": "array", "items": { "type": "string" } },
        "rollback": { "type": "array", "items": { "type": "string" } }
      }
    },
    "glossary": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "terms": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["term", "definition"],
            "properties": {
              "term": { "type": "string", "minLength": 1 },
              "definition": { "type": "string", "minLength": 1 }
            }
          }
        }
      }
    },
    "changeLog": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "summary": { "type": "string" },
        "changes": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["type", "detail"],
            "properties": {
              "type": { "type": "string", "enum": ["added", "modified", "removed", "fixed"] },
              "detail": { "type": "string", "minLength": 1 }
            }
          }
        }
      }
    }
  },
  "$defs": {
    "journeyStep": {
      "type": "object",
      "additionalProperties": false,
      "required": ["stepTitle", "userIntent", "systemResponse"],
      "properties": {
        "stepTitle": { "type": "string", "minLength": 1 },
        "userIntent": { "type": "string", "minLength": 1 },
        "systemResponse": { "type": "string", "minLength": 1 }
      }
    },
    "givenWhenThen": {
      "type": "object",
      "additionalProperties": false,
      "required": ["given", "when", "then"],
      "properties": {
        "given": { "type": "string", "minLength": 1 },
        "when": { "type": "string", "minLength": 1 },
        "then": { "type": "string", "minLength": 1 }
      }
    },
    "requirementFlowStep": {
      "type": "object",
      "additionalProperties": false,
      "required": ["step", "action", "system"],
      "properties": {
        "step": { "type": "integer", "minimum": 1 },
        "action": { "type": "string", "minLength": 1 },
        "system": { "type": "string", "minLength": 1 }
      }
    },
    "requirement": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "title", "priority", "userStory", "acceptance", "edgeCases"],
      "properties": {
        "id": { "type": "string", "pattern": "^[A-Za-z][A-Za-z0-9_-]{1,63}$" },
        "title": { "type": "string", "minLength": 1 },
        "priority": { "type": "string", "enum": ["P0", "P1", "P2"] },
        "userStory": { "type": "string", "minLength": 1 },
        "description": { "type": "string" },
        "flows": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "main": { "type": "array", "items": { "$ref": "#/$defs/requirementFlowStep" } },
            "alternatives": { "type": "array", "items": { "$ref": "#/$defs/requirementFlowStep" } }
          }
        },
        "acceptance": { "type": "array", "minItems": 1, "items": { "$ref": "#/$defs/givenWhenThen" } },
        "edgeCases": { "type": "array", "minItems": 1, "items": { "type": "string" } },
        "dependencies": { "type": "array", "items": { "type": "string" } },
        "trackingRefs": { "type": "array", "items": { "type": "string" } },
        "codingNotes": { "type": "array", "items": { "type": "string" } }
      }
    },
    "trackingEvent": {
      "type": "object",
      "additionalProperties": false,
      "required": ["eventName", "trigger"],
      "properties": {
        "eventName": { "type": "string", "minLength": 1 },
        "trigger": { "type": "string", "minLength": 1 },
        "properties": {
          "type": "array",
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["name", "type"],
            "properties": {
              "name": { "type": "string", "minLength": 1 },
              "type": { "type": "string", "enum": ["string", "number", "boolean", "enum", "object"] },
              "description": { "type": "string" }
            }
          }
        },
        "metricMapping": { "type": "string" }
      }
    }
  }
}
```

### 3.3 Requirement Constraints
- ID pattern: `^[A-Za-z][A-Za-z0-9_-]{1,63}$`
- Priority: `P0 | P1 | P2`
- `flows` is optional but recommended; `flows.main` uses 3–7 steps.

---

## 4. Template DSL (schemaJson v0.1)

### 4.1 Template Structure
Template defines UI sections, fields, validation, and export mapping.

Key fields:
- `templateSchemaVersion`, `contextSchemaVersion`
- `sections[]` with `fields[]`
- `readinessRules` (required fields, per-requirement requirements)
- `aiHooks` for supported AI actions

### 4.2 Field Types (MVP)
- `shortText`, `longText`, `enum`, `multiEnum`, `stringList`, `table`, `objectList`, `object`

### 4.3 Export Mapping
Each field provides:
- `export.path` (JSON Pointer, e.g. `/problem/problemStatement`)
- optional `export.transform` (table → array)
- optional `exportProfile` (standard/detailed only)

---

## 5. Storage Model: fieldsJson (Section-based)
Data is stored by section key in `DocumentField.fieldsJson`:
```json
{
  "meta": { "title": "...", "platform": ["web"] },
  "problem": { "background": "...", "problemStatement": "..." },
  "requirements": { "requirements": [ { "id": "AUTH-LOGIN", "title": "..." } ] }
}
```

---

## 6. fieldPath and Path Resolution

### 6.1 FieldPath Syntax
- Document-level: `section.field` (e.g., `problem.problemStatement`)
- Requirement-level: `requirements.requirements[REQ_ID].acceptance`
- Index fallback: `requirements.requirements[#0].acceptance` when id missing

### 6.2 Resolution
- Requirement-level paths are resolved by matching `requirements[].id` to find index.
- If duplicate ids exist, auto-fix actions are disabled until user resolves.

### 6.3 Patch Paths
AI patches use relative paths from a target root (requirement or field) and are normalized server-side to JSON Pointer.

---

## 7. Readiness & Health Contract

### 7.1 Readiness Output
```
{
  "isReady": boolean,
  "completion": {
    "requiredDone": number,
    "requiredTotal": number,
    "requiredPercent": number,
    "qualityPercent": number
  },
  "blockingIssues": Issue[],
  "recommendations": Issue[],
  "perSectionStats": [ { "sectionKey": string, "requiredDone": number, "requiredTotal": number, "requiredPercent": number } ]
}
```

### 7.2 Issue Codes
Blocking:
- `REQUIRED_FIELD_MISSING`
- `REQUIRED_REQ_FIELD_MISSING`
- `INVALID_ENUM_VALUE`
- `DUPLICATE_REQUIREMENT_ID`
- `INVALID_ACCEPTANCE_ITEM`
- `TOO_MANY_ITEMS`
- `TEXT_TOO_LONG`

Recommendations:
- `FLOWS_STEP_NOT_CONTIGUOUS`
- `FLOWS_TOO_LONG`
- `OPEN_QUESTIONS_EMPTY_BUT_RISKY`

---

## 8. Issue Action Registry (Summary)
- `REQUIRED_REQ_FIELD_MISSING` → AI field_patch (single/batch) for acceptance/edgeCases
- `INVALID_ACCEPTANCE_ITEM` → AI field_patch (single)
- `OPEN_QUESTIONS_EMPTY_BUT_RISKY` → AI field_patch (openQuestions)
- `FLOWS_TOO_LONG` / `FLOWS_STEP_NOT_CONTIGUOUS` → suggested_flows or renumber steps
- `DUPLICATE_REQUIREMENT_ID` / `INVALID_ENUM_VALUE` → manual correction only

---

## 9. Export System

### 9.1 Profiles
- **Lean**: minimal fields; `flows` excluded by default
- **Standard** (default): includes journeys/tracking/nfr if present; includes flows.main when present
- **Detailed**: full context including release/changeLog

### 9.2 Language Export Rules
- ZH export: deterministic mapper → profile prune → schema validate
- EN export: AI translate → schema validate → repair → fallback (rule-based)

---

## 10. UI Structure

### 10.1 Editor
- Document-style blocks rendered from template sections
- Requirements shown as per-requirement cards
- Issue panel with actions (manual focus + AI fixes)

### 10.2 Export Page
- Profile selector (Lean/Standard/Detailed)
- Language selector (ZH/EN)
- Scope selector (all/p0_only/p0_p1)
- JSON preview and copy/download actions
- Warnings panel (AI fallback, open questions)

---

## 11. MVP Iteration Plan
1. Scaffold Next.js + Prisma + Docker Compose
2. Email/password auth + workspace bootstrap
3. Template-driven editor UI (document blocks + requirement cards)
4. Readiness/health + issue actions
5. Deterministic ZH export with profiles
6. AI tasks: fill acceptance/edgeCases, suggested flows, EN export
7. Export page UI
8. Seed templates + examples
9. Minimal domain tests
