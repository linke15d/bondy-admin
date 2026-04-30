<template>
    <el-form :model="form" size="small">
        <el-card>
            <el-row :gutter="20">

                <el-col :span="4">
                    <el-form-item label="地点名称">
                        <el-input v-model="form.keyword" placeholder="请输入地点名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="状态">
                        <el-select class="!w-full" v-model="form.is_active" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="启用" :value="true" />
                            <el-option label="禁用" :value="false" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">查询</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="my-4">
            <el-row class="mb-4">
                <el-form-item>
                    <el-button type="success" size="small" @click="onWrite(null)">
                        新增
                    </el-button>
                </el-form-item>
            </el-row>
            <el-table :data="tableList" style="width: 100%" size="small">
                <el-table-column prop="default_name" label="姿势名称" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="icon_base64" label="姿势图标" align="center">
                    <template #default="{ row }">
                        <el-image :src="row.icon_base64" class="w-10 h-10" />
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType(row.is_active)">{{ row.is_active ? '启用' : '禁用' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="添加时间" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <!-- <el-table-column prop="updated_at" label="更新时间" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" /> -->
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

        <el-card>
            <el-pagination :current-page="form.page" small v-model:page-size="form.page_size"
                :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>

        <LocationEdit :dialogVisible="dialogVisible" :itemData="itemData" @close="onClose" />
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { locationsQuery,locationsDelete } from './service';
import { tableFormatterFn } from '@/utils/format';
import { ElMessage } from 'element-plus';
import { tagType } from '@/utils/tagType';
import LocationEdit from './components/LocationEdit.vue';

const defaultForm = {
    page: 1,
    page_size: 10,
    category_id: '',
    keyword: '',
    is_active: '' as boolean | string
}
const form = reactive({ ...defaultForm })
const tableList = ref([])
const totalCount = ref(0)
const dialogVisible = ref(false)
const itemData = ref({})

const onWrite = (data) => {
    itemData.value = { ...data }
    dialogVisible.value = true
}

const onDelete = async (id) => {
    const res = await locationsDelete({ id })
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
    const res = await locationsQuery(form)
    if (res.code === 0) {
        tableList.value = res.data.list
        totalCount.value = res.data.total
    }
}

// 选择每页显示条数
const handleSizeChange = (val: number) => {
    form.page_size = val;
    onQueryList();
};
// 点击每一页
const handleCurrentChange = (val: number) => {
    form.page = val;
    onQueryList();
};

// 查询
const onSearch = () => {
    form.page = 1;
    onQueryList();
};

// 重置
const onReset = () => {
    Object.assign(form, defaultForm)
    onSearch();
};

const onLoad = async () => {
    await onQueryList()
}

onMounted(onLoad)
onActivated(onLoad)
</script>