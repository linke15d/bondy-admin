<template>
    <el-form size="small">
        <el-card>
            <template #header>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="mr-2">用户信息</span>
                        <el-tag :type="tagType(!detailsData.is_blocked)">
                            {{ !detailsData.is_blocked ? '正常' : '禁用' }}
                        </el-tag>
                    </div>
                </div>
            </template>
            <el-row :gutter="24">
                <el-col :span="4">
                    <el-form-item label="用户昵称">
                        <el-input v-model="detailsData.nickname" placeholder="--" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱地址">
                        <el-input v-model="detailsData.email" placeholder="--" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机号码">
                        <el-input v-model="detailsData.phone" placeholder="--" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="注册时间">
                        <el-input v-model="detailsData.created_at" placeholder="--" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="是否验证">
                        <el-tag :type="tagType(detailsData.is_verified)">
                            {{ detailsData.is_verified ? '已验证' : '未验证' }}
                        </el-tag>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>
    </el-form>
</template>

<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue';
import { tagType } from '@/utils/tagType';
import { userDetail } from '../service';
import { useRoute } from 'vue-router';

const route = useRoute()

const id = route.query.id

const detailsData = ref<any>({})

const getDetails = async () => {
    const res = await userDetail({ id })
    detailsData.value = res.data.user
}

const onLoad = async () => {
    await getDetails()
}

onMounted(onLoad)
onActivated(onLoad)
</script>