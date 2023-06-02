<template>
  <div class="app-container closingCarryover">
    <el-steps :active="1" finish-status="success" simple>
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>
    <div class="box_wrap">
      <div class="overview">
        <div class="item totalItem">
          <span>凭证张数(总张数)</span>
          <span>{{ infoData.totalTicket }}</span>
        </div>
        <div class="item">
          <span>未审核</span>
          <span>{{ infoData.Unaudited }}</span>
        </div>
        <div class="item">
          <span>未记账</span>
          <span>{{ infoData.Unbooked }}</span>
        </div>
        <div class="item">
          <span>已记账</span>
          <span>{{ infoData.Bookkept }}</span>
        </div>
      </div>
      <div class="box">
        
      </div>
      <div class="box"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: 'closingCarryover',
  setup(){
    const data = reactive({
      infoData: {
        totalTicket: 65,
        Unaudited: 65,
        Unbooked: 0,
        Bookkept: 0
      }
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
.box_wrap{
  height: 500px;
  padding: 10px;
  background-color: #f0f0f0;
  .overview{
    background-color: #fff;
    margin-bottom: 10px;
    padding: 15px 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-around;
    .item{
      display: flex;
      flex-direction: column;
      flex: 1 0 20%;
      align-items: center;
    }
    .totalItem{
      display: flex;
      flex-direction: column;
      flex: 0 0 240px;
      border-right: 2px solid #ccc;
    }
  }
  .box{
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    min-height: 60px;
  }
}
</style>