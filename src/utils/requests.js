export const buildAuthHeaders = token => {
  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {}
}
