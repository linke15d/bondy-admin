<template>
    <el-form size="small">
        <el-card class="mb-4">
            <el-row class="mb-4">
                <el-form-item>
                    <el-button type="success" size="small" @click="onWrite(null)">
                        新增
                    </el-button>
                </el-form-item>
            </el-row>
            <el-table :data="tableList" style="width: 100%" size="small">
                <el-table-column prop="name" label="分类名称" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column label="状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType(row.is_active)">{{ row.is_active ? '启用' : '禁用' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="updated_at" label="更新时间" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column label="操作" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="warning" @click="onWrite(row)">
                            编辑
                        </el-button>
                        <el-popconfirm title="确定删除?" @confirm="onDelete(row.id)">
                            <template #reference>
                                <el-button type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <CategoryEdit :dialogVisible="dialogVisible" :itemData="itemData" @close="onClose" />
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { categoriesQuery, categoriesDelete } from './service';
import { tableFormatterFn } from '@/utils/format';
import CategoryEdit from './components/CategoryEdit.vue';
import { tagType } from '@/utils/tagType';
import { ElMessage } from 'element-plus';

const tableList = ref([])
const dialogVisible = ref(false)
const itemData = ref({})

const onWrite = (data) => {
    itemData.value = { ...data }
    dialogVisible.value = true
}

const onDelete = async (id) => {
    const res = await categoriesDelete({ id })
    if (res.code === 0) {
        ElMessage.success('操作成功')
        onQueryList()
    }
}

const onClose = (type) => {
    if (type) onQueryList()
    dialogVisible.value = false
}

const onQueryList = async () => {
    const res = await categoriesQuery()
    if (res.code === 0) {
        tableList.value = res.data.map((val: any) => ({
            ...val,
            name: val.names.find((e: any) => e.language_code === 'zh-CN')?.name || ''
        }))
    }
}

const onLoad = async () => {
    await onQueryList()
}

onMounted(onLoad)
onActivated(onLoad)
</script>