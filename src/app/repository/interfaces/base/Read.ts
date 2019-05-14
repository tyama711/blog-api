export default interface Read<T> {
  retrieve: () => Promise<T[]>;
  findOne: (conditions: Partial<T>) => Promise<T | null>;
}
