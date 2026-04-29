<template>
    <el-form :model="form" size="small">
        <el-card>
            <el-row :gutter="20">

                <el-col :span="4">
                    <el-form-item label="用户">
                        <el-input v-model="form.keyword" placeholder="请输入用户邮箱或昵称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="用户状态">
                        <el-select class="!w-full" v-model="form.is_blocked" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="正常" :value="false" />
                            <el-option label="禁用" :value="true" />
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
                <el-table-column prop="name" label="姿势名称" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="icon_base64" label="姿势图标" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="created_at" label="注册时间" align="center" width="150" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="updated_at" label="更新时间" align="center" width="150" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column label="操作" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-popconfirm title="确定启用?" @confirm="onChangeState(row.id, false)">
                            <template #reference>
                                <el-button type="success" v-if="row.is_blocked">
                                    启用
                                </el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm title="确定禁用?" @confirm="onChangeState(row.id, true)">
                            <template #reference>
                                <el-button type="danger" v-if="!row.is_blocked">
                                    禁用
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
                :total="totalPages" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>

        <PositionEdit :dialogVisible="dialogVisible" :itemData="itemData" @close="onClose" />
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { positionQuery, } from './service';
import { tableFormatterFn } from '@/utils/format';
import { ElMessage } from 'element-plus';
import { tagType } from '@/utils/tagType';
import PositionEdit from './components/PositionEdit.vue';

const defaultForm = {
    page: 1,
    page_size: 10,
    is_blocked: '',
    keyword: '',
}
const form = reactive({ ...defaultForm })
const tableList = ref([])
const totalPages = ref(0)
const dialogVisible = ref(false)
const itemData = ref({})

const onWrite = (data) => {
    itemData.value = { ...data }
    dialogVisible.value = true
}

const onChangeState = async (id, type) => {
    // const apiUrl = type ? userBlock : userUnblock
    // const res: any = await apiUrl({ id })
    // if (res.code === 0) {
    //     ElMessage.success('操作成功')
    //     onQueryList()
    // }
}

const onClose = (type) => {
    if (type) onQueryList()
    dialogVisible.value = false
}

const onQueryList = async () => {
    const res = await positionQuery(form)
    if (res.code === 0) {
        tableList.value = res.data.list
        totalPages.value = res.data.totalCount
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