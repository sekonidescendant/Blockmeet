# BlockMeet V3

BlockMeet is a Web3 event discovery platform. V3 connects the V2 frontend to a real Supabase backend.

## What works
- Events, event pages, Discover and the homepage read live data from Supabase
- Sign in with an emailed link (no passwords)
- `/submit-event` saves real submissions (with image upload) for admin review
- `/host` saves real host applications for admin review
- `/admin` lets admins approve or reject events and host applications (every decision is logged)
- `/account` shows a person's own submissions, application status and notifications
- `/hosts` lists publicly visible approved host profiles, with individual `/hosts/[id]` profile pages
- Event cards show event title, date, category and location directly over the event image
- Security rules (RLS) are enforced in the database; no secret keys are used in the website

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Run locally
```bash
npm install
npm run dev
```

## Next
Automatic event discovery, AI verification, project and host profiles, host marketplace.
