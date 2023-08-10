  
<script setup>
import PlaylistDetailHeader from "@/components/PlaylistDetailHeader.vue";
import SongRowPlaylist from "@/components/SongRowPlaylist.vue";
import SongRowSearch from "@/components/SongRowSearch.vue";
import useEmitter from "@/composables/useEmitter";
import PlayCircle from "vue-material-design-icons/PlayCircle.vue";
import Heart from "vue-material-design-icons/Heart.vue";
import DotsHorizontal from "vue-material-design-icons/DotsHorizontal.vue";
import { computed, ref, watch, defineEmits } from "vue";
import { useRoute } from "vue-router";
import SpotifyWebApi from "spotify-web-api-node";

const spotify = new SpotifyWebApi();

// variable to control showing message when a playlist is deleted
const deleted = ref(false);

const route = useRoute();
const emitter = useEmitter();
const emits = defineEmits(["playSong"]);

// the variable to strore the playlist object
let currentPlaylist = ref({
  images: [
    {
      url: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=",
    },
  ],
});

// A computed function to update playlist id
const playlistId = computed(() => {
  return route.params.playlistId;
});

// check if a playlist is editable (playlist editable if owner is users)
const isEditable = computed(() => {
  return currentPlaylist.value?.ownerId != "spotify";
});

// searchInput is binded with input from the search box to add song to playlist
const searchInput = ref("");

// store search result
const searchResults = ref(null);

const trackToBeDeleted = ref({
  name: null,
  uris: null,
});

function receiveTrackToBeDeleted(name, uris) {
  trackToBeDeleted.value.name = name;
  trackToBeDeleted.value.uris = uris;
}
// used to check the time out of search input
let searchChangeTimeoutId = null;

function playPlaylist() {
  console.log("🤔 playPlaylist() called", "Playlist is playing");
}

async function playSong(trackUri) {
  if (sessionStorage.getItem("deviceId")) {
    const playOptions = {
      device_id: sessionStorage.getItem("deviceId"),
      context_uri: currentPlaylist.value.uri,
      offset: { uri: trackUri },
    };
    emits("playSong", playOptions);
  }
}

function deletePlaylist(playlistId) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  spotify.unfollowPlaylist(playlistId);
  // console.log("playlist to be deleted:", playlistId);
  emitter.emit("delete-playlist", playlistId);
  deleted.value = true;
}

// function to call search API in a regular manner correspond to search input changes
function handleSearchInput() {
  if (searchChangeTimeoutId) {
    clearTimeout(searchChangeTimeoutId);
  }
  searchChangeTimeoutId = setTimeout(() => {
    // console.log("Request search API");
    if (searchInput.value) {
      spotify.searchTracks(searchInput.value, { limit: 20 }).then((data) => {
        // console.log("Search Result", data);
        searchResults.value = data.body.tracks.items;
      });
    }
  }, 500);
}

// get tracks in the playlist. If total tracks > 100, get the last 100 track only, order by latest added
async function getPlaylistTracks() {
  const offsetValue =
    currentPlaylist.value.total > 100
      ? `${currentPlaylist.value.total - 100}`
      : 0;
  spotify.setAccessToken(sessionStorage.getItem("access_token"));

  await spotify
    .getPlaylistTracks(`${playlistId.value}`, {
      limit: 100,
      offset: offsetValue,
    })
    .then((data) => {
      currentPlaylist.value.tracks = data.body;
      if (currentPlaylist.value.ownerId != "spotify") {
        currentPlaylist.value.tracks.items.reverse();
      }
    });
}

// get playlist name, images, owner, total number of track of the playlist
async function getPlaylistMetadata() {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  await spotify
    .getPlaylist(`${playlistId.value}`, {
      fields: "name,images,owner.id,tracks.total,uri",
    })
    .then((data) => {
      currentPlaylist.value.name = data.body.name;
      currentPlaylist.value.images = data.body.images;
      currentPlaylist.value.ownerId = data.body.owner.id;
      currentPlaylist.value.total = parseInt(data.body.tracks.total);
      currentPlaylist.value.uri = data.body.uri;
      // console.log("Current playlist after get metadata", currentPlaylist.value);
    });
}

async function addTrackToPlaylist(trackUris) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  console.log("uri of adding track:", trackUris);
  await spotify.addTracksToPlaylist(playlistId.value, trackUris);
  setTimeout(async () => {
    await getPlaylistMetadata();
    getPlaylistTracks();
  }, 1000);
}

