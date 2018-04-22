var sortable = null;

if (typeof window !== 'undefined') {
    var a = require('@shopify/draggable');
    console.log(a);
    sortable = a.Sortable;
}

export default sortable;

