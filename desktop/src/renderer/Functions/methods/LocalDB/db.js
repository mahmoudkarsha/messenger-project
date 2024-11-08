import Dexie from 'dexie';

export const db = new Dexie('messengerArchive');
db.version(14).stores({
  messages: '++id, uid, conversation_id, user',
  conversations: '++id, contact_number, group_id, last_message_id, user ',
  users: '++id, token, number, role, active',
  contacts: '++id, name, number, user ',
  files: '++id, file_id',
  profileimages: 'number',
  cache: 'key',
});

export const $Messages = 'messages';
export const $Conversations = 'conversations';
export const $Users = 'users';
export const $Contacts = 'contacts';
export const $Files = 'files';
export const $ProfileImages = 'profileimages';

export async function DeleteById(database, id) {
  // return 1
  return await db[database].where({ id }).delete();
}

export async function updateById(database, id, updateObject) {
  // return 1
  return await db[database].where({ id }).modify(updateObject);
}

export async function updateAll(database, updateObject) {
  // return the number of updated elements
  return await db[database].toCollection().modify(updateObject);
}

export async function deleteAll(database) {
  // return the number of deleted elements
  return await db[database].toCollection().delete();
}

export async function updateMany(database, filterObject, updateObject) {
  // return the number of updated elements
  return await db[database].where(filterObject).modify(updateObject);
}

export async function insertOne(database, object) {
  //retun id of created element
  const id = await db[database].add(object);
  return id;
}

export async function findOneById(database, id) {
  //return element or undefined
  const element = await db[database].where({ id }).first();
  return element;
}

export async function findOne(database, filter) {
  //return element or undefined
  const element = await db[database].where(filter).first();
  return element;
}

export async function findAll(database, filter) {
  //return element or undefined
  if (filter) {
    const elements = await db[database].where(filter);
    return elements;
  } else {
    const elements = await db[database].toArray();
    return elements;
  }
}

export async function findAllWithLimit(database, filter, limit) {
  //return element or undefined
  const elements = await db[database].where(filter).limit(limit).toArray();
  return elements;
}

export async function countElements(database, filter) {
  if (filter) {
    return await db[database].where(filter).count();
  }
  return await db[database].toCollection().count();
}
