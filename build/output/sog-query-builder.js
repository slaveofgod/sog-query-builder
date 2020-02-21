/*
 * SOG Query Builder Library v0.0.1 revision a6ace94
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
var sogqb = {version:"0.0.1", revision:"a6ace94", config:{}, common:{}, themes:{}, registerTheme:function(theme) {
  var __t = [theme];
  var __theme = new __t[0]({}, {}, true);
  var alias = __theme.alias;
  if ("undefined" === typeof alias) {
    throw new Error('The theme has to have "alias" property');
  }
  if ("AbstractTheme" !== __theme.base) {
    throw new Error('The theme has to extend "sogqb.AbstractTheme" abstract class');
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
}, validateContainer:function(container) {
  var message = sogv.isValidWithErrorMessage(container, "required|string|length:5,255");
  if (null !== message) {
    throw new Error("Container: " + message);
  }
  return true;
}, validateEntity:function(entity) {
  var message = sogv.isValidWithErrorMessage(entity, "required|string|length:2,50");
  if (null !== message) {
    throw new Error("Entity: " + message);
  }
  return true;
}, validateState:function(state, rules) {
}};
if (typeof exports !== "undefined") {
  exports.sogqb = sogqb;
}
;Object.assign(sogqb, function() {
  var AbstractTheme = function(options, optionRules, internal) {
    this.__options = options || {};
    this.__internal = true === internal;
    this.__skipDrawing = false;
    if (false === this.__internal) {
      this.__validateOptions(optionRules);
    }
    this.name = "AbstractTheme";
    this.base = "AbstractTheme";
  };
  Object.assign(AbstractTheme.prototype, {draw:function() {
    this.__beforeDraw();
    if (false === this.__skipDrawing) {
      console.info('Drawing this container with the id "' + this.container + '" ...');
      this.__draw();
    }
    this.__afterDraw();
  }, update:function() {
    console.info('Updating this container with the id "' + this.container + '" ...');
    var container = document.getElementById(this.container);
    var queryWidth = container.clientWidth - 10;
    container.childNodes.forEach(function(element) {
      if (false === element.classList.contains("query")) {
        queryWidth -= element.clientWidth;
      }
    });
    var queryElement = container.querySelector(".query");
    queryElement.style.width = queryWidth + "px";
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
      var message = sogv.isValidWithErrorMessage(this.__options[key], rules[key], true);
      if (null !== message) {
        throw new Error("[option:" + key + "]: " + message);
      }
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
    this.update();
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
  return {AbstractTheme:AbstractTheme};
}());
Object.assign(sogqb, function() {
  var Scheme = function(scheme) {
    this.__scheme = scheme || null;
    if (null !== this.__scheme) {
      this.__validate();
    }
    this.name = "Scheme";
  };
  Scheme.prototype.constructor = Scheme;
  Object.defineProperties(Scheme.prototype, {"scheme":{get:function() {
    return this.__scheme;
  }}});
  Object.assign(Scheme.prototype, {__validate:function() {
    for (var i = 0; i < this.__scheme.length; i++) {
      this.__validateEntity(this.__scheme[i].entity);
      this.__validateColumns(this.__scheme[i].columns);
    }
    return true;
  }, __validateEntity:function(entity) {
    var message = sogv.isValidWithErrorMessage(entity, "required|string|alpha-dash|length:2,50");
    if (null !== message) {
      throw new Error("Entity: [" + entity + "] " + message);
    }
    return true;
  }, __validateColumns:function(columns) {
    var message = sogv.isValidWithErrorMessage(columns, "required|array|between:1,1000");
    if (null !== message) {
      throw new Error("Columns: " + message);
    }
    columns.forEach(function(element) {
      var validationEngine = new sogv.Application({lang:"en"});
      var data = {name:element.name, title:element.title, type:element.type, data:element.data};
      var rules = {name:"required|string|alpha-dash|length:2,50", title:"required|string|print|length:2,100", type:"required|in:email;integer;numeric;string;date", data:"object"};
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
  var Application = function(container, entity, scheme, state, theme) {
    this.__container = container || null;
    this.__entity = entity || null;
    this.__scheme = scheme || null;
    this.__state = state || null;
    this.__theme = theme || "material";
    sogqb.validateContainer(this.__container);
    sogqb.validateEntity(this.__entity);
    sogqb.validateState(this.__state);
    var __this = this;
    this.setScheme(this.__scheme);
    this.setTheme(this.__theme);
    this.name = "Application";
    window.addEventListener("resize", function() {
      __this.update();
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
  }, setState:function(state) {
    sogqb.validateState(state, "required");
    this.__state = state;
  }, setTheme:function(theme) {
    this.__theme = sogqb.makeTheme(theme, {container:this.container}, {});
  }, draw:function() {
    this.__theme.draw();
  }, update:function() {
    this.__theme.update();
  }});
  return {Application:Application};
}());
Object.assign(sogqb, function() {
  var MaterialTheme = function(options, optionRules, internal) {
    sogqb.AbstractTheme.call(this, options, {container:optionRules.container || "required|string|length:5,255"}, internal);
    this.__queryButton = '<div class="query" contentEditable=true data-text="Searching Filter"></div>';
    this.__searchButton = '<button class="btn btn-default waves-effect btn-super-sm float-right search"><i class="zmdi zmdi-search"></i></button>';
    this.__clearButton = '<button class="btn btn-default waves-effect btn-super-sm float-right clear"><i class="zmdi zmdi-close"></i></button>';
    this.container = this.__options.container;
    this.cssStyles = this.__prepareCssStyles("#%%container%%{height:36px;border:1px solid #5E5E5E;font-size:16px;}#%%container%% .query{height:34px;float:left;width:10px;padding:4px 0 4px 6px;}#%%container%% button.float-left{margin:3px 0 3px 3px;float:left;}#%%container%% button.float-right{margin:3px 3px 3px 0;float:right;}#%%container%% .btn-group-sm > .btn, .btn-super-sm{padding:3px 10px;font-size:14px;line-height:1.5;border-radius:2px;text-transform:none;}#%%container%% [contentEditable=true]:empty:not(:focus):before{content:attr(data-text);opacity:.5;}");
    this.name = "MaterialTheme";
  };
  MaterialTheme.prototype = Object.create(sogqb.AbstractTheme.prototype);
  MaterialTheme.prototype.constructor = MaterialTheme;
  Object.defineProperty(MaterialTheme.prototype, "alias", {get:function() {
    return ["material"];
  }});
  Object.assign(MaterialTheme.prototype, {__draw:function() {
    this.__buildStyleElement();
    this.__buildContainerElement();
  }});
  return {MaterialTheme:MaterialTheme};
}());
sogqb.registerTheme(sogqb.MaterialTheme);


return sogqb;
}));

