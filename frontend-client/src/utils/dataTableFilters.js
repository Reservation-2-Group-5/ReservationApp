import { FilterMatchMode, FilterOperator } from 'primevue/api';

export function initFilters(filters, type) {
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
    requestedOnDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
    },
    requestedStartDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
    },
    requestedEndDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
    },
    fundingSource: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    department: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
  if (type === 'room') {
    filters.value = {
      ...filters.value,
      building: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      room: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_AFTER }],
      },
      time: { value: [0, 23], matchMode: FilterMatchMode.BETWEEN },
      reservedBy: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      type: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      maxOccupancy: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
    };
  }
}

// create a list of unique filter options
function createUniqueFilterOptions(data, field) {
  const options = data.map((item) => item[field])
    .sort().filter((item) => item !== null);
  return [...new Set(options)];
}

// set the filter options for the dropdowns
function setFilterOptions(newData, lists) {
  Object.keys(lists).forEach((key) => {
    lists[key].value = createUniqueFilterOptions(newData, key);
  });
}

// clear the filters
export function clearFilters(filters, type) {
  initFilters(filters, type);
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
  if (!date) return '';
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
