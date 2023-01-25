createFilters: function() {
    document.querySelectorAll('[data-filters] [data-filter]').forEach(function (filter) {
        var filters = filter.closest('[data-filters]'),
            type = 'choice',
            name = filter.dataset.filter,
            ucName = name.charAt(0).toUpperCase()+name.slice(1),
            list = document.createElement('ul'),
            values = filters.dataset['filter'+ucName] || filters.querySelectorAll('[data-filter-'+name+']'),
            labels = {},
            defaults = null,
            indexed = {},
            processed = {};
        if (typeof values === 'string') {
            type = 'level';
            labels = values.split(',');
            values = values.toLowerCase().split(',');
            defaults = values.length - 1;
        }
        addClass(list, 'filter-list');
        addClass(list, 'filter-list-'+type);
        values.forEach(function (value, i) {
            if (value instanceof HTMLElement) {
                value = value.dataset['filter'+ucName];
            }
            if (value in processed) {
                return;
            }
            var option = document.createElement('li'),
                label = i in labels ? labels[i] : value,
                active = false,
                matches;
            if ('' === label) {
                option.innerHTML = '<em>(none)</em>';
            } else {
                option.innerText = label;
            }
            option.dataset.filter = value;
            option.setAttribute('title', 1 === (matches = filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]').length) ? 'Matches 1 row' : 'Matches '+matches+' rows');
            indexed[value] = i;
            list.appendChild(option);
            addEventListener(option, 'click', function () {
                if ('choice' === type) {
                    filters.querySelectorAll('[data-filter-'+name+']').forEach(function (row) {
                        if (option.dataset.filter === row.dataset['filter'+ucName]) {
                            toggleClass(row, 'filter-hidden-'+name);
                        }
                    });
                    toggleClass(option, 'active');
                } else if ('level' === type) {
                    if (i === this.parentNode.querySelectorAll('.active').length - 1) {
                        return;
                    }
                    this.parentNode.querySelectorAll('li').forEach(function (currentOption, j) {
                        if (j <= i) {
                            addClass(currentOption, 'active');
                            if (i === j) {
                                addClass(currentOption, 'last-active');
                            } else {
                                removeClass(currentOption, 'last-active');
                            }
                        } else {
                            removeClass(currentOption, 'active');
                            removeClass(currentOption, 'last-active');
                        }
                    });
                    filters.querySelectorAll('[data-filter-'+name+']').forEach(function (row) {
                        if (i < indexed[row.dataset['filter'+ucName]]) {
                            addClass(row, 'filter-hidden-'+name);
                        } else {
                            removeClass(row, 'filter-hidden-'+name);
                        }
                    });
                }
            });
            if ('choice' === type) {
                active = null === defaults || 0 <= defaults.indexOf(value);
            } else if ('level' === type) {
                active = i <= defaults;
                if (active && i === defaults) {
                    addClass(option, 'last-active');
                }
            }
            if (active) {
                addClass(option, 'active');
            } else {
                filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]').forEach(function (row) {
                    toggleClass(row, 'filter-hidden-'+name);
                });
            }
            processed[value] = true;
        });

        if (1 < list.childNodes.length) {
            filter.appendChild(list);
            filter.dataset.filtered = '';
        }
    });
}