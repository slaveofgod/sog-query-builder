/*
 * SOG Query Builder Library v0.0.1 revision 8bf1a81 (DEBUG PROFILER)
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
var sogqb = {version:"0.0.1", revision:"8bf1a81", config:{stateElementTypes:["expression", "conjunction"], expressionOperators:[{key:"equal", label:"Equal"}, {key:"not_equal", label:"Not Equal"}, {key:"more", label:"More"}, {key:"more_or_equal", label:"More or Equal"}, {key:"less", label:"Less"}, {key:"less_or_equal", label:"less_or_equal"}, {key:"like", label:"Like"}], conjunctionOperators:[{key:"or", label:"Or"}, {key:"and", label:"And"}], operators:{entity:["equal", "not_equal"]}}, 
common:{}, themes:{}, operatorsList:function(type) {
  var operators = this.config.operators[type];
  var list = [];
  for (var i = 0; i < operators.length; i++) {
    for (var j = 0; j < this.config.expressionOperators.length; j++) {
      if (operators[i] === this.config.expressionOperators[j].key) {
        list.push({key:this.config.expressionOperators[j].key, label:this.config.expressionOperators[j].label});
        break;
      }
    }
  }
  return list;
}, registerTheme:function(theme) {
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
}, __createHtmlElementFromString:function(string) {
  var template = document.createElement("template");
  template.innerHTML = string;
  return template.content.firstChild;
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
  Object.assign(BaseTheme.prototype, {appendChild:function(type, options) {
    var container = document.getElementById(this.container);
    var element = this.__buildElement(type, options);
    container.appendChild(element);
  }, destroy:function() {
    document.getElementById(this.container).innerHTML = "";
  }, draw:function() {
    this.__beforeDraw();
    if (false === this.__skipDrawing) {
      console.info('Drawing this container with the id "' + this.container + '" ...');
      this.__draw();
      this.__buildStyleElement();
      this.__buildContainerElement();
      this.__prettify();
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
    style.innerHTML = this.__prepareCssStyles(this.cssStyles);
    container.appendChild(style);
  }, __buildContainerElement:function() {
    var container = document.getElementById(this.container);
    var query = this.__buildElement("query");
    var save = this.__buildElement("save");
    var search = this.__buildElement("search");
    var clear = this.__buildElement("clear");
    container.appendChild(query);
    container.appendChild(search);
    container.appendChild(clear);
    container.appendChild(save);
  }, __prettify:function() {
    var container = document.getElementById(this.container);
    var queryWidth = container.clientWidth;
    container.childNodes.forEach(function(element) {
      if (false === element.classList.contains("query")) {
        queryWidth -= parseInt(element.clientWidth + 3);
      }
    });
    var queryElement = container.querySelector(".query");
    queryElement.style.width = queryWidth + "px";
  }, __buildElement:function(type, options) {
    var html = "";
    switch(type) {
      case "query":
        html = this.queryButton.trim();
        break;
      case "search":
        html = this.searchButton.trim();
        break;
      case "clear":
        html = this.clearButton.trim();
        break;
      case "save":
        html = this.saveButton.trim();
        break;
      case "field":
        html = this.fieldButton.trim();
        break;
      case "expressionOperator":
        html = this.expressionOperatorButton.trim();
        break;
      case "fieldValue":
        html = this.fieldValueButton.trim();
        break;
      case "conjunctionOperator":
        html = this.conjunctionOperatorButton.trim();
        break;
    }
    var element = sogqb.__createHtmlElementFromString(this.__prepareElement(html, options));
    switch(type) {
      case "search":
      case "clear":
      case "save":
        element.className += " " + this.cssControlClasses;
        break;
      case "field":
      case "expressionOperator":
      case "fieldValue":
      case "conjunctionOperator":
        element.className += " " + this.cssQueryClasses;
        break;
    }
    switch(type) {
      case "query":
        element.classList.add("query-button");
        break;
      case "search":
        element.classList.add("search-button");
        break;
      case "clear":
        element.classList.add("clear-button");
        break;
      case "save":
        element.classList.add("save-button");
        break;
      case "field":
        element.classList.add("field-button");
        break;
      case "expressionOperator":
        element.classList.add("expression-operator-button");
        break;
      case "fieldValue":
        element.classList.add("field-value-button");
        break;
      case "conjunctionOperator":
        element.classList.add("conjunction-operator-button");
        break;
    }
    return element;
  }, __prepareElement:function(element, options) {
    options = options || {};
    for (var key in options) {
      if (!options.hasOwnProperty(key)) {
        continue;
      }
      element = element.replace("%%" + key + "%%", options[key]);
    }
    return element;
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
  Object.assign(Scheme.prototype, {getEntity:function(entityName) {
    var entity = null;
    for (var i = 0; i < this.__scheme.length; i++) {
      if (entityName === this.__scheme[i].entity) {
        entity = this.__scheme[i];
        break;
      }
    }
    return entity;
  }, getEntityColumns:function(entityName) {
    var entity = this.getEntity(entityName);
    if (null === entity) {
      return null;
    }
    return entity.columns;
  }, getEntityColumnsList:function(entityName) {
    var list = [];
    var columns = this.getEntityColumns(entityName);
    if (null === columns) {
      return list;
    }
    for (var i = 0; i < columns.length; i++) {
      list.push({key:entityName + "." + columns[i].name, label:columns[i].title});
    }
    return list;
  }, exist:function(field) {
    var field = field.split(".");
    var entity = this.getEntity(field[0]);
    if (null === entity) {
      return false;
    }
    for (var i = 0; i < entity.columns.length; i++) {
      if (field[1] === entity.columns[i].name) {
        return true;
      }
    }
    return false;
  }, getEntityFields:function(entityName) {
    var entity = this.getEntity(entityName);
    var columns = [];
    if (null === entity) {
      return [];
    }
    for (var i = 0; i < entity.columns.length; i++) {
      columns.push({name:entity.columns[i].name, title:entity.columns[i].title});
    }
    return columns;
  }, getEntityField:function(field) {
    var field = field.split(".");
    var entity = this.getEntity(field[0]);
    for (var i = 0; i < entity.columns.length; i++) {
      if (field[1] === entity.columns[i].name) {
        return entity.columns[i];
        break;
      }
    }
    return null;
  }, getEntityFieldLabel:function(field) {
    field = this.getEntityField(field);
    if (null === field) {
      return field;
    }
    return field.title;
  }, getEntityFieldType:function(field) {
    field = this.getEntityField(field);
    if (null === field) {
      return field;
    }
    return field.type;
  }, getEntityFieldFormattedValue:function(field, value) {
    var field = field.split(".");
    var entity = this.getEntity(field[0]);
    var data = value;
    for (var i = 0; i < entity.columns.length; i++) {
      if (field[1] === entity.columns[i].name) {
        switch(entity.columns[i].type) {
          case "entity":
            for (var j = 0; j < entity.columns[i].data.length; j++) {
              if (value === entity.columns[i].data[j].id) {
                data = entity.columns[i].data[j].label;
                break;
              }
            }
            break;
        }
        break;
      }
    }
    return data;
  }, getEntityFieldValueList:function(field) {
    var field = field.split(".");
    var entity = this.getEntity(field[0]);
    var data = [];
    for (var i = 0; i < entity.columns.length; i++) {
      if (field[1] === entity.columns[i].name) {
        switch(entity.columns[i].type) {
          case "entity":
            for (var j = 0; j < entity.columns[i].data.length; j++) {
              data.push({key:entity.columns[i].data[j].id, label:entity.columns[i].data[j].label});
            }
            break;
        }
        break;
      }
    }
    return data;
  }, getFormattedExpressionOperator:function(operator) {
    var operators = sogqb.config.expressionOperators;
    for (var key in operators) {
      if (!operators.hasOwnProperty(key)) {
        continue;
      }
      if (operator === operators[key].key) {
        operator = operators[key].label;
        break;
      }
    }
    return operator;
  }, getFormattedConjunctionOperator:function(operator) {
    var operators = sogqb.config.conjunctionOperators;
    for (var key in operators) {
      if (!operators.hasOwnProperty(key)) {
        continue;
      }
      if (operator === operators[key].key) {
        operator = operators[key].label;
        break;
      }
    }
    return operator;
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
    this.__state = state || [];
    this.__scheme = scheme || [];
    if (null !== this.__state) {
      this.__validate();
      this.__validateFields();
      this.__init();
    }
    this.name = "State";
  };
  State.prototype.constructor = State;
  Object.defineProperties(State.prototype, {"state":{get:function() {
    return this.__state;
  }}});
  Object.assign(State.prototype, {add:function(options, strict) {
    strict = strict || true;
    this.__state.push(options);
    this.__validate(strict);
  }, draw:function(theme) {
    var fieldButton = theme.fieldButton;
    var fieldValueButton = theme.fieldValueButton;
    var expressionOperatorButton = theme.expressionOperatorButton;
    var conjunctionOperatorButton = theme.conjunctionOperatorButton;
    for (var i = 0; i < this.__state.length; i++) {
      switch(this.__state[i].type) {
        case "expression":
          var field = this.__state[i].field.split(".");
          if (null != this.__state[i].field) {
            theme.appendChild("field", {value:this.__state[i].field, label:this.__scheme.getEntityFieldLabel(this.__state[i].field)});
          }
          if (null != this.__state[i].operator) {
            theme.appendChild("expressionOperator", {value:this.__state[i].operator, label:this.__scheme.getFormattedExpressionOperator(this.__state[i].operator)});
          }
          if (null != this.__state[i].value) {
            theme.appendChild("fieldValue", {value:this.__state[i].value, label:this.__scheme.getEntityFieldFormattedValue(this.__state[i].field, this.__state[i].value)});
          }
          break;
        case "conjunction":
          theme.appendChild("conjunctionOperator", {value:this.__state[i].operator, label:this.__scheme.getFormattedConjunctionOperator(this.__state[i].operator)});
          break;
      }
    }
  }, removeLatestBlock:function() {
    var blockIndex = this.latestBlockIndex();
    if (null !== blockIndex) {
      this.__state.splice(blockIndex, 1);
    }
  }, nextElementType:function() {
    var block = this.latestBlock();
    if (null === block || "complete" === block.status && "conjunction" === block.type) {
      return "field";
    }
    switch(block.status) {
      case "complete":
        return "conjunction";
        break;
      case "field":
        return "operator";
        break;
      case "operator":
        return "value";
        break;
    }
  }, __init:function() {
    for (var i = 0; i < this.__state.length; i++) {
      this.__state[i].status = "complete";
    }
  }, latestBlockIndex:function() {
    if (this.__state.length == 0) {
      return null;
    }
    return this.__state.length - 1;
  }, latestBlock:function() {
    var blockIndex = this.latestBlockIndex();
    if (null === blockIndex) {
      return null;
    }
    return this.__state[blockIndex];
  }, __validate:function(strict) {
    strict = strict || true;
    sogqb.isValidException("State", this.__state, "required|array");
    for (var i = 0; i < this.__state.length; i++) {
      sogqb.isValidException("State > Type", this.__state[i].type, "required|alnum|in:" + sogqb.config.stateElementTypes.join(";"));
      var validationEngine = new sogv.Application({lang:"en"});
      var data = {};
      var rules = {};
      var required = false === strict || "complete" !== this.__state[i].status ? "" : "required|";
      switch(this.__state[i].type) {
        case "expression":
          data = {field:this.__state[i].field, value:this.__state[i].value, operator:this.__state[i].operator};
          rules = {field:"required|regex:^[a-zA-Z0-9_-]+.[a-zA-Z0-9_-]+$", value:required + "scalar", operator:required + "alnum|in:" + sogqb.config.expressionOperators.map(function(data) {
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
      if ("expression" === this.__state[i].type && "complete" === this.__state[i].status) {
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
      this.__theme.destroy();
      this.__state.draw(theme);
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
    this.initialized = false;
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
    this.__init();
  }, __init:function() {
    var __this = this;
    var queryButton = document.querySelector("#" + this.container + " .query-button");
    var container = document.getElementById(this.container);
    if (null !== container) {
      document.querySelectorAll("#" + this.container + " .field-button").forEach(function(element) {
        element.addEventListener("click", function(e) {
          queryButton.focus();
        });
      });
      document.querySelectorAll("#" + this.container + " .expression-operator-button").forEach(function(element) {
        element.addEventListener("click", function(e) {
          queryButton.focus();
        });
      });
      document.querySelectorAll("#" + this.container + " .field-value-button").forEach(function(element) {
        element.addEventListener("click", function(e) {
          queryButton.focus();
        });
      });
      document.querySelectorAll("#" + this.container + " .conjunction-operator-button").forEach(function(element) {
        element.addEventListener("click", function(e) {
          queryButton.focus();
        });
      });
      queryButton.addEventListener("focus", function(e) {
        __this.__addQueryItem();
      });
      queryButton.addEventListener("keydown", function(e) {
        switch(e.code) {
          case "Backspace":
            __this.__state.removeLatestBlock();
            __this.draw();
            document.querySelector("#" + __this.container + " .query-button").focus();
            break;
          default:
            break;
        }
      }, {passive:true});
      queryButton.addEventListener("blur", function(e) {
        document.querySelector("#" + __this.container + " .query-button").innerHTML = "";
      });
    }
    this.initialized = true;
  }, __addQueryItem:function() {
    var __this = this;
    var type = this.__state.nextElementType();
    var queryContainer = document.querySelector("#" + this.container + " .query-button");
    queryContainer.innerHTML = "";
    switch(type) {
      case "conjunction":
        var dropdown = this.__theme.createDropdownElement(sogqb.config.conjunctionOperators, function(e) {
          __this.__state.add({type:"conjunction", operator:e.target.getAttribute("data-value"), status:"complete"});
          __this.draw();
        }, true);
        queryContainer.appendChild(dropdown);
        break;
      case "field":
        var columns = this.__scheme.getEntityColumnsList(this.__entity);
        var dropdown = this.__theme.createDropdownElement(columns, function(e) {
          __this.__state.add({type:"expression", field:e.target.getAttribute("data-value"), value:null, operator:null, status:"field"}, false);
          __this.draw();
        }, true);
        queryContainer.appendChild(dropdown);
        break;
      case "operator":
        var block = this.__state.latestBlock();
        var type = this.__scheme.getEntityFieldType(block.field);
        var list = sogqb.operatorsList(type);
        var dropdown = this.__theme.createDropdownElement(list, function(e) {
          var block = __this.__state.latestBlock();
          block.operator = e.target.getAttribute("data-value");
          block.status = "operator";
          __this.draw();
        }, true);
        queryContainer.appendChild(dropdown);
        break;
      case "value":
        var block = this.__state.latestBlock();
        var type = this.__scheme.getEntityFieldType(block.field);
        switch(type) {
          case "entity":
            var data = this.__scheme.getEntityFieldValueList(block.field);
            var dropdown = this.__theme.createDropdownElement(data, function(e) {
              var block = __this.__state.latestBlock();
              block.value = __this.__scheme.getEntityFieldFormattedValue(block.field, e.target.getAttribute("data-value"));
              block.status = "completed";
              __this.draw();
            }, true);
            queryContainer.appendChild(dropdown);
            break;
        }break;
    }
  }});
  return {Application:Application};
}());
Object.assign(sogqb, function() {
  var MaterialTheme = function(options, optionRules, internal) {
    sogqb.BaseTheme.call(this, options, {container:optionRules.container || "required|string|length:5,255"}, internal);
    this.container = this.__options.container;
    this.name = "MaterialTheme";
  };
  MaterialTheme.prototype = Object.create(sogqb.BaseTheme.prototype);
  MaterialTheme.prototype.constructor = MaterialTheme;
  Object.defineProperty(MaterialTheme.prototype, "alias", {get:function() {
    return ["material"];
  }});
  Object.defineProperties(MaterialTheme.prototype, {cssStyles:{get:function() {
    return "#%%container%%{height:36px;border:1px solid #5E5E5E;font-size:16px;}#%%container%% .query{height:34px;float:left;width:10px;padding:4px 0 4px 6px;}#%%container%% button.float-left{margin:3px 0 3px 3px;float:left;}#%%container%% button.float-right{margin:3px 3px 3px 0;float:right;}#%%container%% .btn-group-sm > .btn, .btn-super-sm{padding:3px 10px;font-size:14px;line-height:1.5;border-radius:2px;text-transform:none;}#%%container%% [contentEditable=true]:empty:not(:focus):before{content:attr(data-text);opacity:.5;}";
  }}, cssControlClasses:{get:function() {
    return "btn btn-default waves-effect btn-super-sm float-right";
  }}, cssQueryClasses:{get:function() {
    return "btn btn-default btn-icon-text waves-effect btn-super-sm float-left";
  }}, queryButton:{get:function() {
    return '<div class="query" contentEditable=true data-text="Searching Filter"></div>';
  }}, searchButton:{get:function() {
    return '<button class="search"><i class="zmdi zmdi-search"></i></button>';
  }}, saveButton:{get:function() {
    return '<button class="search"><i class="zmdi zmdi-attachment-alt"></i></button>';
  }}, clearButton:{get:function() {
    return '<button class="clear"><i class="zmdi zmdi-close"></i></button>';
  }}, fieldButton:{get:function() {
    return '<button class = "bgm-lightgreen" data-value="%%value%%">%%label%%</button>';
  }}, expressionOperatorButton:{get:function() {
    return '<button class="bgm-lightblue" data-value="%%value%%">%%label%%</button>';
  }}, fieldValueButton:{get:function() {
    return '<button class="bgm-purple" data-value="%%value%%">%%label%%</button>';
  }}, conjunctionOperatorButton:{get:function() {
    return '<button class="bgm-black" data-value="%%value%%">%%label%%</button>';
  }}});
  Object.assign(MaterialTheme.prototype, {__draw:function() {
  }, createDropdownElement:function(list, listener, open) {
    list = list || [];
    listener = listener || function(e) {
    };
    open = open || false;
    var dropdown = document.createElement("div");
    dropdown.setAttribute("contenteditable", false);
    dropdown.classList.add("dropdown");
    var button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-link btn-super-sm waves-effect");
    button.setAttribute("data-toggle", "dropdown");
    button.setAttribute("contenteditable", false);
    button.appendChild(document.createTextNode(" "));
    var ul = document.createElement("ul");
    ul.setAttribute("class", "dropdown-menu pull-left");
    for (var i = 0; i < list.length; i++) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.setAttribute("href", "#");
      a.setAttribute("contenteditable", false);
      a.setAttribute("data-value", list[i].key);
      a.addEventListener("click", listener);
      a.appendChild(document.createTextNode(list[i].label));
      li.appendChild(a);
      ul.appendChild(li);
    }
    dropdown.appendChild(button);
    dropdown.appendChild(ul);
    if (false !== open) {
      setTimeout(function() {
        dropdown.classList.add("open");
      }, 100);
    }
    return dropdown;
  }});
  return {MaterialTheme:MaterialTheme};
}());
sogqb.registerTheme(sogqb.MaterialTheme);


return sogqb;
}));

