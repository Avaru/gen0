import { deflateSync, inflateSync, strToU8, strFromU8 } from 'fflate'

const maxBytes = 262144

export function encodeSheetToken(value: unknown): string {
  const bytes = strToU8(JSON.stringify(value))
  if (bytes.length >= maxBytes) throw new Error('Character is too large for a link')
  const compressed = deflateSync(bytes)
  let binary = ''
  for (const byte of compressed) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeSheetToken(token: string): unknown {
  if (!token || token.length > maxBytes * 2 || !/^[A-Za-z0-9_-]+$/.test(token))
    throw new Error('Invalid character link')
  const binary = atob(token.replace(/-/g, '+').replace(/_/g, '/'))
  const compressed = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  // A fixed output buffer bounds allocation even for hostile compressed input.
  const bytes = inflateSync(compressed, { out: new Uint8Array(maxBytes) })
  if (bytes.length >= maxBytes) throw new Error('Character is too large for a link')
  return JSON.parse(strFromU8(bytes)) as unknown
}
