import type { TRawTreeNode, TTreeNode } from "./TreeStore.type"

export class TreeStore {
  tree: TTreeNode[] = []
  constructor(items: TTreeNode[]) {
    this.tree = this.prepareTree(items)
  }

  private prepareTree = (items: TRawTreeNode[]) => {
    const nodesMap = new Map<number | string, TTreeNode>();
    items.forEach(item => nodesMap.set(item.id, item));

    items.forEach(item => {
      const path: (number | string)[] = [];
      let currentId: number | string | null = item.id;
      
      while (currentId !== null) {
        path.unshift(currentId);
        const parentId: string | number | null = nodesMap.get(currentId)?.parent ?? null;
        currentId = parentId;
      }

      (item as TTreeNode).path = path;
    });

    return items;
  }

  getAll() {
    return this?.tree
  }

  getItem(id: number | string) {
    return this.tree.find((treeItem) => treeItem.id === id)
  }

  getChildren(id: number | string) {
    return this.tree.filter((treeItem) => treeItem.parent === id)
  }

  getAllChildrenId(id: number | string) {

  }

  getAllParents(id: number | string) {

  }

  addItem(item: TTreeNode) {
    this.tree.push(item)
  }

  removeItem(id: string | number) {
    const index = this.tree.findIndex((node) => node.id === id);

    if (index !== -1) {
      this.tree.splice(index, 1);
    }
  }

  updateItem(id: string | number, item: TTreeNode) {
    this.tree.map((node) => {
      if (node.id === id) {
        return {
          ...item
        }
      }

      if (node.parent === id) {
        return {
          ...node,
          parent: item.id
        }
      }

      return node
    })
  }
}