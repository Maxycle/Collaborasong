<template>
  <div id="home">
    <div class="form">
      <UserForm />
    </div>
  </div>
</template>

<script setup>
  import { useRouter } from "vue-router"
  import { useSessionStore } from "@/stores/modules/sessionStore"
  import UserForm from "@/components/UserForm.vue"

  const router = useRouter()
  const sessionStore = useSessionStore()
  if (sessionStore.isLoggedIn) router.push({ name: "Home" })
</script>

<style lang="scss" scoped>
  #home {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;

    .form {
      align-items: center;
      display: flex;
      flex-grow: 1;
      height: 100%;
      justify-content: center;
      width: 100%;
    }

    .logos {
      display: flex;
      gap: 30px;

      a {
        align-items: center;
        display: flex;
        height: 120px;
        justify-content: center;
        position: relative;
        width: 120px;

        &::before {
          background-image: linear-gradient(135deg, #be1818aa, #bb1616aa);
          border-radius: 50%;
          bottom: 50%;
          content: "";
          display: block;
          filter: blur(2em);
          height: 50px;
          left: 50%;
          position: absolute;
          transition: all 0.3s ease;
          translate: -50% 50%;
          width: 50px;
          z-index: -10;
        }

        &:hover::before {
          height: 120px;
          width: 120px;
        }

        &.pinia::before {
          background-image: linear-gradient(20deg, #ffe368aa 40%, #23e233aa);
        }

        &.vite::before {
          background-image: linear-gradient(135deg, #4cc2ffaa, #bd34feaa);
        }

        &.vue::before {
          background-image: linear-gradient(to top, #42b883aa 40%, #375494aa);
        }

        .logo {
          height: 100%;
          padding: 10px;
          transition: filter 0.3s ease;
          width: 100%;
          z-index: 10;
        }
      }
    }
  }
</style>