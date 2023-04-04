const allGridColumns: any = {
  
}

export async function getGridColumns(name: string | number) {
  const columns = allGridColumns[name]
  return columns
}
