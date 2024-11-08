export default function renderContact(group_id, groups) {
  const group = groups.find((group) => group._id === group_id);
  if (!group) return group_id;
  return group.group_name;
}
