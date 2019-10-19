<template>
  <span :class="courseClass"
    >{{ value.ลงทะเบียน }}/{{ value.ที่นั้งทั้งหมด }}</span
  >
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        ลงทะลงทะเบียน: "0",
        ที่นั้งที่นั้งทั้งหมด: "0"
      })
    }
  },
  computed: {
    courseClass() {
      const avail =
        Number(this.value.ที่นั้งทั้งหมด) - Number(this.value.ลงทะเบียน);
      if (avail <= 0) return "has-text-danger";
      if (avail <= 5) return "has-text-warning";
      if (this.value.ลงทะเบียน == 0) return "has-text-success";
      return "has-text-success";
    }
  }
};
</script>

<style lang="scss">
span {
  &.has-text-warning {
    color: #ffb100fc !important;
  }
  &.has-text-success {
    color: #0aab42 !important;
  }
}
</style>
