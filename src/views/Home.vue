<template>
  <div class="home">
    <form @submit.prevent="fetchDemAllergies">
      <label for="zip">Enter your zip code</label>
      <input v-model="zip" type="tel" name="zip" id="zip" />
      <button :disabled="!validZip">Submit</button>
    </form>
    <div v-if="data !== null">
      <div>
        Allergy info for:
        {{ data.Location.City }},{{ data.Location.State }}
      </div>
      <div>
        Are allergies gonna fuck up my day?
        {{ today.Index }}
      </div>
      <div>
        Top allergens:
        <ul>
          <li v-for="allergen in today.Triggers" :key="allergen.LGID">
            {{ allergen.Name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      zip: null,
      data: null
    };
  },
  computed: {
    validZip() {
      return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.zip);
    },
    today() {
      return this.data.Location.periods.find(item => item.Type === "Today");
    }
  },
  methods: {
    fetchDemAllergies() {
      if (this.validZip) {
        localStorage.setItem("zip", this.zip);
        axios
          .post("/api/fetch-allergies", {
            zip: this.zip
          })
          .then(res => {
            this.data = res.data;
          });
      }
    }
  },
  created() {
    const zip = localStorage.getItem("zip");
    if (zip) {
      this.zip = zip;
      this.fetchDemAllergies();
    }
  }
};
</script>
