<lists class="block clearfix px2">
  <div class="col col-12">
    <h1>Lists</h1>
    <ul class="list-reset">
      <li each={ this.lists }><a href="/list/{ id }">{ title }</a></li>
      <li class="mt1">
        <a href="/list/new">+ New List</a>
      </li>
    </ul>
  </div>
  <script>

  import api from '../api.js'

  api('/api/list/').then((lists) => {
    this.lists = lists

    riot.update()
  })

  </script>
</lists>
