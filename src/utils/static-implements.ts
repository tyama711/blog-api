// https://github.com/Microsoft/TypeScript/issues/13462#issuecomment-295685298
/* class decorator */
export default function staticImplements<T>() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (constructor: T) => {}
}
