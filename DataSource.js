/* jshint es3:true, immed:true, indent:4, noempty:true, undef:true, unused:true */
/*global $ */

var DataSource = function (config) {
    var _deferred = function () {};
    var _items = new Array();

    if (config.splice) {
        _items = config;
        config = null;
    }

    if (typeof config === 'object' && config !== null) {
        for (var key in config) {
            this[key] = config[key];
        }
    } else if (typeof config === 'string' || typeof config === 'function') {
        this.source = config;
    }

    this.add = function (item) {
        _items.push(item);
    };

    this.addRange = function (items) {
        _items = _items.concat(items);
    };

    this.insert = function (item, index) {
        _items.splice(index, 0, item);
    };

    this.remove = function(item) {
        var index = _items.indexOf(item);
        this.removeAt(index);
    };

    this.removeAt = function (index) {
        _items.splice(index, 1);
    };

    this.get = function(index) {
        return _items[index];
    };

    this.set = function(index, item) {
        _items[index] = item;
    };

    this.deferred = function(fn) {
        var parent = this;
        return new DataSource(function() {
            var result = parent.execute();
            return fn(this, result);
        });
    };

    this.toArray =
    this.execute = function () {
        return typeof _deferred !== 'undefined' && _items.length === 0
            ? _deferred.call(this)
            : _items;
    };

    if (this.source && typeof this.source !== 'function') {
        var ajaxOptions = {
            async: false,
            dataType: 'json'
        };

        if (typeof this.source === 'object') {
            $.extend(ajaxOptions, this.source);
        } else if (typeof this.source === 'string') {
            $.extend(ajaxOptions, { url: this.source });
        }

        var retry = 0;

        this.source = function () {
            var dataSource = this;
            $.ajax(ajaxOptions)
                .success(function (data) {
                    if (data.splice) {
                        dataSource.addRange(data);
                    } else if (typeof data === 'object') {
                        dataSource.add(data);
                    } else {
                        throw "Unknown data type";
                    }
                });
            if (++retry > 3) throw new Error("Unable to fetch data source");
            return dataSource.execute();
        };
    }

    if (typeof this.source === 'function') {
        _deferred = this.source;
    }

    var fnWraps = ["all", "any", "average", "contains", "count", "forEach", "elementAt", "elementAtOrDefault", "first", "firstOrDefault", "last", "lastOrDefault", "max", "min", "sequenceEqual", "single", "singleOrDefault", "sum"];
    var fnDefers = ["aggregate", "distinct", "except", "groupBy", "groupJoin", "innerJoin", "intersect", "orderBy", "orderByDescending", "select", "selectMany", "skip", "skipWhile", "take", "takeWhile", "union", "where", "zip"];

    fnWraps.forEach(function(method) {
        this[method] = function() {
            var items = this.toArray();
            return items[method].apply(items, arguments);
        };
    }, this);

    fnDefers.forEach(function(method) {
        this[method] = function() {
            var args = arguments;
            return this.deferred(function(dataSource, items) {
                return items[method].apply(items, args);
            });
        };
    }, this);

    return this;
};