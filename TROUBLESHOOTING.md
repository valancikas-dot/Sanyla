# Common Issues & Solutions

## Setup Issues

### 1. "pnpm: command not found"

**Cause:** pnpm is not installed

**Solution:**
```bash
npm install -g pnpm
# or
brew install pnpm  # macOS
```

---

### 2. "Cannot find module '@prisma/client'"

**Cause:** Prisma Client not generated

**Solution:**
```bash
cd prisma
pnpm prisma generate
```

This creates `node_modules/.prisma/client` with types.

---

### 3. "ECONNREFUSED localhost:5432"

**Cause:** PostgreSQL not running or wrong connection string

**Solution:**

**If using Docker:**
```bash
cd infra
docker-compose up -d postgres
docker-compose logs postgres  # Check status
```

**If using Neon/Cloud:**
- Verify `DATABASE_URL` in `.env`
- Ensure it ends with `?sslmode=require`
- Check Neon dashboard - project might be sleeping

**Test connection:**
```bash
cd prisma
pnpm prisma db pull  # Should succeed
```

---

### 4. "Redis connection failed"

**Cause:** Redis not running or wrong URL

**Solution:**

**If using Docker:**
```bash
cd infra
docker-compose up -d redis
```

**If using Upstash:**
- Verify `REDIS_URL` in `.env`
- Check Upstash dashboard for connection string
- Ensure no trailing slashes

**Test connection:**
```bash
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

---

### 5. "OpenAI API error: 401 Unauthorized"

**Cause:** Invalid or missing API key

**Solution:**
- Get new key: https://platform.openai.com/api-keys
- Verify key starts with `sk-proj-`
- Check billing: https://platform.openai.com/usage
- Add $5+ credit if needed
- Update `.env`:
  ```
  OPENAI_API_KEY="sk-proj-your-actual-key-here"
  ```

---

### 6. "Module resolution errors"

**Cause:** Missing dependencies or wrong workspace setup

**Solution:**
```bash
# Clean reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install

# Rebuild shared package
cd packages/shared
pnpm build
```

---

### 7. "Port 3000/4000 already in use"

**Cause:** Another process using the port

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change ports in .env:
API_PORT=4001
# And in apps/web/.env.local:
NEXT_PUBLIC_API_URL="http://localhost:4001"
```

---

## Runtime Issues

### 8. "Cannot read property 'user' of undefined"

**Cause:** Prisma Client not initialized or not generated

**Solution:**
```bash
cd prisma
pnpm prisma generate
pnpm prisma db push
```

Restart dev server:
```bash
pnpm dev
```

---

### 9. "OpenAI timeout / Rate limit"

**Cause:** OpenAI API overloaded or rate limited

**Solution:**
- Wait and retry
- Check OpenAI status: https://status.openai.com
- Reduce parallel requests
- Upgrade OpenAI plan if hitting rate limits

---

### 10. "Prisma migration failed"

**Cause:** Schema conflicts or database locked

**Solution:**
```bash
# Reset database (WARNING: Deletes data)
cd prisma
pnpm prisma migrate reset

# Or force push
pnpm prisma db push --force-reset
```

---

### 11. "JWT token expired"

**Cause:** Session expired (token TTL is 1 hour)

**Solution:**
- Frontend auto-redirects to `/auth`
- Login again
- To extend TTL, edit `apps/api/src/auth/auth.module.ts`:
  ```typescript
  JwtModule.register({
    secret: config.get('JWT_SECRET'),
    signOptions: { expiresIn: '7d' }, // Changed from 1h
  })
  ```

---

### 12. "CORS error in browser"

**Cause:** API not allowing frontend origin

**Solution:**
- Verify `.env`:
  ```
  CORS_ORIGIN="http://localhost:3000"
  ```
- Check `apps/api/src/main.ts` has CORS enabled
- Ensure frontend uses correct API URL:
  ```
  NEXT_PUBLIC_API_URL="http://localhost:4000"
  ```

---

### 13. "Queue jobs not processing"

**Cause:** Redis not connected or worker not running

