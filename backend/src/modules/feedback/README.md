# Feedback Certificates

## Production Setup

1. Run `backend/supabase/feedback.sql` in the Supabase SQL editor.
   - Creates `feedback_submissions`.
   - Creates a private `certificates` storage bucket if it does not exist.

2. Make sure the backend env has a Supabase key that can read/write the `certificates` bucket.
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - Optional: `CERTIFICATES_BUCKET=certificates`

3. Upload mapped certificates once:

```bash
cd backend
npm run certificates:upload
```

The upload script uploads the 52 mapped PDF certificates from:

```text
certificates/TEDxBMU 2026 OC Certificates
```

Recipient mapping is generated from:

```text
certificates/TEDxBMU 2026 OC.xlsx
```

Each PDF filename ends with `pages-{serialNo}.pdf`, matching the Excel `S.No.` column.

## Runtime Flow

1. User submits `/feedback`.
2. Backend matches by normalized email from the OC spreadsheet mapping.
3. If no email mapping exists, backend only falls back to exact normalized name for recipients whose Excel email is blank.
4. Backend downloads the mapped PDF from the private Supabase Storage bucket.
5. Backend sends it as a PDF email attachment with the recipient's contribution designation.
6. Backend best-effort logs the submission in `feedback_submissions`.

## Regenerating Recipient Mapping

If the Excel sheet changes, regenerate the mapping and re-upload:

```bash
cd backend
npm run certificates:generate
npm run certificates:upload
```
