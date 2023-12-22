/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react'
// 按需导入组件和 hook
import { Form, redirect, useLoaderData, useNavigate } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { updateContact } from '@/contacts.ts'

const EditContact: FC = () => {
  // 获取联系人的数据，用以进行数据的回显
  const { contact } = useLoaderData() as { contact: ContactType }
  const navigate = useNavigate()

  return (
    // 注意：这里用的是 react-router 提供的 Form 组件
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input placeholder="First" aria-label="First name" type="text" name="first" defaultValue={contact.first} />
        <input placeholder="Last" aria-label="Last name" type="text" name="last" defaultValue={contact.last} />
      </p>
      <label>
        <span>Twitter</span>
        <input type="text" name="twitter" placeholder="@jack" defaultValue={contact.twitter} />
      </label>
      <label>
        <span>Avatar URL</span>
        <input placeholder="https://example.com/avatar.jpg" aria-label="Avatar URL" type="text" name="avatar" defaultValue={contact.avatar} />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  )
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // 1. request.formData 是一个函数，需要 request.formData() 进行调用
  // 2. request.formData() 的返回值是 Promise 对象，需要使用 async...await 来拿到真正的 formdata 对象
  const fd = await request.formData()
  const info = Object.fromEntries(fd)
  await updateContact(params.id!, info)
  // return null
  return redirect('/contacts/' + params.id)
}

export default EditContact
