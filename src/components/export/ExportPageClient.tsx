'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExportSettings, ExportProfile, ExportLanguage, ExportScope } from './ExportSettings';
import { ExportPreview } from './ExportPreview';
import { ExportWarnings } from './ExportWarnings';

export const ExportPageClient = ({ id }: { id: string }) => {
  const [profile, setProfile] = useState<ExportProfile>('standard');
  const [language, setLanguage] = useState<ExportLanguage>('zh');
  const [scope, setScope] = useState<ExportScope>('all');
  const [includeFlows, setIncludeFlows] = useState(false);
  const [generateFlows, setGenerateFlows] = useState(false);
  const [tokenBudget, setTokenBudget] = useState(45);
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const baseRequirements = [
        {
          id: 'AUTH-LOGIN',
          priority: 'P0',
          title: language === 'zh' ? '用户登录' : 'User Login',
          userStory: language === 'zh'
            ? '作为用户，我想用邮箱和密码登录，以便访问我的账户。'
            : 'As a user, I want to log in with email and password.',
          acceptance: [
            {
              given: language === 'zh' ? '用户输入正确的凭据' : 'User enters valid credentials',
              when: language === 'zh' ? '点击登录' : 'Clicks login',
              then: language === 'zh' ? '成功跳转到仪表盘' : 'Redirects to dashboard',
            },
          ],
          edgeCases: [
            language === 'zh' ? '密码错误5次锁定' : 'Lock after 5 failed attempts',
          ],
        },
        {
          id: 'AUTH-REGISTER',
          priority: 'P0',
          title: language === 'zh' ? '用户注册' : 'User Registration',
          userStory: language === 'zh'
            ? '作为新用户，我想创建账户以便使用平台。'
            : 'As a new user, I want to create an account.',
          acceptance: [
            {
              given: language === 'zh' ? '用户提供有效邮箱' : 'User provides valid email',
              when: language === 'zh' ? '提交注册表单' : 'Submits registration',
              then: language === 'zh' ? '账户创建成功' : 'Account is created',
            },
          ],
          edgeCases: [
            language === 'zh' ? '邮箱已存在' : 'Email already registered',
          ],
        },
        {
          id: 'PRD-EXPORT',
          priority: 'P1',
          title: language === 'zh' ? 'PRD 导出' : 'PRD Export',
          userStory: language === 'zh'
            ? '作为产品经理，我想导出结构化 JSON。'
            : 'As a PM, I want to export structured JSON.',
          acceptance: [
            {
              given: language === 'zh' ? '选择导出配置' : 'User selects export settings',
              when: language === 'zh' ? '点击导出' : 'Clicks export',
              then: language === 'zh' ? '生成有效的 JSON' : 'Generates valid JSON',
            },
          ],
          edgeCases: [
            language === 'zh' ? '必填字段缺失' : 'Required fields missing',
          ],
        },
      ];

      const filteredRequirements = baseRequirements.filter((item) => {
        if (scope === 'p0_only') return item.priority === 'P0';
        if (scope === 'p0_p1') return item.priority !== 'P2';
        return true;
      });

      const journeysPrimary = generateFlows
        ? [
            {
              stepTitle: language === 'zh' ? '配置导出' : 'Configure export',
              userIntent: language === 'zh' ? '选择配置' : 'Select settings',
              systemResponse: language === 'zh' ? '展示预览' : 'Show preview',
            },
            {
              stepTitle: language === 'zh' ? '执行导出' : 'Run export',
              userIntent: language === 'zh' ? '点击导出' : 'Click export',
              systemResponse: language === 'zh' ? '生成 JSON' : 'Generate JSON',
            },
          ]
        : [];

      const data = {
        schemaVersion: '0.1',
        meta: {
          id: `PRD-${id}`,
          title: language === 'zh' ? '新功能规格说明书' : 'New Feature Specification',
          language,
          platform: ['web'],
          productType: 'tool',
          updatedAt: new Date().toISOString(),
          source: 'manual',
        },
        problem: {
          background: language === 'zh'
            ? '当前 PRD 依赖人工整理，难以复用为编码上下文。'
            : 'Current PRDs rely on manual formatting and are hard to reuse.',
          problemStatement: language === 'zh'
            ? '缺少稳定、结构化的 PRD 导出格式。'
            : 'Lack of stable, structured PRD export format.',
          targetUsers: [language === 'zh' ? '产品经理' : 'Product Managers'],
          constraints: [],
        },
        goals: {
          goals: language === 'zh'
            ? [
                { goal: '减少导出时间', metric: '导出耗时', target: '-90%' },
                { goal: '提升一致性', metric: '格式错误率', target: '0%' },
              ]
            : [
                { goal: 'Reduce export time', metric: 'Export time', target: '-90%' },
                { goal: 'Improve consistency', metric: 'Format error rate', target: '0%' },
              ],
          nonGoals: [],
        },
        scope: {
          inScope: language === 'zh'
            ? ['JSON 导出', '配置选择', '中英文导出']
            : ['JSON export', 'Profile selection', 'ZH/EN export'],
          outScope: language === 'zh'
            ? ['第三方集成', 'PDF 导出']
            : ['Third-party integrations', 'PDF export'],
          assumptions: [],
          openQuestions: [],
        },
        ...(profile !== 'lean' && {
          journeys: {
            primary: journeysPrimary,
            secondary: [],
          },
        }),
        requirements: filteredRequirements,
        ...(profile === 'detailed' && {
          tracking: { events: [] },
          nfr: { items: [] },
          release: { plan: [], monitoring: [], rollback: [] },
          glossary: { terms: [] },
          changeLog: { summary: '', changes: [] },
        }),
      };

      setPreviewContent(JSON.stringify(data, null, 2));
      setIsLoading(false);

      let budget = 45;
      if (profile === 'detailed') budget += 30;
      if (profile === 'lean') budget -= 20;
      if (generateFlows) budget += 15;
      if (scope === 'p0_only') budget -= 10;
      setTokenBudget(Math.min(100, Math.max(0, budget)));
    }, 500);

    return () => clearTimeout(timer);
  }, [id, profile, language, scope, includeFlows, generateFlows]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([previewContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prd.context.${language}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Back button overlay */}
      <Link
        href={`/prd/${id}`}
        className="fixed top-4 left-4 z-50 btn btn-secondary text-sm shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Editor
      </Link>

      {/* Settings Panel */}
      <div className="w-80 h-full shrink-0">
        <ExportSettings
          profile={profile}
          setProfile={setProfile}
          language={language}
          setLanguage={setLanguage}
          scope={scope}
          setScope={setScope}
          includeFlows={includeFlows}
          setIncludeFlows={setIncludeFlows}
          generateFlows={generateFlows}
          setGenerateFlows={setGenerateFlows}
          tokenBudget={tokenBudget}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>

      {/* Preview Panel */}
      <ExportPreview content={previewContent} isLoading={isLoading} />

      {/* Warnings Panel */}
      <ExportWarnings
        items={[
          {
            id: 'fallback',
            type: 'fallback',
            message: language === 'zh'
              ? '英文导出使用 AI 翻译，可能需要人工校验。'
              : 'English export uses AI translation and may need review.',
          },
          {
            id: 'open-questions',
            type: 'question',
            message: language === 'zh'
              ? '开放问题列表为空，请确认是否已覆盖所有边界条件。'
              : 'Open questions list is empty. Confirm all edge cases are covered.',
          },
        ]}
      />

      {/* Toast notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="badge badge-success px-4 py-2 shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard
          </div>
        </div>
      )}
    </div>
  );
};
