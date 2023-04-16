<template>
  <div class="app-root">
    <header-tool
      v-show="showHeader"
      :evtBus="evtBus"
      @input-changed="inputChanged"
      @clear="onClear"
      @begin="onBegin"
    />
    <button class="opt-btn" @click="showHeader=!showHeader">选项</button>
    <div class="cropper-container">
      <cropper
        v-for="file in files"
        :key="file.path"
        :file="file"
        :evtBus="evtBus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Vue } from "vue-property-decorator";
import HeaderTool from "@/components/header.vue";
import Cropper from "@/components/cropper.vue";
import {showWarnMsg} from '@/components/common';

@Component({
  components: {
    cropper: Cropper,
    "header-tool": HeaderTool,
  },
})
export default class App extends Vue {
  evtBus = new Vue();
  showHeader = true;
  files: File[] = [];

  inputChanged(files: File[]) {
    this.files.push(...files);
  }

  onClear() {
    this.files = [];
  }

  onBegin(evt: unknown) {
    if(this.files.length === 0) {
      showWarnMsg('请选择待处理图片', 2 * 1000, this);
      return;
    }
    this.evtBus.$emit("done", evt);
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
