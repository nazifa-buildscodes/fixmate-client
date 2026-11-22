import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role || 'customer',
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return NextResponse.json({ token, user: session.user });
  } catch (error) {
    return NextResponse.json({ message: 'Token generation failed' }, { status: 500 });
  }
}
