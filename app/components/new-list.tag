<new-list class="block clearfix px2">
  <h1>New List</h1>
  <list-form save={ this.save }></list-form>
  <script>

  this.save = function () {
    console.log(this.title.value)
  }

  </script>
</new-list>
