export function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export function currency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}