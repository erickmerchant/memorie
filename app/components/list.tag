<list class="block clearfix px2">
  <div class="col col-12">
    <div class="cursor-pointer" onclick={ this.toggleEditList }>
      <h1>{ this.title }</h1>
      <p>{ this.description }</p>
    </div>
    <ul class="list-reset mt2">
      <li each={ this.items } class="cursor-pointer px1 border-left border-1 border-{ {'created': 'gray', 'started': 'green', 'halted': 'red', 'completed': 'blue'}[status] }" onclick={ this.toggleEditItem }> { value }</li>
      <li class="mt1">
        <a class="cursor-pointer" onclick={ this.toggleNewItem }>+ New Item</a>
      </li>
    </ul>
  </div>
  <script>

  import api from '../api.js'

  api('/api/list/' + opts.id).then((list) => {
    this.title = list.title
    this.description = list.description
    this.items = list.items

    riot.update()
  })

  </script>
</list>
