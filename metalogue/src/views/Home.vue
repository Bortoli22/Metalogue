<template>
  <div class="home">
    <SpeakerCreate align="left"/>
    <a v-bind:href="downloadImg" download="downloaded.png"><img src="@/assets/logo.png" height="5%" width="5%"></a>
    <br>
    <DialogueContainer
    v-for="val in dialogueData"
    v-bind:key="val.id"
    v-bind:msg="val.msg"
    v-bind:id="val.id"
    v-bind:name="val.name"
    v-bind:modProp="val.mod"
    v-bind:nestProp="val.nest"
    v-bind:parentProp="val.parent"
    v-bind:activeContainerID="activeContainerID"
    @setActiveContainerID="setActiveContainerID"
    />
    <b-button v-on:click="createDialogue()">+</b-button>
  </div>
</template>

<script>
// @ is an alias to /src
import DialogueContainer from '@/components/DialogueContainer.vue'
import SpeakerCreate from '@/components/SpeakerCreate.vue'
import img from '@/assets/logo.png'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    DialogueContainer,
    SpeakerCreate
  },
  computed: {
    ...mapState([
      'dialogueData'
    ])
  },
  methods: {
    ...mapActions([
      'addDialogue'
    ]),
    createDialogue () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      const created = { id: id, name: 'charx', msg: '', mod: [], nest: 0 }
      this.addDialogue(created)
    },
    setActiveContainerID (payload) {
      this.activeContainerID = payload
    }
  },
  data () {
    return {
      activeContainerID: 'none',
      downloadImg: img
    }
  }
}
</script>
