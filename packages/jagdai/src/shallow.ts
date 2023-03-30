export const shallow = <T>(prev: T, next: T) => {
  if (Object.is(prev, next)) {
    return true
  }

  if (
    typeof prev !== 'object' ||
    prev === null ||
    typeof next !== 'object' ||
    next === null
  ) {
    return false
  }

  if (prev instanceof Map && next instanceof Map) {
    if (prev.size !== next.size) return false

    for (const [key, value] of prev) {
      if (!Object.is(value, next.get(key))) {
        return false
      }
    }

    return true
  }

  if (prev instanceof Set && next instanceof Set) {
    if (prev.size !== next.size) return false

    for (const value of prev) {
      if (!next.has(value)) {
        return false
      }
    }
    return true
  }

  const keys = Object.keys(prev)
  if (keys.length !== Object.keys(next).length) {
    return false
  }

  for (let i = 0; i < keys.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(next, keys[i]) ||
      !Object.is(prev[keys[i]], next[keys[i]])
    ) {
      return false
    }
  }

  return true
}
