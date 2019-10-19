export default interface Write<T> {
  create: (item: T) => Promise<T>
  update: (_id: string, item: T) => Promise<T | null>
  delete: (_id: string) => Promise<T | null>
}
