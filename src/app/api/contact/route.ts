import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isValidEmail, escapeHtml } from '@/utils/validation';

// Variabili globali per memorizzare il transporter e le credenziali di test.
// In Node.js, le variabili definite fuori dalla funzione 'POST'
// vengono mantenute tra una richiesta e l'altra (caching).
// Questo evita di creare un nuovo account Ethereal ad ogni singolo invio!
let cachedTransporter: nodemailer.Transporter | null = null;
let cachedTestAccount: nodemailer.TestAccount | null = null;

// In-memory rate limiting per prevenire abusi (spam/DoS)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_MAP_SIZE = 1000; // Previene esaurimento memoria (DoS)

export async function POST(request: Request) {
  try {
    // SECURITY: Rate limiting basato su IP per limitare le richieste
    // Diamo priorita' a x-real-ip che viene settato in modo affidabile da proxy come Vercel.
    // Se non presente, estraiamo il primo IP dalla catena x-forwarded-for (client originario)
    // per prevenire spoofing e non bloccare il reverse proxy stesso.
    // Per ora, limitiamo la dimensione della mappa per evitare OOM (Out Of Memory).
    let ip = request.headers.get('x-real-ip');

    if (!ip) {
      const forwardedFor = request.headers.get('x-forwarded-for');
      if (forwardedFor) {
        const ips = forwardedFor.split(',');
        ip = ips[0].trim();
      } else {
        ip = 'unknown';
      }
    }
    const now = Date.now();

    // Evita crescita infinita della mappa
    if (rateLimitMap.size > MAX_MAP_SIZE) {
        // Pulisce le entry scadute
        rateLimitMap.forEach((value, key) => {
            if (now - value.timestamp >= RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        });
        // Se e' ancora troppo grande, svuotala per sicurezza
        if (rateLimitMap.size > MAX_MAP_SIZE) {
            rateLimitMap.clear();
        }
    }

    const rateLimitData = rateLimitMap.get(ip);

    if (rateLimitData && now - rateLimitData.timestamp < RATE_LIMIT_WINDOW_MS) {
      if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
        console.warn(`[SECURITY] Rate limit exceeded per IP: ${ip}`);
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      rateLimitData.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    const { email, message } = body;

    // Validazione base (Basic validation)
    // Ci assicuriamo che i dati inviati dal client siano corretti
    // prima di procedere.
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Email is too long.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string.' }, { status: 400 });
    }
    if (message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }

    // Configurazione dell'invio delle email tramite variabili d'ambiente.
    // In React e Next.js, 'process.env' ci permette di accedere a queste variabili
    // in modo sicuro lato server.
    const {
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_FROM,
      EMAIL_TO,
    } = process.env;

    let transporter: nodemailer.Transporter;
    // Variabili per il mittente e destinatario che useremo.
    // Di default, prendiamo quelle dell'ambiente.
    let mailFrom = EMAIL_FROM;
    let mailTo = EMAIL_TO;

    // Se mancano delle configurazioni essenziali per le email...
    if (
      !EMAIL_HOST ||
      !EMAIL_PORT ||
      !EMAIL_USER ||
      !EMAIL_PASS ||
      !EMAIL_FROM ||
      !EMAIL_TO
    ) {
      // Controlliamo se ci troviamo in ambiente di sviluppo locale.
      // E' un ottimo trucco per Next.js per facilitare lo sviluppo!
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Configurazione email mancante. Utilizzo account di test Ethereal per lo sviluppo locale.');

        // Riutilizziamo l'account e il transporter se li abbiamo già creati.
        // Se non esistono ancora (prima richiesta), li creiamo e li salviamo.
        if (!cachedTransporter || !cachedTestAccount) {
          console.log('Creazione di un nuovo account di test Ethereal...');
          cachedTestAccount = await nodemailer.createTestAccount();
          cachedTransporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // In sviluppo, usiamo false se la porta non è 465
            auth: {
              user: cachedTestAccount.user, // Utente fittizio generato
              pass: cachedTestAccount.pass, // Password fittizia generata
            },
          });
        }

        transporter = cachedTransporter;

        // Impostiamo mittente e destinatario fittizi per i nostri test.
        mailFrom = '"Test Utente" <test@example.com>';
        mailTo = '"Test Destinatario" <receiver@example.com>';
      } else {
        console.error('Missing email configuration. Please check environment variables.');
        return NextResponse.json(
          { error: 'Server configuration error: Email settings are incomplete.' },
          { status: 500 }
        );
      }
    } else {
      const portNumber = Number(EMAIL_PORT);
      if (isNaN(portNumber)) {
          console.error('Invalid EMAIL_PORT. Must be a number.');
          return NextResponse.json(
              { error: 'Server configuration error: Invalid email port.' },
              { status: 500 }
          );
      }

      transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: portNumber,
        secure: portNumber === 465, // true per 465, false per altre porte
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });
    }

    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    const mailOptions = {
      // L'operatore 'as string' dice a TypeScript che siamo sicuri che questa sia una stringa
      from: mailFrom as string,
      to: mailTo as string,
      replyTo: email, // Email dell'utente che ha compilato il form
      subject: `New Contact Form Message from ${escapedEmail}`,
      text: message,
      html: `<p>You have received a new message from your website contact form:</p>
             <p><strong>From:</strong> ${escapedEmail}</p>
             <p><strong>Message:</strong></p>
             <p>${escapedMessage.replace(/\n/g, '<br>')}</p>`,
    };

    try {
      // Usiamo 'await' perché l'invio della mail è un'operazione asincrona
      const info = await transporter.sendMail(mailOptions);

      // Se stiamo usando l'account di test (Ethereal), possiamo recuperare l'URL
      // del messaggio per poterlo visualizzare nel browser!
      if (process.env.NODE_ENV !== 'production' && info.messageId) {
        const testMessageUrl = nodemailer.getTestMessageUrl(info);
        if (testMessageUrl) {
          console.log('Preview URL: %s', testMessageUrl);
        }
      }

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
