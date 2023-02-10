<template >
  <div>
    <el-container class="home-container">
      <el-header>
        <div>
          <span>
            学生考试系统
          </span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px"> 
          <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <span>学生考试信息</span>
          </el-menu-item>
        </el-menu>
        </el-aside>
        <el-main>
          <el-scrollbar>
            <el-table :data="examlist">
              <el-table-column prop="title" label="考试信息" width="400"   />
            </el-table>
          </el-scrollbar>
          
          <router-link to="/exam">
            <el-button>
              开始考试
            </el-button>
          </router-link>
          
        </el-main>
      </el-container>
    </el-container>

    


  </div>
</template>

<script land="ts">
import {ref, onMounted} from 'vue';
import axios from 'axios';
  export default {
    name:'home',
    setup () {
      const examlist = ref([]);
      const getExamInfo = () => {
        axios.get('/api/get/exam').then(res => {
          examlist.value=res.data.list;
        })
      }
      onMounted(() => {
        getExamInfo()
      })

      return {
        examlist,
      }
    }
  }
  
</script>

<style >
a {
  text-decoration: none;
}
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #2d9972;
  align-items: center;
  font-size: 20px;
  color: white;
}
.el-header>div {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #fff; 
}
.el-menu span{
  font-size: 20px;
}
.el-main {
  height: 100%;
}
.el-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  font-size: 20px;
}
.el-button {
  background-color: #2d9972;
  height: 60px;
  width: 200px;
  font-size: 30px;
  color: #fff;
}

</style>