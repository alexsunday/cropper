<template>
  <div class='warn-root'>
    <span>{{msg}}</span>
  </div>
</template>

<script lang='ts'>
import {Component, Vue, Prop, Emit} from 'vue-property-decorator';

@Component
export default class WarnMsgWidget extends Vue {
  @Prop()
  msg!:string;

  @Prop()
  timeoutMs!:number;

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
