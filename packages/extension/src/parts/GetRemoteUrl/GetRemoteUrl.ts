export const getRemoteUrl = (uri: string): string => {
  return uri ? `/remote/${uri}` : ''
}
