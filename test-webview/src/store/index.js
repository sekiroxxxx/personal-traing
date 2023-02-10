import { createStore } from 'vuex'

export default createStore({
  state: {
    //控制当前答题区域
    current: 0,
    //控制答题区域显示
    isShortAnswer: true,
    isFill: false,
    isChoice: false,
    answerShortAnswer: [],
    answerFill: [],
    answerChoice: []
  },
  getters: {
  },
  mutations: {
    increment(state) {
      state.current++
    },
    decrease(state) {
      state.current--
    },
    showShortAnswer(state) {
      state.isShortAnswer = true;
      state.isFill = false;
      state.isChoice = false;
      state.current = 0;
    },
    showFill(state) {
      state.isShortAnswer = false;
      state.isFill = true;
      state.isChoice = false;
      state.current = 0;
    },
    showChoice(state) {
      state.isShortAnswer = false;
      state.isFill = false;
      state.isChoice = true;
      state.current = 0;
    },
    selected(state, payload) {
      state.current = payload;
    },
    save(state, payload) {
      if (state.isShortAnswer) {
        state.answerShortAnswer[state.current] = payload
      }
      if (state.isChoice) {
        state.answerChoice[state.current] = payload
        
      }
      if (state.isFill) {
        state.answerFill[state.current] = payload
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
