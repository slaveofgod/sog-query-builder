/*
 * SOG Query Builder Library v0.0.1 revision 1c0f86a (PROFILER)
 * Copyright 2019-2020 Slave of God <iamtheslaveofgod@gmail.com>. All rights reserved.
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.sogqb = factory();
    }
}(this, function () {

var _typeLookup = function() {
  var result = {};
  var names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];
  for (var i = 0; i < names.length; i++) {
    result["[object " + names[i] + "]"] = names[i].toLowerCase();
  }
  return result;
}();
var sogqb = {version:"0.0.1", revision:"1c0f86a", config:{stateElementTypes:["expression", "conjunction"], expressionOperators:[{key:"equal", label:"Equal"}, {key:"not_equal", label:"Not Equal"}, {key:"more", label:"More"}, {key:"more_or_equal", label:"More or Equal"}, {key:"less", label:"Less"}, {key:"less_or_equal", label:"less_or_equal"}, {key:"like", label:"Like"}], conjunctionOperators:[{key:"or", label:"Or"}, {key:"and", label:"And"}]}, common:{}, themes:{}, registerTheme:function(theme) {
  var __t = [theme];
  var __theme = new __t[0]({}, {}, true);
  var alias = __theme.alias;
  if ("undefined" === typeof alias) {
    throw new Error('The theme has to have "alias" property');
  }
  if ("BaseTheme" !== __theme.base) {
    throw new Error('The theme has to extend "sogqb.BaseTheme" abstract class');
  }
  if ("undefined" === typeof __theme.__draw) {
    throw new Error('The theme has to implement "__draw" method');
  }
  if (false === sogv.isType("string", alias) && false === sogv.isType("array", alias)) {
    throw new Error('The alias must be type of "string" or "array", "' + sogv.getType(alias) + '" given');
  }
  if ("string" === typeof alias) {
    alias = [alias];
  }
  alias.forEach(function(element) {
    if ("undefined" === typeof sogqb.themes[theme]) {
      sogqb.themes[element] = theme;
    }
  });
}, makeTheme:function(theme, options, optionRules, internal) {
  if ("undefined" === typeof sogqb.themes[theme]) {
    throw new Error('Theme with alias "' + theme + '" is not registered.');
  }
  return new sogqb.themes[theme](options, optionRules, internal);
}, makeScheme:function(scheme) {
  return new sogqb.Scheme(scheme);
}, makeState:function(state, scheme) {
  return new sogqb.State(state, scheme);
}, isValidException:function(prefix, data, rules) {
  var message = sogv.isValidWithErrorMessage(data, rules);
  if (null !== message) {
    throw new Error(prefix + ": " + message);
  }
  return true;
}};
if (typeof exports !== "undefined") {
  exports.sogqb = sogqb;
}
;Object.assign(sogqb, function() {
  var BaseTheme = function(options, optionRules, internal) {
    this.__options = options || {};
    this.__internal = true === internal;
    this.__skipDrawing = false;
    if (false === this.__internal) {
      this.__validateOptions(optionRules);
    }
    this.name = "BaseTheme";
    this.base = "BaseTheme";
  };
  Object.assign(BaseTheme.prototype, {draw:function() {
    this.__beforeDraw();
    if (false === this.__skipDrawing) {
      this.__destroy();
      console.info('Drawing this container with the id "' + this.container + '" ...');
      this.__draw();
    }
    this.__afterDraw();
  }, __draw:function() {
    throw new Error('The theme has to implement "__draw" method');
  }, __beforeDraw:function() {
    var container = document.getElementById(this.container);
    if (null === container) {
      this.__skipDrawing = true;
      console.info('This container with the id "' + this.container + '" does not exist.');
    }
  }, __afterDraw:function() {
  }, __destroy:function() {
    document.getElementById(this.container).innerHTML = "";
  }, __validateOptions:function(rules) {
    if ("undefined" === typeof rules || null === rules) {
      return;
    }
    for (var key in rules) {
      if (!rules.hasOwnProperty(key)) {
        continue;
      }
      sogqb.isValidException("[option: " + key + "]", this.__options[key], rules[key]);
    }
  }, __prepareCssStyles:function(styles) {
    var parameters = {container:this.container};
    for (var key in parameters) {
      if (!parameters.hasOwnProperty(key)) {
        continue;
      }
      styles = styles.replace(new RegExp("%%" + key + "%%", "gm"), parameters[key]);
    }
    return styles;
  }, __buildStyleElement:function() {
    var container = document.getElementById(this.container);
    var style = document.createElement("style");
    style.innerHTML = this.cssStyles;
    container.appendChild(style);
  }, __buildContainerElement:function() {
    var container = document.getElementById(this.container);
    var query = this.__buildElement("query");
    var search = this.__buildElement("search");
    var clear = this.__buildElement("clear");
    container.appendChild(query);
    container.appendChild(search);
    container.appendChild(clear);
  }, __prettify:function() {
    var container = document.getElementById(this.container);
    var queryWidth = container.clientWidth - 10;
    container.childNodes.forEach(function(element) {
      if (false === element.classList.contains("query")) {
        queryWidth -= element.clientWidth;
      }
    });
    var queryElement = container.querySelector(".query");
    queryElement.style.width = queryWidth + "px";
  }, __buildElement:function(type) {
    var template = document.createElement("template");
    var html = "";
    switch(type) {
      case "query":
        html = this.__queryButton.trim();
        break;
      case "search":
        html = this.__searchButton.trim();
        break;
      case "clear":
        html = this.__clearButton.trim();
        break;
    }
    template.innerHTML = html;
    return template.content.firstChild;
  }});
  return {BaseTheme:BaseTheme};
}());
Object.assign(sogqb, function() {
  var Scheme = function(scheme) {
    this.__scheme = scheme || null;
    this.__validate();
    this.name = "Scheme";
  };
  Scheme.prototype.constructor = Scheme;
  Object.defineProperties(Scheme.prototype, {"scheme":{get:function() {
    return this.__scheme;
  }}});
  Object.assign(Scheme.prototype, {exist:function(field) {
    var field = field.split(".");
    var entity = null;
    for (var i = 0; i < this.__scheme.length; i++) {
      if (field[0] === this.__scheme[i].entity) {
        entity = this.__scheme[i];
        break;
      }
    }
    if (null === entity) {
      return false;
    }
    for (var i = 0; i < entity.columns.length; i++) {
      if (field[1] === entity.columns[i].name) {
        return true;
      }
    }
    return false;
  }, __validate:function() {
    sogqb.isValidException("Scheme", this.__scheme, "required|array|count:1,100");
    for (var i = 0; i < this.__scheme.length; i++) {
      this.__validateEntity(this.__scheme[i].entity);
      this.__validateColumns(this.__scheme[i].columns);
    }
    return true;
  }, __validateEntity:function(entity) {
    sogqb.isValidException("Entity", entity, "required|string|alpha-dash|length:2,50");
    return true;
  }, __validateColumns:function(columns) {
    sogqb.isValidException("Columns", columns, "required|array|between:1,1000");
    columns.forEach(function(element) {
      var validationEngine = new sogv.Application({lang:"en"});
      var data = {name:element.name, title:element.title, type:element.type, data:element.data};
      var rules = {name:"required|string|alpha-dash|length:2,50", title:"required|string|print|length:2,100", type:"required|in:email;integer;numeric;string;date;entity", data:"array"};
      var form = validationEngine.make(data, rules);
      if (false === form.isValid()) {
        for (var key in data) {
          if (!data.hasOwnProperty(key)) {
            continue;
          }
          if (false === form.get(key).isValid()) {
            throw new Error("Column '" + key + "' = '" + data[key] + "': " + form.get(key).errors().first());
          }
        }
      }
    });
    return true;
  }});
  return {Scheme:Scheme};
}());
Object.assign(sogqb, function() {
  var State = function(state, scheme) {
    this.__state = state || null;
    this.__scheme = scheme || null;
    if (null !== this.__state) {
      this.__validate();
      this.__validateFields();
    }
    this.name = "State";
  };
  State.prototype.constructor = State;
  Object.defineProperties(State.prototype, {"state":{get:function() {
    return this.__state;
  }}});
  Object.assign(State.prototype, {__validate:function() {
    sogqb.isValidException("State", this.__state, "required|array|count:1,100");
    for (var i = 0; i < this.__state.length; i++) {
      sogqb.isValidException("State > Type", this.__state[i].type, "required|alnum|in:" + sogqb.config.stateElementTypes.join(";"));
      var validationEngine = new sogv.Application({lang:"en"});
      var data = {};
      var rules = {};
      switch(this.__state[i].type) {
        case "expression":
          data = {field:this.__state[i].field, label:this.__state[i].label, value:this.__state[i].value, operator:this.__state[i].operator};
          rules = {field:"required|regex:^[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+$", label:"required|string", value:"required|string", operator:"required|alnum|in:" + sogqb.config.expressionOperators.map(function(data) {
            return data.key;
          }).join(";")};
          break;
        case "conjunction":
          data = {operator:this.__state[i].operator};
          rules = {operator:"required|alnum|in:" + sogqb.config.conjunctionOperators.map(function(data) {
            return data.key;
          }).join(";")};
          break;
      }
      var form = validationEngine.make(data, rules);
      if (false === form.isValid()) {
        for (var key in data) {
          if (!data.hasOwnProperty(key)) {
            continue;
          }
          if (false === form.get(key).isValid()) {
            throw new Error(sogh.camelCase(this.__state[i].type) + " '" + key + "' = '" + data[key] + "': " + form.get(key).errors().first());
          }
        }
      }
    }
    return true;
  }, __validateFields:function() {
    for (var i = 0; i < this.__state.length; i++) {
      if ("expression" === this.__state[i].type) {
        var field = this.__state[i].field.split(".");
        if (false === this.__scheme.exist(this.__state[i].field)) {
          throw new Error('Model "' + field[0] + '" or field "' + field[1] + '" for model "' + field[0] + '" does not exist.');
        }
      }
    }
    return true;
  }});
  return {State:State};
}());
sogqb.QueryBuilderFactory = {create:function(scheme, theme, state) {
  var __function = function(scheme, theme, state) {
    this.__scheme = scheme;
    this.__theme = theme;
    this.__state = state;
    this.draw = function() {
      this.__theme.draw();
    };
  };
  return new __function(scheme, theme, state);
}};
Object.assign(sogqb, function() {
  var Application = function(container, entity, scheme, state, theme) {
    var __this = this;
    this.__container = container || null;
    this.__entity = entity || null;
    this.__scheme = scheme || null;
    this.__state = state || null;
    this.__theme = theme || "material";
    sogqb.isValidException("Container", this.__container, "required|string|length:5,255");
    sogqb.isValidException("Entity", this.__entity, "required|string|length:2,50");
    this.setScheme(this.__scheme);
    this.setTheme(this.__theme);
    this.setState(this.__state, this.__scheme);
    this.name = "Application";
    window.addEventListener("resize", function() {
      __this.draw();
    });
  };
  Application.prototype.constructor = Application;
  Object.defineProperties(Application.prototype, {"container":{get:function() {
    return this.__container;
  }}, "entity":{get:function() {
    return this.__entity;
  }}, "scheme":{get:function() {
    return this.__scheme;
  }}, "state":{get:function() {
    return this.__state;
  }}, "theme":{get:function() {
    return this.__theme;
  }}});
  Object.assign(Application.prototype, {setScheme:function(scheme) {
    this.__scheme = sogqb.makeScheme(scheme);
  }, setState:function(state, scheme) {
    if ("undefined" !== typeof state) {
      scheme = this.__state;
    }
    if (null !== typeof scheme) {
      scheme = this.__scheme;
    }
    this.__state = sogqb.makeState(state, scheme);
  }, setTheme:function(theme) {
    this.__theme = sogqb.makeTheme(theme, {container:this.container}, {});
  }, draw:function() {
    var builder = sogqb.QueryBuilderFactory.create(this.__scheme, this.__theme, this.__state);
    builder.draw();
  }});
  return {Application:Application};
}());
Object.assign(sogqb, function() {
  var MaterialTheme = function(options, optionRules, internal) {
    sogqb.BaseTheme.call(this, options, {container:optionRules.container || "required|string|length:5,255"}, internal);
    this.__queryButton = '<div class="query" contentEditable=true data-text="Searching Filter"></div>';
    this.__searchButton = '<button class="btn btn-default waves-effect btn-super-sm float-right search"><i class="zmdi zmdi-search"></i></button>';
    this.__clearButton = '<button class="btn btn-default waves-effect btn-super-sm float-right clear"><i class="zmdi zmdi-close"></i></button>';
    this.container = this.__options.container;
    this.cssStyles = this.__prepareCssStyles("#%%container%%{height:36px;border:1px solid #5E5E5E;font-size:16px;}#%%container%% .query{height:34px;float:left;width:10px;padding:4px 0 4px 6px;}#%%container%% button.float-left{margin:3px 0 3px 3px;float:left;}#%%container%% button.float-right{margin:3px 3px 3px 0;float:right;}#%%container%% .btn-group-sm > .btn, .btn-super-sm{padding:3px 10px;font-size:14px;line-height:1.5;border-radius:2px;text-transform:none;}#%%container%% [contentEditable=true]:empty:not(:focus):before{content:attr(data-text);opacity:.5;}");
    this.name = "MaterialTheme";
  };
  MaterialTheme.prototype = Object.create(sogqb.BaseTheme.prototype);
  MaterialTheme.prototype.constructor = MaterialTheme;
  Object.defineProperty(MaterialTheme.prototype, "alias", {get:function() {
    return ["material"];
  }});
  Object.assign(MaterialTheme.prototype, {__draw:function() {
    this.__buildStyleElement();
    this.__buildContainerElement();
    this.__prettify();
  }});
  return {MaterialTheme:MaterialTheme};
}());
sogqb.registerTheme(sogqb.MaterialTheme);


return sogqb;
}));

