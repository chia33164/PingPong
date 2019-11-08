<template>
  <div id="input_modal">
    <b-modal
    id="infoModal"
    ref="modal"
    title="基本資訊"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    ok-only
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <label> 比賽名稱 </label>
        <b-form-input 
        v-model="game"
        placeholder="比賽名稱"
        id="gameName"
        :state="game !== ''"
        padding="5px"
        aria-describedby="input-live-help input-live-feedback"
        required></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback"> 必填 </b-form-invalid-feedback>

        <div id="selectRounds">
          <label> 輪次 </label>
          <b-form-select v-model="numOfRounds" :options="rounds">
            <template slot="first">
              <option :value="''" disabled>輪次</option>
            </template>
          </b-form-select>
        </div>

        <label> 我方名稱 </label>
        <b-form-input
        v-model="name1"
        placeholder="我方"
        id="me"
        :state="name1 !== ''"
        aria-describedby="input-live-help input-live-feedback"
        required></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback"> 必填 </b-form-invalid-feedback>

        <label> 對方名稱 </label>
        <b-form-input
        v-model="name2"
        placeholder="對方"
        id="other"
        :state="name2 !== ''"
        aria-describedby="input-live-help input-live-feedback"
        required></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback"> 必填 </b-form-invalid-feedback>
        
        <div class="btns">
          <div class="left">
            <b-form-group label="" :state="roundState">
              <b-form-radio v-model="numOfBoards" value="1"> 1 戰 1 勝 </b-form-radio>
              <b-form-radio v-model="numOfBoards" value="3"> 3 戰 2 勝 </b-form-radio>
              <b-form-radio v-model="numOfBoards" value="5"> 5 戰 3 勝 </b-form-radio>
              <b-form-radio v-model="numOfBoards" value="7"> 7 戰 4 勝 </b-form-radio>
              <b-form-invalid-feedback :state="roundState">必填</b-form-invalid-feedback>
              <b-form-valid-feedback :state="roundState">ok</b-form-valid-feedback>
            </b-form-group>
          </div>
          <div class="mid">
            <b-form-group label="首局站位" :state="stationState">
              <b-form-radio v-model="selected" name="some-radios" value="top">上方</b-form-radio>
              <b-form-radio v-model="selected" name="some-radios" value="bottom">下方</b-form-radio>
              <b-form-invalid-feedback :state="stationState">必填</b-form-invalid-feedback>
              <b-form-valid-feedback :state="stationState">ok</b-form-valid-feedback>
            </b-form-group>
          </div>
          <div class="right">
            <b-form-checkbox
            v-model="serve"
            value = 'true'
            unchecked-value = 'false'
            >
              先發球
            </b-form-checkbox>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      nameState: null,
      submittedNames: [],
      rounds: [
        {
          'value': 'R128',
          'text': 'R128'
        },
        {
          'value': 'R64',
          'text': 'R64'
        },
        {
          'value': 'R32',
          'text': 'R32'
        },
        {
          'value': 'R16',
          'text': 'R16'
        },
        {
          'value': 'R8',
          'text': 'R8'
        },
        {
          'value': 'Quater-Round',
          'text': 'Quater-Round'
        },
        {
          'value': 'Final-Round',
          'text': 'Final-Round'
        }
      ],
      name1: '',
      name2: '',
      game: '',
      selected: null,
      numOfBoards: null,
      serve: 'false',
      numOfRounds: ''
    }
  },
  computed: {
    stationState () {
      return Boolean(this.selected)
    },
    roundState () {
      return Boolean(this.numOfBoards)
    }
  },
  methods: {
    checkFormValidity: function () {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid ? 'valid' : 'invalid'
      return valid
    },
    resetModal: function () {
      this.name = ''
      this.nameState = null
    },
    handleOk: function (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit: function () {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      let sendData = []
      sendData.push(this.game)
      sendData.push(this.name1)
      sendData.push(this.name2)
      sendData.push(this.selected)
      sendData.push(this.serve)
      sendData.push(this.numOfBoards)
      sendData.push(this.numOfRounds)

      this.$emit('getInfo', sendData)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.modal.hide()
      })
    }
  }
}
</script>

<style scoped>
.btns {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: flex-start;
  padding: 20px;
}

.btns .left {
  /* width: 100px; */
  flex-grow: 1;
}

.btns .mid {
  /* width: auto; */
  flex-grow: 1;
}

.btns .right {
  /* width: 100px; */
  flex-grow: 1;
}

</style>
