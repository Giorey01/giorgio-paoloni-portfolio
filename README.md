# My Personal photography portfolio

This is a project for my personal photography portfolio powered by NextJS
### Mobile Demo
[click here](https://giorgio-paoloni-portfolio-git-main-giorey01s-projects.vercel.app/)

## Mobile Version
![image](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/88f71b53-8f9d-4e2a-9e0b-20e92b29770b)
 
## Tablet Version
![image](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/7fb8a645-35f6-4925-b9d5-3b26de9c536b)

## Desktop Version
![image](https://github.com/Giorey01/giorgio-paoloni-portfolio/assets/61801344/28298b32-5e17-4bb8-97c0-ce0e7555d797)

## Contact Form Email Configuration

For the contact form on the "About" page to successfully send emails, you need to configure several environment variables. These variables provide the necessary credentials and settings for the email sending service (Nodemailer).

### Required Environment Variables

The following environment variables must be set:

*   `EMAIL_HOST`: The address of your SMTP server (e.g., `smtp.example.com`).
*   `EMAIL_PORT`: The port of your SMTP server (e.g., `587` for TLS, `465` for SSL).
*   `EMAIL_USER`: The username for authentication with your SMTP server.
*   `EMAIL_PASS`: The password for authentication with your SMTP server.
*   `EMAIL_FROM`: The "From" address that will appear on received emails (e.g., `"Your Website Name <noreply@yourdomain.com>"`).
*   `EMAIL_TO`: The email address where you want to receive messages from the contact form.

### How to Configure

1.  Create a file named `.env.local` in the root directory of the project (if it doesn't already exist).
2.  Add the environment variables to this file in the following format:

    ```env
    EMAIL_HOST=smtp.example.com
    EMAIL_PORT=587
    EMAIL_USER=your_smtp_username
    EMAIL_PASS=your_smtp_password
    EMAIL_FROM="Contact Form <noreply@yourwebsite.com>"
    EMAIL_TO=your_personal_email@example.com
    ```

3.  **Important**: The `.env.local` file is listed in `.gitignore` by default in Next.js projects and should **not** be committed to your Git repository, as it contains sensitive credentials.

### Nodemailer

This project uses [Nodemailer](https://nodemailer.com/) to handle email sending. For more advanced configuration options or troubleshooting, please refer to the official Nodemailer documentation.

### Security Note

Always keep your SMTP credentials secure. Do not hardcode them directly into your application files. Using environment variables (especially with a gitignored `.env.local` file for local development and platform-specific environment variable settings for deployment) is the recommended practice.


