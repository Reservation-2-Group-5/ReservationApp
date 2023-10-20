import { FilterMatchMode, FilterOperator } from 'primevue/api';

export function initFilters(filters) {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.IN }],
    },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    assignedTo: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    netId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    location: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    warrantyExpiration: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }],
    },
    available: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    requestedBy: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    requestedDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
    },
  };
}

// create a list of unique filter options
function createUniqueFilterOptions(data, field) {
  return [...new Set(data.map((item) => item[field]))];
}

// set the filter options for the dropdowns
function setFilterOptions(newData, lists) {
  Object.keys(lists).forEach((key) => {
    lists[key].value = createUniqueFilterOptions(newData, key);
  });
}

// clear the filters
export function clearFilters(filters) {
  initFilters(filters);
}

// fetch the data from the server or test data file
// and set the reactive variables
export async function fetchData(store, loading, filterLists) {
  loading.value = true;
  try {
    await store.fetchAll();
    setFilterOptions(store.getAll, filterLists);
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
}

// format the date to a readable format
export function formatDate(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
  });
}

export function searchItems(event, itemNames, filteredItems) {
  // in final app, make request to db with query and return filtered results
  // for testing filter at client side
  const { query } = event;
  const filteredItemsList = [];

  for (let i = 0; i < itemNames.value.length; i += 1) {
    const item = itemNames.value[i];

    if (item.toLowerCase().indexOf(query.toLowerCase()) === 0) {
      filteredItemsList.push(item);
    }
  }

  filteredItems.value = filteredItemsList;
}
