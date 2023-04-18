<template>
  <div class="app-root">
    <header-tool v-show="showHeader" :evtBus="evtBus" @input-changed="inputChanged" @clear="onClear" @begin="onBegin"
      @size-changed='sizeChanged'>
    </header-tool>
    <div class="picture-grids">
      <cropper v-for="file in files" :key="file.path" :file="file" :evtBus="evtBus" :aspectRatio="aspectRatio" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderTool from "@/components/header.vue";
import Cropper from "@/components/cropper.vue";

@Component({
  components: {
    cropper: Cropper,
    "header-tool": HeaderTool,
  },
})
export default class App extends Vue {
  // 这里使用 vue 内置消息机制做为通讯
  // 但无法各自「取消」，考虑替换为 EventTarget ?
  evtBus = new Vue();
  showHeader = true;
  files: File[] = [];

  // size
  aspectRatio = 1;

  inputChanged(files: File[]) {
    this.files.push(...files);
  }

  sizeChanged(v: { width: number; height: number }) {
    this.aspectRatio = v.width / v.height;
  }

  onClear() {
    this.files = [];
  }

  onBegin(evt: unknown) {
    if (this.files.length === 0) {
      this.showWarnMsg('请选择待处理图片');
      return;
    }
    this.evtBus.$emit("begin-crop", evt);
  }

  allDone() {
    this.showSuccMsg('已全部完成');
  }

  showSuccMsg(msg: string) {
    this.$message({
      type: 'info',
      message: msg,
    });
  }

  showWarnMsg(msg: string) {
    this.$message({
      type: 'warning',
      message: msg,
    });
  }
}
</script>

<style scoped lang="scss">
.app-root {
  position: relative;
}

.picture-grids {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
