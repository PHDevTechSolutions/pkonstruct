# Firebase Firestore Indexes Setup

## Required Indexes

Para ma-fix ang "The query requires an index" error, kailangan mag-create ng mga composite index sa Firebase Console.

## Option 1: Automatic (Click the Link)

Click ang link sa error message o ito:

**Para sa projects index:**
https://console.firebase.google.com/v1/r/project/pwebsites/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9wd2Vic2l0ZXMvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Byb2plY3RzL2luZGV4ZXMvXxABGg0KCXB1Ymxpc2hlZBABGggKBHllYXIQAhoMCghfX25hbWVfXxAC

## Option 2: Manual Creation

1. Go to https://console.firebase.google.com
2. Select **pwebsites** project
3. Firestore Database → Indexes tab
4. Click **Create Index**

### Index 1: Blog Posts (Published + Date)
```
Collection ID: blogPosts
Field 1: published (Ascending)
Field 2: date (Descending)
Query scope: Collection
```

### Index 2: Blog Posts with Category Filter
```
Collection ID: blogPosts
Field 1: published (Ascending)
Field 2: category (Ascending)
Field 3: date (Descending)
Query scope: Collection
```

### Index 3: Projects (Published + Year)
```
Collection ID: projects
Field 1: published (Ascending)
Field 2: year (Descending)
Query scope: Collection
```

### Index 4: Projects with Category Filter
```
Collection ID: projects
Field 1: published (Ascending)
Field 2: category (Ascending)
Field 3: year (Descending)
Query scope: Collection
```

## Option 3: Deploy via CLI

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:indexes
```

## Index Status

After creation, ang index ay magiging **"Building"** status muna (1-5 minutes). Pag **"Enabled"** na, magwo-work na ang queries.

## Verification

Pag okay na ang indexes, dapat wala nang error sa console at makikita mo na ang data galing sa Firebase.
