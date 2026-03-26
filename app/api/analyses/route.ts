import { NextRequest, NextResponse } from 'next/server';
import getAnalysisModel from '@/models/Analysis';
import { runWithContext } from 'lyzr-architect';

const RLS_OWNER = process.env.ANALYSES_RLS_OWNER_ID || 'system';

function getRlsContext() {
  return { userId: RLS_OWNER, isAdmin: false };
}

export async function GET(req: NextRequest) {
  return runWithContext(getRlsContext(), async () => {
    try {
      const Analysis = await getAnalysisModel();
      const analyses = await Analysis.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: analyses });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return runWithContext(getRlsContext(), async () => {
    try {
      const body = await req.json();
      if (!body.owner_user_id) {
        body.owner_user_id = RLS_OWNER;
      }
      const Analysis = await getAnalysisModel();
      const analysis = await Analysis.create(body);
      return NextResponse.json({ success: true, data: analysis });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  });
}

export async function DELETE(req: NextRequest) {
  return runWithContext(getRlsContext(), async () => {
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
  });
}
