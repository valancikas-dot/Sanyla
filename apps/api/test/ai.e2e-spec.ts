import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { OpenAiService } from '../src/ai/openai.service';

// Mock OpenAI service
class MockOpenAiService {
  async generateWithSchema(systemPrompt: string, userPrompt: string, schema: any) {
    return {
      overview: 'Mock 30-day strategy overview',
      targetAudience: 'Young professionals',
      keyMessages: ['Quality', 'Innovation', 'Trust'],
      weeks: [
        {
          week: 1,
          focus: 'Brand awareness',
          goals: ['Increase followers', 'Boost engagement'],
          tactics: ['Social media posts', 'Influencer partnerships'],
          kpis: ['Follower growth', 'Engagement rate'],
        },
        {
          week: 2,
          focus: 'Customer engagement',
          goals: ['Drive traffic', 'Build community'],
          tactics: ['User-generated content', 'Contests'],
          kpis: ['Website visits', 'Comments'],
        },
        {
          week: 3,
          focus: 'Product promotion',
          goals: ['Generate leads', 'Increase sales'],
          tactics: ['Product demos', 'Special offers'],
          kpis: ['Lead conversion', 'Revenue'],
        },
        {
          week: 4,
          focus: 'Community building',
          goals: ['Foster loyalty', 'Encourage referrals'],
          tactics: ['Loyalty program', 'Events'],
          kpis: ['Retention rate', 'Referrals'],
        },
      ],
    };
  }
}

describe('AI Strategy Generation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let orgId: string;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OpenAiService)
      .useClass(MockOpenAiService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);

    // Create test user & org
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'test123',
        name: 'Test User',
      })
      .expect(201);

    authToken = signupRes.body.token;

    // Get user orgs
    const meRes = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Create org if not exists
    if (!meRes.body.organizations || meRes.body.organizations.length === 0) {
      const org = await prisma.organization.create({
        data: { name: 'Test Org', slug: `test-org-${Date.now()}` },
      });
      await prisma.membership.create({
        data: {
          userId: meRes.body.id,
          organizationId: org.id,
          role: 'owner',
        },
      });
      orgId = org.id;
    } else {
      orgId = meRes.body.organizations[0].id;
    }

    // Create project
    const projectRes = await request(app.getHttpServer())
      .post(`/orgs/${orgId}/projects`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Coffee Shop',
        industry: 'Food & Beverage',
        country: 'Lithuania',
        city: 'Vilnius',
        language: 'en',
        tone: 'friendly',
        brandColors: ['#000000', '#FFFFFF'],
      })
      .expect(201);

    projectId = projectRes.body.id;
  });

  afterAll(async () => {
    // Cleanup
    if (projectId) {
      await prisma.scheduleJob.deleteMany({ where: { projectId } });
      await prisma.contentItem.deleteMany({ where: { projectId } });
      await prisma.contentBatch.deleteMany({ where: { projectId } });
      await prisma.project.delete({ where: { id: projectId } });
    }
    await app.close();
  });

  it('/projects/:projectId/ai/strategy (POST) - should generate strategy', async () => {
    const res = await request(app.getHttpServer())
      .post(`/projects/${projectId}/ai/strategy`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.type).toBe('STRATEGY');
    expect(res.body.content).toHaveProperty('overview');
    expect(res.body.content).toHaveProperty('weeks');
    expect(res.body.content.weeks).toHaveLength(4);
    expect(res.body.content.weeks[0]).toHaveProperty('focus');
    expect(res.body.content.weeks[0]).toHaveProperty('goals');
    expect(res.body.content.weeks[0]).toHaveProperty('tactics');
  });

  it('/projects/:projectId/content (GET) - should retrieve generated strategy', async () => {
    const res = await request(app.getHttpServer())
      .get(`/projects/${projectId}/content?type=STRATEGY`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].type).toBe('STRATEGY');
  });
});
