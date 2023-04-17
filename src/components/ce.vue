<template>
  <div class='copper-root'>
    <div class="test-root">
      <button @click="loadModels">load models</button>
      <button @click="detect">detect1</button>
      <button @click="detectTiny1">detect2</button>
      <button @click="serializeTest">serialize</button>
      <button @click="loadCropper">load crop</button>
      <button @click="crop1">crop1</button>
    </div>
    <div class="cropper">
      <img ref="picNode" @click="picClicked" class="img" src="@/assets/mpv-shot0036.jpg" alt="pic here"/>
    </div>
  </div>
</template>

<script lang='ts'>
import {Component, Ref, Vue} from 'vue-property-decorator';
// 下面这一句 不能使用，否则 electron 打包后无法运行
// 这一句是开发时做类型提示用的，实际上项目已经在 public/index.html 里全局引用了
// 这里加载模型也用了较为复杂的方法，因为默认的加载方式使用 fetch，不支持 electron 编译后的 app://
// 但是 xhr 支持，所以手动请求，再加载 arraybuffer
// import * as faceapi from '@vladmandic/face-api';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import type{FaceDetection} from '@vladmandic/face-api';
import {loadTinyModels} from './face-recognition';

@Component
export default class Copper extends Vue {
  @Ref()
  picNode!:HTMLImageElement;

  cropper: Cropper|null = null;
  rs: FaceDetection[] = [];
  pos = 0;

  // async loadModels() {
  //   // 用 URL 方式加载模型
  //   // await faceapi.nets.ssdMobilenetv1.loadFromUri("/weights");
  //   // await faceapi.nets.tinyFaceDetector.loadFromUri("/weights");

  //   // 用网络请求方式加载模型
  //   // const ab = await xhrRequest("/static/params");
  //   // console.log(ab.byteLength);
  //   // const r = await faceapi.nets.tinyFaceDetector.load(new Float32Array(ab));
  //   // console.log(r);
  //   console.log('load model finished!');
  // }

  loadModels() {
    loadTinyModels();
  }

  picClicked(evt: any) {
    console.log(evt);
  }

  detect() {
    this.detectSSD();
  }

  async detectSSD() {
    const optSSD = new faceapi.SsdMobilenetv1Options();
    const start = +(new Date());
    const detections = await faceapi.detectAllFaces(this.picNode, optSSD);
    console.log(+(new Date()) - start);
    console.log(detections);
    this.rs = detections;
  }

  async detectTiny1() {
    const optTiny = new faceapi.TinyFaceDetectorOptions();
    const start = +(new Date());
    const detections = await faceapi.tinyFaceDetector(this.picNode, optTiny);
    console.log(+(new Date()) - start);
    console.log(detections);
    this.rs = detections;
    // faceapi.tinyFaceDetector(this.picNode, {});
  }

  serializeTest() {
    const rs = faceapi.nets.tinyFaceDetector.serializeParams();
    console.log(rs.length);
    console.log(rs.byteLength);
    const u8buf = new Uint8Array(rs.buffer);
    (window as any).eapi.sendData(u8buf).then((r: any)=>{
      console.log(r);
    });
    // const r2 = faceapi.nets.ssdMobilenetv1.serializeParams();
    // console.log(r2.length);
    faceapi.nets.tinyFaceDetector.load(rs).then(()=>{
      console.log('load finished!!!');
    });
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
      // aspectRatio: 1,
    });
  }

  crop1() {
    if(this.rs.length === 0) {
      console.log('没有识别到');
      return;
    }
    if(this.pos >= this.rs.length) {
      this.pos = 0;
    }
    const item = this.rs[this.pos];
    console.log(item.box.x);
    this.cropper!.setData({
      x: item.box.x,
      y: item.box.y,
      width: item.box.width,
      height: item.box.height,
    });
    this.pos += 1;
  }
}
</script>

<style scoped>
.img {
  display: block;
  max-width: 100%;
}
.cropper {
  position: relative;
}
</style>

function loadTinyModels() {
  throw new Error('Function not implemented.');
}
