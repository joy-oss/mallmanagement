<template>
    <div style="height:500px;width:400px;margin: 10px;">  <!-- 富文本编辑器, 容器 -->
            <div id="J_quillEditor">
            </div>
    </div>
</template>

<script>
import Quill from "quill";              //引入模块
import 'quill/dist/quill.snow.css'      //引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import { nextTick } from "vue";

export default {
    name: "Quill",
    data() {
        return {
            reason: '',
            quillEditor: null,
            quillEditorToolbarOptions: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block", "image"],
                [
                    {
                        header: 1,
                    },
                    {
                        header: 2,
                    },
                ],
                [
                    {
                        list: "ordered",
                    },
                    {
                        list: "bullet",
                    },
                ],
                [
                    {
                        script: "sub",
                    },
                    {
                        script: "super",
                    },
                ],
                [
                    {
                        indent: "-1",
                    },
                    {
                        indent: "+1",
                    },
                ],
                [
                    {
                        direction: "rtl",
                    },
                ],
                [
                    {
                        size: ["small", false, "large", "huge"],
                    },
                ],
                [
                    {
                        header: [1, 2, 3, 4, 5, 6, false],
                    },
                ],
                [
                    {
                        color: [],
                    },
                    {
                        background: [],
                    },
                ],
                [
                    {
                        font: [],
                    },
                ],
                [
                    {
                        align: [],
                    },
                ],
                ["clean"],
            ],
        }
    },
    props:['edittext'],
    mounted() {
        this.quillEditorHandle()
    },
    updated(){
        this.quillEditor.root.innerHTML=this.edittext
        this.quillEditor.root.style.overflow='auto'
    },
    methods: {
        // 富文本编辑器
        quillEditorHandle() {
            this.quillEditor = new Quill("#J_quillEditor", {
                modules: {
                    toolbar: this.quillEditorToolbarOptions,
                },
                theme: "snow",
            });
            // 自定义上传图片功能 (使用element upload组件)
            this.quillEditor.getModule("toolbar").addHandler("image", () => {
                // 自定义上传图片事件
                console.log('点击上传图片触发')
            });

            // 监听内容变化，动态赋值
            this.quillEditor.on("text-change", () => {
                this.reason = this.quillEditor.root.innerHTML;
                 this.$emit('richcons', this.reason)
            });
        },
    }
}
</script>

<style scoped>

</style>

