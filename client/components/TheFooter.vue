
<template lang='pug'>
  footer.footer.is-dark
    .content.has-text-left.has-text-white
      .columns(style='max-width: 760px')
        .column.is-4
          figure.image.is-96x96(style='margin: 0; height: 80px')
            img(src='~assets/img/cu-white-240x120.png')
          div
            p.
              #[strong.has-text-white Create ] by #[a.has-text-link Krist Pornpairin.]
              #[br] #[strong.has-text-white Contact ] us #[a.has-text-link(href="tel:0900206430") 090-020-6430]
        .column.is-3
          .field
            .label: strong.has-text-white.is-size-5 INFORMATION
            div.has-text-white
              li: a event
              li: a sponcer
        .column.is-3
          .field
            .label: strong.has-text-white.is-size-5 ABOUT #[a(href='https://www.chula.ac.th/en/') CHULA]
            .buttons
              button.button.is-link: b-icon(icon='facebook-f' pack='fab')
              button.button.is-link: b-icon(icon='twitter' pack='fab')
              button.button.is-link: b-icon(icon='instagram' pack='fab')

        .column.is-4
          .field: strong.has-text-white.is-size-5
            | ABOUT #[a(href='https://fb.com/krist7599555/') US]
          .field
            a.map(href='') View on Google Map
          //- p.is-size-7 องค์การบริหารสโมสรนิสิตจุฬาลงกรณ์มหาวิทยาลัย (อบจ.) ชั้น 2 อาคาร จุลจักรพงษ์ แขวง ปทุมวัน เขต ปทุมวัน กรุงเทพมหานคร 10330
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
}

.map {
  position: relative;
  display: block;
  min-height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: rgb(255, 255, 255);
}
.map:after {
  width: 100%;
  height: 100%;
  content: '';
  background: red
    url('https://www.library.eng.chula.ac.th/assets/1.0.0/img/map.jpg');

  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: inline-block;
  z-index: 0;
  border-radius: 8px;
  background-position: center;
  background-size: contain;
  opacity: 0.2;
}
</style>
