<template>
  <div class="progress-root">
    进行中，请稍候...
    <div ref="content" class="content" v-html="lines" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref } from "vue-property-decorator";

@Component
export default class ProgressConsole extends Vue {
  @Prop()
  evtBus!: Vue;

  @Prop()
  total!: number;

  @Ref()
  content!:HTMLDivElement;

  finished = 0;
  items: string[] = [];

  get lines() {
    const rs = this.items.map((line) => "✔️ " + line);
    return rs.join("<br/>");
  }

  mounted() {
    this.evtBus.$on("file-crop-done", (v: any) => {
      this.finished += 1;
      this.items.push(v);
      this.$nextTick().then(()=>{
        this.toBottom();
        if(this.finished === this.total) {
          this.$emit('all-done');
        }
      });
    });
  }

  toBottom() {
    this.content.scrollTop = this.content.scrollHeight;
  }

  beforeDestroy() {
    this.evtBus.$off("file-crop-done");
  }
}
</script>

<style scoped>
.progress-root {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  background: grey;
}
.content {
  height: 100%;
  overflow-y: auto;
}

.content::-webkit-scrollbar {
  width: 10px;
}

.content::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
}

.content::-webkit-scrollbar-thumb {
  background: rgb(136, 136, 136);
  border-radius: 10px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 100, 100);
  border-radius: 10px;
}

.content::-webkit-scrollbar-thumb:active {
  background: rgb(68, 68, 68);
  border-radius: 10px;
}
</style>
