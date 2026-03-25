import { NextRequest, NextResponse } from 'next/server';
import getAnalysisModel from '@/models/Analysis';

export async function GET(req: NextRequest) {
  try {
    const Analysis = await getAnalysisModel();
    const analyses = await Analysis.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: analyses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const Analysis = await getAnalysisModel();
    const analysis = await Analysis.create(body);
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    const Analysis = await getAnalysisModel();
    await Analysis.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
