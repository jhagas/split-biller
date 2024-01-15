export default function compareDate(
  a: { edited_at: string },
  b: { edited_at: string }
) {
  return new Date(b.edited_at).getTime() - new Date(a.edited_at).getTime();
}
