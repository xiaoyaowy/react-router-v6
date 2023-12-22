import type { ActionFunctionArgs } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { deleteContact } from '@/contacts.ts'

export const action = async ({ params }: ActionFunctionArgs) => {
  // throw new Error('duang!')
  await deleteContact(params.id!)
  return redirect('/')
}
