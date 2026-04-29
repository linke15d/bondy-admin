<template>
    <ElDialog :model-value="dialogVisible" :title="itemData?.id ? '编辑姿势' : '新增姿势'" width="450" center
        @close="onClose()">
        <el-form :model="form" :rules="rules" ref="ruleFormRef" size="small" label-width="70">
            <el-form-item label="姿势分类" prop="category">
                <el-select v-model="form.category" placeholder="请选择姿势分类" class="w-full" clearable>
                    <el-option label="经典" value="CLASSIC" />
                    <el-option label="探险" value="ADVENTURE" />
                    <el-option label="亲密" value="INTIMATE" />
                    <el-option label="趣味" value="FUN" />
                </el-select>
            </el-form-item>
            <el-form-item label="姿势名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入姿势名称" clearable />
            </el-form-item>
            <el-form-item label="姿势图标" prop="icon_base64">
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
        </el-form>
        <template #footer>
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onSave">保存</el-button>
        </template>
    </ElDialog>
</template>

<script setup lang="ts">
import { ElMessage, UploadProps } from 'element-plus'
import { reactive, ref } from 'vue'
import { positionCreate } from '../service'

const props = defineProps({
    dialogVisible: { type: Boolean, default: false },
    itemData: { type: Object, default: {} },
})
const emit = defineEmits(['close'])

const defaultForm = {
    category: '',
    icon_base64: '',
    name: '',
}
const form = reactive({ ...defaultForm })
const rules = reactive({
    category: [{ required: true, message: '请选择姿势分类', trigger: ['blur', 'change'] }],
    name: [{ required: true, message: '请姿势名称', trigger: ['blur', 'change'] }],
    icon_base64: [{ required: true, message: '请上传图标', trigger: ['blur', 'change'] }],
})
const ruleFormRef = ref()

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式必须得是png/jep/jpg');
        return false;
    }
    // else if (rawFile.size / 1024 / 1024 > 1) {
    //     ElMessage.error('图片大小不能超过1MB!');
    //     return false;
    // }
    return true;
};

const onSave = async () => {
    await ruleFormRef.value.validate(async (valid) => {
        if (!valid) return
        const res = await positionCreate(Object.assign({ ...form }))
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

const resetForm = () => {
    ruleFormRef.value?.resetFields()
    Object.assign(form, JSON.parse(JSON.stringify(defaultForm)))
}

const onClose = () => {
    emit('close', false)
    resetForm()
}
</script>