<template>
    <v-layout column align-center justify-center fill-height>
      <v-layout row>
        <v-card width="300px">
          <v-layout row align-center justify-center>
            <v-avatar size="200" aspect-ratio="2">
              <img src="https://st2.depositphotos.com/2101611/9885/v/950/depositphotos_98850500-stock-illustration-man-silhouette-icon-with-question.jpg">
            </v-avatar>
          </v-layout>
          <v-card-title>
            <div>
              <h1>{{ myprofile.full_name }}</h1>
              <h3>{{ myprofile.username }}</h3>
              <p>Total questions : {{ myQuestions.length }}</p>
              <p>Total answers : {{ myAnswers.length }}</p>
            </div>
          </v-card-title>
        </v-card>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6>
          <v-layout class="blue lighten-4" pa-3 align-center justify-center>
            <h2>All Questions</h2>
          </v-layout>
          <homeBox v-for="item in myQuestions" :key="item._id"
            :item="item"></homeBox>
        </v-flex>
        <v-flex xs12 sm6>
          <v-layout class="blue lighten-4" pa-3 align-center justify-center>
            <h2>All Answers</h2>
          </v-layout>
          <homeBox v-for="item in myAnswers" :key="item._id"
            :item="item"></homeBox>
        </v-flex>
      </v-layout>
    </v-layout>
</template>

<script>
import axios from 'axios'
import homeBox from '@/components/homeBox.vue'

export default {
  name: 'profile',
  components: {
    homeBox
  },
  data () {
    return {
      myprofile: {},
      myQuestions: [],
      myAnswers: []
    }
  },
  created () {
    let promiseAnswer = axios({
      method: 'GET',
      url: `${this.$store.state.url_server}/answers/users/${this.$route.params.id}`
    })
    let promiseQuestion = axios({
      method: 'GET',
      url: `${this.$store.state.url_server}/questions/users/${this.$route.params.id}`
    })
    Promise.all([promiseAnswer, promiseQuestion])
      .then((values) => {
        this.myAnswers = values[0].data
        this.myQuestions = values[1].data
        this.myprofile = this.myQuestions[0].user_id
      })
      .catch(err => console.log(err))
  }
}
</script>

<style>

</style>
