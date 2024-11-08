export default function renderContact(sender_number, contacts) {
  const contact = contacts.find((user) => user.number === sender_number);
  if (!contact) return sender_number;
  return contact.name;
}
