<template>
  <div class="container p-4 border shadow rounded">
    <div class="inline-flex">
      <btn-group :items="currencies" :active="activeCurrency" @changeFilter="changeCurrency($event)" />

      <btn-group :items="years" :active="activeYear" :multi-select="true" has-filter="year" @changeFilter="changeYear($event)" />

      <btn-group :items="values" :active="activeValue" @changeFilter="changeValue($event)" />
    </div>

    <div class="w-96 pt-4">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
        </div>
        <input v-model="search" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
               placeholder="Filter by company name ..." required>
        <button v-if="search" @click="clearSearch" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="relative overflow-x-auto my-2">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs uppercase bg-white border-b border-gray-400">
        <tr class="text-gray-500">
          <th colspan="2" class="px-3 py-1"/>
          <template v-for="year in activeYear">
            <th colspan="2" class="px-3 text-center">
              <div class="py-1 border-b border-gray-400">
                {{ year | year }}
              </div>
            </th>
          </template>
        </tr>
        <tr class="text-gray-400">
          <th class="px-2 py-1 text-center">
            <div class="inline-flex">
              Date Sent

              <btn-sort sort-value="DateSent" :sort-by="sortBy" :asc="asc" @sort="sortColBy($event)" />
            </div>
          </th>
          <th class="px-3 py-1">
            <div class="inline-flex">
              Company

              <btn-sort sort-value="Company" :sort-by="sortBy" :asc="asc" @sort="sortColBy($event)" />
            </div>
          </th>
          <template v-for="_ in activeYear">
            <th class="px-3 py-1 text-center">
              FIX
            </th>
            <th class="px-3 py-1 text-center">
              FRN
            </th>
          </template>
        </tr>
        </thead>
        <tbody>
        <template v-for="item in getFilteredItems">
          <tr v-if="!!item.DateSent" class="t-row-active">
            <td class="w-36">
              <div class="inline-flex">
                {{ item.DateSent | date }}

                <btn-expand :item="item.Id" :expanded="expandedData" @expand="expand($event)" />
              </div>
            </td>
            <td class="font-bold text-left">
              {{ item.Company }}
            </td>
            <template v-for="year in activeYear">
              <td class="w-24" :class="isLowestValue(item, year) ? 'highlight' : ''">
                {{ getItemQuote(item, year, 'FIX') | formattedValue(activeValue === 'Yield') }}
              </td>
              <td class="w-24">
                {{ getItemQuote(item, year, 'FRN') | formattedValue(activeValue === 'Yield') }}
              </td>
            </template>
          </tr>

          <tr v-else class="t-row-inactive">
            <td class="w-32"/>
            <td class="font-bold text-left">
              {{ item.Company }}
            </td>
            <template v-for="_ in activeYear">
              <td class="w-24"/>
              <td class="w-24"/>
            </template>
          </tr>

          <template v-if="!!item.DateSent && expandedData === item.Id">
            <tr v-for="value in values" v-if="value !== activeValue" class="t-row-active extended">
              <td class="w-32"/>
              <td class="text-left">
                {{ value }}
              </td>
              <template v-for="year in activeYear">
                <td class="w-24">
                  {{ getItemQuote(item, year, 'FIX', value) | formattedValue(value === 'Yield') }}
                </td>
                <td class="w-24">
                  {{ getItemQuote(item, year, 'FRN', value) | formattedValue(value === 'Yield') }}
                </td>
              </template>
            </tr>
          </template>
        </template>

        </tbody>
        <tfoot class="border-t-2 border-gray-400">
          <tr class="t-row-active">
            <td class="w-32"/>
            <td class="font-bold text-left">
              Average for {{ activeValue }}
            </td>
            <template v-for="year in activeYear">
              <td class="w-24">
                {{ getItemQuote(totalValues, year, 'FIX') | formattedValue(activeValue === 'Yield') }}
              </td>
              <td class="w-24">
                {{ getItemQuote(totalValues, year, 'FRN') | formattedValue(activeValue === 'Yield') }}
              </td>
            </template>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import data from "../data.json";

import moment from "moment";

import BtnGroup from "./buttons/BtnGroup.vue";
import BtnSort from "./buttons/BtnSort.vue";
import BtnExpand from "./buttons/BtnExpand.vue";

