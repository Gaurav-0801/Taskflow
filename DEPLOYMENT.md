# Deployment Guide

This guide provides step-by-step instructions for deploying TaskFlow with the backend on Render and the frontend on Vercel.

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│  Vercel         │────────▶│  Render         │
│  (Frontend)     │  CORS   │  (Backend API)  │
│                 │◀────────│                 │
└─────────────────┘         └────────┬────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │  Neon         │
                              │  PostgreSQL   │
                              └───────────────┘
```

## Prerequisites

- GitHub repository with your code
- Neon PostgreSQL database (or any PostgreSQL database)
- Render account (free tier available)
- Vercel account (free tier available)

## Part 1: Deploy Backend to Render

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub
2. Verify that `render.yaml` exists in the root directory
3. Make sure `backend/package.json` has the correct build and start scripts

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file automatically

### Step 3: Configure Environment Variables

In the Render dashboard, navigate to your service → **Environment** tab and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3001` (or leave empty for auto-assignment) | Server port |
| `DATABASE_URL` | `postgresql://user:password@host/database` | Your Neon PostgreSQL connection string |
| `JWT_SECRET` | `your-strong-random-secret-key` | Secret key for JWT tokens (use a strong random string) |
| `CORS_ORIGIN` | `https://taskflow-self-omega.vercel.app` | Frontend URL (your Vercel deployment) |

**Important Notes:**
- `JWT_SECRET`: Generate a strong random string (at least 32 characters). You can use:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `DATABASE_URL`: Get this from your Neon dashboard → Connection String
- `CORS_ORIGIN`: Use your exact Vercel deployment URL (with or without trailing slash)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build the TypeScript code
   - Start the server
3. Wait for deployment to complete (usually 2-5 minutes)
4. Note your backend URL: `https://your-service-name.onrender.com`

### Step 5: Verify Backend Deployment

1. Test the health endpoint:
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
   Should return: `{"status":"ok"}`

2. Check CORS headers:
   ```bash
   curl -H "Origin: https://taskflow-self-omega.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-service-name.onrender.com/health \
        -v
   ```
   Should include `Access-Control-Allow-Origin` header

## Part 2: Configure Frontend on Vercel

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TaskFlow project

### Step 2: Update Environment Variables

Navigate to **Settings** → **Environment Variables** and set:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-service-name.onrender.com` | Your Render backend URL (from Part 1, Step 4) |
| `JWT_SECRET` | `same-as-backend` | Must match the `JWT_SECRET` used in Render |
| `DATABASE_URL` | `postgresql://...` | Only if needed for server-side operations |

**Important:**
- `NEXT_PUBLIC_API_URL` must start with `https://` (not `http://`)
- Do NOT include a trailing slash
- The `JWT_SECRET` must be identical to the one in Render

### Step 3: Redeploy Frontend

1. After updating environment variables, trigger a new deployment:
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger automatic deployment

2. Wait for deployment to complete

## Part 3: Testing the Deployment

### 1. Test Backend Health

```bash
curl https://your-service-name.onrender.com/health
```

Expected response:
```json
{"status":"ok"}
```

### 2. Test CORS Configuration

Open browser console on your Vercel frontend and run:
```javascript
fetch('https://your-service-name.onrender.com/health', {
  credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Should return `{status: "ok"}` without CORS errors.

### 3. Test Authentication Flow

1. Visit your Vercel frontend: `https://taskflow-self-omega.vercel.app`
2. Try to sign up with a new account
3. Verify you can log in
4. Check that tasks can be created, read, updated, and deleted

### 4. Verify API Connectivity

In browser DevTools → Network tab:
- Check that API requests go to your Render backend URL
- Verify requests include proper CORS headers
- Confirm cookies are being sent/received correctly

## Troubleshooting

### Backend Issues

**Problem: Build fails on Render**
- Check that `backend/package.json` has correct `build` and `start` scripts
- Verify TypeScript is installed as a dev dependency
- Check Render build logs for specific errors

**Problem: CORS errors**
- Verify `CORS_ORIGIN` in Render matches your exact Vercel URL
- Check that the URL doesn't have a trailing slash mismatch
- Ensure `credentials: true` is set in CORS config (already done)

**Problem: Database connection fails**
- Verify `DATABASE_URL` is correct in Render environment variables
- Check that your Neon database allows connections from Render's IPs
- Ensure SSL is enabled in the connection string

### Frontend Issues

**Problem: API calls fail with network errors**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check that the URL uses `https://` (not `http://`)
- Ensure there's no trailing slash in the URL

**Problem: Authentication doesn't work**
- Verify `JWT_SECRET` matches between Vercel and Render
- Check browser console for CORS errors
- Verify cookies are being set (check Application → Cookies in DevTools)

**Problem: Environment variables not updating**
- Redeploy the frontend after changing environment variables
- Clear browser cache and cookies
- Check that variables are set for the correct environment (Production)

## Environment Variables Checklist

### Render (Backend) ✅
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001` (optional, Render can auto-assign)
- [ ] `DATABASE_URL` = Your Neon PostgreSQL connection string
- [ ] `JWT_SECRET` = Strong random secret (32+ characters)
- [ ] `CORS_ORIGIN` = `https://taskflow-self-omega.vercel.app`

### Vercel (Frontend) ✅
- [ ] `NEXT_PUBLIC_API_URL` = `https://your-service-name.onrender.com`
- [ ] `JWT_SECRET` = Same as Render backend
- [ ] `DATABASE_URL` = Only if needed for server-side operations

## Security Best Practices

1. **Never commit secrets**: Use environment variables, never hardcode
2. **Use strong JWT secrets**: Generate random 32+ character strings
3. **Enable HTTPS**: Both Render and Vercel provide HTTPS by default
4. **Database security**: Use connection pooling and SSL for database connections
5. **CORS**: Only allow your specific frontend domain, not `*`

## Monitoring

### Render
- Check **Logs** tab for server errors
- Monitor **Metrics** for CPU, memory, and response times
- Set up alerts for service downtime

### Vercel
- Check **Deployments** for build errors
- Monitor **Analytics** for performance metrics
- Review **Functions** logs for serverless function issues

## Cost Considerations

### Render Free Tier
- 750 hours/month of free usage
- Services spin down after 15 minutes of inactivity
- First request after spin-down may be slow (cold start)

### Vercel Free Tier
- Unlimited deployments
- 100GB bandwidth/month
- Serverless functions with execution limits

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render and Vercel deployment logs
3. Verify all environment variables are set correctly
4. Test API endpoints directly with curl or Postman

## Next Steps

After successful deployment:
- Set up custom domains (optional)
- Configure monitoring and alerts
- Set up CI/CD for automatic deployments
- Consider upgrading to paid tiers for better performance

