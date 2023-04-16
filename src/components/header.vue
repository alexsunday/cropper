<template>
  <div class="header-root">
    <div class="form">
      <div class="container import-container">
        <span>输入: </span>
        <input
          type="file"
          multiple
          accept="image/*"
          ref="fileInput"
          @change="fileChanged"
          style="display: none"
        />
        <button @click="importFile">导入文件</button>
        <button @click="clear">清除/放弃</button>
      </div>
      <div class="container size-container">
        <span>尺寸: </span>
        <label>
          <span class="p-span">宽 </span>
          <input
            class="p-input"
            type="number"
            v-model.number="width"
            placeholder="width"
          />
        </label>
        <label>
          <span class="p-span">高 </span>
          <input
            class="p-input"
            type="number"
            v-model.number="height"
            placeholder="height"
          />
        </label>
        <button @click="sizeChanged">🗸</button>
      </div>
      <div class="container output-container">
        <span>输出: </span>
        <button @click="selectOutputDir" v-if="outStyle === 'OUTPUT'">
          选择文件夹
        </button>
        <input
          type="text"
          v-model="outDir"
          placeholder="输出路径"
          v-show="outDir !== ''"
          v-if="outStyle === 'OUTPUT'"
        />
        <button @click="saveFiles">开始</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref, Emit } from "vue-property-decorator";
import { outOpt, showWarnMsg } from "./common";

@Component
export default class Header extends Vue {
  @Prop()
  readonly evtBus!: Vue;

  @Ref()
  fileInput!: HTMLInputElement;
  @Ref()
  dirInput!: HTMLInputElement;

  outDir = "";
  width = 512;
  height = 512;
  outStyle: "INPLACE" | "OUTPUT" = "OUTPUT";

  @Emit()
  begin(opt: outOpt) {
    return opt;
  }

  fileChanged(evt: Event) {
    const files = (evt.target as HTMLInputElement).files;
    if (!files) {
      console.log("files empty!");
      return;
    }
    const rs: File[] = [];
    for (let i = 0; i !== files.length; i++) {
      rs.push(files[i]);
    }
    this.$emit("input-changed", rs);
    this.fileInput.value = "";
  }

  sizeChanged() {
    if (this.width <= 0 || this.height <= 0) {
      this.showWarn("尺寸值不合法");
      return;
    }
    this.evtBus.$emit("size-changed", {
      width: this.width,
      height: this.height,
    });
  }

  importFile() {
    const e = new MouseEvent("click");
    this.fileInput.dispatchEvent(e);
  }

  saveFiles() {
    if (this.outStyle === "OUTPUT" && this.outDir === "") {
      this.showWarn("必须先选择输出文件夹");
      return;
    }
    console.log(`outDir: [${this.outDir}]`);
    this.begin({
      dir: this.outDir,
      width: this.width,
      height: this.height,
    });
  }

  clear() {
    this.$emit("clear");
  }

  async selectOutputDir() {
    const r = await (window as any).eapi.openDirectory();
    if (r) {
      this.outDir = r;
    }
  }

  showWarn(msg: string) {
    showWarnMsg(msg, 2 * 1000, this);
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-bottom: 6px;
}

.header-root {
  position: relative;
}

button,
select,
input {
  margin-right: 10px;
}

.p-input {
  width: 50px;
}
</style>