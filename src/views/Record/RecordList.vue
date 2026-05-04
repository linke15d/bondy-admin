<template>
    <el-form :model="form" size="small">
        <el-card>
            <el-row :gutter="20">

                <el-col :span="4">
                    <el-form-item label="伴侣ID">
                        <el-input v-model="form.couple_id" placeholder="请输入伴侣ID" clearable />
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
                <el-table-column prop="couple_id" label="伴侣ID" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="created_by_id" label="创建用户ID" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="icon_base64" label="持续时长" align="center">
                    <template #default="{ row }">
                        <span>{{ `${row.duration_mins}分` }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mood" label="心情评分" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="satisfaction" label="满意度评分" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="note_encrypted" label="备注" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
                <el-table-column prop="positions" label="姿势" align="center">
                    <template #default="{ row }">
                        <div>
                            <span v-for="v in row.positions" :key="v.id">{{ v.default_name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="positions" label="标签" align="center">
                    <template #default="{ row }">
                        <div>
                            <span v-for="v in row.tags" :key="v.id">{{ v.default_name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" align="center" show-overflow-tooltip
                    :formatter="tableFormatterFn" />
            </el-table>
        </el-card>

        <el-card>
            <el-pagination :current-page="form.page" small v-model:page-size="form.page_size"
                :page-sizes="[10, 20, 50, 100]" background layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, reactive } from 'vue'
import { recordsQuery } from './service';
import { tableFormatterFn } from '@/utils/format';

const defaultForm = {
    page: 1,
    page_size: 10,
    couple_id: '',
}
const form = reactive({ ...defaultForm })
const tableList = ref([])
const totalCount = ref(0)

const onQueryList = async () => {
    const res = await recordsQuery(form)
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