<list class="block clearfix px2">
  <div class="col col-12">
    <h1>{ opts.title }</h1>
    <p>{ opts.description }</p>
    <ul each={ opts.items }>
      <li><span class="inline-block px1 mr1 white rounded bg-{ {'created': 'gray', 'started': 'green', 'halted': 'red', 'completed': 'blue'}[status] }">{ status }</span> { value }</li>
    </ul>
  </div>
</list>
