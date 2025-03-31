export type NodeId = {
  id: number | string | null
}

export type TTreeNode = {
  id: NodeId
  parent: number | string | null
  label: string | null
  path?: (string | number)[]
  category?: "Группа" | "Элемент" | ''
}

export type TRawTreeNode = {
  id: NodeId
  parent: number | string | null
  label: string | null
}