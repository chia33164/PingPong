<template>
  <div id="input_modal">
    <b-modal
    id="modal-1"
    ref="modal"
    title="基本資訊"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
    >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <label> 比賽名稱 </label>
      <b-form-input 
      v-model="game"
      placeholder="比賽名稱"
      id="gameName"
      :state="game !== ''"
      aria-describedby="input-live-help input-live-feedback"
      required></b-form-input>
      <b-form-invalid-feedback id="input-live-feedback"> 必填 </b-form-invalid-feedback>

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
      
      <b-form-group label="首局站位">
        <b-form-radio v-model="selected" name="some-radios" value="top">上方</b-form-radio>
        <b-form-radio v-model="selected" name="some-radios" value="bottom">下方</b-form-radio>
      </b-form-group>

      <label>是否發球</label>
      <b-form-checkbox
      v-model="serve"
      value = "1"
      unchecked-value = "0"
      >
        發球
      </b-form-checkbox>
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
      name1: '',
      name2: '',
      game: '',
      selected: '',
      serve: '0'
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

      this.$emit('getInfo', sendData)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.modal.hide()
      })
    }
  }
}
</script>