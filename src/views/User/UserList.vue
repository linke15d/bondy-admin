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
                        <el-select v-model="form.is_blocked" clearable>
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
            <el-table :data="tableList" style="width: 100%" size="small">
                <!-- <el-table-column prop="id" label="用户ID" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" /> -->

                <el-table-column prop="nickname" label="用户昵称" align="center" width="100" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="email" label="用户邮箱" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="phone" label="手机号码" align="center" width="100" :formatter="tableFormatterFn" />
                <el-table-column prop="is_blocked" label="账号状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="tagType(!row.is_blocked)">
                            {{ row.is_blocked ? '禁用' : '启用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="注册时间" align="center" width="150" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="updated_at" label="更新时间" align="center" width="150" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column label="操作" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="warning" @click="onDetails(row.id)">详情</el-button>
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
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { userQuery, userBlock, userUnblock } from './service';
import { tableFormatterFn } from '@/utils/format';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { tagType } from '@/utils/tagType';


const router = useRouter()

const defaultForm = {
    page: 1,
    page_size: 10,
    is_blocked: '',
    keyword: '',
}
const form = reactive({ ...defaultForm })
const tableList = ref([])
const totalPages = ref(0)

const onDetails = (id) => {
    router.push({ path: '/user/userList/userDetails', query: { id } })
}

const onChangeState = async (id, type) => {
    const apiUrl = type ? userBlock : userUnblock
    const res: any = await apiUrl({ id })
    if (res.code === 0) {
        ElMessage.success('操作成功')
        onQueryList()
    }
}

const onQueryList = async () => {
    const res = await userQuery(form)
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