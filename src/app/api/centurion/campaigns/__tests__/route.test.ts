export {};

if (typeof global.Request === 'undefined') {
  (global as any).Request = class Request {
    url: string;
    constructor(input: string) {
      this.url = input;
    }
  };
}

if (typeof global.Response === 'undefined') {
  (global as any).Response = class Response {
    static json(data: any, init?: any) {
      return {
        status: init?.status || 200,
        json: async () => data,
      };
    }
  };
}

// Lightweight NextResponse stand-in: the route only uses status + json body.
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

// Duck-typed auth mock: avoids loading @clerk/nextjs in jsdom while
// preserving the route's 401/403 contract via centurionAuthorizationResponse.
jest.mock('@/lib/auth/centurion', () => ({
  CenturionAuthorizationError: class CenturionAuthorizationError extends Error {
    status: 401 | 403;
    constructor(message: string, status: 401 | 403) {
      super(message);
      this.name = 'CenturionAuthorizationError';
      this.status = status;
    }
  },
  requireCenturionAction: jest.fn(),
  centurionAuthorizationResponse: (error: unknown) => {
    const status = (error as { status?: number } | null)?.status;
    if (status === 401 || status === 403) {
      return Response.json(
        { success: false, error: (error as Error).message },
        { status },
      );
    }
    return null;
  },
}));

const { PATCH } = require('../route');
const { requireCenturionAction } = require('@/lib/auth/centurion');

function createMockRequest(body: unknown): Request {
  return { json: async () => body } as unknown as Request;
}

const VALID_ID = '123e4567-e89b-12d3-a456-426614174000';

describe('Campaign status PATCH (/api/centurion/campaigns)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 for unauthenticated callers without touching the database', async () => {
    const { CenturionAuthorizationError } = require('@/lib/auth/centurion');
    (requireCenturionAction as jest.Mock).mockRejectedValue(
      new CenturionAuthorizationError('Authentication required', 401),
    );
    const res = await PATCH(createMockRequest({ id: VALID_ID, status: 'retired' }));
    const data = await res.json();
    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('returns 403 for roles without campaign management rights', async () => {
    const { CenturionAuthorizationError } = require('@/lib/auth/centurion');
    (requireCenturionAction as jest.Mock).mockRejectedValue(
      new CenturionAuthorizationError('Insufficient Centurion privileges', 403),
    );
    const res = await PATCH(createMockRequest({ id: VALID_ID, status: 'retired' }));
    expect(res.status).toBe(403);
  });

  it('rejects unknown statuses with 400 before any database write', async () => {
    (requireCenturionAction as jest.Mock).mockResolvedValue({ userId: 'admin-1', role: 'centurion_admin' });
    const res = await PATCH(createMockRequest({ id: VALID_ID, status: 'deleted' }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('rejects non-UUID campaign ids with 400', async () => {
    (requireCenturionAction as jest.Mock).mockResolvedValue({ userId: 'admin-1', role: 'centurion_admin' });
    const res = await PATCH(createMockRequest({ id: 'not-a-uuid', status: 'retired' }));
    expect(res.status).toBe(400);
  });
});
