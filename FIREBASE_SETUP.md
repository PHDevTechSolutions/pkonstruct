# Firebase Setup Guide

## 1. Firebase Console Configuration

### Firestore Database Rules

Go to Firebase Console → Firestore Database → Rules tab

Paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to blog posts for everyone
    match /blogPosts/{postId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow read access to projects for everyone
    match /projects/{projectId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow read access to testimonials for everyone
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow create access to contact submissions
    match /contactSubmissions/{submissionId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
    
    // Allow create access to quote requests
    match /quoteRequests/{quoteId} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

Then click **Publish**.

## 2. Environment Variables

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBEtR53_FjNX3CuQK1u_7qoFGY_ubCIzvo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pwebsites.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pwebsites
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pwebsites.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=591029721243
NEXT_PUBLIC_FIREBASE_APP_ID=1:591029721243:web:c40ddd88ad330c67ca4e3e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LKQ6GKTH43
```

## 3. Seed Initial Data

```bash
cd scripts
npx tsx seed-firebase.ts
```

## 4. Deploy Rules (Optional)

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

## Security Notes

- These rules allow **public read access** for blog posts, projects, and testimonials
- **Write access is restricted** - only seed script (using Admin SDK) can write initial data
- Contact forms can **create** submissions but not read them
- For production with authentication, update rules to check `request.auth`
