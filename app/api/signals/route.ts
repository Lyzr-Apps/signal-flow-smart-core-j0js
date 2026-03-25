import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, getCurrentUserId } from 'lyzr-architect';

import getSignalModel from '@/models/Signal';

async function handleGet(req: NextRequest) {
  try {
    const Signal = await getSignalModel();
    const signals = await Signal.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: signals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const Signal = await getSignalModel();
    const signal = await Signal.create({
      ...body,
      owner_user_id: getCurrentUserId(),
    });
    return NextResponse.json({ success: true, data: signal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const GET = authMiddleware(handleGet);
export const POST = authMiddleware(handlePost);
