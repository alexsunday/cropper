<template>
  <div class='copper-root'>
    <p>{{title}}</p>
    <div class="cropper">
      <img class="img" :src="image" alt="pic here"/>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Prop, Ref} from 'vue-property-decorator';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { outOpt } from './common';

@Component
export default class Copper extends Vue {
  @Prop()
  file!:File;

  @Prop()
  evtBus!:Vue;

  image: string|ArrayBuffer = "";
  cropper: Cropper|null = null;

  get title() {
    return this.file.path;
  }

  created() {
    this.loadFile();
    this.evtBus.$on('done', (opt: any) => {
      this.done(opt);
    });
    this.evtBus.$on('size-changed', (v: {width: number;height: number}) => {
      this.cropper!.setAspectRatio(v.width/v.height);
    });
  }

  beforeDestroy() {
    this.evtBus.$off('done');
    this.evtBus.$off('size-changed');
    this.cropper?.destroy();
  }

  loadCropper() {
    const img = this.$el.querySelector("img.img");
    if(!img) {
      return;
    }
    if(!(img instanceof HTMLImageElement)) {
      return;
    }
    this.cropper = new Cropper(img, {
      viewMode: 2,
      aspectRatio: 1,
    });
  }

  done(opt: outOpt) {
    if(!this.cropper) {
      return;
    }
    const r1 = this.cropper.getData();
    (window as any).eapi.cropDone({
      ...r1,
      path: this.file.path,
      out: {
        dir: opt.dir,
        width: opt.width,
        height: opt.height,
      }
    });
  }

  loadFile() {
    const reader = new FileReader();
    reader.onload = e => {
      this.image = e.target?.result || '';
      this.$nextTick().then(()=>{
        this.loadCropper();
      });
    }
    reader.readAsDataURL(this.file);
  }
}
</script>

<style scoped>
.copper-root {
  /* height: 600px; */
  margin: 10px;
}
.img {
  display: block;
  max-width: 100%;
}
</style>
