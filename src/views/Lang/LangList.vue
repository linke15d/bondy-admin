<template>
    <el-form :model="form" size="small">
        <el-card class="my-4">
            <el-row class="mb-4">
                <el-form-item>
                    <el-button type="success" size="small" @click="onWrite(null)">
                        新增
                    </el-button>
                </el-form-item>
            </el-row>
            <el-table :data="tableList" style="width: 100%" size="small">
                <el-table-column prop="name" label="语言名称" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="code" label="语言编码" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column label="语言编码" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType(row.is_active)">{{ row.is_active ? '启用' : '禁用' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否默认" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType(row.is_default)">{{ row.is_default ? '是' : '否' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center" width="150" show-overflow-tooltip
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

        <LangEdit :dialogVisible="dialogVisible" :itemData="itemData" @close="onClose" />
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { langQuery, langDelete } from './service';
import { tableFormatterFn } from '@/utils/format';
import LangEdit from './components/LangEdit.vue';
import { tagType } from '@/utils/tagType';
import { ElMessage } from 'element-plus';

const defaultForm = {
    is_blocked: '',
    keyword: '',
}
const form = reactive({ ...defaultForm })
const tableList = ref([])
const dialogVisible = ref(false)
const itemData = ref({})

const onWrite = (data) => {
    itemData.value = { ...data }
    dialogVisible.value = true
}

const onDelete = async (id) => {
    const res = await langDelete({ id })
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
    const res = await langQuery()
    if (res.code === 0) {
        tableList.value = res.data
    }
}

const onLoad = async () => {
    await onQueryList()
}

onMounted(onLoad)
onActivated(onLoad)
</script>