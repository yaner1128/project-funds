
export function getColumnKey(column: any){
  return column.params&&column.params.extendKey?column.params.extendKey:((typeof column['getKey']==='function')?column.getKey():column.field)
}
