# 🔒 Security Best Practices

## ✅ Kas padaryta:

1. **Hardcoded slaptažodis pašalintas** iš `run-migration.js`
2. **`.env` faile yra .gitignore** - nebepakliūs į Git
3. **Commit'as su fix'u push'intas**

## ⚠️ KĄ REIKIA PADARYTI DABAR:

### 1. Pakeisti Railway PostgreSQL slaptažodį

**Kodėl:** Senasis slaptažodis vis dar matomas Git commit istorijoje.

**Kaip:**
```bash
# Option 1: Railway CLI
railway login
railway link
railway variables set DATABASE_URL="postgresql://postgres:NEW_PASSWORD@tramway.proxy.rlwy.net:59033/railway"

# Option 2: Railway Dashboard
1. Eiti į https://railway.app
2. Pasirinkti projektą
3. PostgreSQL service → Variables
4. Generate new password
5. Copy naują DATABASE_URL
6. Web service → Variables → Update DATABASE_URL
```

### 2. Confirm GitGuardian alert resolved

Eikite į https://dashboard.gitguardian.com ir pažymėkite kaip "Resolved" - slaptažodis invalidated.

---

## 🛡️ Kaip išvengti ateityje:

### 1. Niekada nekopijuokite slaptažodžių į kodą

**❌ Blogai:**
```javascript
const pool = new Pool({
  connectionString: 'postgresql://postgres:PASSWORD@host/db'
});
```

**✅ Gerai:**
```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### 2. Visada naudokite .env failus

```bash
# .env (ignored by Git)
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
NEXTAUTH_SECRET="..."
```

### 3. Railway environment variables

Visi secret'ai Railway:
- Dashboard → Service → Variables
- Automatiškai injected kaip `process.env.*`

### 4. Jei atsitiktinai push'inote slaptažodį:

```bash
# 1. Invalidate slaptažodį NEDELSIANT
# 2. Commit fix (remove hardcoded value)
git commit -am "Security: Remove hardcoded secret"
git push

# 3. (Optional) Išvalyti Git istoriją
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch apps/web/scripts/run-migration.js" \
  --prune-empty --tag-name-filter cat -- --all

# 4. Force push (ATSARGIAI!)
git push origin --force --all
```

---

## 📋 Security Checklist

- [x] `.env` yra .gitignore
- [x] Hardcoded slaptažodis pašalintas
- [ ] **Railway PostgreSQL slaptažodis pakeistas** ⚠️
- [ ] GitGuardian alert resolved
- [ ] Visi secrets tik environment variables

---

## 🚀 Po slaptažodžio pakeitimo

1. Railway automatiškai redeploy'ins
2. Aplikacija veiks su nauju slaptažodžiu
3. Senasis slaptažodis nebegalioja
4. Git istorija nebe problema

**Svarbu:** Pakeiskite slaptažodį Railway dabar!
