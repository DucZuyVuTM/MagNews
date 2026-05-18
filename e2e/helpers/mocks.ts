import type { Page } from '@playwright/test';

const BACKEND = '**/api';

export const FAKE_USER = {
  id: 1,
  email: 'tester@example.com',
  username: 'tester',
  full_name: 'Test User',
  role: 'user',
  is_active: true,
  created_at: '2026-05-18T00:00:00Z',
};

export const FAKE_ADMIN = {
  id: 2,
  email: 'admin@example.com',
  username: 'admin',
  full_name: 'Admin',
  role: 'admin',
  is_active: true,
  created_at: '2026-05-18T00:00:00Z',
};

export const FAKE_PUBLICATIONS = [
  {
    id: 1,
    title: 'Daily News',
    description: 'Daily newspaper coverage of national events',
    type: 'newspaper',
    publisher: 'News Corp',
    frequency: 'daily',
    price_monthly: 5.0,
    price_yearly: 50.0,
    cover_image_url: null,
    is_visible: true,
    is_available: true,
    created_at: '2026-05-18T00:00:00Z',
  },
  {
    id: 2,
    title: 'Science Today',
    description: 'Weekly magazine about science and tech',
    type: 'magazine',
    publisher: 'SciPub',
    frequency: 'weekly',
    price_monthly: 8.0,
    price_yearly: 80.0,
    cover_image_url: null,
    is_visible: true,
    is_available: true,
    created_at: '2026-05-18T00:00:00Z',
  },
  {
    id: 3,
    title: 'Research Journal',
    description: 'Monthly research journal',
    type: 'journal',
    publisher: 'Academic Press',
    frequency: 'monthly',
    price_monthly: 12.0,
    price_yearly: 120.0,
    cover_image_url: null,
    is_visible: true,
    is_available: true,
    created_at: '2026-05-18T00:00:00Z',
  },
];

export async function mockBackend(page: Page, options: { admin?: boolean } = {}) {
  const me = options.admin ? FAKE_ADMIN : FAKE_USER;

  await page.route('**/api/users/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake.jwt.token',
        token_type: 'bearer',
      }),
    });
  });

  await page.route('**/api/users/register', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ ...FAKE_USER, email: 'new@example.com' }),
    });
  });

  await page.route('**/api/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(me),
    });
  });

  await page.route('**/api/publications/all', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(FAKE_PUBLICATIONS),
    });
  });

  await page.route('**/api/publications/*', async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/publications\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const pub = FAKE_PUBLICATIONS.find((p) => p.id === id);
      if (pub) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(pub),
        });
        return;
      }
      await route.fulfill({ status: 404, body: '{}' });
      return;
    }
    await route.continue();
  });

  await page.route('**/api/publications/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('/api/publications/') || url.pathname.endsWith('/api/publications')) {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const type = url.searchParams.get('type') || '';
      let filtered = FAKE_PUBLICATIONS;
      if (q) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.publisher || '').toLowerCase().includes(q),
        );
      }
      if (type) {
        filtered = filtered.filter((p) => p.type === type);
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filtered),
      });
      return;
    }
    await route.continue();
  });

  await page.route('**/api/subscriptions/my', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/api/subscriptions/*/block', async (route) => {
    const id = route.request().url().match(/\/api\/subscriptions\/(\d+)\/block/)?.[1];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: Number(id ?? 1),
        user_id: 1,
        publication_id: 1,
        start_date: '2026-05-18T00:00:00Z',
        end_date: '2026-06-18T00:00:00Z',
        status: 'blocked',
        price: 10,
        auto_renew: false,
        created_at: '2026-05-18T00:00:00Z',
        publication: FAKE_PUBLICATIONS[0],
      }),
    });
  });

  await page.route('**/api/complaints/**', async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();

    if (method === 'POST' && url.pathname.endsWith('/api/complaints/')) {
      const body = route.request().postDataJSON() as { publication_id: number; reason: string; description?: string };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1001,
          user_id: 1,
          publication_id: body.publication_id,
          reason: body.reason,
          description: body.description ?? null,
          status: 'new',
          resolution_note: null,
          created_at: '2026-05-18T00:00:00Z',
          updated_at: '2026-05-18T00:00:00Z',
        }),
      });
      return;
    }

    if (method === 'GET' && url.pathname.endsWith('/my')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    if (method === 'GET' && /\/api\/complaints\/$/.test(url.pathname)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1001,
            user_id: 1,
            publication_id: 1,
            reason: 'Inappropriate content',
            description: 'Sample complaint',
            status: 'new',
            resolution_note: null,
            created_at: '2026-05-18T00:00:00Z',
            updated_at: '2026-05-18T00:00:00Z',
          },
        ]),
      });
      return;
    }

    await route.continue();
  });

  await page.route('**/api/publications/', async (route) => {
    const method = route.request().method();
    if (method === 'GET') {
      const url = new URL(route.request().url());
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const type = url.searchParams.get('type') || '';
      let filtered = FAKE_PUBLICATIONS;
      if (q) {
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q) ||
            (p.publisher || '').toLowerCase().includes(q),
        );
      }
      if (type) {
        filtered = filtered.filter((p) => p.type === type);
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filtered),
      });
      return;
    }
    await route.continue();
  });
}

export async function loginAs(page: Page, username = 'tester') {
  await page.goto('/login');
  await page.locator('#login').fill(username);
  await page.locator('#password').fill('FakePass123');
  await page.getByRole('main').getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/');
}
