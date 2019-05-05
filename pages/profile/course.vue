<template lang='pug'>
div
  //- .notification.is-danger PRIVATE Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  br
  template(v-for='{img, title, date, status} in events')
    a.event-card.has-text-dark
      .event-img
        img(:src='img')
      .event-content
        .event-content__inner
          .event-label {{title}}
          .event-date {{date}}
          .event-status.has-text-success {{status}}
</template>

<script>
export default {
  data() {
    return {
      events: [
        {
          img: "http://tnews.teenee.com/etc/img8/300699.jpg",
          title: "วิศณุ",
          date: "13 มีนาคม 2561",
          status: "approve"
        },
        {
          img:
            "http://static.trueplookpanya.com/tppy/member/m_525000_527500/525016/cms/images/รับน้องก้าวใหม่ (15).png",
          title: "รับน้องก้าวใหม่",
          date: "13 มีนาคม 2561",
          status: "approve"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
$event-card-height: 120px;
.event-card {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 4px 8px #aaaa;
  transition: all 200ms;
  height: $event-card-height;
  margin-bottom: 15px;
  .event-img {
    flex-grow: 1;
    img {
      object-fit: cover;
      width: $event-card-height;
      height: $event-card-height;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .event-content {
    flex-grow: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    text-align: left;
    .event-content__inner {
      min-width: 100%;
      padding-left: 50px;
    }
  }
  .event-label {
    font-weight: bold;
  }
  .event-date {
    font-size: 0.8rem;
  }
  .event-status {
    font-size: 0.8rem;
  }
}
.event-card:hover {
  transform: scale(1.02) translateY(-3px);
  box-shadow: 0px 5px 10px #888a;
}
</style>
