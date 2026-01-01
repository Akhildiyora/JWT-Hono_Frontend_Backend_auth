import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcrypt';
import { cors } from 'hono/cors';
import db from './Database/database.js';
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.SECRET

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = new Hono();
app.use('*', cors());

app.get('/', (c) => c.text('working'))

app.post('/create', async (c) => {
    const { username, email, password, age } = await c.req.json();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);;
    if (user) {
        return c.json({ message: "already Registered" }, 400);
    }
    const hash = await bcrypt.hash(password, 10);
    db.prepare(`
    INSERT INTO users (username, email, password, age)
    VALUES (?, ?, ?, ?)
  `).run(username, email, hash, age);

    return c.json({ success: true, message: "User Created Successfully", }, 201)
})

app.post('/login', async (c) => {
    const { email, password } = await c.req.json();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !user.password) {
        return c.json({ error: 'Somthing is Missing' }, 400)
    }
    const result = await bcrypt.compare(password, user.password)
    if (!result) {
        return c.json({ error: "you can't login" }, 401)
    }
    const token = await sign({ email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, JWT_SECRET)

    return c.json({ success: true, message: 'Login Successful', token, user: { email: user.email, username: user.username, }, })
})

app.post("/google-login", async (c) => {
    const { token } = await c.req.json();
    if (!token) {
        return c.json({ error: "Token missing" }, 400);
    }
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const {
        email,
        name,
        sub: googleId,
        email_verified,
    } = payload;
    if (!email || !email_verified) {
        return c.json({ error: "Email not verified" }, 401);
    }
    let user = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email);
    if (!user) {
        db.prepare(`
        INSERT INTO users (username, email, password, age)
        VALUES (?, ?, ?, ?)
      `).run(name, email, "GOOGLE_AUTH", null);
    }
    const appToken = await sign(
        {
            email,
            provider: "google",
            exp: Math.floor(Date.now() / 1000) + 60 * 60, 
        },
        JWT_SECRET
    );
    return c.json({
        success: true,
        token: appToken,
        user: { email, name },
    });

});

const authMiddleware = async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return c.json({ error: 'Unauthorized' }, 401)
    }
    const token = authHeader.split(' ')[1]
    try {
        const payload = await verify(token, JWT_SECRET)
        c.set('user', payload)
        await next()
    } catch {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
}

app.get('/profile', authMiddleware, (c) => {
    const payload = c.get('user');
    const user = db.prepare(`SELECT id, username, email, age FROM users WHERE email = ?`).get(payload.email);
    return c.json({ message: 'protected route', user });
})

app.get('/logout', (c) => {
    return c.json({ status: "logout done" })
})

serve({
    fetch: app.fetch,
    port: 3000,
})
console.log('Hono server running on http://localhost:3000')