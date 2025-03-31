import type { TRawTreeNode, TTreeNode } from "./TreeStore.type"

type NodeId = string | number

export class TreeStore {
  private tree: TTreeNode[] = []
  private childrenMap = new Map<NodeId | null, TTreeNode[]>()
  private nodesMap = new Map<NodeId, TTreeNode>()

  constructor(items: TRawTreeNode[]) {
    this.initializeTree(items)
  }

  getAll(): TTreeNode[] {
    return [...this.tree]
  }

  getItem(id: NodeId): TTreeNode | undefined {
    return this.nodesMap.get(id)
  }

  getChildren(id: NodeId): TTreeNode[] {
    return [...(this.childrenMap.get(id) || [])]
  }

  getAllChildren(id: NodeId): TTreeNode[] {
    const result: TTreeNode[] = []
    const queue = this.getChildren(id)
    
    for (const item of queue) {
      result.push(item)
      queue.push(...this.getChildren(item.id))
    }
    
    return result
  }

  getAllParents(id: NodeId): TTreeNode[] {
    const result: TTreeNode[] = []
    let currentId: NodeId | null = id
    const visited = new Set<NodeId>()

    while (currentId && !visited.has(currentId)) {
      const node = this.getItem(currentId)
      if (!node) break
      
      result.push(node)
      visited.add(currentId)
      currentId = node.parent
    }

    return result
  }

  addItem(item: TTreeNode): void {
    this.tree.push(item)
    this.nodesMap.set(item.id, item)
    this.updateIndexes()
  }

  removeItem(id: NodeId): void {
    this.tree = this.tree.filter(node => node.id !== id)
    this.nodesMap.delete(id)
    this.updateIndexes()
  }

  updateItem(id: NodeId, newItem: TTreeNode): void {
    this.tree = this.tree.map(node => 
      node.id === id ? { ...newItem } : node
    )
    this.nodesMap.set(id, newItem)
    this.updateIndexes()
  }

  private initializeTree(items: TRawTreeNode[]): void {
    // Первоначальное заполнение nodesMap
    items.forEach(item => {
      this.nodesMap.set(item.id, { 
        ...item,
        category: "Элемент",
        path: []
      } as TTreeNode)
    })

    // Построение childrenMap
    this.buildChildrenMap(items)

    // Обновление категорий и путей
    this.tree = items.map(item => ({
      ...item,
      category: this.getNodeCategory(item.id),
      path: this.buildNodePath(item.id)
    } as TTreeNode))

    // Обновление nodesMap с полными данными
    this.tree.forEach(node => this.nodesMap.set(node.id, node))
  }

  private getNodeCategory(id: NodeId): "Группа" | "Элемент" {
    return this.childrenMap.has(id) ? "Группа" : "Элемент"
  }

  private buildNodePath(id: NodeId): NodeId[] {
    const path: NodeId[] = []
    let currentId: NodeId | null = id

    while (currentId !== null) {
      const node = this.nodesMap.get(currentId)
      if (!node) break
      
      path.unshift(currentId)
      currentId = node.parent
    }

    return path
  }

  private buildChildrenMap(items: TRawTreeNode[]): void {
    this.childrenMap.clear()
    items.forEach(item => {
      const parentKey = item.parent ?? null
      const children = this.childrenMap.get(parentKey) || []
      children.push({ ...item } as TTreeNode)
      this.childrenMap.set(parentKey, children)
    })
  }

  private updateIndexes(): void {
    this.buildChildrenMap(this.tree)
    this.tree = this.tree.map(node => ({
      ...node,
      category: this.getNodeCategory(node.id),
      path: this.buildNodePath(node.id)
    }))
    this.tree.forEach(node => this.nodesMap.set(node.id, node))
  }
}