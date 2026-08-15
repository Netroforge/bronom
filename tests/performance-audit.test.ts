import { describe, expect, it } from 'vitest'
import {
  PERFORMANCE_AUDIT_LIMITS,
  normalizePerformanceOptions,
  performanceAuditPageScript,
  sanitizePerformanceReport
} from '../src/shared/performance-audit.js'
import type { BrowserPerformanceReport } from '../src/shared/types.js'

describe('performance audit', () => {
  it('defaults to a short bounded local collection window', () => {
    expect(normalizePerformanceOptions()).toEqual({ settleMs: 800 })
    expect(normalizePerformanceOptions({ settleMs: 0 })).toEqual({ settleMs: 0 })
    expect(normalizePerformanceOptions({ settleMs: PERFORMANCE_AUDIT_LIMITS.maxSettleMs })).toEqual({
      settleMs: PERFORMANCE_AUDIT_LIMITS.maxSettleMs
    })
  })

  it('rejects invalid collection windows', () => {
    expect(() => normalizePerformanceOptions({ settleMs: -1 })).toThrow('settleMs')
    expect(() => normalizePerformanceOptions({ settleMs: 1.5 })).toThrow('settleMs')
    expect(() => normalizePerformanceOptions({ settleMs: PERFORMANCE_AUDIT_LIMITS.maxSettleMs + 1 })).toThrow('settleMs')
  })

  it('builds a bounded collector without returning page markup or resource URLs', () => {
    const script = performanceAuditPageScript(
      'globalThis.webVitals = { onLCP() {}, onINP() {}, onCLS() {}, onFCP() {}, onTTFB() {} };',
      normalizePerformanceOptions(),
      '6.1.0'
    )
    expect(script).toContain('__bronomPerformanceCollector')
    expect(script).toContain("scope: 'current-visit'")
    expect(script).toContain("getEntriesByType('resource')")
    expect(script).toContain("includes('long-animation-frame')")
    expect(script).toContain('forcedStyleAndLayoutDurationMs')
    expect(script).not.toContain('outerHTML')
    expect(script).not.toContain('entry.name')
  })

  it('redacts page-authored performance attribution before returning it', () => {
    const report = sanitizePerformanceReport({
      tabId: 'tab-1',
      url: 'https://example.test/page?token=page-secret&view=kept#fragment',
      title: 'Dashboard token=title-secret',
      measuredAt: '2026-08-15T00:00:00.000Z',
      observedAt: '2026-08-15T00:00:00.000Z',
      scope: 'current-visit',
      engine: { name: 'web-vitals', version: '6.1.0' },
      metrics: {
        LCP: {
          name: 'LCP',
          value: 10,
          unit: 'ms',
          rating: 'good',
          navigationType: 'navigate token=navigation-secret',
          targets: ['#target-token=selector-secret']
        },
        INP: null,
        CLS: null,
        FCP: null,
        TTFB: null
      },
      navigation: null,
      resources: { count: 0, transferBytes: 0, encodedBodyBytes: 0, decodedBodyBytes: 0, byType: [] },
      longTasks: {
        supported: true,
        count: 1,
        totalDurationMs: 80,
        blockingTimeMs: 30,
        longestDurationMs: 80
      },
      longAnimationFrames: {
        supported: true,
        count: 1,
        totalDurationMs: 90,
        blockingDurationMs: 40,
        longestDurationMs: 90,
        renderDurationMs: 20,
        styleAndLayoutDurationMs: 10,
        frames: [{
          startTimeMs: 100,
          durationMs: 90,
          blockingDurationMs: 40,
          renderDurationMs: 20,
          styleAndLayoutDurationMs: 10,
          firstUIEventDelayMs: null,
          scriptCount: 1
        }],
        contributors: [{
          sourceUrl: 'https://example.test/app.js?token=script-secret&variant=kept#source',
          sourceFunctionName: 'run token=function-secret',
          invoker: 'button.onclick token=invoker-secret',
          invokerType: 'event-listener',
          count: 1,
          totalDurationMs: 70,
          forcedStyleAndLayoutDurationMs: 8
        }],
        truncated: false
      },
      caveats: []
    } satisfies BrowserPerformanceReport)

    expect(JSON.stringify(report)).not.toContain('page-secret')
    expect(JSON.stringify(report)).not.toContain('title-secret')
    expect(JSON.stringify(report)).not.toContain('script-secret')
    expect(JSON.stringify(report)).not.toContain('function-secret')
    expect(JSON.stringify(report)).not.toContain('invoker-secret')
    expect(report.url).toContain('view=kept')
    expect(report.longAnimationFrames.contributors[0]?.sourceUrl).toContain('variant=kept')
  })
})
