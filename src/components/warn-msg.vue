<template>
  <div class='warn-root'>
    <span :style="`background-color: ${background}`">{{msg}}</span>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Prop, Emit} from 'vue-property-decorator';

@Component
export default class WarnMsgWidget extends Vue {
  @Prop()
  msg!:string;

  @Prop()
  color?: string;

  @Prop()
  timeoutMs!:number;

  get background() {
    if(this.color) {
      return this.color;
    }
    return "#E6A23C";
  }

  @Emit()
  finish() {
    return 1;
  }

  mounted() {
    setTimeout(() => {
      this.finish();
    }, this.timeoutMs);
  }
}
</script>

<style scoped>
.warn-root {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

span {
  background: #E6A23C;
  padding: 2px 10px;
  border-radius: 2px;  
}
</style>
