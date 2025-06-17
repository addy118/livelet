# Auth Starter Template

A modern authentication starter template for Next.js apps. Get up and running with secure, production-ready auth in **under 5 minutes**.

---

## ✨ Features

- **Credentials Login** (email & password)
- **Google OAuth Login**
- **GitHub OAuth Login**
- **Forgot Password**
- **Two-Factor Authentication** (expiry in 5 minutes)
- **Change Password**
- **Email Verification**
- **Email Change Verification**

---

## 🛠️ Tech Stack

- **Auth.js v5**
- **Next.js**
- **TypeScript**
- **Prisma** (PostgreSQL)
- **Tailwind CSS**
- **shadcn/ui**

---

## 🚀 Getting Started

### 1. Clone or Fork the Repository

```bash
git clone https://github.com/your-username/auth-kit.git
cd auth-kit
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in all required values.

```bash
cp .env.example .env
```

#### Guide to Environment Variables

- **NODE_ENV**:
  Change it to `production` for deployment or else leave it as it is for development.

- **DATABASE_URL**  
  Create a PostgreSQL database (e.g., on [Prisma Postgres](https://console.prisma.io)) and paste the connection string or use the general format of `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`.

- **AUTH_SECRET**  
  Generate a strong secret using:
  ```bash
  npm exec auth secret
  ```

- **GOOGLE_CLIENT_ID** & **GOOGLE_CLIENT_SECRET**  
  [How to get Google OAuth credentials](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)

- **GITHUB_CLIENT_ID** & **GITHUB_CLIENT_SECRET**  
  [How to get GitHub OAuth credentials](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

- **RESEND_API_KEY***  
  Create an account on [Resend](https://resend.com) and get the API key from there for sending emails 

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate --no-engine
```

### 5. Start the Development Server

```bash
npm run dev
```

---

## 🎉 Enjoy!

Your authentication starter is ready!  
> For suggestions or feature requests, [raise an issue](https://github.com/your-username/auth-kit/issues).  
> Feel free to fork and start contributing!
