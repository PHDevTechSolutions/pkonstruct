# Firebase Seeding Instructions

## Setup

1. **Download Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. **Enable Firestore:**
   - Go to Firebase Console → Firestore Database
   - Click "Create Database"
   - Choose "Start in production mode" or "Start in test mode"
   - Select a location close to your users

3. **Install Dependencies:**
   ```bash
   npm install firebase-admin
   ```

4. **Run Seeding Script:**
   ```bash
   npx ts-node scripts/seed-firebase.ts
   ```

## Firestore Collections Created

### 1. `blogPosts`
Fields: `title`, `excerpt`, `content`, `category`, `author`, `date`, `readTime`, `tags`, `published`

### 2. `projects`
Fields: `title`, `category`, `location`, `year`, `duration`, `size`, `team`, `client`, `description`, `challenge`, `solution`, `results`, `features`, `published`

### 3. `testimonials`
Fields: `name`, `role`, `location`, `rating`, `text`, `project`, `published`

### 4. `contactSubmissions` (auto-created)
Fields: `name`, `email`, `phone`, `projectType`, `message`, `status`, `createdAt`

### 5. `quoteRequests` (auto-created)
Fields: `name`, `email`, `phone`, `projectType`, `budget`, `timeline`, `details`, `status`, `createdAt`

## Firebase Security Rules

Add these rules to Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to published content
    match /blogPosts/{document} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    match /projects/{document} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    match /testimonials/{document} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    // Allow anyone to submit contact forms
    match /contactSubmissions/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    match /quoteRequests/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## Using Firebase in Components

### Fetch Blog Posts
```tsx
import { useBlogPosts } from "@/hooks/use-blog"

function BlogList() {
  const { posts, loading, error } = useBlogPosts("Industry Trends")
  // Use posts data
}
```

### Submit Contact Form
```tsx
import { submitContactForm } from "@/lib/contact-service"

await submitContactForm({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  projectType: "Residential",
  message: "I want to build a house."
})
```
