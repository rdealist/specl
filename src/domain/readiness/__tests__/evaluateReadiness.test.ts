import { describe, it, expect } from 'vitest';
import { evaluateReadiness } from '../evaluateReadiness';
import type { TemplateSchema } from '../types';

describe('evaluateReadiness', () => {
  const mockTemplate: TemplateSchema = {
    sections: [
      {
        key: 'overview',
        title: { zh: '概述', en: 'Overview' },
        fields: [
          {
            key: 'title',
            label: { zh: '标题', en: 'Title' },
            type: 'text',
            required: true,
          },
          {
            key: 'summary',
            label: { zh: '摘要', en: 'Summary' },
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        key: 'requirements',
        title: { zh: '需求', en: 'Requirements' },
        repeatable: true,
        fields: [
          {
            key: 'id',
            label: { zh: '需求ID', en: 'Requirement ID' },
            type: 'text',
            required: true,
          },
          {
            key: 'userStory',
            label: { zh: '用户故事', en: 'User Story' },
            type: 'textarea',
            required: true,
          },
          {
            key: 'priority',
            label: { zh: '优先级', en: 'Priority' },
            type: 'select',
            options: [
              { value: 'P0', label: { zh: 'P0', en: 'P0' } },
              { value: 'P1', label: { zh: 'P1', en: 'P1' } },
              { value: 'P2', label: { zh: 'P2', en: 'P2' } },
            ],
            required: true,
          },
          {
            key: 'acceptance',
            label: { zh: '验收标准', en: 'Acceptance Criteria' },
            type: 'acceptance',
            required: true,
          },
        ],
      },
    ],
    readinessRules: {
      requireFields: ['overview.title', 'overview.summary'],
      requirePerRequirement: ['id', 'userStory', 'priority', 'acceptance'],
    },
  };

  describe('Required fields validation', () => {
    it('should detect missing required fields', () => {
      const fieldsJson = {
        overview: {
          title: '',
          summary: '',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues).toHaveLength(2);
      expect(result.blockingIssues[0].fieldPath).toBe('overview.title');
      expect(result.blockingIssues[0].severity).toBe('error');
      expect(result.blockingIssues[1].fieldPath).toBe('overview.summary');
    });

    it('should pass when all required fields are filled', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'This is a test summary',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(true);
      expect(result.blockingIssues).toHaveLength(0);
    });

    it('should handle whitespace-only values as empty', () => {
      const fieldsJson = {
        overview: {
          title: '   ',
          summary: '\n\t',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues).toHaveLength(2);
    });
  });

  describe('Completion percentage calculation', () => {
    it('should calculate 0% when no fields are filled', () => {
      const fieldsJson = {
        overview: {
          title: '',
          summary: '',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.completion.requiredPercent).toBe(0);
    });

    it('should calculate 50% when half required fields are filled', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: '',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.completion.requiredPercent).toBe(50);
    });

    it('should calculate 100% when all required fields are filled', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.completion.requiredPercent).toBe(100);
    });
  });

  describe('Per-requirement field validation', () => {
    it('should detect missing per-requirement fields', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: '',
              priority: 'P0',
              acceptance: [],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.length).toBeGreaterThan(0);
    });

    it('should validate all requirements', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
            {
              id: 'REQ-002',
              userStory: '',
              priority: 'P1',
              acceptance: [],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.length).toBeGreaterThan(0);
    });
  });

  describe('Duplicate requirement ID detection', () => {
    it('should detect duplicate requirement IDs', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
            {
              id: 'REQ-001',
              userStory: 'Story 2',
              priority: 'P1',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.some((issue) => issue.message.includes('Duplicate'))).toBe(true);
    });

    it('should allow different requirement IDs', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
            {
              id: 'REQ-002',
              userStory: 'Story 2',
              priority: 'P1',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(true);
      expect(result.blockingIssues.some((issue) => issue.message.includes('Duplicate'))).toBe(false);
    });
  });

  describe('Priority validation', () => {
    it('should reject invalid priority values', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'INVALID',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.some((issue) => issue.message.includes('must be P0, P1, or P2'))).toBe(true);
    });

    it('should accept valid priority values', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
            {
              id: 'REQ-002',
              userStory: 'Story 2',
              priority: 'P1',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
            {
              id: 'REQ-003',
              userStory: 'Story 3',
              priority: 'P2',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(true);
    });
  });

  describe('Acceptance criteria validation', () => {
    it('should detect empty acceptance arrays', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.length).toBeGreaterThan(0);
    });

    it('should validate GWT format (given-when-then)', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [
                { given: '', when: 'action', then: 'result' },
                { given: 'context', when: '', then: 'result' },
                { given: 'context', when: 'action', then: '' },
              ],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues.filter((issue) => issue.message.includes('Given/When/Then'))).toHaveLength(3);
    });

    it('should accept valid acceptance criteria', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [
                { given: 'user is logged in', when: 'user clicks button', then: 'modal opens' },
                { given: 'modal is open', when: 'user submits form', then: 'data is saved' },
              ],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(true);
    });
  });

  describe('Section statistics', () => {
    it('should calculate section-level statistics', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: '',
        },
        requirements: {
          requirements: [
            {
              id: 'REQ-001',
              userStory: 'Story 1',
              priority: 'P0',
              acceptance: [{ given: 'context', when: 'action', then: 'result' }],
            },
          ],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.perSectionStats).toBeDefined();
      expect(result.perSectionStats.length).toBeGreaterThan(0);
      const overviewSection = result.perSectionStats.find(s => s.sectionKey === 'overview');
      expect(overviewSection).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle missing sections gracefully', () => {
      const fieldsJson = {
        overview: {
          title: 'Test Document',
          summary: 'Test Summary',
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result).toBeDefined();
      expect(result.isReady).toBe(true);
    });

    it('should handle null values as empty', () => {
      const fieldsJson = {
        overview: {
          title: null,
          summary: null,
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues).toHaveLength(2);
    });

    it('should handle undefined values as empty', () => {
      const fieldsJson = {
        overview: {
          title: undefined,
          summary: undefined,
        },
        requirements: {
          requirements: [],
        },
      };

      const result = evaluateReadiness(fieldsJson, mockTemplate);

      expect(result.isReady).toBe(false);
      expect(result.blockingIssues).toHaveLength(2);
    });
  });
});
