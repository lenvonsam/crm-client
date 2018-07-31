import { Pie } from 'vue-chartjs'
export default {
  props: ['data', 'options'],
  extends: Pie,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  methods: {
    update () {
      this.renderChart(this.data, this.options)
    }
  }
}
