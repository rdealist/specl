import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminEmail = 'admin@specl.dev';
  const adminPassword = 'admin123'; // Change in production!

  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log(`✅ Created admin user: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
  }

  // Create admin workspace
  let adminWorkspace = await prisma.workspace.findFirst({
    where: { ownerUserId: adminUser.id },
  });

  if (!adminWorkspace) {
    adminWorkspace = await prisma.workspace.create({
      data: {
        name: `${adminEmail}'s Workspace`,
        ownerUserId: adminUser.id,
      },
    });
    console.log(`✅ Created admin workspace`);
  } else {
    console.log(`ℹ️  Admin workspace already exists`);
  }

  // Create default template
  const templateName = 'Standard PRD v0.1';
  let defaultTemplate = await prisma.template.findFirst({
    where: {
      workspaceId: null,
      name: templateName,
    },
  });

  if (!defaultTemplate) {
    const templateSchema = {
      templateSchemaVersion: '0.1',
      contextSchemaVersion: '0.1',
      sections: [
        {
          key: 'meta',
          title: { zh: '元信息', en: 'Meta' },
          fields: [
            {
              key: 'title',
              type: 'shortText',
              label: { zh: '标题', en: 'Title' },
              required: true,
              export: { path: '/meta/title' },
            },
            {
              key: 'platform',
              type: 'multiEnum',
              label: { zh: '平台', en: 'Platform' },
              options: ['web', 'ios', 'android', 'miniprogram', 'desktop', 'backend'],
              export: { path: '/meta/platform' },
            },
            {
              key: 'productType',
              type: 'enum',
              label: { zh: '产品类型', en: 'Product Type' },
              options: ['consumer', 'business', 'internal', 'content', 'ecommerce', 'community', 'tool', 'other'],
              export: { path: '/meta/productType' },
            },
          ],
        },
        {
          key: 'problem',
          title: { zh: '问题陈述', en: 'Problem Statement' },
          fields: [
            {
              key: 'background',
              type: 'longText',
              label: { zh: '背景', en: 'Background' },
              export: { path: '/problem/background' },
            },
            {
              key: 'problemStatement',
              type: 'longText',
              label: { zh: '问题陈述', en: 'Problem Statement' },
              required: true,
              export: { path: '/problem/problemStatement' },
            },
            {
              key: 'targetUsers',
              type: 'stringList',
              label: { zh: '目标用户', en: 'Target Users' },
              export: { path: '/problem/targetUsers' },
            },
            {
              key: 'constraints',
              type: 'stringList',
              label: { zh: '约束条件', en: 'Constraints' },
              export: { path: '/problem/constraints' },
            },
          ],
        },
        {
          key: 'goals',
          title: { zh: '目标与成功指标', en: 'Goals & Success Metrics' },
          fields: [
            {
              key: 'goals',
              type: 'objectList',
              label: { zh: '目标', en: 'Goals' },
              required: true,
              itemSchema: {
                goal: { type: 'string', label: { zh: '目标', en: 'Goal' }, required: true },
                metric: { type: 'string', label: { zh: '指标', en: 'Metric' }, required: true },
                baseline: { type: 'string', label: { zh: '基线', en: 'Baseline' } },
                target: { type: 'string', label: { zh: '目标值', en: 'Target' } },
                timeWindow: { type: 'string', label: { zh: '时间窗口', en: 'Time Window' } },
              },
              export: { path: '/goals/goals' },
            },
            {
              key: 'nonGoals',
              type: 'stringList',
              label: { zh: '非目标', en: 'Non-Goals' },
              required: true,
              export: { path: '/goals/nonGoals' },
            },
          ],
        },
        {
          key: 'scope',
          title: { zh: '范围', en: 'Scope' },
          fields: [
            {
              key: 'inScope',
              type: 'stringList',
              label: { zh: '范围内', en: 'In Scope' },
              required: true,
              export: { path: '/scope/inScope' },
            },
            {
              key: 'outScope',
              type: 'stringList',
              label: { zh: '范围外', en: 'Out of Scope' },
              required: true,
              export: { path: '/scope/outScope' },
            },
            {
              key: 'assumptions',
              type: 'stringList',
              label: { zh: '假设', en: 'Assumptions' },
              export: { path: '/scope/assumptions' },
            },
            {
              key: 'openQuestions',
              type: 'stringList',
              label: { zh: '待解决问题', en: 'Open Questions' },
              required: true,
              export: { path: '/scope/openQuestions' },
              aiHook: 'field_patch',
            },
          ],
        },
        {
          key: 'requirements',
          title: { zh: '需求清单', en: 'Requirements' },
          isRequirementSection: true,
          fields: [
            {
              key: 'id',
              type: 'shortText',
              label: { zh: 'ID', en: 'ID' },
              required: true,
              validation: { pattern: '^[A-Za-z][A-Za-z0-9_-]{1,63}$' },
              export: { path: '/requirements/[]/id' },
            },
            {
              key: 'title',
              type: 'shortText',
              label: { zh: '标题', en: 'Title' },
              required: true,
              export: { path: '/requirements/[]/title' },
            },
            {
              key: 'priority',
              type: 'enum',
              label: { zh: '优先级', en: 'Priority' },
              required: true,
              options: ['P0', 'P1', 'P2'],
              export: { path: '/requirements/[]/priority' },
            },
            {
              key: 'userStory',
              type: 'longText',
              label: { zh: '用户故事', en: 'User Story' },
              required: true,
              export: { path: '/requirements/[]/userStory' },
            },
            {
              key: 'description',
              type: 'longText',
              label: { zh: '描述', en: 'Description' },
              export: { path: '/requirements/[]/description' },
            },
            {
              key: 'acceptance',
              type: 'objectList',
              label: { zh: '验收标准', en: 'Acceptance Criteria' },
              required: true,
              itemSchema: {
                given: { type: 'string', label: { zh: '前置条件', en: 'Given' }, required: true },
                when: { type: 'string', label: { zh: '操作', en: 'When' }, required: true },
                then: { type: 'string', label: { zh: '结果', en: 'Then' }, required: true },
              },
              export: { path: '/requirements/[]/acceptance' },
              aiHook: 'field_patch',
            },
            {
              key: 'edgeCases',
              type: 'stringList',
              label: { zh: '边界情况', en: 'Edge Cases' },
              required: true,
              export: { path: '/requirements/[]/edgeCases' },
              aiHook: 'field_patch',
            },
            {
              key: 'flows',
              type: 'object',
              label: { zh: '流程', en: 'Flows' },
              schema: {
                main: {
                  type: 'array',
                  label: { zh: '主流程', en: 'Main Flow' },
                  itemSchema: {
                    step: { type: 'number', required: true },
                    action: { type: 'string', required: true },
                    system: { type: 'string', required: true },
                  },
                },
                alternatives: {
                  type: 'array',
                  label: { zh: '替代流程', en: 'Alternative Flows' },
                  itemSchema: {
                    step: { type: 'number', required: true },
                    action: { type: 'string', required: true },
                    system: { type: 'string', required: true },
                  },
                },
              },
              export: { path: '/requirements/[]/flows', exportProfile: 'standard' },
              aiHook: 'suggested_flows',
            },
            {
              key: 'dependencies',
              type: 'stringList',
              label: { zh: '依赖', en: 'Dependencies' },
              export: { path: '/requirements/[]/dependencies' },
            },
            {
              key: 'codingNotes',
              type: 'stringList',
              label: { zh: '编码备注', en: 'Coding Notes' },
              export: { path: '/requirements/[]/codingNotes', exportProfile: 'detailed' },
            },
          ],
        },
        {
          key: 'tracking',
          title: { zh: '埋点追踪', en: 'Tracking' },
          fields: [
            {
              key: 'events',
              type: 'objectList',
              label: { zh: '事件', en: 'Events' },
              itemSchema: {
                eventName: { type: 'string', required: true },
                trigger: { type: 'string', required: true },
                properties: {
                  type: 'array',
                  itemSchema: {
                    name: { type: 'string', required: true },
                    type: { type: 'string', enum: ['string', 'number', 'boolean', 'enum', 'object'], required: true },
                    description: { type: 'string' },
                  },
                },
              },
              export: { path: '/tracking/events', exportProfile: 'standard' },
            },
          ],
        },
        {
          key: 'nfr',
          title: { zh: '非功能需求', en: 'Non-Functional Requirements' },
          fields: [
            {
              key: 'items',
              type: 'objectList',
              label: { zh: 'NFR 列表', en: 'NFR Items' },
              itemSchema: {
                type: {
                  type: 'string',
                  enum: ['performance', 'availability', 'security', 'privacy', 'accessibility', 'other'],
                  required: true,
                },
                requirement: { type: 'string', required: true },
              },
              export: { path: '/nfr/items', exportProfile: 'standard' },
            },
          ],
        },
        {
          key: 'glossary',
          title: { zh: '术语表', en: 'Glossary' },
          fields: [
            {
              key: 'terms',
              type: 'objectList',
              label: { zh: '术语', en: 'Terms' },
              itemSchema: {
                term: { type: 'string', required: true },
                definition: { type: 'string', required: true },
              },
              export: { path: '/glossary/terms' },
            },
          ],
        },
      ],
      readinessRules: {
        requireFields: [
          'meta.title',
          'problem.problemStatement',
          'goals.goals',
          'scope.inScope',
          'scope.outScope',
          'scope.openQuestions',
        ],
        requirePerRequirement: ['id', 'title', 'priority', 'userStory', 'acceptance', 'edgeCases'],
      },
      aiHooks: {
        acceptance: { taskType: 'field_patch', scope: 'single' },
        edgeCases: { taskType: 'field_patch', scope: 'single' },
        flows: { taskType: 'suggested_flows', scope: 'single' },
        openQuestions: { taskType: 'field_patch', scope: 'single' },
      },
    };

    defaultTemplate = await prisma.template.create({
      data: {
        workspaceId: null, // Global template
        name: templateName,
        version: '0.1',
        schemaJson: templateSchema,
      },
    });
    console.log(`✅ Created default template: ${templateName}`);
  } else {
    console.log(`ℹ️  Default template already exists: ${templateName}`);
  }

  // Create example document
  const exampleTitle = 'Example: User Authentication System';
  let exampleDoc = await prisma.document.findFirst({
    where: {
      workspaceId: adminWorkspace.id,
      title: exampleTitle,
    },
  });

  if (!exampleDoc) {
    exampleDoc = await prisma.document.create({
      data: {
        workspaceId: adminWorkspace.id,
        templateId: defaultTemplate.id,
        title: exampleTitle,
        languageMode: 'zh',
        status: 'draft',
        createdByUserId: adminUser.id,
      },
    });

    // Create initial fields for example document
    await prisma.documentField.create({
      data: {
        documentId: exampleDoc.id,
        fieldsJson: {
          meta: {
            title: 'User Authentication System',
            platform: ['web', 'ios', 'android'],
            productType: 'consumer',
          },
          problem: {
            background: 'Users currently have no way to securely access their personal data. We need a robust authentication system.',
            problemStatement: 'Lack of user authentication prevents personalization and secure data access.',
            targetUsers: ['New users signing up', 'Existing users logging in'],
            constraints: ['Must comply with GDPR', 'Must support OAuth 2.0'],
          },
          goals: {
            goals: [
              {
                goal: 'Enable secure user login',
                metric: 'Login success rate',
                baseline: '0%',
                target: '99.5%',
                timeWindow: '3 months',
              },
            ],
            nonGoals: ['Multi-factor authentication (v2)', 'Biometric login (v2)'],
          },
          scope: {
            inScope: ['Email/password login', 'OAuth integration', 'Password reset'],
            outScope: ['SSO integration', 'Passwordless login'],
            assumptions: ['Users have valid email addresses', 'SMTP server is available'],
            openQuestions: ['Should we rate limit login attempts?'],
          },
          requirements: {
            requirements: [
              {
                id: 'AUTH-LOGIN',
                title: 'User Login Flow',
                priority: 'P0',
                userStory: 'As a user, I want to log in with my email and password so that I can access my account securely.',
                description: 'Implement standard email/password authentication with session management.',
                acceptance: [
                  {
                    given: 'User has a registered account',
                    when: 'User enters valid credentials and clicks login',
                    then: 'System authenticates user and redirects to dashboard',
                  },
                  {
                    given: 'User enters incorrect password',
                    when: 'User clicks login',
                    then: 'System shows error message and does not authenticate',
                  },
                ],
                edgeCases: [
                  'User enters incorrect password 5 times - account locked for 15 minutes',
                  'User tries to login with unverified email - show verification reminder',
                  'Session expires during login - redirect to login page with message',
                ],
                dependencies: [],
                codingNotes: ['Use bcrypt for password hashing', 'Store JWT in httpOnly cookie'],
              },
              {
                id: 'AUTH-REGISTER',
                title: 'User Registration',
                priority: 'P0',
                userStory: 'As a new user, I want to create an account with my email so that I can start using the platform.',
                acceptance: [
                  {
                    given: 'User provides valid email and strong password',
                    when: 'User clicks register',
                    then: 'System creates account and sends verification email',
                  },
                ],
                edgeCases: [
                  'Email already registered - show helpful error message',
                  'Weak password entered - display password requirements',
                  'Email delivery fails - allow manual verification link request',
                ],
                dependencies: [],
              },
            ],
          },
        },
      },
    });

    console.log(`✅ Created example document: ${exampleTitle}`);
  } else {
    console.log(`ℹ️  Example document already exists: ${exampleTitle}`);
  }

  console.log('🎉 Seed completed!');
  console.log('');
  console.log('📌 Admin credentials:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
