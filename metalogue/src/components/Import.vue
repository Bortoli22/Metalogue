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
import * as fire from '../firebase'

export default {
  computed: {
    ...mapState([
      'characterBank',
      'dialogueBank',
      'projectBank',
      'activeUser',
      'customMod'
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
      'imScene',
      'addProject',
      'swapProject'
    ]),
    importing () {
      if (this.file === null) {
        this.error = 'Please upload a valid file'
        return
      }
      this.error = this.file.type
      if (this.file.type === 'text/plain') {
        // importing MM
        this.manageMM()
      } else if (this.file.type === 'application/json') {
        // importing JSON
        this.manageJSON()
      }
    },
    manageJSON () {
      var parsedData = new FileReader()
      parsedData.onload = async (e) => {
        var dupSearch
        var jsonData = JSON.parse(e.target.result)
        console.log('jsonData => ', jsonData)

        if (this.mode === 'Scene') {
          // import a JSON scene
          dupSearch = this.dialogueBank.findIndex(e => e.id === jsonData.id)
          if (dupSearch >= 0) {
            this.error = 'Scene exists, overwriting...'
          }
          for (var el of jsonData.data) {
            el.importKey += 1
          }
          this.imScene({ dup: dupSearch, scene: jsonData, activeID: this.activeSceneID })
        } else {
          try {
          // import a JSON project
            dupSearch = this.projectBank.findIndex(e => e.id === jsonData.id)
            if (dupSearch >= 0) {
              this.error = 'Project exists, overwriting...'
            } else {
              this.addProject({ projectName: jsonData.name, projectID: jsonData.id })
              await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
                projects: this.projectBank
              })
            }
            this.swapProject({ sBank: jsonData.sceneBank, pID: jsonData.id })
            this.$emit('setActiveProjectID', jsonData.id)
            if (jsonData.sceneBank.length > 0) {
              this.$emit('setActiveSceneID', jsonData.sceneBank[0].id)
            }
          } catch (err) {
            console.log(err)
            this.error = 'There was an error importing this project'
          }
        }
      }
      parsedData.readAsText(this.file)
    },
    manageMM () {
      var parsedData = new FileReader()
      parsedData.onload = async (e) => {
        var dupSearch
        var rawText = e.target.result.split('\n')
        console.log('array => ', rawText)
        if (this.mode === 'Scene') {
          // import a MM scene
          var sceneData = rawText[0].split(' ')
          var toObject = { name: sceneData[1], id: sceneData[2], data: [] }
          dupSearch = this.dialogueBank.findIndex(e => e.id === sceneData[2])
          console.log('dupSearch => ', dupSearch)
          if (dupSearch >= 0) {
            this.error = 'Scene exists, overwriting...'
          }
          for (var el = 1; el < rawText.length; el++) {
            if (rawText[el].length > 5) {
              toObject.data.push(this.MMextract(rawText[el]))
            }
          }
          console.log('toObject => ', toObject)
          this.imScene({ dup: dupSearch, scene: toObject, activeID: this.activeSceneID })
        } else {
          try {
          // import a MM project

          } catch (err) {
            console.log(err)
            this.error = 'There was an error importing this project'
          }
        }
      }
      parsedData.readAsText(this.file)
    },
    MMextract (el) {
      var metaParse = el.substring(0, el.lastIndexOf('*/') + 2).split(' ')

      // get mods
      var getMod = []
      var getArgs = []
      var modName = ''
      var parseIndex = 3
      while (metaParse[parseIndex] !== '`' && parseIndex < 1000) {
        modName = ''
        switch (metaParse[parseIndex]) {
          case '-x':
            modName = 'Event'
            break
          case '-r':
            modName = 'Response'
            break
          case '-rl':
            modName = 'Roulette'
            break
          case '-o':
            modName = 'Option'
            break
          default:
            var cmI = this.customMod.findIndex(e => e.shorthand === metaParse[parseIndex])
            if (cmI >= 0) {
              modName = this.customMod[cmI].flag
            }
            break
        }

        // get args
        if (modName !== '') {
          parseIndex++
          while (metaParse[parseIndex].indexOf('-') === -1 && metaParse[parseIndex] !== '`' && parseIndex < 1000) {
            getArgs.push(metaParse[parseIndex])
            parseIndex++
          }
          parseIndex--
          getMod.push({ flag: modName, arg: getArgs })
          getArgs = []
        }
        parseIndex++
      }

      // get parent
      var getParent = ''
      if (metaParse[parseIndex + 3] !== '*/') {
        getParent = metaParse[parseIndex + 3]
      }

      // create and send object
      var createdDC = {
        id: metaParse[2],
        name: this.characterBank.find(e => e.spID === metaParse[1]).spName,
        msg: el.substring(el.lastIndexOf('*/') + 3, el.length),
        mod: getMod,
        nest: parseInt(metaParse[parseIndex + 1]),
        importKey: parseInt(metaParse[parseIndex + 2]) + 1,
        parent: getParent
      }
      return createdDC
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
