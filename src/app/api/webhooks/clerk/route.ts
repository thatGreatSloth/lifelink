import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { UserRepository } from '../../../../../lib/repositories/user.repository'

type ClerkWebhookEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      verification?: { status: string }
    }>
    phone_numbers: Array<{
      phone_number: string
      verification?: { status: string }
    }>
    first_name: string
    last_name: string
    [key: string]: any
  }
}

export async function POST(req: Request) {
  console.log('🔔 Webhook received!')
  
  //this renders headers easier to read in the logs
  console.log('Headers:', Object.fromEntries(await headers()))
  
  const payload = await req.text()
  console.log('Payload received:', payload)
  
  const headerList = await headers()

  const svixHeaders = {
    'svix-id': headerList.get('svix-id')!,
    'svix-timestamp': headerList.get('svix-timestamp')!,
    'svix-signature': headerList.get('svix-signature')!,
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!)

  let event: ClerkWebhookEvent

  try {
    event = wh.verify(payload, svixHeaders) as ClerkWebhookEvent
  } catch (err) {
    console.error('Webhook verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event

  try {
    switch (type) {
      case 'user.created':
        await UserRepository.createFromClerk({
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phoneNumber: data.phone_numbers[0]?.phone_number,
          emailVerified: data.email_addresses[0]?.verification?.status === 'verified',
          phoneVerified: data.phone_numbers[0]?.verification?.status === 'verified',
        })
        break

      case 'user.updated':
        await UserRepository.updateFromClerk(data.id, {
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_numbers[0]?.phone_number,
          emailVerified: data.email_addresses[0]?.verification?.status === 'verified',
          phoneVerified: data.phone_numbers[0]?.verification?.status === 'verified',
        })
        break

      case 'user.deleted':
        if (data.id) {
          await UserRepository.deleteByClerkId(data.id)
        }
        break

      default:
        console.log(`Unhandled webhook event type: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}
