<!-- 答题的主页面,接收数据 -->
<template>
  <!--答题区域组件  -->
  <div class="answerInfoBox">
    <div>
      <AnswerArea  :questionTitle= shortAnswerList :current=$store.state.current :isShortAnswer=$store.state.isShortAnswer   
      v-show="$store.state.isShortAnswer" />
      <AnswerArea  :questionTitle= choiceQuestionList :current=$store.state.current :isChoice=$store.state.isChoice  
      v-show="$store.state.isChoice" />
      <AnswerArea  :questionTitle= fulfillList :current=$store.state.current :isFill=$store.state.isFill :handin="handinPaper"
      v-show="$store.state.isFill" />
    </div>
    <!-- 考试信息部分 -->
    <div class="answerInfoRight">
      <!-- 倒计时 -->
      <div  class="timeCommit">
        <img src="../assets/1351647396240_.pic.jpg" alt="">
        <span> {{ hour? hour : '00' }} : </span>
        <span> {{ minute? minute : '00' }} : </span>
        <span> {{ second? second : '00' }} </span>
        <button @click="handinPaper()">交卷</button>
      </div>
      <div class="userInfo" >
          <img src="../assets/1371647396258_.pic.jpg" alt="">
          <div>
            <span>姓名: {{ userinfo[0]?.name }} </span>
            <span>班级: {{userinfo[0]?.grade }} 年 ({{ userinfo[0]?.class }}) 班 </span>
          </div>
      </div>
      <div class="examInfo">
        <span>{{ examinfo[0]?.title }}</span>
      </div>
    <!-- 题目信息组件 -->
      <div>
        <Question title="简答题" :list=shortAnswerList  />
        <Question title="选择题" :list=choiceQuestionList   />
        <Question title="填空题" :list=fulfillList  />
      </div>
    </div>
  </div>



 
</template>

<script>
import {ref,onMounted} from 'vue';
import {useStore} from 'vuex';
import AnswerArea from '@/components/AnswerInfo/AnswerArea.vue';
import Question from '@/components/AnswerInfo/Question.vue';
import axios from 'axios';
export default {
  name: 'AnswerInfo',
  props:{
    examinfo: Array
  },
  components: {
    Question,
    AnswerArea,
  },
  setup () {
    const store = useStore();
    const hour = ref('');
    const minute = ref('');
    const second = ref('');
    const userinfo = ref([]);
    const choiceQuestionList = ref([]);
    const shortAnswerList = ref([]);
    const fulfillList = ref([]);
    const  getuserinfo = () => {
      axios.get('/api/get/userinfo').then(res => {
        userinfo.value = res.data.list;
      })
    };
    const getChoiceList = () => {
      axios.get('/api/get/choicequestion').then( res => {
        choiceQuestionList.value = res.data.list;
      })
    };
    const getShortAnswerList = () => {
      axios.get('/api/get/shortanswer').then( res => {
        shortAnswerList.value =  res.data.list;
      })
    };
    const getFulfillList = () => {
      axios.get('/api/get/fulfill').then( res => {
        fulfillList.value =  res.data.list;
      })
    };
    const setTestTime = () => {
      // 获取考试时长
      let timer; 
      axios.get('/api/get/exam').then( res =>{
        timer = res.data.list[0].time
        //设置倒计时
        if(timer>0) {
        hour.value = Math.floor((timer/3600)%24);
        minute.value = Math.floor((timer/60)%60);
        second.value = Math.floor(timer%60);
        countDown();
        }
      })
    };
    const countDown = () => {
      // 实现倒计时
      let finish =  setInterval( function() {
        if(hour.value === 0) {
          if(minute.value !==0 && second.value ===0) {
            minute.value -= 1;
            second.value = 59;
          } else if (minute.value === 0 && second.value === 0) {
            second.value = 0;
              //倒计时结束 调用交卷接口/保存
              handinPaper();
              clearInterval(finish);
          } else {
            second.value-= 1;
          }
        } else {
            if(minute.value !== 0 && second.value === 0) {
              second.value = 59;
              minute.value -= 1;
            } else if (minute.value === 0 && second.value === 0) {
                hour.value -= 1;
                minute.value = 59;
                second.value = 59;
            } else {
              second.value -= 1;
            }
        }
      },1000);
    }
    const handinPaper = () => {
      // 交卷检查是否全部完成
      let completeShortAnswer;
      let completeChoice;
      let completeFill;
      let shortanswer = store.state.answerShortAnswer;
      let Choice = store.state.answerChoice;
      let Fill = store.state.answerFill
      if(shortanswer.length==shortAnswerList.value.length){
        completeShortAnswer = true;
        for(let i of shortanswer){
          if(!i){
            completeShortAnswer = false;
          }
        }
      }
      if(Choice.length==choiceQuestionList.value.length){
        completeChoice = true;
        for(let i of Choice){
          if(!i){
            completeChoice = false;
          }
        }
      }
      if(Fill.length==fulfillList.value.length){
        completeFill =true;
        for(let i of Fill){
          if(!i){
            completeFill = false;
          }
        }
      }
      if(!completeShortAnswer||!completeChoice||!completeFill){
        let handinOrNot = confirm("还有未完成的题目,您确定要交卷吗?");
          if(handinOrNot){
            completeShortAnswer = true;
            completeChoice = true;
            completeFill =true;
          }
      }
      if(completeShortAnswer&&completeChoice&&completeFill){
        // 交卷保存
        axios.post('/api/post/saveanswer',{
          shortanswer: shortanswer,
          fill:Fill,
          choice:Choice
          }).then(res => {
            alert(`
            交卷成功!
            简答题答案 ${res.data.list.shortanswer}
            选择题答案 ${res.data.list.choice}
            填空题答案 ${res.data.list.fill}
            `)
        })
      } 
    }
    onMounted( ()=> {
      getuserinfo();
      getChoiceList();
      getShortAnswerList();
      getFulfillList();
      setTestTime();
    })
    
    return {
      hour,
      minute,
      second,
      //存储接口数据
      userinfo,
      choiceQuestionList,
      shortAnswerList,
      fulfillList,
      handinPaper
    }
  }
}
</script>

