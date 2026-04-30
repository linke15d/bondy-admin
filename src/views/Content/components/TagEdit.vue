<template>
    <ElDialog :model-value="dialogVisible" :title="itemData?.id ? '编辑标签' : '新增标签'" width="450" center
        @close="onClose()">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" size="small" label-width="80">
            <div class="mb-2">标签名称</div>
            <el-form-item v-for="(v, i) in langList" :key="v.id" :label="v.name">
                <el-input v-model="form.names[i].name" placeholder="请输入标签名称" clearable />
            </el-form-item>
            <el-form-item label="标签图标" prop="icon_base64">
                <template #default>
                    <div class="w-full flex">
                        <el-upload accept="image/*" :http-request="uploadHttpClose" :auto-upload="true"
                            :show-file-list="false" :before-upload="beforeAvatarUpload">
                            <img v-if="form.icon_base64" :src="form.icon_base64" class="!w-20 !h-20 rounded-lg" />
                            <div v-else
                                class="!w-20 !h-20 flex justify-center items-center border border-solid rounded-lg">
                                <el-icon :size="30">
                                    <Plus />
                                </el-icon>
                            </div>
                        </el-upload>
                    </div>
                </template>
            </el-form-item>
            <el-form-item label="是否启用" prop="is_active" v-if="itemData.id">
                <el-select v-model="form.is_active" class="w-full">
                    <el-option label="启用" :value="true" />
                    <el-option label="禁用" :value="false" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="form.sort_order" placeholder="请输入排序" clearable
                    @input="v => form.sort_order = sanitizePositive(v, { decimals: 0 })" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { tagsCreate, tagsUpdate } from '../service'
import { langQuery } from '@/views/Lang/service'
import { sanitizePositive } from '@/utils/numbers'
import { isFieldEmpty } from '@/utils/format'

const props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    itemData: { type: Object, default: {} },
})
const emit = defineEmits(['close'])

const defaultForm = {
    id: '',
    sort_order: '',
    icon_base64: '',
    is_active: true,
    names: [] as { language_code: string, name: string }[],
}
const form = reactive({ ...defaultForm })
const rules = reactive({
    icon_base64: [{ required: true, message: '请上传图标', trigger: ['blur', 'change'] }],
})
const ruleFormRef = ref()
const langList = ref<any>([])

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式必须得是png/jep/jpg');
        return false;
    }
    return true;
};

const onSave = async () => {
    await ruleFormRef.value.validate(async (valid) => {
        if (!valid) return
        if (isFieldEmpty(form.names, 'name')) return ElMessage.error('请输入全部名称')
        const apiUrl = props.itemData.id ? tagsUpdate : tagsCreate
        const res = await apiUrl(Object.assign({ ...form }, { sort_order: Number(form.sort_order) }))
        if (res.code === 0) {
            ElMessage.success('操作成功')
            emit('close', true)
            resetForm()
        }
    });
}

const uploadHttpClose = async ({ file }) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        form.icon_base64 = e.target?.result as string
    }
    reader.readAsDataURL(file)
};

const getLangs = async () => {
    const res = await langQuery()
    langList.value = res.data

    // 初始化 names，编辑时回显已有数据
    form.names = res.data.map((lang: any) => {
        const existing = props.itemData?.names?.find(
            (n: any) => n.language_code === lang.code
        )
        return {
            language_code: lang.code,
            name: existing?.name || ''
        }
    })

    // 回显其他字段
    if (props.itemData?.id) {
        form.id = props.itemData.id
        form.sort_order = props.itemData.sort_order
        form.icon_base64 = props.itemData.icon_base64
        form.is_active = props.itemData.is_active
    }
}

const resetForm = () => {
    ruleFormRef.value?.resetFields()
    Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
    // 重置 names 但保留语言结构
    form.names = langList.value.map((lang: any) => ({
        language_code: lang.code,
        name: ''
    }))
}

const onClose = () => {
    emit('close', false)
    resetForm()
}

watch(() => props.dialogVisible, async (val) => {
    if (val) await getLangs()
}, { immediate: true })
</script>