<template>
    <div>
        <b-spinner v-if="isExporting" label="Loading..."></b-spinner>
        <b-dropdown v-if="!isExporting" id="dropdown-right" right text="Export">
            <b-dropdown-group id="dropdown-group-1" header="Scene">
                <b-dropdown-item v-on:click="exporting('scene', 'mm')">Export as MM </b-dropdown-item>
                <b-dropdown-item v-on:click="exporting('scene', 'json')">Export as JSON </b-dropdown-item>
            </b-dropdown-group>
            <b-dropdown-group id="dropdown-group-2" header="Project">
                <b-dropdown-item v-on:click="exporting('project', 'mm')">Export as MM </b-dropdown-item>
                <b-dropdown-item v-on:click="exporting('project', 'json')">Export as JSON </b-dropdown-item>
            </b-dropdown-group>
            <b-dropdown-group id="dropdown-group-3" header="Characters">
                <b-dropdown-item v-on:click="characters()">Export as MM </b-dropdown-item>
            </b-dropdown-group>
        </b-dropdown>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueData',
      'dialogueBank',
      'projectBank',
      'characterBank'
    ])
  },
  data () {
    return {
      isExporting: false
    }
  },
  methods: {
    characters () {
      this.isExporting = true
      var c
      var toSend = ''
      for (c of this.characterBank) {
        toSend += '/* ' + c.spID + ' */ ' + c.spName + '\n'
      }
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(toSend))
      element.setAttribute('download', 'characters')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      this.isExporting = false
    },
    exporting (operation, type) {
      this.isExporting = true
      var name = 'file1'
      if (operation === 'scene') {
        name = 'scene_' + this.activeSceneID
      } else {
        name = 'project_' + this.activeProjectID
      }
      var toSend = this.pack(operation, type)
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(toSend))
      element.setAttribute('download', name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      this.isExporting = false
    },
    pack (operation, type) {
      var packed = ''
      var element
      var subelement
      var passFlag = ''
      var index = 0
      if (type === 'mm') {
        if (operation === 'scene') {
          for (element of this.dialogueData) {
            // assign opener, sequence, and/or terminus
            if (index === 0) {
              passFlag = '-z '
            } else if (index === this.dialogueData.length - 1) {
              passFlag = '-t '
            } else {
              passFlag = '-s '
            }
            packed += this.mm(element, passFlag)
            index++
          }
        } else {
          for (element of this.dialogueBank) {
            packed += '/* ' + element.name + ' ' + element.id + ' */\n'
            for (subelement of element.data) {
              // assign opener, sequence, and/or terminus
              if (index === 0) {
                passFlag = '-z '
              } else if (index === element.data.length - 1) {
                passFlag = '-t '
              } else {
                passFlag = '-s '
              }
              packed += this.mm(subelement, passFlag)
              index++
            }
            index = 0
            packed += '\n'
          }
        }
      } else if (type === 'json') {
        if (operation === 'scene') {
          for (element of this.dialogueData) {
            packed += JSON.stringify(element)
          }
        } else {
          for (element of this.dialogueBank) {
            packed += JSON.stringify(element)
          }
        }
      }
      return packed
    },
    mm (element, passFlag) {
      console.log(element.id)
      var mmString = '/* '
      mmString = mmString + this.characterBank.find(e => e.spName === element.name).spID + ' ' + element.id + ' ' + passFlag
      var f
      var arg
      var addArgs = false
      for (f of element.mod) {
        // assign option, roulette, and/or event
        switch (f.flag) {
          case 'Option':
            mmString += '-o '
            addArgs = true
            break
          case 'Roulette':
            mmString += '-r '
            addArgs = true
            break
          case 'Event':
            mmString = mmString + '-x ' + f.args + ' '
            break
        }
        if (addArgs) {
          for (arg of f.args) {
            mmString = mmString + arg + ' '
          }
        }
      }
      mmString = mmString + '*/ ' + element.msg + '\n'
      return mmString
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>
