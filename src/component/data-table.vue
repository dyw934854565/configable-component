<template>
  <div class="data-table">
    <slot></slot>
    <t-table v-loading="loading" v-bind="$attrs" :cols="cols" :data="list" @filter-change="onFilterChange" v-on="$listeners"/>
    <div class="clearfix">
      <el-pagination
        class="pull-right"
        v-bind="pageInfoInner"
        @size-change="onSizeChange"
        @current-change="onCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import tTable from './t-table'
export default {
  props: {
    cols: {
      type: Array,
      required: false,
      default: () => []
    },
    pageInfo: {
      type: Object,
      required: false,
      default: () => ({})
    },
    routerMode: {
      type: Function,
      required: false
    },
    getData: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      filterOption: {},
      pageInfoInner: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        layout: 'total, prev, pager, next, jumper'
      }
    }
  },
  created () {
    this.mergePageInfo()
    this.getDataInner()
    if (this.routerMode) {
      this.$watch('$route', () => {
        this.mergePageInfo()
        this.getDataInner()
      })
    }
  },
  components: {
    tTable
  },
  methods: {
    onChange () {
      if (this.routerMode) {
        const path = this.routerMode(this.pageInfoInner)
        if (path && typeof path === 'string') {
          this.$router.push(path)
        }
      } else {
        this.getDataInner()
      }
    },
    onSizeChange (pageSize) {
      this.pageInfoInner.currentPage = 1
      this.pageInfoInner.pageSize = pageSize
      this.onChange()
    },
    onCurrentChange (currentPage) {
      this.pageInfoInner.currentPage = currentPage
      this.onChange()
    },
    mergePageInfo () {
      this.pageInfoInner = Object.assign({}, this.pageInfoInner, this.pageInfo)
      if (this.routerMode) {
        this.pageInfoInner = Object.assign({}, this.pageInfoInner, {
          currentPage: Number(this.$route.params.currentPage) || this.pageInfoInner.currentPage,
          pageSize: Number(this.$route.params.pageSize) || this.pageInfoInner.pageSize
        })
      }
    },
    async getDataInner () {
      this.loading = true
      try {
        const res = await this.getData(this.pageInfoInner, this.filterOption)
        this.list = res.data
        this.pageInfoInner.total = res.total
      } catch (e) {
        this.list = []
        this.$handleError && this.$handleError(e)
      }
      this.loading = false
    },
    onFilterChange (filterOption) {
      this.filterOption = filterOption
      this.pageInfoInner.currentPage = 1
      return this.getDataInner()
    },
    onSearch () {
      this.pageInfoInner.currentPage = 1
      return this.getDataInner()
    }
  }
}
</script>