export default {
  name: "VueTable",

  components: {
    BtnGroup,
    BtnSort,
    BtnExpand,
  },

  data(){
    return {
      items: [],

      activeCurrency: 'USD',
      activeYear: [],
      activeValue: 'Spread',

      search: '',

      expandedData: null,

      sortBy: 'DateSent',
      asc: true,

      values: [
          'Spread',
          'Yield',
          '3MLSpread'
      ]
    }
  },

  computed: {
    allQuotes() {
      let quotes = [];

      this.items.forEach(item => {
        if (!!item.Quote) {
          quotes.push(...item.Quote);
        }
      });

      return quotes;
    },

    currencies() {
      return Array.from(new Set(this.allQuotes.map(item => item.Currency)));
    },

    years() {
      return Array.from(new Set(this.allQuotes.map(item => {
        if (item.Currency === this.activeCurrency) {
          return item.Years;
        }
      }))).filter( Number );
    },

    totalValues() {
      let totalValues = [];

      this.activeYear.forEach(year => {
        let dataFix = this.calculateTotalValue(year, 'FIX');

        let dataFrn = this.calculateTotalValue(year, 'FRN');

        if (dataFix) {
          totalValues.push(dataFix);
        }
        if (dataFrn) {
          totalValues.push(dataFrn);
        }
      });

      return {"Quote": totalValues};
    },

    minValue() {
      let minValues = [];

      this.activeYear.forEach(year => {
        let dataMin = {
          "year": year,
          "value": null,
        };

        this.allQuotes.forEach(quote => {
          if (quote['Years'] === year && quote['Currency'] === this.activeCurrency) {
            if (quote['CouponType'] === 'FIX' && !!quote[this.activeValue]) {
              if (!dataMin.value || dataMin.value > quote[this.activeValue]) {
                dataMin.value = quote[this.activeValue];
              }
            }
          }
        });

        minValues = [...minValues, dataMin];
      });

      return minValues;
    },

    getFilteredItems() {
      return this.items.map(item => {
        let data = {
          'Id': item.Id,
          'DateSent': item.DateSent,
          'Company': item.Company,
          'Quote': []
        }
        if (item.Quote && item.Quote.length) {
          this.activeYear.forEach(year => {
            item.Quote.forEach(quote => {
              if (quote['Years'] === year && quote['Currency'] === this.activeCurrency) {
                data['Quote'].push(quote);
              }
            });
          })
        }

        if (data.Quote.length === 0) {
          data.DateSent = null;
        }

        return data;
      }).filter(item => {
        return item.Company.includes(this.search);
      }).sort((a, b) => {
        if (this.sortBy === 'DateSent') {
          if (this.asc) {
            return moment(b['DateSent']).diff(moment(a['DateSent']));
          } else {
            return moment(a['DateSent']).diff(moment(b['DateSent']));
          }
        } else {
          if (this.asc) {
            return b['Company'].localeCompare(a['Company']);
          } else {
            return a['Company'].localeCompare(b['Company']);
          }
        }
      }).sort((a, b) => {
        if (a['DateSent'] === null) {
          return 1;
        }
        if (b['DateSent'] === null) {
          return -1;
        }
      })
    }
  },

  methods: {
    sortColBy(col) {
      if (this.sortBy === col) {
        this.asc = !this.asc;
      } else {
        this.sortBy = col;
        this.asc = true;
      }
    },

    changeCurrency(currency) {
      this.activeCurrency = currency;
      this.activeYear = this.years;
    },

    changeYear(year) {
      if (this.activeYear.includes(year)) {
        if (this.activeYear.length > 1) {
          this.activeYear = this.activeYear.filter(y => y !== year)
        }
      } else {
        this.activeYear.push(year);
        this.activeYear.sort((a, b) => a - b)
      }
    },

    changeValue(value) {
      this.activeValue = value;
    },

    clearSearch() {
      this.search = '';
    },

    expand(itemId) {
      if (this.expandedData === itemId) {
        this.expandedData = null;
      } else {
        this.expandedData = itemId
      }
    },

    calculateTotalValue(year, coupon) {
      let dataQuotes = this.allQuotes.filter(quote => {
        if (quote['Years'] === year
            && quote['Currency'] === this.activeCurrency
            && quote['CouponType'] === coupon
            && !!quote[this.activeValue]) {
          return quote;
        }
      }).map(quote => quote[this.activeValue]);

      let totalData = dataQuotes.length;

      if (totalData) {
        let data = {
          "Years": year,
          "Currency": this.activeCurrency,
          "CouponType": coupon,
        }
        data[this.activeValue] = dataQuotes.reduce((a, b) => a + b) / totalData;

        return data;
      }

      return null;
    },

    getItemQuote(item, year, coupon, value = null) {
      let quote = item.Quote.filter(item => {
        if (item['Years'] === year && item['CouponType'] === coupon && item['Currency'] === this.activeCurrency) {
          return item[this.activeValue];
        }
      });

      if (quote.length) {
        if (value) {
          return quote[0][value];
        } else {
          return quote[0][this.activeValue];
        }
      } else {
        return null;
      }
    },

    isLowestValue(item, year) {
      let itemValue = this.getItemQuote(item, year, 'FIX');
      let minValue = null;
      this.minValue.forEach(val => {
        if (val.year === year) {
          minValue = val.value;
        }
      });

      return minValue === itemValue;
    }
  },

  mounted() {
    this.items = data.Items;

    this.activeYear = this.years;
  }
}
</script>

<style lang="scss" scoped>
.t-row-active {
  @apply bg-white border-b text-gray-600 text-center;

  td {
    @apply px-3 py-3;
  }

  &.extended td {
    @apply py-2
  }
}

.t-row-inactive {
  @apply bg-white border-b text-gray-300 font-normal text-center;

  td {
    @apply px-3 py-3;
  }
}

.highlight {
  @apply bg-amber-100;
}
</style>