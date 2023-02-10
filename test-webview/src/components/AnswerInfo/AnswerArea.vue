<!-- 答题区域相关组件 用于显示题干提供作答区域以及切换题目-->
<template>
  <div class="answerArea">
    <div class="answerBox">
       <!-- 简答题区域 -->
      <div v-if="isShortAnswer">
        <div class="QuestionTitle">
          <span>
            {{ questionTitle[current]?.id }}.
           {{ questionTitle[current]?.title}}
          </span>
        </div>
        <div class="shortanserArea">
          <span>作答:</span>
          <textarea placeholder="请输入答案" v-model="fillInput" >
          </textarea>
        </div>
      </div>
      
      <!-- 填空题 -->
      <div v-if="isFill">
        <div class="QuestionTitle">
          <span>
           {{ questionTitle[current]?.id }}.
           {{ questionTitle[current]?.title}}
          </span>
        </div>
        <div class="fillAnswerBox">
          <span>答:</span>
          <input class="fillAnswer" type="text" v-model="fillInput">  
        </div>
      </div>
      <!-- 选择题 -->
      <div v-if="isChoice">
        <div class="QuestionTitle">
          <span>
            {{ questionTitle[current]?.id }}.
           {{ questionTitle[current]?.title}}
          </span>
        </div>
        <div class="choiceAnswer">
          <div class="choiceSingle" v-for="(item,index) in choice" :key="index" @click="choiceAnswer(index)">
            <button class="choiceSinglebutton"  :class="choiceSelect(index)" > {{ choice[index] }} </button>
            <span>  {{ questionTitle[current]?.answer[index] }}  </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 切换题目 -->
    <div class="changeQuestion">
        <span>共{{ questionTitle.length }}题</span>
        <button class="pre" @click="preQuestion()">上一题</button>
        <button class="next" @click="nextQuestion()">下一题</button>
    </div>
  </div>
</template>

<script>
import {ref,computed} from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'AnswerArea',
  props: {
    questionTitle: Array,
    current: Number,
    isShortAnswer: Boolean,
    isFill:Boolean,
    isChoice: Boolean,
    handin: Function
  },
  setup (props) {
    const store = useStore();
    const answer = ref([]);
    const choice = ref(['A','B','C','D']);
    const choiceAnswer = (index) => {
      answer.value[props.current]=index+1;
      store.commit('save',answer.value[props.current]);
    }
    const choiceSelect = (index) => {
      if(answer.value[props.current]==index+1){
        return {
          choiceSelect: true
        }
      }
    }
    const saveQuestion = () => {
      if(answer.value[props.current]){
        //保存当前作答
        store.commit('save',answer.value[props.current]);
      } else {
        //保存空答案
        answer.value[props.current]='';
        store.commit('save',answer.value[props.current]);
      }
    }
    const preQuestion = () => {
      //保存答案
      saveQuestion();
      if(props.current > 0){
        //index为0 不准切换
        //切换上一题
        store.commit('decrease');
      } else {
        //切换上一个大题类型
          if(store.state.isChoice){
            store.commit('showShortAnswer');
          } else if (store.state.isFill) {
            store.commit('showChoice');
          }
      }
    }
    const  nextQuestion = () => {
      saveQuestion();
        //如果不是当前题目最后一题,点击切换到下一小题
      if(props.current < props.questionTitle.length - 1){
        store.commit('increment');
      } else {
      //如果是答卷的最后一题，询问是否交卷
        if(store.state.isFill){
          let final = confirm("已经完成最后一题，是否交卷？"); 
          if(final){
            props.handin();
          }
        }
        //如果index到达最大值,切换到下一个大题型
          if(store.state.isShortAnswer){
            store.commit('showChoice');
          } else if(store.state.isChoice){
            store.commit('showFill');
          }
      }
    }
    const fillInput = computed( {
        get: () =>{
          if(store.state.isShortAnswer){ 
            return store.state.answerShortAnswer[props.current];
          }
          if(store.state.isFill) { 
            return store.state.answerFill[props.current];
          }
        },
        set: (newVal) => {
          answer.value[props.current] = newVal;
          store.commit('save',newVal)
        }
    })
    return {
      answer,
      choice,
      fillInput,
      choiceAnswer,
      choiceSelect,
      preQuestion,
      nextQuestion
    }
  }
}
</script>

<style>
.answerArea {
  position: relative;
  left: 0;
  float: left;
  width: 1498px;
  height: 1048px;
  background-image: url(@/assets/1341647396232_.pic.jpg);
  background-size: auto;
}

.answerBox {
  width: 1337px;
	height: 529px;
  margin-left: 76px;
  font-family: SourceHanSansCN-Medium;
	font-size: 38px;
  color: #495561;
}

.QuestionTitle{
  margin-top: 82px;
  text-align: left;
  
}

.shortanserArea {
  margin-top: 39px;
}

.shortanserArea span{
  float: left;
  width: 88px;
	height: 36px;
	margin-right: 9px;
	line-height: 39px;
	letter-spacing: 0px;
	
}

.answerBox textarea {
  
  width: 1230px;
	height: 454px;
	border-radius: 10px;
	border: solid 1px #dff1e4;
  resize: none;
  font-size: 38px;
	background-color: #ffffff;
}

.fillAnswerBox {
  overflow: hidden;
  margin-left: 30px;
  margin-top: 50px;
}
.fillAnswerBox span {
  float: left;
  margin-right: 20px;
}

.fillAnswer {
  float: left;
  font-family: SourceHanSansCN-Medium;
  font-size: 38px;
  color: #495561;
  width: 800px;
  border: none;
  border-bottom: 2px solid black;
  outline:none
}
.choiceAnswer {
  margin-top: 70px;
  margin-left: 50px;
}
.choiceSingle {
  height: 60px;
  overflow: hidden;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 20px;
}
.choiceSingle:hover {
  background-color: rgba(133, 133, 133, 0.1);
}
.choiceSinglebutton {
  float: left;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 30px;
  border: 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: #dff1e4;
  color:#1ac36e;
  font-size: 20px;
}
.choiceSelect {
  background-color: #1ac36e;
  color: #dff1e4;
}

.choiceSingle span {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  float: left;
  margin-left: 20px;
  line-height: 38px;

}
.changeQuestion{
  position: absolute;
  right: 0;
  bottom: 0;
	height: 66px;
  margin-bottom: 10px;
  font-size: 30px;
  font-family: SourceHanSansCN-Medium;
}

.changeQuestion span {
  color: #ffffff;
  float: left;
  line-height: 66px;
  margin-right: 12px;
}
.changeQuestion button {
  position: relative;
  width: 158px;
	height: 66px;
  margin-right: 12px;
  border-radius: 15px;
  border-color: transparent;
  cursor: pointer;
  color: #1ac36e;  
  font-size: 30px;
  font-weight: 700;
  background-color: #ffffff;
}
.pre::after {
  content: '';
  position:absolute;
  width: 158px;
	height: 66px;
  border-radius: 15px;
  inset: 0;
  opacity: 0;
  box-shadow: 0 0 0 15px rgb(0, 0, 0);
  transition: .4s;
}
.pre:active::after {
  box-shadow: none;
  opacity: 0.8;
  transition: 0s;
}
.next::after {
  content: '';
  position:absolute;
  width: 158px;
	height: 66px;
  border-radius: 15px;
  inset: 0;
  opacity: 0;
  box-shadow: 0 0 0 15px rgb(0, 0, 0);
  transition: .4s;
}
.next:active::after {
  box-shadow: none;
  opacity: 0.8;
  transition: 0s;
}

</style>