<template lang='pug'>
div
  //- div [[ {{user}} ]]
  #profile-content.content(align='center' v-if='user')
    .profile-partition
      .head-brand__wrapper: h5.head-brand
        b-icon(icon='file-alt' size='is-large')
        span PERSONAL
      .profile-fields.max-width-content
        b-field(label='เพศ' horizontal)
          input.input.is-static(:value='user.genderTH' disabled)
          b-icon(icon='mars' pack='fas')
        b-field(label='ชื่อ' horizontal)
          .field-body__stack
            input.input.is-static(:value='`${user.titleTH} ${user.nameTH} ${user.surnameTH}`' disabled)
            //- input.input.is-static(:value='`${user.titleTH} ${user.nameTH} ${user.surnameTH}`' disabled)
            //- input.input.is-static(:value='`${user.titleEN} ${user.nameEN} ${user.surnameEN}`' disabled)
          b-icon(icon='user' pack='fas')
        b-field(label='คณะ' horizontal)
          .field-body__stack
            input.input.is-static(:value='user.facultyTH' disabled)
            //- input.input.is-static(:value='user.facultyEN' disabled)
          b-icon(icon='cog' pack='fas')
        //- b-field(label='ภาค' horizontal)
        //-   input.input.is-static(:value='user.department' disabled)
        //-   b-icon(icon='code-branch' pack='fas')
        //- b-field(label='เอก' horizontal)
        //-   input.input.is-static(:value='user.fieldOfStudy' disabled)
        //-   b-icon(icon='code-branch' pack='fas')
    .profile-partition
      .head-brand__wrapper: h5.head-brand
        b-icon(icon='shield-alt' pack='fas' size='is-large')
        span PROTECTED
      .profile-fields.max-width-content
        b-field(label='รหัสนิสิต' horizontal)
          input.input.is-static(:value='user.ouid' disabled)
          b-icon(icon='id-card-alt' pack='fas')
        b-field(label='เบอร์โทร' horizontal)
          input.input.is-static(v-mask="'###-###-####'" icon='phone' size='is-static' v-model='user.phone' placeholder="099-999-9999")
          b-icon(icon='phone' pack='fas')
        b-field(label='อีเมล' horizontal)
          input.input.is-static(v-model='user.email' placeholder='mymail@gmail.com')
          b-icon(icon='envelope' pack='fas')
        b-field(label='ศาสนา' horizontal)
          input.input.is-static(v-model='user.religien' placeholder='ไม่ระบุ')
          b-icon(icon='dharmachakra' pack='fas')
        b-field(label="การแพ้" horizontal)
          input.input.is-static(v-model='alergy' placeholder='หมู, กุ้ง, แป้งฝุ่นม ถั่ว')
          b-icon(icon='utensils' pack='fas')
        b-field(label="การเจ็บป่วย" horizontal)
          input.input.is-static(v-model='sickness' placeholder='ซึมเศร้า, G6PD')
          b-icon(icon='syringe' pack='fas')
        b-field(label="รอบอก" horizontal)
          input.input.is-static(v-model='shirt' placeholder='38')
          b-icon(icon='syringe' pack='fas')
    .profile-partition
      .head-brand__wrapper: h5.head-brand
        b-icon(icon='ambulance' pack='fas' size='is-large')
        span EMERGENCY
      .profile-fields.max-width-content
        b-field(label="เบอร์ฉุกเฉิน" horizontal)
          input.input.is-static(v-model='user.emergencyPhone' v-mask="'###-###-####'" icon='phone' size='is-static' placeholder='099-999-9999')
          b-icon(icon='user-injured' pack='fas')
        b-field(label="ความเกี่ยวข้อง" horizontal)
          input.input.is-static(v-model='user.emergencyRelation' placeholder='แม่' disabled)
          b-icon(icon='notes-medical' pack='fas')
        b-field(label="ที่อยู่" horizontal)
          b-input(type='textarea' v-model='user.house' size='is-static' placeholder='11/12 หมู่ 6 ศรีจันทร์ 39 ต ในเมือง อ เมือง จ ขอนแก่น')
          b-icon(icon='home' pack='fas')
    .profile-partition
      .head-brand__wrapper: h5.head-brand
        b-icon(icon='globe' pack='fas' size='is-large')
        span SOCIAL
      .profile-fields.max-width-content
        b-field(label='LINE' horizontal)
          input.input.is-static(value='krist7599555' disabled)
          b-icon(icon='line' pack='fab')
        b-field(label='Facebook' horizontal)
          input.input.is-static(value="Krist Pornpairin" disabled)
          b-icon(icon='facebook' pack='fab')
        b-field(label='Instagram' horizontal)
          input.input.is-static(value='krist7599555' disabled)
          b-icon(icon='instagram' pack='fab')




</template>

<script>
import Vue from 'vue'
import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective)
export default {
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$auth.user
    }
  },
  watch: {
    user: {
      deep: true,
      handler() {
        console.log('MEE')
      }
    }
  }
}
</script>

<style lang="scss">
$head-color: $dark;
$head-color: lightblue;
$head-color: $primary;

#profile-content {
  .field.is-horizontal {
    display: flex;
    .field-label {
      padding-top: 0.375em;

      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 0;
      margin-right: 1.5rem;
      text-align: right;

      min-width: 82px;
      max-width: 150px;
    }
    .field-body {
      display: flex;
      flex-basis: 0;
      flex-grow: 5;
      flex-shrink: 1;
    }
    .field-body__stack {
      display: flex;
      flex-direction: column;
    }
    .icon:last-child {
      padding-top: 0.6rem;
    }
  }
  .profile-fields {
    margin-left: 15px;
    margin: 0 auto;
  }
  .textarea.is-static {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    padding-left: 0;
    padding-right: 0;
    padding-top: calc(0.375em - 1px);
    padding-bottom: calc(0.375em - 1px);
    min-height: 6rem !important;
  }
  .max-width-content {
    max-width: 370px;
  }
  .profile-partition {
    text-align: left;
    margin-top: 80px;
    &:first-child {
      margin-top: 100px;
    }
    &:last-child {
      margin-bottom: 150px;
    }
  }
  .head-brand__wrapper {
    padding-left: 6px;
    border-left: 6px solid $head-color;
    max-width: 440px;
    margin: 0 auto;
    filter: drop-shadow(1px 5px 4px #aaaa);
    .head-brand {
      display: flex;
      align-items: center;
      padding: 10px;
      color: white;
      background-color: $head-color;
      margin-bottom: 30px;
      // clip-path: polygon(95% 0, 100% 50%, 95% 100%, 0% 100%, 0% 0%);
      clip-path: polygon(95% 0, 100% 50%, 95% 100%, 0% 100%, 0% 0%);
      @media screen and (min-width: $tablet) {
        clip-path: polygon(
          95% 0,
          100% 50%,
          95% 100%,
          0% 100%,
          0% 0%,
          79% 0,
          79% 50%,
          82% 30%,
          85% 50%,
          85% 0
        );
      }
    }
  }
}
</style>

