# Contributing to AI Marketing Autopilot

Thank you for your interest in contributing! 🎉

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### 1. Fork & Clone

```bash
# Fork repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/sanyla.git
cd sanyla
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Development Environment

Follow [QUICKSTART.md](./QUICKSTART.md) to configure `.env` and database.

### 4. Create Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

---

## Development Workflow

### Run Development Servers

```bash
pnpm dev
```

This starts:
- API: http://localhost:4000
- Web: http://localhost:3000

### Make Changes

Follow project structure:
```
apps/api/src/        # Backend modules
apps/web/src/app/    # Frontend pages
packages/shared/src/ # Shared types/schemas
```

### Test Your Changes

```bash
# Run tests
pnpm test

# Run E2E tests
cd apps/api
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format
```

### Commit

Use conventional commits:

```bash
git add .
git commit -m "feat: add social media integration"
# or
git commit -m "fix: resolve OpenAI timeout issue"
# or
git commit -m "docs: update setup instructions"
```

**Commit Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Push & PR

```bash
git push origin feature/your-feature-name
```

Then create Pull Request on GitHub.

---

## Pull Request Guidelines

### PR Title

Use conventional commit format:
```
feat: add TikTok integration
fix: resolve database connection timeout
docs: improve setup guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Added E2E tests
- [ ] Updated documentation

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Fixes #123
```

### PR Checklist

- [ ] Code follows project style (run `pnpm lint`)
- [ ] Code is formatted (run `pnpm format`)
- [ ] Tests pass (run `pnpm test`)
- [ ] Documentation updated (if needed)
- [ ] No console.log() in production code
- [ ] No commented-out code
- [ ] TypeScript types added (no `any`)
- [ ] Environment variables documented (if new)

---

## Project Structure

```
Sanyla/
├── apps/
│   ├── api/              # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/    # Authentication module
│   │   │   ├── ai/      # OpenAI integration
│   │   │   ├── projects/
│   │   │   ├── content/
│   │   │   ├── scheduler/
│   │   │   ├── analytics/
│   │   │   ├── common/  # Shared services
│   │   │   └── prisma/  # Database service
│   │   └── test/        # E2E tests
│   │
│   └── web/              # Next.js Frontend
│       ├── src/
│       │   ├── app/     # App Router pages
│       │   ├── components/
│       │   └── lib/     # Utilities
│       └── public/      # Static assets
│
├── packages/
│   └── shared/          # Shared code
│       ├── schemas.ts   # Zod schemas
│       ├── types.ts     # TypeScript types
│       └── constants.ts
│
└── prisma/
    ├── schema.prisma    # Database schema
    └── seed.ts          # Seed data
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

async function getUser(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id: any): any {
  return prisma.user.findUnique({ where: { id } });
}
```

### NestJS Controllers

```typescript
// ✅ Good
@Controller('projects')
export class ProjectsController {
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.create(user.id, dto);
  }
}

// ❌ Bad
@Controller('projects')
export class ProjectsController {
  @Post()
  async create(@Body() body: any) {
    return this.projectsService.create(body);
  }
}
```

### React Components

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={cn(styles[variant])} onClick={onClick}>
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Naming Conventions

- **Files:** kebab-case (`user-service.ts`, `auth-controller.tsx`)
- **Classes:** PascalCase (`UserService`, `AuthController`)
- **Functions:** camelCase (`getUserById`, `handleSubmit`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Interfaces:** PascalCase with `I` prefix optional (`User` or `IUser`)

---

## Adding New Features

### 1. Backend Module

```bash
cd apps/api/src
mkdir feature-name
cd feature-name
touch feature.module.ts feature.service.ts feature.controller.ts
```

**feature.module.ts:**
```typescript
import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],
})
export class FeatureModule {}
```

Add to `app.module.ts`:
```typescript
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    // ...
    FeatureModule,
  ],
})
export class AppModule {}
```

### 2. Frontend Page

```bash
cd apps/web/src/app
mkdir feature-name
cd feature-name
touch page.tsx
```

**page.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function FeaturePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Feature Name</h1>
      <Card>{/* Content */}</Card>
    </div>
  );
}
```

### 3. Database Model

Edit `prisma/schema.prisma`:
```prisma
model FeatureName {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Run migration:
```bash
cd prisma
pnpm prisma migrate dev --name add-feature-name
```

### 4. Zod Schema

Edit `packages/shared/src/schemas.ts`:
```typescript
export const FeatureNameSchema = z.object({
  name: z.string().min(1).max(100),
  // ...
});
```

Export in `packages/shared/src/index.ts`:
```typescript
export { FeatureNameSchema } from './schemas';
```

---

## Testing

### Unit Tests

```typescript
// feature.service.spec.ts
describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FeatureService, PrismaService],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
  });

  it('should create item', async () => {
    const result = await service.create({ name: 'Test' });
    expect(result).toBeDefined();
    expect(result.name).toBe('Test');
  });
});
```

### E2E Tests

```typescript
// feature.e2e-spec.ts
describe('Feature (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/feature (POST)', () => {
    return request(app.getHttpServer())
      .post('/feature')
      .send({ name: 'Test' })
      .expect(201);
  });
});
```

---

## Documentation

### Code Comments

```typescript
/**
 * Generate 30-day marketing strategy using OpenAI GPT-4
 * 
 * @param projectId - Project identifier
 * @returns Promise with generated strategy content
 * @throws {NotFoundException} If project not found
 */
async generateStrategy(projectId: string): Promise<ContentItem> {
  // Implementation
}
```

### API Documentation

Add JSDoc comments for all public APIs:

```typescript
/**
 * @api {post} /projects/:id/ai/strategy Generate Marketing Strategy
 * @apiName GenerateStrategy
 * @apiGroup AI
 * 
 * @apiParam {String} id Project ID
 * 
 * @apiSuccess {Object} contentItem Generated strategy
 * @apiSuccess {String} contentItem.id Content ID
 * @apiSuccess {Object} contentItem.content Strategy JSON
 * 
 * @apiError {404} NotFound Project not found
 * @apiError {500} InternalServerError OpenAI API error
 */
```

---

## Common Tasks

### Adding New Environment Variable

1. Add to `.env`:
   ```
   NEW_VARIABLE="value"
   ```

2. Add to `.env.template`:
   ```
   # Description of variable
   NEW_VARIABLE="example-value"
   ```

3. Document in README.md environment variables table

4. Use in code:
   ```typescript
   const newVar = this.config.get('NEW_VARIABLE');
   ```

### Adding New Dependency

```bash
# Backend
cd apps/api
pnpm add package-name

# Frontend
cd apps/web
pnpm add package-name

# Shared
cd packages/shared
pnpm add package-name
```

### Updating Prisma Schema

```bash
cd prisma
# Make changes to schema.prisma
pnpm prisma migrate dev --name describe-change
pnpm prisma generate
```

---

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Commit: `git commit -m "chore: release v1.1.0"`
4. Tag: `git tag v1.1.0`
5. Push: `git push && git push --tags`

---

## Questions?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Read [README.md](./README.md)
- Open Discussion on GitHub
- Email: support@sanyla.com

---

**Thank you for contributing!** 🙏
