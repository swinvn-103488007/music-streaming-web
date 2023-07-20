<!-- TEMPLATE SECTION -->
<template>
  <div>
    <button type="button" class="btn btn-primary" @click="Login">Login</button>
  </div>
</template>

<!-- SCRIPT SECTION -->
<script setup>
import { defineEmits } from "vue";
const clientId = "b5dd9e992f02489c8ae1d217fb609101";
// const clientSecret = "81bdf70a7be44478b5c1ec269fb6e35b";
const hash = window.location.hash;
const emit = defineEmits(["authorizeAccess", "setAccessToken"]);

async function Login() {
  if (hash) {
    const token = hash.substring(1).split("&")[0].split("=")[1];
    console.log(hash);
    console.log(token);
    emit("authorizeAccess");
    sessionStorage.setItem("access_token", token);
  } else {
    redirectToAuthCodeFlow();
  }
}

// // Get the URL hash
// // Print the access token value to the console

async function redirectToAuthCodeFlow() {
  const scopes = [
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming"
  ].join(" ");
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "token");
  params.append("redirect_uri", "http://localhost:8080/");
  params.append("scope", scopes);
  params.append("show_dialog", true);

  // using fetch
  // fetch(`https://accounts.spotify.com/authorize?${params.toString()}`)
  // .then(response => {
  //   console.log(response)
  // });

  // window location (redirect to authorize page)
  window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// async function getAccesToken(code) {
//   // const params = new URLSearchParams();
//   // params.append("grant_type", "authorization_code");
//   // params.append("code", code);
//   // params.append("redirect_uri", "http://localhost:8080/");

//   const credentials = `${clientId}:${clientSecret}`;
//   const encodedCredentials = btoa(credentials);

//   // const result = await fetch("https://accounts.spotify.com/api/token", {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/x-www-form-urlencoded",
//   //     "Authorization": `Authorization: Basic ${encodedCredentials}`
//   //   },
//   //   body: params,
//   // });
//   const result = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       "Authorization": `Authorization: Basic ${encodedCredentials}`
//     },
//     body: {
//       grant_type: "authorization_code",
//       code: code,
//       redirect_uri: "http://localhost:8080/"
//     },
//   });
//   return result;
// }

// async function fetchProfile(token) {
//   const result = await fetch("https://api.spotify.com/v1/me", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   })

//   return await result.json()
// }
</script>
