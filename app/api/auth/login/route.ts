import { NextResponse } from 'next/server';

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body. Please submit JSON credentials.' },
      { status: 400 },
    );
  }

  const { username, password } = (payload ?? {}) as {
    username?: unknown;
    password?: unknown;
  };

  const normalizedUsername = typeof username === 'string' ? username.trim() : '';
  const normalizedPassword = typeof password === 'string' ? password : '';

  const errors: Record<string, string> = {};

  if (!normalizedUsername) {
    errors.username = 'Username is required.';
  }

  if (!normalizedPassword) {
    errors.password = 'Password is required.';
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: 'Please fix the highlighted fields.', errors },
      { status: 400 },
    );
  }

  const isValidUser =
    normalizedUsername === VALID_USERNAME && normalizedPassword === VALID_PASSWORD;

  if (!isValidUser) {
    return NextResponse.json(
      { message: 'Incorrect username or password.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ message: 'Authenticated successfully.' });

  response.cookies.set('pokedex-session', 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}
