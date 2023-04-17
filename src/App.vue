<template>
  <div class="app-root">
    <header-tool
      v-show="showHeader"
      :evtBus="evtBus"
      @input-changed="inputChanged"
      @clear="onClear"
      @begin="onBegin"
      @size-changed='sizeChanged'
    />
    <div class="opt-btn">
      <button @click="showHeader=!showHeader">
        <span v-if="showHeader">收起</span>
        <span v-else>选项</span>
      </button>
    </div>
    <div class="cropper-container">
      <cropper
        v-for="file in files"
        :key="file.path"
        :file="file"
        :evtBus="evtBus"
        :aspectRatio="aspectRatio"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderTool from "@/components/header.vue";
import Cropper from "@/components/cropper.vue";
import ProgressConsole from '@/components/progress.vue';
import {showWarnMsg} from '@/components/common';
import {loadTinyModels} from '@/components/face-recognition';
// import testWidget from '@/components/ce.vue';

@Component({
  components: {
    cropper: Cropper,
    "header-tool": HeaderTool,
    'progress-console': ProgressConsole,
    // 'test-widget': testWidget,
  },
})
export default class App extends Vue {
  // 这里使用 vue 内置消息机制做为通讯
  // 但无法各自「取消」，考虑替换为 EventTarget ?
  evtBus = new Vue();
  showProgress = false;
  showHeader = true;
  files: File[] = [];

  // size
  aspectRatio = 1;

  created() {
    // 启动后加载一下 face-api 的模型
    loadTinyModels();
  }

  inputChanged(files: File[]) {
    this.files.push(...files);
  }

  sizeChanged(v: {width: number;height: number}) {
    this.aspectRatio = v.width / v.height;
  }

  onClear() {
    this.files = [];
  }

  onBegin(evt: unknown) {
    if(this.files.length === 0) {
      showWarnMsg('请选择待处理图片', 2 * 1000);
      return;
    }
    this.evtBus.$emit("begin-crop", evt);
    this.showProgress = true;
  }

  allDone() {
    this.showProgress = false;
    showWarnMsg('已全部完成', 2*1000, 'green');
  }
}
</script>

<style scoped lang="scss">
.app-root {
  position: relative;
}

.cropper-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(300px, 1fr));
}

.lists {
  height: 100px;
  background: red;
  margin: 10px;
}

.form {
  user-select: none;
}

.opt-btn {
  z-index: 10;
  position: absolute;
  right: 40px;
  top: 20px;
}
</style>
