# PKonstruct - Construction Company Website

A modern, responsive construction company website built with Next.js 16, shadcn/ui, and Firebase integration.

## Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI** - Built with shadcn/ui components
- **Firebase Integration** - Ready for Firestore, Storage, and Authentication
- **Static Export** - Optimized for deployment on any static hosting

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Storage, Auth)
- **TypeScript**: Full type safety


### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in the root directory with your Firebase configuration:

```env
# Firebase Configuration (pwebsites project)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBEtR53_FjNX3CuQK1u_7qoFGY_ubCIzvo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pwebsites.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pwebsites
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pwebsites.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=591029721243
NEXT_PUBLIC_FIREBASE_APP_ID=1:591029721243:web:c40ddd88ad330c67ca4e3e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LKQ6GKTH43
```

**Note**: The `.env.local` file is gitignored for security. Never commit your actual Firebase credentials to version control.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Build for Production

```bash
npm run build
```

The static site will be generated in the `dist` folder.

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   ├── navigation.tsx
│   ├── hero.tsx
│   ├── services.tsx
│   ├── projects.tsx
│   ├── about.tsx
│   ├── contact.tsx
│   └── footer.tsx
├── lib/             # Utility functions
│   ├── utils.ts     # cn() helper
│   └── firebase.ts  # Firebase config
└── ...
```

## Sections

- **Hero** - Landing banner with CTA
- **Services** - 8 service cards
- **Projects** - Filterable portfolio
- **About** - Company story and values
- **Contact** - Form and FAQ

## Deployment

The project is configured for static export. Deploy the `dist` folder to:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- Any static hosting provider

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Firebase Documentation](https://firebase.google.com/docs)
