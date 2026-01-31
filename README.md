# Hallx - Web-Based Read-Only Wallet

Hallx is a web-based read-only wallet application that allows users to manage and monitor their cryptocurrency assets securely.

## Goal

The goal of this project is to make a website that lets users:

1. Generate a random seed phrase for themselves
2. Create multiple Solana and Ethereum wallets
3. See their Solana balance
4. See their USDC/other token balances

---

## 🚀 Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh) (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Hallx
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your app URL:

   ```env
   EXPO_PUBLIC_APP_URL=http://localhost:8081
   ```

### Running the Application

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `bun start`       | Start the Expo development server |
| `bun run web`     | Start for web platform            |
| `bun run ios`     | Start for iOS (macOS only)        |
| `bun run android` | Start for Android                 |
| `bun run build`   | Build for production (web)        |
| `bun run lint`    | Run ESLint                        |

**Quick Start:**

```bash
bun start
```

Then press `w` to open in a web browser, or scan the QR code with Expo Go app for mobile.

---

## ☁️ Hosting on Vercel

### Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) (optional, for CLI deployment)
- A [Vercel account](https://vercel.com/signup)

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Connect your Git repository
   - Select the `Hallx` repository

3. **Configure environment variables**
   - In the Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add the following variable:
     | Name | Value |
     |------|-------|
     | `EXPO_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |

4. **Deploy**
   - Click **Deploy** and wait for the build to complete

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

   For production deployment:

   ```bash
   vercel --prod
   ```

### Build Configuration

The project uses a custom build script (`scripts/vercel-build.js`) that:

- Runs `expo export -p web` to build the web version
- Renames the `(tabs)` directory to `tabs` for proper routing
- Copies client files to the server directory

This is automatically configured in `vercel.json`:

```json
{
  "buildCommand": "node scripts/vercel-build.js",
  "outputDirectory": "dist/server",
  "framework": null,
  "rewrites": [{ "source": "/", "destination": "/tabs/index.html" }]
}
```

---

## 📁 Project Structure

```
Hallx/
├── app/              # Main application code with file-based routing
├── api/              # Serverless API functions
├── components/       # Reusable React components
├── constants/        # Application constants and theme configuration
├── hooks/            # Custom React hooks
├── assets/           # Static assets and images
├── scripts/          # Build and utility scripts
├── utils/            # Utility functions
└── dist/             # Build output (generated)
```

---

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) with [React Native Web](https://necolas.github.io/react-native-web/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native)
- **Blockchain:** [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/), [Ethers.js](https://docs.ethers.org/)
- **Package Manager:** [Bun](https://bun.sh/)

---

## 📝 Environment Variables

| Variable              | Description                        | Example                    |
| --------------------- | ---------------------------------- | -------------------------- |
| `EXPO_PUBLIC_APP_URL` | The public URL of your application | `https://hallx.vercel.app` |
