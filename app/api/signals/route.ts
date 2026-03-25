import { NextRequest, NextResponse } from 'next/server';
import getSignalModel from '@/models/Signal';

export async function GET(req: NextRequest) {
  try {
    const Signal = await getSignalModel();
    const signals = await Signal.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: signals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const Signal = await getSignalModel();
    const signal = await Signal.create(body);
    return NextResponse.json({ success: true, data: signal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
