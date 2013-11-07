/*global $ */

var DataSource = function (config) {
    var _deferred = function () {};
    var _items = new Array();
    
    if (typeof config === 'object') {
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
            
            return dataSource.execute();
        };
    }
    
    if (typeof this.source === 'function') {
        _deferred = this.source;
    }

    return this;
};

DataSource.prototype.toArray = function () {
    return this.execute();
};

//Array Interface
DataSource.prototype.aggregate = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.aggregate.apply(items, args);
    });
};
DataSource.prototype.all = function () {
    var items = this.toArray();
    return items.all.apply(items, arguments);
};
DataSource.prototype.any = function () {
    var items = this.toArray();
    return items.any.apply(items, arguments);
};
DataSource.prototype.average = function () {
    var items = this.toArray();
    return items.average.apply(items, arguments);
};
DataSource.prototype.contains = function () {
    var items = this.toArray();
    return items.contains.apply(items, arguments);
};
DataSource.prototype.count = function () {
    var items = this.toArray();
    return items.count.apply(items, arguments);
};
DataSource.prototype.distinct = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.distinct.apply(items, args);
    });
};
DataSource.prototype.each = function () {
    var items = this.toArray();
    return items.each.apply(items, arguments);
};
DataSource.prototype.elementAt = function () {
    var items = this.toArray();
    return items.elementAt.apply(items, arguments);
};
DataSource.prototype.elementAtOrDefault = function () {
    var items = this.toArray();
    return items.elementAtOrDefault.apply(items, arguments);
};
DataSource.prototype.except = function () {
    //Deferred Action
    var args = arguments;
    this.deferred(function (dataSource, items) {
        return items.except.apply(items, args);
    });

    return this;
};
DataSource.prototype.first = function () {
    var items = this.toArray();
    return items.first.apply(items, arguments);
};
DataSource.prototype.firstOrDefault = function () {
    var items = this.toArray();
    return items.firstOrDefault.apply(items, arguments);
};
DataSource.prototype.groupBy = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        if (args[0].toArray) args[0] = args[0].toArray();
        return items.groupBy.apply(items, args);
    });
};
DataSource.prototype.groupJoin = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        if (args[0].toArray) args[0] = args[0].toArray();
        return items.groupJoin.apply(items, args);
    });
};
DataSource.prototype.innerJoin = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        if (args[0].toArray) args[0] = args[0].toArray();
        return items.innerJoin.apply(items, args);
    });
};
DataSource.prototype.intersect = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        if (args[0].toArray) args[0] = args[0].toArray();
        return items.intersect.apply(items, args);
    });
};
DataSource.prototype.last = function () {
    var items = this.toArray();
    return items.firstOrDefault.apply(items, arguments);
};
DataSource.prototype.lastOrDefault = function () {
    var items = this.toArray();
    return items.last.apply(items, arguments);
};
DataSource.prototype.max = function () {
    var items = this.toArray();
    return items.max.apply(items, arguments);
};
DataSource.prototype.min = function () {
    var items = this.toArray();
    return items.min.apply(items, arguments);
};
DataSource.prototype.orderBy = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.orderBy.apply(items, args);
    });
};
DataSource.prototype.orderByDescending = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.orderByDescending.apply(items, args);
    });
};
DataSource.prototype.select = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.select.apply(items, args);
    });
};
DataSource.prototype.selectMany = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.selectMany.apply(items, args);
    });
};
DataSource.prototype.sequenceEqual = function () {
    var items = this.toArray();
    return items.sequenceEqual.apply(items, arguments);
};
DataSource.prototype.single = function () {
    var items = this.toArray();
    return items.single.apply(items, arguments);
};
DataSource.prototype.singleOrDefault = function () {
    var items = this.toArray();
    return items.singleOrDefault.apply(items, arguments);
};
DataSource.prototype.skip = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.skip.apply(items, args);
    });
};
DataSource.prototype.skipWhile = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.skipWhile.apply(items, args);
    });
};
DataSource.prototype.sum = function () {
    var items = this.toArray();
    return items.sum.apply(items, arguments);
};
DataSource.prototype.take = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.take.apply(items, args);
    });
};
DataSource.prototype.takeWhile = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.takeWhile.apply(items, args);
    });
};
DataSource.prototype.union = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        if (args[0].toArray) args[0] = args[0].toArray();
        return items.union.apply(items, args);
    });
};
DataSource.prototype.where = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.where.apply(items, args);
    });
};
DataSource.prototype.zip = function () {
    //Deferred Action
    var args = arguments;
    return this.deferred(function (dataSource, items) {
        return items.zip.apply(items, args);
    });
};