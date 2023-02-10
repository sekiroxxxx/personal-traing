<!-- 切换题目相关组件 -->
<template>
  <div class="question">
    <div>
      <table>
        <thead>
          <div class="questionType">
            <span class="questionTypeTitle">
              {{ title }}
              <span class="questionTypeSum" >
                (共{{ list.length }}题{{ totalScore }} 分)
              </span>
            </span>
          </div>
        </thead>
        <!-- 显示题目列表 -->
        <tr class="questionSort">
            <td  class="questionChange"  
                v-for="(item,index) in list"  
                :key="item.id"
                @click="selectQuestion(index)"
                :class="questionComplete(index),select(index)" > 
                {{ index+1 }}
            </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {ref,computed} from 'vue';
import { useStore } from 'vuex';


export default {
  name: 'Question',
  props: {
    title: String,
    list: Array,
    isShortAnswer: Boolean,
    isFill:Boolean,
    isChoice: Boolean
  },
  setup (props) {
    const store = useStore();
    const totalScore = computed(() => {
      return props.list.length * props.list[0]?.score;
    })
    const selectQuestion = (index) =>{
      if(props.title=="简答题"){
        store.commit('showShortAnswer')
        store.commit('selected',index)
      }  
      if(props.title=="选择题") {
        store.commit('showChoice')
        store.commit('selected',index)
      }
      if(props.title=="填空题") {
        store.commit('showFill')
        store.commit('selected',index)
        }
    }
    const questionComplete = (index) => {
      //根据题目的完成状态切换样式
      if(props.title=='简答题') {
        if(store.state.answerShortAnswer[index]){
        return {
          completed: true
          }
        }
      }  
      if(props.title=='选择题') {
        if(store.state.answerChoice[index]){
        return {
          completed: true
          }
        }
      }
      if(props.title=='填空题') {
        if(store.state.answerFill[index]){
        return {
          completed: true
          }
        }
      }
    }
    const select = (index) => {
      if(props.title=='简答题'&&store.state.isShortAnswer) {
        if(index==store.state.current){
        return {
          selteced: true
        }
        }
      }
      if(props.title=='选择题'&&store.state.isChoice) {
        if(index==store.state.current){
          return {
            selteced: true
          }
        }
      }
      if(props.title=='填空题'&&store.state.isFill) {
        if(index==store.state.current){
          return {
            selteced: true
          }
        }
      }
    }
    return {
      totalScore,
      selectQuestion,
      questionComplete,
      select
    }
  }
}

</script>

<style>

  .question  {
    width: 377px;
    border-radius: 10px;
    border: solid 1px #dff1e4;
    background-color: #ffffff;
    margin-bottom: 16px;
    caret-color: rgba(0, 0, 0, 0)
  }

  .questionType {
    width: 334px;
    font-family: SourceHanSansCN-Medium;
	  font-size: 24px;
    color: #495561;
    margin-left: 24px;
    
  }
  .questionTypeTitle{
    float: left;
    width: 334px;
    margin-top: 21px;
    margin-bottom: 14px;
    text-align: left;
  }

  .questionTypeSum {
    float: right;
    text-align: right;
    
  }
  .questionSort {
    display: block;
    overflow: hidden;
    width: 332px;
    margin-left: 30px;
    margin-bottom: 22px;
    margin-left: 24px;
  }
  
  .questionChange{
    float: left;
    -webkit-user-select: none;
    user-select: none;
    height: 44px;
    width: 65px;
    border: 5px solid transparent;
    margin: 3px;
    cursor: pointer;
    color: #1ac36e;
    text-align: center;
    line-height: 44px;
    font-size: 30px;
    background-color: #dff1e4;
  }
  .selteced {
    border-color: #ffc13c;
  }

  .completed {
    background-color: #1ac36e;
    color: #dff1e4;
  }

</style>