<template>
  <v-dialog v-model="$store.state.addEditDialog.show"
    fullscreen hide-overlay
    dark
    transition="dialog-bottom-transition"
    color="grey">
    <v-card>
      <v-toolbar dark>
        <v-btn icon dark @click="closeAddEdit">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ dialogTitle }} - {{ $store.state.addEditDialog.type }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-list three-line subheader>
        <v-container>
          <v-layout>
            <v-flex xs12 sm10 offset-sm1>
              <v-container>
                <v-text-field
                  v-model="title"
                  label="What do you want to ask?"
                  required
                ></v-text-field>
                <v-textarea
                  outline
                  v-model="content"
                  name="content"
                  label="Explain more detail here"
                ></v-textarea>

                <v-btn @click="submit">submit</v-btn>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['dialog'],
  data () {
    return {
      dialogTitle: '',
      title: '',
      content: ''
    }
  },
  methods: {
    submit () {
      let newQuestion = {
        dialogTitle: this.dialogTitle,
        title: this.title,
        content: this.content,
        method: (this.dialogTitle === 'Add') ? 'POST' : 'PUT',
        type: this.$store.state.addEditDialog.type
      }
      this.$store.dispatch('sendQuestionAnswer', newQuestion)
    },
    closeAddEdit () {
      this.dialogTitle = ''
      this.title = ''
      this.content = ''
      this.$store.commit('setAddEditDialog', { show: false })
    }
  },
  watch: {
    '$store.state.addEditDialog.show' () {
      if (this.$store.state.editedAnswerQuestion.title) {
        this.dialogTitle = 'Edit'
        this.title = this.$store.state.editedAnswerQuestion.title
        this.content = this.$store.state.editedAnswerQuestion.content
      } else {
        this.dialogTitle = 'Add'
        this.title = ''
        this.content = ''
      }
    }
  }
}
</script>

<style>

</style>
