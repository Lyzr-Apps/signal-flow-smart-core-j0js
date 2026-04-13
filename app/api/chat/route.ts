import { NextRequest, NextResponse } from 'next/server'

const LYZR_TASK_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/task'
const LYZR_API_KEY = process.env.LYZR_API_KEY || ''
const CHAT_AGENT_ID = '69dd164973b4b622c99ebd9e'

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!LYZR_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'LYZR_API_KEY not configured' },
        { status: 500 }
      )
    }

    // Poll mode
    if (body.task_id) {
      const pollRes = await fetch(`${LYZR_TASK_URL}/${body.task_id}`, {
        headers: {
          'accept': 'application/json',
          'x-api-key': LYZR_API_KEY,
        },
      })

      if (!pollRes.ok) {
        return NextResponse.json(
          { success: false, status: 'failed', error: `Poll failed: ${pollRes.status}` },
          { status: pollRes.status }
        )
      }

      const task = await pollRes.json()

      if (task.status === 'processing') {
        return NextResponse.json({ status: 'processing' })
      }

      if (task.status === 'failed') {
        return NextResponse.json(
          { success: false, status: 'failed', error: task.error || 'Chat task failed' },
          { status: 500 }
        )
      }

      // Completed — extract the response
      let rawResponse = task.response
      // Unwrap envelope if present
      if (rawResponse && typeof rawResponse === 'object' && 'response' in rawResponse) {
        rawResponse = rawResponse.response
      }

      return NextResponse.json({
        success: true,
        status: 'completed',
        response: rawResponse,
      })
    }

    // Submit mode
    const { message, session_id } = body
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'message is required' },
        { status: 400 }
      )
    }

    const userId = process.env.LYZR_USER_ID || process.env.NEXT_LYZR_USER_ID || `user-${generateUUID()}`
    const sessionId = session_id || `chat-${generateUUID().substring(0, 12)}`

    const submitRes = await fetch(LYZR_TASK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify({
        message,
        agent_id: CHAT_AGENT_ID,
        user_id: userId,
        session_id: sessionId,
      }),
    })

    if (!submitRes.ok) {
      const errText = await submitRes.text()
      let errorMsg = `Submit failed: ${submitRes.status}`
      try {
        const errData = JSON.parse(errText)
        errorMsg = errData?.detail || errData?.error || errData?.message || errorMsg
      } catch {}
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: submitRes.status }
      )
    }

    const { task_id } = await submitRes.json()

    return NextResponse.json({
      task_id,
      session_id: sessionId,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
