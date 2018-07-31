import { Line } from 'vue-chartjs'
export default {
  props: ['data', 'options'],
  extends: Line,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  methods: {
    update () {
      this.renderChart(this.data, this.options)
    }
  }
}
