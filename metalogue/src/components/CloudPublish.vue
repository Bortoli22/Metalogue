<template>
    <div>
        <b-button v-on:click="pushData()">Save to Cloud</b-button>
    </div>
</template>

<script>
import * as fire from '../firebase'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'projectBank'
    ])
  },
  methods: {
    async pushData () {
      const getName = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
      const toSend = getName.data().name
      console.log(toSend)
    }
  }
}
</script>
