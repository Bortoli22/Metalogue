<template>
    <div>
        <b-card class="middark">
            <p class="card-text">Import a {{mode}} (MM or JSON)</p>
            <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            accept=".json, .txt"
            ></b-form-file>
            <b-row id="upload" align-h="center">
                <b-col md="4" offset-md="4">
                    <b-button-group>
                        <b-button v-on:click="importing()" variant="info" size="sm">Import</b-button>
                        <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
                    </b-button-group>
                </b-col>
                <b-col md="4" offset-md="0">
                    <b-button size="sm" v-on:click="switchMode()">Switch to {{altMode}} Import</b-button>
                </b-col>
            </b-row>
            {{ error }}
        </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'characterBank',
      'dialogueBank'
    ])
  },
  data () {
    return {
      mode: 'Scene',
      altMode: 'Project',
      file: null,
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'imScene'
    ]),
    importing () {
      if (this.file === null) {
        this.error = 'Please upload a valid file'
        return
      }
      this.error = this.file.type
      if (this.file.type === 'text/plain') {
        // importing MM
      } else if (this.file.type === 'application/json') {
        // importing JSON
        this.manageJSON()
      }
    },
    manageJSON () {
      var parsedData = new FileReader()
      parsedData.onload = (e) => {
        var jsonData = JSON.parse(e.target.result)
        console.log('jsonData => ', jsonData)

        if (this.mode === 'Scene') {
          var dupSearch = this.dialogueBank.findIndex(e => e.id === jsonData.id)
          if (dupSearch >= 0) {
            this.error = 'Scene exists, overwriting...'
          }
          for (var el of jsonData.data) {
            el.id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
          }
          this.imScene({ dup: dupSearch, scene: jsonData, activeID: this.activeSceneID })
        }
      }
      parsedData.readAsText(this.file)
    },
    switchMode () {
      if (this.mode === 'Project') {
        this.mode = 'Scene'
        this.altMode = 'Project'
      } else {
        this.mode = 'Project'
        this.altMode = 'Scene'
      }
    },
    close () {
      this.$emit('close', null)
      this.file = null
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
  #upload {
      margin-top: 10px;
  }
</style>