<style>
a {
  text-decoration: none;
}
.answerInfoBox input {
  caret-color:#495561
}
.answerInfoBox textarea {
  caret-color:#495561
}

.answerInfoBox{
  width: 1980px;
  caret-color: rgba(0, 0, 0, 0)
}

.answerInfoRight {
  position: relative;
  right: 0;
  float: left;
  width: 422px;
  background-color: #f7f7f7;
  margin-left: 18px;
}

.timeCommit{
  width: 373px;
	height: 62px;
  line-height: 62px;
  margin-bottom: 25px;
  margin-top: 20px;
}

.timeCommit img {
  float: left;
  width: 40px;
  height: 40px;
  margin-left: 8px;
  margin-top: 13px;

}

.timeCommit span {
  float: left;
  margin-left: 8px; 
  font-size: 37px;
  font-weight: 700;
  font-family: SourceHanSansCN-Bold;
  color: #ff812d;
}

.timeCommit button {
  float: right;
  cursor: pointer;
  width: 110px;
	height: 62px;
  border: 0;
	border-radius: 15px;
  color: #ffffff;
  font-family: SourceHanSansCN-Medium;
	font-size: 30px;
  background-color: #0dc582;
}



.userInfo {
  width: 377px;
	height: 181px;
  margin-bottom: 16px;
	border-radius: 10px;
	border: solid 1px #dff1e4;
  background-color: #ffffff;
  text-align: center;
  vertical-align: middle;
}

.userInfo img {
  float: left;
  margin-left: 29px;
  margin-top: 44px;
  margin-bottom: 43px;
}
.userInfo div {
  height: 75x;
  margin-top: 57px;
  margin-bottom: 58px;
  line-height: 34px;
}
.userInfo span {
  float: left;
  margin-left: 28px;
  font-size: 24px;
  font-family: SourceHanSansCN-Regular;
  color: #495561;
}

.examInfo{
  
  width: 377px;
	height: 60px;
  border-radius: 10px;
  margin-bottom: 13px;
  font-size: 24px;
  font-family: SourceHanSansCN-Medium;
  text-align: center;
  line-height: 60px;
  color: #4084b8;
  background-image: url(../assets/1361647396249_.pic.jpg);
}
</style>