async function deleteTrackFromPlaylist(trackUris) {
  spotify.setAccessToken(sessionStorage.getItem("access_token"));
  console.log("track uri arrays to be deleted", trackUris);
  await spotify.removeTracksFromPlaylist(playlistId.value, trackUris);
  setTimeout(async () => {
    await getPlaylistMetadata();
    getPlaylistTracks();
  }, 1000);
}

// Watch the change when user select another playlist
watch(
  playlistId,
  async () => {
    deleted.value = false;
    await getPlaylistMetadata();
    await getPlaylistTracks();
    console.log("🤔 Current playlist is", currentPlaylist.value);
  },
  { immediate: true }
);

// Watch search input and handle change in search input
watch(searchInput, handleSearchInput);
</script>

<template>
  <div class="body" v-if="!deleted">
    <PlaylistDetailHeader></PlaylistDetailHeader>

    <div class="body__info">
      <img :src="currentPlaylist?.images[0]?.url" alt="" />
      <div class="body__infoText">
        <strong>PLAYLIST</strong>
        <h4>{{ currentPlaylist?.name }}</h4>
      </div>
    </div>

    <div class="body__songs">
      <div class="body__icons">
        <PlayCircle
          fillColor="#F36921"
          class=""
          @click="playPlaylist"
        ></PlayCircle>
        <Heart fillColor="#F36921"></Heart>

        <div class="dropdown">
          <DotsHorizontal
            class=""
            fillColor="#F36921"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          ></DotsHorizontal>
          <ul class="dropdown-menu">
            <li v-if="isEditable" class="dropdown-item">
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#addSongsModal"
                >Add songs</a
              >
            </li>
            <li class="dropdown-item">
              <a
                class="dropdown-item"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#deletePlaylistModal"
                >Delete playlist</a
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Rows of song in a playlist -->
      <SongRowPlaylist
        v-for="(playlistTrackObject, index) in currentPlaylist?.tracks?.items"
        :key="index"
        :playlist-track="playlistTrackObject"
        @play-song="playSong"
        @add-track-to-delete="receiveTrackToBeDeleted"
      ></SongRowPlaylist>
    </div>

    <!--Confirm Delete Playlist Modal -->
    <div
      class="modal fade"
      id="deletePlaylistModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Delete this playlist
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delelete this playlist?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="deletePlaylist(playlistId)"
            >
              Confirm delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Songs Modal -->
    <div
      class="modal fade"
      id="addSongsModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <!-- Modal header -->
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Add songs to playlist
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control mb-3"
                  placeholder="Search for the tracks to add"
                  aria-label="Search for the tracks to add"
                  v-model="searchInput"
                />
              </div>

              <!-- Row of search result -->
              <SongRowSearch
                v-for="(track, index) in searchResults"
                :key="index"
                :track="track"
                @add-track-to-playlist="addTrackToPlaylist"
              ></SongRowSearch>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Confirm Delete Track From Playlist Modal -->
    <div
      class="modal fade"
      id="deleteTrackFromPlaylistModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">
              Delete track from playlist
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {{
              `Are you sure you want to delelete ${trackToBeDeleted.name} from playlist?`
            }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="deleteTrackFromPlaylist(trackToBeDeleted.uris)"
            >
              Confirm delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="body" v-else>
    <p><em>Playlist was deleted</em></p>
  </div>
</template>
  
<style scoped>
.body {
  margin: 1rem;
  padding: 30px 30px 150px 30px;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  flex: 0.8;
  color: 2e3271;
  background-color: white;
  border-radius: 40px;
}

.body::-webkit-scrollbar {
  display: none;
}

.body__info {
  display: flex;
  align-items: flex-end;
  padding: 10px;
}

.dropdown:hover {
  background-color: rgb(124, 141, 181, 0.72);
  border-radius: 30px;
}

.body__icons {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 40px;
}

.body__songs {
  z-index: 1;
  margin: 20px -30px;
  margin-bottom: 150px;
}

.body__info > img {
  height: 20vw;
  margin-right: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.16);
}

.body__infoText {
  flex: 1;
}

.body__infoText > h2 {
  font-size: 48px;
  margin-bottom: 10px;
}

@media screen and (max-width: 992px) {
  .body {
    flex-grow: 1;
    padding-bottom: 150px;
  }
}

@media screen and (max-width: 576px) {
  .body {
    flex-grow: 1;
    margin: 0.5rem;
    padding: 15px;
    padding-bottom: 150px;
  }

  .body__icons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 30px;
  }
}
</style> 