**Solution:**
- Verify Redis connection (see #4)
- Check backend logs for BullMQ errors
- Restart backend:
  ```bash
  cd apps/api
  pnpm start:dev
  ```

---

### 14. "Build failed: TypeScript errors"

**Cause:** Type errors in code

**Solution:**
```bash
# Check errors
pnpm lint

# Generate Prisma types
cd prisma && pnpm prisma generate

# Fix shared package
cd packages/shared
pnpm build

# Retry build
cd ../..
pnpm build
```

---

### 15. "Cannot login: 401 error"

**Cause:** Wrong credentials or auth service issue

**Solution:**
- Use demo account: `demo@example.com` / `demo123`
- Verify user exists in database:
  ```bash
  cd prisma
  pnpm prisma studio
  # Check User table
  ```
- Reseed database:
  ```bash
  pnpm seed
  ```

---

## Development Issues

### 16. "Hot reload not working"

**Cause:** File watcher limits (Linux/macOS)

**Solution:**

**macOS:**
```bash
# Increase file watcher limit
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
```

**Linux:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### 17. "Docker Compose not found"

**Cause:** Docker Desktop not installed

**Solution:**
- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Or use cloud databases (Neon + Upstash) - see QUICKSTART.md

---

### 18. "Prisma Studio won't open"

**Cause:** Port 5555 in use or Prisma not connected

**Solution:**
```bash
# Kill process on 5555
lsof -ti:5555 | xargs kill -9

# Try again
cd prisma
pnpm prisma studio
```

---

### 19. "Environment variable not loaded"

**Cause:** .env not in correct location or not loaded

**Solution:**
- Ensure `.env` is in project root
- Restart dev servers completely
- Verify no typos in variable names
- Check `console.log(process.env.DATABASE_URL)` in code

---

### 20. "Git conflicts in package-lock.json"

**Cause:** Using npm instead of pnpm

**Solution:**
```bash
# Remove npm artifacts
rm package-lock.json
rm -rf node_modules

# Use pnpm exclusively
pnpm install
```

---

## Performance Issues

### 21. "AI generation very slow"

**Normal:** 10-40 seconds per generation

**If slower:**
- Check OpenAI status: https://status.openai.com
- Try smaller prompts (reduce project description length)
- Check network latency

---

### 22. "High memory usage"

**Cause:** Next.js dev mode uses more RAM

**Solution:**
- Use production build:
  ```bash
  pnpm build
  pnpm start
  ```
- Increase Node.js memory:
  ```bash
  export NODE_OPTIONS="--max-old-space-size=4096"
  pnpm dev
  ```

---

## Production Issues

### 23. "Cannot connect to Neon from server"

**Cause:** IP not whitelisted

**Solution:**
- In Neon dashboard → Settings → IP Allowlist
- Add server IP or allow all (0.0.0.0/0)

---

### 24. "HTTPS redirect loop"

**Cause:** Reverse proxy configuration

**Solution:**
- If using Nginx/Cloudflare, ensure `X-Forwarded-Proto` header set
- Configure Next.js:
  ```javascript
  // next.config.js
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  }
  ```

---

## Getting More Help

1. **Check logs:**
   ```bash
   # Backend logs
   cd apps/api
   pnpm start:dev
   
   # Frontend logs
   cd apps/web
   pnpm dev
   ```

2. **Enable debug mode:**
   ```bash
   # .env
   DEBUG=*
   NODE_ENV=development
   ```

3. **Database inspection:**
   ```bash
   cd prisma
   pnpm prisma studio
   ```

4. **Test API directly:**
   ```bash
   # Test auth endpoint
   curl -X POST http://localhost:4000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@example.com","password":"demo123"}'
   ```

5. **Check dependencies:**
   ```bash
   pnpm why <package-name>  # See why package installed
   pnpm outdated            # Check for updates
   ```

---

## Still Having Issues?

1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Check [MVP_CHECKLIST.md](./MVP_CHECKLIST.md)
3. Review [README.md](./README.md)
4. Search GitHub issues
5. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment (OS, Node version, pnpm version)
   - Relevant logs
