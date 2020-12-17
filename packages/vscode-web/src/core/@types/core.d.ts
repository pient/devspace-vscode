import * as message from '../message'
import * as store from '../store'

declare module 'core' {
  const uni: Uni

  export default {
    ...uni,
    ...message,
    ...store
  }
}
