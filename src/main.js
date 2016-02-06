const filters =
  { 'all': todo => true
  , 'active': todo => !todo.done
  , 'completed': todo => todo.done
  }

let visible = filters[window.location.hash.slice(1)] || filters.all

on(key('enter', '.new-todo'), e => {
  store(todos => todos.concat({ value: e.target.value, done: false }))
})

on(click('.toggle'), e => {
  store(todos => todos.map((todo, i) => {
    if (i === parseInt(e.target.dataset.id)) {
      todo.done = !todo.done
    }

    return todo
  }))
})

on(click('.destroy'), e => {
  store(todos => todos.filter((_, i) => i !== parseInt(e.target.dataset.id)))
})

on(click('.clear-completed'), e => {
  store(todos => todos.filter(todo => !todo.done))
})

on(click('.filters a'), e => {
  visible = filters[e.target.hash.slice(1)] || filters.all
})

render()

function render() {
  document.body.innerHTML = `
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus>
      </header>

      <section class="main">
        <input class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
        ${
          store(todos => todos)
            .map((todo, i) => Object.assign(todo, { id: i}))
            .filter(visible)
            .map(todo => {
              return `
                <li class="${todo.done? 'completed' : ''}">
                  <div class="view">
                  <input data-id="${todo.id}" class="toggle" type="checkbox" ${todo.done? 'checked' : ''}>
                  <label>${todo.value}</label>
                  <button data-id="${todo.id}" class="destroy"></button>
                  </div>
                </li>
              `
            })
            .join('')
        }
        </ul>
      </section>

      <footer class="footer">
        <span class="todo-count"></span>
        <ul class="filters">
          <li><a href="#" class="${toggle(visible === filters.all)}">All</a></li>
          <li><a href="#active" class="${toggle(visible === filters.active)}">Active</a></li>
          <li><a href="#completed" class="${toggle(visible === filters.completed)}">Completed</a></li>
        </ul>
        <button class="clear-completed">Clear completed</button>
      </footer>
    </section>
  `
}

function on(event, handler) {
  let { type, condition = () => true } = event

  document.addEventListener(type, function(e) {
    if (condition(e)) {
      handler(e)
      render()
    }
  }, true)
}

function click(selector) {
  return { type: 'click', condition: e => e.target.matches(selector) }
}

function key(code, selector) {
  let keyCode = { enter: 13 }[code]
  return { type: 'keypress', condition: e => e.target.matches(selector) && e.keyCode === keyCode }
}

function store(fn) {
  let storage

  try {
    storage = JSON.parse(window.sessionStorage.todos) || []
  } catch (e) {
    storage = []
  }

  let result = fn(storage)

  window.sessionStorage.todos = JSON.stringify(result)
  return result
}

function toggle(cond) {
  return cond? 'selected' : ''
}