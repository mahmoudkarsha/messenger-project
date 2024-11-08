/* 
@param ref
*/

export default function scrollTo(ref, position = 0) {
  if (ref?.current) {
    ref.current.scrollTop =
      ref.current.scrollHeight - ref.current.offsetHeight + position;
  }
}
