import { browser } from 'k6/browser';
import { check } from 'k6';

/**
 * Browser Performance Test
 *
 * This test demonstrates real-browser (UI) performance testing using the
 * k6 browser module. It loads a page in a real Chromium instance, waits
 * for key elements, and measures page-level performance.
 */

export const options = {
	scenarios: {
		ui: {
			executor: 'shared-iterations',
			vus: 5,
			iterations: 10,
			maxDuration: '2m',
			options: {
				browser: {
					type: 'chromium',
				},
			},
		},
	},
	thresholds: {
		checks: ['rate>0.95'],
		browser_http_req_duration: ['p(95)<3000'],
	},
};

export default async function () {
	const page = await browser.newPage();

	try {
		const response = await page.goto('https://test.k6.io/', {
			waitUntil: 'networkidle',
		});

		check(response, {
			'status is 200': (r) => r.status() === 200,
		});

		const heading = page.locator('h1');
		check(await heading.textContent(), {
			'heading is visible': (text) => text && text.length > 0,
		});

		await page.screenshot({ path: 'tests/browser/screenshots/homepage.png' });
	} finally {
		await page.close();
	}
}

/**
 * Best Practices for Browser Load Testing:
 *
 * 1. Keep VU/iteration counts low - real browsers are resource-intensive
 * 2. Always close pages/contexts in a finally block to avoid leaked browsers
 * 3. Prefer waitUntil: 'networkidle' or explicit locators over fixed sleeps
 * 4. Use browser-specific metrics (browser_http_req_duration, browser_web_vital_*)
 * 5. Combine with protocol-level tests (api/graphql/grpc) for full-stack coverage
 * 6. Run in headless mode in CI; only use headful mode for local debugging
 */
