<template lang='pug'>
  div
    nav.navbar(role='navigation', aria-label='main navigation')
      .navbar-brand
        a.navbar-item
          img(src='https://bulma.io/images/bulma-logo.png', width='112', height='28')
        a.navbar-burger.burger(role='button', aria-label='menu', aria-expanded='false', data-target='navbarBasicExample' @click='show = !show' :class='{"is-active": show}')
          span(aria-hidden='true')
          span(aria-hidden='true')
          span(aria-hidden='true')
      #navbarBasicExample.navbar-menu(:class='{"is-active": show}')
        .navbar-start
          nuxt-link.navbar-item(v-for='path in paths' :to='path' :key='path.id') {{path.name}}
        .navbar-end
          .navbar-item
            .buttons
              a.button.is-primary: strong Sign up
              a.button.is-light Log in
    nuxt
</template>

<script>
export default {
  data() {
    return {
      show: false,
      paths: [{ name: "index" }, { name: "about" }, { name: "user" }]
    };
  }
};
</script>
