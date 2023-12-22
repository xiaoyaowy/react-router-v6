/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react'
import { Form, useLoaderData, useFetcher } from 'react-router-dom'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom'
import { getContact, updateContact } from '@/contacts.ts'

const Contact: FC = () => {
  // 获取 loader 返回的数据
  const { contact } = useLoaderData() as { contact: ContactType }

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || ''} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          {/* /contacts/:id/edit */}
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault()
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  )
}

const Favorite: FC<{ contact: ContactType }> = ({ contact }) => {
  // yes, this is a `let` for later
  let favorite = contact.favorite
  const fetcher = useFetcher({ key: 'update-favorite' })
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }

  return (
    <fetcher.Form method="post">
      <button name="favorite" value={favorite ? 'false' : 'true'} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id) {
    // 调用接口
    const contact = await getContact(params.id)

    if (!contact) {
      throw new Response(null, {
        status: 404,
        statusText: 'Not found!'
      })
    }

    return { contact }
  }
  return null
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const fd = await request.formData()
  await updateContact(params.id!, { favorite: fd.get('favorite') === 'true' })
  return null
}

export default Contact
