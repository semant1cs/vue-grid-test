export type TTreeNode = {
  id: number | string
  parent: number | string | null
  label: string | null
  path?: (string | number)[]
}

export type TRawTreeNode = {
  id: number | string
  parent: number | string | null
  label: string | null
}