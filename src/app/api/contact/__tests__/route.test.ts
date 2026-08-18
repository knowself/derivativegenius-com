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

// Require after polyfilling globals to prevent ES import hoisting issues in Jest
const { POST } = require('../route');

function createMockRequest(body: any): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('Contact API Route Handler (/api/contact)', () => {
  it('successfully validates and processes valid lead submission', async () => {
    const req = createMockRequest({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      service: 'AI-Native Web Application',
      budget: '$5,000 - $15,000',
      message: 'We want to build an intelligent client portal for our agency clients.',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(data.message).toMatch(/captured successfully/i);
  });

  it('rejects invalid email address with 400 status', async () => {
    const req = createMockRequest({
      name: 'Jane Smith',
      email: 'not-an-email',
      message: 'Valid project description that is long enough.',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Validation failed');
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'Invalid email address' }),
      ])
    );
  });

  it('rejects short message with 400 status', async () => {
    const req = createMockRequest({
      name: 'Jane Smith',
      email: 'jane@acme.com',
      message: 'Too short',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'message',
          message: 'Project description must be at least 10 characters',
        }),
      ])
    );
  });
});
