<template>
    <div>
      <b-container fluid>
        <b-row>
          <b-col class="col-1">
            <SpeakerSelect />
          </b-col>
          <b-col>
            <b-form-textarea
              id="dtext"
              v-model="text"
              placeholder="Dialogue Here..."
              rows="2"
              max-rows="6"
            ></b-form-textarea>
          </b-col>
          <b-col class="col-md-auto">
            <b-button v-on:click="modifyDialogue()">Commit</b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import SpeakerSelect from '@/components/SpeakerSelect.vue'

export default {
  components: {
    SpeakerSelect
  },
  data () {
    return {
      text: '',
      sentId: ''
    }
  },
  props: {
    id: String,
    msg: String,
    name: String
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
  },
  methods: {
    ...mapActions([
      'modDialogue'
    ]),
    modifyDialogue () {
      this.modDialogue({ id: this.sentId, msg: this.text })
    }
  }

}
</script>
