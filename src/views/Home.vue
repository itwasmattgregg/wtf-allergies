<template>
  <div class="home">
    <form @submit.prevent="fetchDemAllergies">
      <div class="form-group">
        <label for="zip" class="label">Enter your zip code</label>
        <input v-model="zip" type="tel" name="zip" id="zip" class="input" />
      </div>
      <button :disabled="!validZip" class="button">Submit</button>
    </form>
    <div v-if="data !== null" class="results-container">
      <div class="location">
        {{ transformedLocation }}
      </div>
      <div class="fuckometer">
        <div class="gauge-wrapper">
          <svg class="gauge">
            <circle
              class="gauge-circle"
              stroke="white"
              fill="transparent"
              r="58"
              :stroke-dasharray="`${58 * 2 * Math.PI} ${58 * 2 * Math.PI}`"
              :stroke-dashoffset="offset"
              cx="60"
              cy="60"
            />
            <circle
              class="gauge-circle-bg"
              stroke="white"
              fill="transparent"
              r="58"
              cx="60"
              cy="60"
            />
          </svg>
          <div class="index">{{ today.Index }}</div>
        </div>
        <div className="font_monad">Allergen Fuck-o-meter</div>
      </div>
      <div v-if="today.Triggers.length > 0">
        <strong>Top Allergens</strong>
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
    },
    transformedLocation() {
      return `${this.data.Location.City.toLowerCase()}, ${
        this.data.Location.State
      }`;
    },
    offset() {
      const circ = 58 * 2 * Math.PI;
      return circ - (this.today.Index / 12) * circ;
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

<style lang="scss" scoped>
.form-group {
  max-width: 400px;
  margin: 0 auto;
}
.input {
  width: 100%;
  display: block;
  margin-bottom: 1em;
  background: none;
  border: 2px solid white;
  padding: 10px;
  color: #fff;
  font-size: 18px;
}
.label {
  text-align: left;
  display: block;
}
.button {
  font-size: 18px;
  border-radius: 0;
  background: #fff;
  box-shadow: none;
  border: 2px solid aliceblue;
  padding: 10px 30px;
}

.results-container {
  margin-top: 2em;
}
.location {
  text-transform: capitalize;
  margin-bottom: 2em;
}
.fuckometer {
  margin-bottom: 2em;
}
.gauge-wrapper {
  display: grid;
  align-items: center;
  justify-items: center;
  margin-bottom: 1em;
}
.gauge {
  width: 120px;
  height: 120px;
  grid-column: 1/1;
  grid-row: 1/1;
}
.gauge-circle {
  stroke-width: 4px;
  transform: rotate(90deg);
  transform-origin: 50% 50%;
  stroke-linecap: "round";
  transition: 1s all ease-out;
}
.gauge-circle-bg {
  stroke-width: 4px;
  opacity: 0.3;
}
.index {
  grid-column: 1/1;
  grid-row: 1/1;
  font-size: 2em;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
}
</style>
