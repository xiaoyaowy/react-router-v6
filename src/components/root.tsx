/* eslint-disable react-refresh/only-export-components */
import { FC, useEffect } from 'react'
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, LoaderFunctionArgs, useSubmit, useLocation, useParams, useFetchers } from 'react-router-dom'
import { getContacts, createContact } from '@/contacts.ts'

const Root: FC = () => {
  const { contacts, q } = useLoaderData() as { contacts: ContactType[]; q: string }
  const navigation = useNavigation()
  // submit(表单对象)
  const submit = useSubmit()
  const location = useLocation()
  const params = useParams()
  // 这个 useFetchers 可以获取到全局所有的 fetcher，返回值是个数组
  const fetchers = useFetchers()

  const updateFavoriteFetcher = fetchers.find((item) => item.key === 'update-favorite')
  if (updateFavoriteFetcher && updateFavoriteFetcher.formData) {
    const state = updateFavoriteFetcher.formData.get('favorite') === 'true'
    contacts.some((item) => {
      if (item.id === params.id) {
        item.favorite = state
        return true
      }
    })
  }

  const loading = navigation.location && new URLSearchParams(navigation.location.search).has('q')

  useEffect(() => {
    const ipt = document.getElementById('q') as HTMLInputElement
    ipt.focus()
  }, [q])

  const renderContacts = () => {
    if (contacts.length === 0) {
      return (
        <p>
          <i>No contacts</i>
        </p>
      )
    }

    return (
      <ul>
        {contacts.map((item) => (
          <li key={item.id}>
            <NavLink to={'/contacts/' + item.id} className={({ isActive, isPending }) => (isActive ? 'my-active' : isPending ? 'my-pending' : '')}>
              {item.first || item.last ? (
                <>
                  {item.first} {item.last}
                </>
              ) : (
                <i>No name</i>
              )}
              {item.favorite && <span>★</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            {/* 通过 defaultValue 属性，可以为文本框设置默认值 */}
            <input
              id="q"
              className={loading ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              key={q}
              onChange={(e) => {
                // console.log(location.search)
                // const isFirstSearch = e.currentTarget.value.length === 1 && q === ''
                const isFirstSearch = e.currentTarget.value.length === 1 && location.search === ''
                submit(e.currentTarget.form, { replace: !isFirstSearch })
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!loading} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* 新增联系人的 form 表单 */}
          <Form method="post" action="/">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>{renderContacts()}</nav>
      </div>
      <div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
        {/* 在这里放占位符 */}
        <Outlet />
      </div>
    </>
  )
}

// 当前路由组件，需要用到的 loader 函数
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get('q') || ''
  const contacts = await getContacts(q)
  return { contacts, q }
}

export const action = async () => {
  const contact = await createContact()
  return redirect(`/contacts/${contact.id}/edit`)
}

export default Root
