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
      error: '',
      addedProject: false
    }
  },
  methods: {
    ...mapActions([
      'imScene',
      'addProject',
      'swapProject',
      'remProject'
    ]),
    async caughtError (err, msg, id) {
      console.log(err)
      this.error = msg
      this.file = null
      if (this.addedProject) {
        this.addedProject = false
        this.remProject(id)
        await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
          projects: this.projectBank
        })
      }
    },
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
        try {
          var jsonData = JSON.parse(e.target.result)
        } catch (err) {
          this.caughtError(err, 'Invalid JSON', null)
          return
        }

        if (this.mode === 'Scene') {
          try {
          // import a JSON scene
            dupSearch = this.dialogueBank.findIndex(e => e.id === jsonData.id)
            if (dupSearch >= 0) {
              this.error = 'Scene exists, overwriting...'
            }
            for (var el of jsonData.data) {
              el.importKey += 1
            }
            this.imScene({ dup: dupSearch, scene: jsonData, activeID: this.activeSceneID })
          } catch (err) {
            this.caughtError(err, 'There was an error importing this JSON scene', null)
            return
          }
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
              this.addedProject = true
            }
            this.swapProject({ sBank: jsonData.sceneBank, pID: jsonData.id })
            this.$emit('setActiveProjectID', jsonData.id)
            if (jsonData.sceneBank.length > 0) {
              this.$emit('setActiveSceneID', jsonData.sceneBank[0].id)
            }
          } catch (err) {
            this.caughtError(err, 'There was an error importing this JSON project', jsonData.id)
            return
          }
        }
        this.error = 'Import Complete'
      }
      parsedData.readAsText(this.file)
    },
    manageMM () {
      var parsedData = new FileReader()
      parsedData.onload = async (e) => {
        var dupSearch, toObject, sceneData, el
        var rawText = e.target.result.split('\n')
        if (this.mode === 'Scene') {
          try {
          // import a MM scene
            sceneData = rawText[0].split(' ')
            toObject = { name: sceneData[1], id: sceneData[2], data: [] }
            dupSearch = this.dialogueBank.findIndex(e => e.id === sceneData[2])
            if (dupSearch >= 0) {
              this.error = 'Scene exists, overwriting...'
            }
            for (el = 1; el < rawText.length; el++) {
              if (rawText[el].length > 5) {
                toObject.data.push(this.MMextract(rawText[el]))
              }
            }
            this.imScene({ dup: dupSearch, scene: toObject, activeID: this.activeSceneID })
          } catch (err) {
            this.caughtError(err, 'There was an error importing this MM Scene', null)
            return
          }
        } else {
          try {
          // import a MM project
            var projectData = rawText[0].split(' ')
            sceneData = rawText[2].split(' ')
            dupSearch = this.projectBank.findIndex(e => e.id === projectData[2])
            if (dupSearch >= 0) {
              this.error = 'Project exists, overwriting...'
            } else {
              this.addProject({ projectName: projectData[1], projectID: projectData[2] })
              await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
                projects: this.projectBank
              })
              this.addedProject = true
            }
            var sBank = []
            toObject = { name: sceneData[1], id: sceneData[2], data: [] }
            for (el = 3; el < rawText.length; el++) {
              if (rawText[el].split(' ').length === 4) {
                // new scene
                sBank.push(toObject)
                sceneData = rawText[el].split(' ')
                toObject = { name: sceneData[1], id: sceneData[2], data: [] }
              } else if (rawText[el].length > 5) {
                toObject.data.push(this.MMextract(rawText[el]))
              }
            }
            sBank.push(toObject)

            this.swapProject({ sBank: sBank, pID: projectData[2] })
            this.$emit('setActiveProjectID', projectData[2])
            if (sBank.length > 0) {
              this.$emit('setActiveSceneID', sBank[0].id)
            }
          } catch (err) {
            this.caughtError(err, 'There was an error importing this MM project', projectData[2])
            return
          }
        }
        this.error = 'Import Complete'
      }
      parsedData.readAsText(this.file)
    },
    MMextract (el) {
      const regex = /[&<>]/g
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
          case '-q':
            modName = 'Queue'
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
          getMod.push({ flag: modName, args: getArgs })
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
        msg: el.substring(el.lastIndexOf('*/') + 3, el.length).replace(regex, 'bad'),
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
      this.error = ''
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
