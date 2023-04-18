<template>
  <div class='copper-root'>
    <p>{{title}}</p>
    <div class="cropper">
      <img ref="img" class="img" :src="image" alt="pic here"/>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Prop, Ref} from 'vue-property-decorator';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { outOpt } from './common';
import type{FaceDetection} from '@vladmandic/face-api';
import { detectAllFace } from './face-recognition';

@Component
export default class Copper extends Vue {
  @Prop()
  file!:File;

  @Prop()
  evtBus!:Vue;

  @Prop()
  aspectRatio!:number;

  @Ref()
  img!:HTMLImageElement;

  image = "";
  cropper: Cropper|null = null;

  get title() {
    return this.file.path;
  }

  created() {
    this.loadFile();
    // 收到开始裁切命令
    this.evtBus.$on('begin-crop', (opt: any) => {
      this.beginCrop(opt);
    });
    // 裁切尺寸调整
    this.evtBus.$on('size-changed', (v: {width: number;height: number}) => {
      this.cropper!.setAspectRatio(v.width/v.height);
    });
    // 收到人脸识别命令
    this.evtBus.$on('face-recognition', () => {
      this.faceRecognition();
    });
  }

  async faceRecognition() {
    const item: FaceDetection|undefined = await detectAllFace(this.img);
    if(!item) {
      console.log('可能没有识别到?');
      return;
    }

    this.cropper!.setData({
      x: item.box.x,
      y: item.box.y,
      width: item.box.width,
      height: item.box.height,
    });
  }

  beforeDestroy() {
    this.evtBus.$off('begin-crop');
    this.evtBus.$off('size-changed');
    this.evtBus.$off('face-recognition');
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
      aspectRatio: this.aspectRatio,
    });
  }

  async beginCrop(opt: outOpt) {
    if(!this.cropper) {
      return;
    }
    const r1 = this.cropper.getData();
    await (window as any).eapi.cropDone({
      ...r1,
      path: this.file.path,
      out: {
        dir: opt.dir,
        width: opt.width,
        height: opt.height,
      }
    });
    this.evtBus.$emit('file-crop-done', this.file.path);
  }

  loadFile() {
    const reader = new FileReader();
    reader.onload = e => {
      const d = e.target?.result || '';
      if(typeof d !== 'string') {
        console.error('readAsDataUrl,but response not string');
        return;
      }
      this.image = d;
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
  margin: 10px;
}
.img {
  display: block;
  max-width: 100%;
}
</style>
