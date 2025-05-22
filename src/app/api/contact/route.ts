import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message } = body;

    // Basic validation (as before)
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string.' }, { status: 400 });
    }
    if (message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    // Email sending configuration from environment variables
    const {
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_FROM,
      EMAIL_TO,
    } = process.env;

    if (
      !EMAIL_HOST ||
      !EMAIL_PORT ||
      !EMAIL_USER ||
      !EMAIL_PASS ||
      !EMAIL_FROM ||
      !EMAIL_TO
    ) {
      console.error('Missing email configuration. Please check environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error: Email settings are incomplete.' },
        { status: 500 }
      );
    }

    const portNumber = Number(EMAIL_PORT);
    if (isNaN(portNumber)) {
        console.error('Invalid EMAIL_PORT. Must be a number.');
        return NextResponse.json(
            { error: 'Server configuration error: Invalid email port.' },
            { status: 500 }
        );
    }

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: portNumber,
      secure: portNumber === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email, // User's email from the form
      subject: `New Contact Form Message from ${email}`,
      text: message,
      html: `<p>You have received a new message from your website contact form:</p>
             <p><strong>From:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send message due to a server error.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing request:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
