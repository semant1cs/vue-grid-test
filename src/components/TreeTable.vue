<template>
  <div>
    <ag-grid-vue
      :tree-data="true"
      :get-data-path="getDataPath"
      :column-defs="colDefs"
      :row-data="rowData"
      :autoGroupColumnDef="autoGroupColumnDef"
      style="height: 700px; width: 1000px;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { TreeStore } from '../enitities/TreeStore'
import { treeItems } from '../enitities/mock'
import { AgGridVue } from 'ag-grid-vue3'
import type { GetDataPath, GridApi } from 'ag-grid-enterprise'
import type { TTreeNode } from '../enitities/TreeStore.type'

const treeStore = new TreeStore(treeItems)
const gridApi = shallowRef<GridApi<TTreeNode> | null>(null);
const rowData = ref<TTreeNode[]>(treeStore.getAll())
const getDataPath = ref<GetDataPath>((data) => data?.path)

const autoGroupColumnDef = ref({
  headerName: '№ П/П',
  hide: true, // Полностью скрываем групповую колонку
  cellRendererParams: {
    suppressCount: true
  }
});

const colDefs = ref([
  { field: "id", hide: true },
  { field: "category" },
  { field: "label" }
])

</script>

<style scoped>

</style>