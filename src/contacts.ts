import localforage from 'localforage'
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

// 获取所有联系人
export async function getContacts(query?: string) {
  await fakeNetwork(`getContacts:${query}`)
  let contacts = await localforage.getItem<ContactType[]>('contacts')
  if (!contacts) contacts = []
  if (query) {
    contacts = matchSorter(contacts, query.toString(), { keys: ['first', 'last'] })
  }
  return contacts.sort(sortBy('last', 'createdAt'))
}

// 创建联系人，返回联系人对象，只包含 id 和创建时间
export async function createContact() {
  await fakeNetwork()
  const id = Math.random().toString(36).substring(2, 9)
  const contact = { id, createdAt: Date.now() }
  const contacts = await getContacts()
  contacts.unshift(contact)
  await set(contacts)
  return contact
}

// 根据 id 获取联系人
export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`)
  const contacts = (await localforage.getItem<ContactType[]>('contacts')) || []
  const contact = contacts.find((contact) => contact.id === id)
  return contact ?? null
}

// 根据 id 和表单数据，更新联系人信息
export async function updateContact(id: string, updates: Omit<ContactType, 'id'>) {
  await fakeNetwork()
  const contacts = (await localforage.getItem<ContactType[]>('contacts')) || []
  const contact = contacts.find((contact) => contact.id === id)
  if (!contact) throw new Error('No contact found for')
  Object.assign(contact, updates)
  await set(contacts)
  return contact
}

// 根据 id 删除联系人
export async function deleteContact(id: string) {
  const contacts = (await localforage.getItem<ContactType[]>('contacts')) || []
  const index = contacts.findIndex((contact) => contact.id === id)
  if (index > -1) {
    contacts.splice(index, 1)
    await set(contacts)
    return true
  }
  return false
}

function set(contacts: ContactType[]) {
  return localforage.setItem('contacts', contacts)
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: { [key in string]: boolean } = {}

// 模拟网络请求的延迟时间
async function fakeNetwork(key?: string) {
  if (!key) {
    fakeCache = {}
    key = ''
  }

  if (fakeCache[key]) {
    return
  }

  key && (fakeCache[key] = true)
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800)
  })
}
