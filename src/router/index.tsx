import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/error-page.tsx'

// router 是路由的配置对象
const router = createBrowserRouter([
  // 根路由
  {
    path: '/',
    errorElement: <ErrorPage />,
    async lazy() {
      const { default: Root, loader, action } = await import('@/components/root.tsx')
      return {
        Component: Root,
        loader,
        action
      }
    },
    children: [
      // 如果某个 Route 规则没有 path 选项，就是无 path 的 Route
      // 它的作用，是为 children 子路由提取公共的配置
      {
        errorElement: <ErrorPage />,
        children: [
          // 索引路由
          {
            index: true,
            async lazy() {
              const { default: Index } = await import('@/components/index.tsx')
              return {
                Component: Index
              }
            }
          },
          // 联系人信息
          /* 强调：子路由的 path 不要以 / 开头 */
          {
            path: 'contacts/:id',
            async lazy() {
              const { default: Contact, loader, action } = await import('@/components/contact.tsx')
              return {
                Component: Contact,
                loader,
                action
              }
            }
          },
          {
            path: 'contacts/:id/edit',
            async lazy() {
              const { default: EditContact, action } = await import('@/components/edit.tsx')
              const { loader } = await import('@/components/contact.tsx')
              return {
                Component: EditContact,
                action,
                loader
              }
            }
          },
          {
            path: 'contacts/:id/destroy',
            async lazy() {
              const { action } = await import('@/components/delete.tsx')
              return {
                action
              }
            }
          }
        ]
      }
    ]
  }
])

export default router
