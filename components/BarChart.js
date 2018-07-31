import { Bar } from 'vue-chartjs'
export default {
  props: ['data', 'options'],
  extends: Bar,
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
