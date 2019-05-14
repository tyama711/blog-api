import Read from "./../common/read";
import Write from "./../common/write";
export default interface BaseBusiness<T> extends Read<T>, Write<T> {}
