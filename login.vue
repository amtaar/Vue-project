<template>
  <div class="w-full h-[100vh] flex justify-center items-center">
    <div
      class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="space-y-6">
        <img
          src="/images/Alpertra_Logo.png"
          class="w-full me-3"
          alt="Alpertra Logo"
        />
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">
          {{ isPersonnel ? "Personel" : "Müşteri" }} Giriş Ekranı
        </h5>
        <div>
          <label
            for="tel"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Telefon Numarası</label
          >
          <input
            type="tel"
            name="tel"
            v-model="txtPhone"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="5XXXXXXXXX"
            onkeypress="return event.charCode >= 48 && event.charCode <= 57 && this.value.length <= 10"
            required
          />
        </div>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Şifre</label
          >
          <input
            type="password"
            name="password"
            v-model="txtPassword"
            placeholder="••••••••"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required
          />
        </div>
        <div class="flex items-start">
          <!-- <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
              />
            </div>
            <label
              for="remember"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Remember me</label
            >
          </div> -->
          <!-- <a
            href="#"
            class="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
            >Şifremi Unuttum?</a
          > -->
        </div>
        <button
          type="submit"
          @click="login()"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Giriş Yap
        </button>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          <p>
            {{ isPersonnel ? "Personel" : "Müşteri" }} değil misiniz?
            <span
              class="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
              @click="isPersonnelStore.setIsPersonnel(!isPersonnel)"
            >
              Giriş Yap
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LoginQueryRequest } from "@/models/Api";
import { useIsPersonnelStore, useUserInfoStore } from "#imports";
import { jwtDecode } from "jwt-decode";

const axios = useNuxtApp().$axiosWithoutAuthorize;
const isPersonnelStore = useIsPersonnelStore();
const userInfoStore = useUserInfoStore();
const isPersonnel = storeToRefs(isPersonnelStore).isPersonnel;
const txtPhone = ref("");
const txtPassword = ref("");

watch(txtPhone, (value) => {
  //startsWith("5")

  txtPhone.value.substring(0, 1).startsWith("5");
});

function login() {
  const phone = txtPhone.value;
  const password = txtPassword.value;
  if (phone.length == 0 || password.length == 0) {
    alert("Telefon numarası veya şifre boş bırakılamaz.");
    return;
  }
  if (phone.length < 10) {
    alert("Telefon numarası 10 haneli olmalıdır.");
    return;
  }

  const loginReq: LoginQueryRequest = {
    mobile: phone,
    password: password,
    isPersonnel: isPersonnelStore.getIsPersonnel(),
  };

  axios.api
    .v1AlpertraGlobalLoginCreate(loginReq)
    .then((res) => {
      if (res.data) {
        localStorage.setItem("accessToken", res.data.accessToken ?? "");
        localStorage.setItem("refreshToken", res.data.refreshToken ?? "");
        isPersonnelStore.setIsPersonnel(isPersonnelStore.getIsPersonnel());
        const decoded = jwtDecode(res.data.accessToken ?? "");
        var jwtPayload: { [key: string]: any } = decoded;
        useUserInfoStore().setFullName(
          jwtPayload["name"] + " " + jwtPayload["surname"]
        );
        useUserInfoStore().setUserId(jwtPayload["sub"]);
        useIsUserAuthorizedViewStore().setIsUserAuthorizedViewByPermissionId();
        useIsUserAuthorizedViewStore().setIsCollapsed();

        // userInfoStore.setFullName(decodedToken.aud?.valueOf() ?? "");

        navigateTo("/");
      }
    })
    .catch((err) => {
      alert(err.response.data.message);
      console.log(err);
    });
}
definePageMeta({
  title: "Login",
  description: "Login page",
  layout: false,
  middleware: ["login"],
});
</script>
