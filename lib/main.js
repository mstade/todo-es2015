(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.main = mod.exports;
  }
})(this, function () {
  'use strict';

  var filters = {
    'all': function all(todo) {
      return true;
    },
    'active': function active(todo) {
      return !todo.done;
    },
    'completed': function completed(todo) {
      return todo.done;
    }
  };
  var visible = filters[window.location.hash.slice(1)] || filters.all;
  on(key('enter', '.new-todo'), function (e) {
    store(function (todos) {
      return todos.concat({
        value: e.target.value,
        done: false
      });
    });
  });
  on(click('.toggle'), function (e) {
    store(function (todos) {
      return todos.map(function (todo, i) {
        if (i === parseInt(e.target.dataset.id)) {
          todo.done = !todo.done;
        }

        return todo;
      });
    });
  });
  on(click('.destroy'), function (e) {
    store(function (todos) {
      return todos.filter(function (_, i) {
        return i !== parseInt(e.target.dataset.id);
      });
    });
  });
  on(click('.clear-completed'), function (e) {
    store(function (todos) {
      return todos.filter(function (todo) {
        return !todo.done;
      });
    });
  });
  on(click('.filters a'), function (e) {
    visible = filters[e.target.hash.slice(1)] || filters.all;
  });
  render();

  function render() {
    document.body.innerHTML = '\n    <section class="todoapp">\n      <header class="header">\n        <h1>todos</h1>\n        <input class="new-todo" placeholder="What needs to be done?" autofocus>\n      </header>\n\n      <section class="main">\n        <input class="toggle-all" type="checkbox">\n        <label for="toggle-all">Mark all as complete</label>\n        <ul class="todo-list">\n        ' + store(function (todos) {
      return todos;
    }).map(function (todo, i) {
      return Object.assign(todo, {
        id: i
      });
    }).filter(visible).map(function (todo) {
      return '\n                <li class="' + (todo.done ? 'completed' : '') + '">\n                  <div class="view">\n                  <input data-id="' + todo.id + '" class="toggle" type="checkbox" ' + (todo.done ? 'checked' : '') + '>\n                  <label>' + todo.value + '</label>\n                  <button data-id="' + todo.id + '" class="destroy"></button>\n                  </div>\n                </li>\n              ';
    }).join('') + '\n        </ul>\n      </section>\n\n      <footer class="footer">\n        <span class="todo-count"></span>\n        <ul class="filters">\n          <li><a href="#" class="' + toggle(visible === filters.all) + '">All</a></li>\n          <li><a href="#active" class="' + toggle(visible === filters.active) + '">Active</a></li>\n          <li><a href="#completed" class="' + toggle(visible === filters.completed) + '">Completed</a></li>\n        </ul>\n        <button class="clear-completed">Clear completed</button>\n      </footer>\n    </section>\n  ';
  }

  function on(event, handler) {
    var type = event.type;
    var _event$condition = event.condition;
    var condition = _event$condition === undefined ? function () {
      return true;
    } : _event$condition;
    document.addEventListener(type, function (e) {
      if (condition(e)) {
        handler(e);
        render();
      }
    }, true);
  }

  function click(selector) {
    return {
      type: 'click',
      condition: function condition(e) {
        return e.target.matches(selector);
      }
    };
  }

  function key(code, selector) {
    var keyCode = {
      enter: 13
    }[code];
    return {
      type: 'keypress',
      condition: function condition(e) {
        return e.target.matches(selector) && e.keyCode === keyCode;
      }
    };
  }

  function store(fn) {
    var storage = undefined;

    try {
      storage = JSON.parse(window.sessionStorage.todos) || [];
    } catch (e) {
      storage = [];
    }

    var result = fn(storage);
    window.sessionStorage.todos = JSON.stringify(result);
    return result;
  }

  function toggle(cond) {
    return cond ? 'selected' : '';
  }
});
//# sourceMappingURL=main.js.map