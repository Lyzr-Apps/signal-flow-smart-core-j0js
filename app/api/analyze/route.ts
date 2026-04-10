import { NextRequest, NextResponse } from 'next/server'

const LYZR_TASK_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/task'
const LYZR_API_KEY = process.env.LYZR_API_KEY || ''
const MANAGER_AGENT_ID = '69d8f60764831a5b8a4ac41e'

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
        const pollText = await pollRes.text()
        return NextResponse.json(
          { success: false, status: 'failed', error: `Poll failed: ${pollRes.status}`, raw_response: pollText },
          { status: pollRes.status }
        )
      }

      const task = await pollRes.json()

      if (task.status === 'processing') {
        return NextResponse.json({ status: 'processing' })
      }

      if (task.status === 'failed') {
        return NextResponse.json(
          { success: false, status: 'failed', error: task.error || 'Analysis task failed' },
          { status: 500 }
        )
      }

      // Completed
      return NextResponse.json({
        success: true,
        status: 'completed',
        response: task.response,
        raw_response: JSON.stringify(task.response),
      })
    }

    // Submit mode
    const { message } = body
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'message is required' },
        { status: 400 }
      )
    }

    const userId = process.env.LYZR_USER_ID || process.env.NEXT_LYZR_USER_ID || `user-${generateUUID()}`
    const sessionId = `analyze-${generateUUID().substring(0, 12)}`

    const submitRes = await fetch(LYZR_TASK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify({
        message,
        agent_id: MANAGER_AGENT_ID,
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

    return NextResponse.json({ task_id, session_id: sessionId })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
