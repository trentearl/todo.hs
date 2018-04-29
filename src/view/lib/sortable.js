var sortable = null;

if (typeof window !== 'undefined') {
    var a = require('@shopify/draggable');
    sortable = a.Sortable;
}

export default sortable;

