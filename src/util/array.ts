export function flat<T extends any>(arr: any[]): T[] {
  return arr.reduce(function(f, toFlatten) {
    return f.concat(Array.isArray(toFlatten) ? flat(toFlatten) : toFlatten)
  }, [])
}
