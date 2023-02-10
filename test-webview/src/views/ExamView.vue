<template>
  <div class="about">
    <AnswerInfo  :examinfo=exam />
  </div>
</template>

<script>
import axios from 'axios'
import AnswerInfo from '@/components/AnswerInfo.vue'

export default {
  name: 'ExamView',
  data () {
    return {
      exam: []
    }
  },
  components: {
    AnswerInfo
  },
  created () {
    this.getExamInfo ()
  },
  methods: {
    getExamInfo () {
      axios.get('/api/get/exam').then( res => {
        this.exam = res.data.list
      })
    }
  }
}


</script>