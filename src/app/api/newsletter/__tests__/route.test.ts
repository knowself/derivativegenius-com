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

const { POST } = require('../route');

function createMockRequest(body: any): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('Newsletter API Route Handler (/api/newsletter)', () => {
  it('successfully validates and handles valid email submission', async () => {
    const req = createMockRequest({
      email: 'test@example.com',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/subscrib/i);
  });

  it('rejects invalid email address with 400 status', async () => {
    const req = createMockRequest({
      email: 'invalid-email-string',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});
