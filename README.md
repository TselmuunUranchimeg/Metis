# Metis
A teaching platform supporting online courses and live classes

## Tech stack

### Frontend

* Next.js
* Tailwind CSS
* Font Awesome

### Backend

* Next.js Serverless functions
* Prisma
* Next-Auth

### Storage

* PostgreSQL
* AWS S3 (with AWS Cloudfront)

## How to run local

1. Download the repository
2. Create .env file at the root directory and fill in the variables

```
DATABASE_URL="Your PostgreSQL database link"
GOOGLE_CLIENT_ID="For OAuth"
GOOGLE_CLIENT_SECRET="For OAuth"
NEXTAUTH_SECRET="Secret key necessary for Next-Auth.js"
AWS_ACCESS_KEY="For S3"
AWS_SECRET_ACCESS_KEY="For S3"
```
3. Run the ```npm run dev``` command.
