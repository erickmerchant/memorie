<app>
  <p>{ message }</p>
  <time onclick={ setTime }>{ time }</time>
  <script>
    this.message = 'ABC !@#'

    this.setTime = function () {
      this.time = `Today is ${ Date.now() }`
    }

    this.setTime()
  </script>
</app>
