<template>
<div class="boxStyle">
  <div class="outerbox">
    <div class="top">
      <Jurisdiction />
    </div>
    <JurisdictionList />
  </div>
</div>
</template>

<script>
import Jurisdiction from '../components/System/jurisdiction.vue'
import JurisdictionList from '../components/System/jurisdictionlist.vue'
export default {
  name: 'jurisdictionmanage',
  components: {
    Jurisdiction,
    JurisdictionList
  }
}
</script>

<style scoped>
.outerbox {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  padding:15px;
}
.top {
  display: flex;
  margin-bottom: 15px;
}
</style>
