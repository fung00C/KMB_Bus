
// get API 
/* async function fetchStopData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop/A3ADFCDF8487ADB9"); // https://data.etabus.gov.hk/v1/transport/kmb/stop/{stop_id}
    const StopData = await response.json();
    console.log(StopData);
}
fetchStopData(); 
async function fetchRouteStopListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route-stop"); // https://data.etabus.gov.hk/v1/transport/kmb/route-stop
    const routeStopListData = await response.json();
    console.log(routeStopListData);
}
fetchRouteStopListData();  */

async function fetchRouteListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/"); // https://data.etabus.gov.hk/v1/transport/kmb/route/
    const data = await response.json();
    routeListData = data['data'];
    //console.log(routeListData);
}

/* async function fetchRouteData(route, direction, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route/${route}/${direction}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/route/{route}/{direction}/{service_type}
    const RouteData = await response.json();
    console.log(RouteData);
    return RouteData;
}
async function fetchStopListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop"); // https://data.etabus.gov.hk/v1/transport/kmb/stop
    const stopListData = await response.json();
    console.log(stopListData);
    return stopListData;
} */

async function fetchrouteStopData(route, direction, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}
    const data = await response.json();
    routeStopData = data['data'];
    //console.log(routeStopData);
}
async function fetchETAData(stop_id, route, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop_id}/${route}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/eta/{stop_id}/{route}/{service_type}
    const ETAData = await response.json();
    console.log(ETAData);
    return ETAData;
}

// test
//fetchRouteListData();
//fetchRouteData('74B', 'outbound', '1');
//fetchrouteStopData('1A', 'outbound', '1');
//fetchETAData('A60AE774B09A5E44', '40', '1');

let searchQuery = ""
let routeListData = []
let routeStopData = []
let ETAData = []
let currentData = {'route': '', 'bound': '', 'orig_tc': '', 'dest_tc': '','service_type': '', 'stop_id': ''}
const div_routeContainer = document.querySelector("#div_routeContainer");
const div_searchResult = document.querySelector("#div_searchResult");
const div_routeList = document.querySelector("#div_routeList");
const ipt_search = document.querySelector("#ipt_search");
const div_routeStopContainer = document.querySelector("#div_routeStopContainer");
const btn_exchange = document.querySelector("#btn_exchange");
const btn_closeRouteStopPage = document.querySelector("#btn_closeRouteStopPage");
const div_routeName_aRoute = document.querySelector("#div_routeName_aRoute");
const div_fromStop_aRoute = document.querySelector("#div_fromStop_aRoute");
const div_toStop_aRoute = document.querySelector("#div_toStop_aRoute");
const div_routeStopList = document.querySelector("#div_routeStopList");

function storeData(route, bound, orig_tc, dest_tc, service_type, stop_id) {
    if(route !== null) {
        currentData['route'] = route
    }
    if(bound !== null) {
        currentData['bound'] = bound
    }
    if(orig_tc !== null) {
        currentData['orig_tc'] = orig_tc
    }
    if(dest_tc !== null) {
        currentData['dest_tc'] = dest_tc
    }
    if(service_type !== null) {
        currentData['service_type'] = service_type
    }
    if(stop_id !== null) {
        currentData['stop_id'] = stop_id
    }
    console.log(route, bound, orig_tc, dest_tc, service_type, stop_id)
}

fetchRouteListData();

// Stop list
const handleRouteStopListItem = (li_aStop) => {
    li_aStop.addEventListener('click', () => {
        console.log('hi')
    });
}
const createRouteStopList = (data) => {
    const {seq, stop} = data;
    storeData(null, null, null, null, null, stop)
    const ul = document.createElement("ul");
    ul.className = "ul_routeStopList";
    ul.innerHTML = `
        <li id="li_aStop" class="li_aStop">
            <div class="div_stopNumber">${seq}</div>
            <div class="div_stopName">${stop}</div>
        </li>
    `;
    div_routeStopList.append(ul);
    const li_aStop = ul.querySelector('#li_aStop');
    handleRouteStopListItem(li_aStop);
}
async function openRouteStopPage() {
    let direction = '';
    if(currentData.bound === 'O') {
        direction = 'outbound';
    } else if(currentData.bound === 'I') {
        direction = 'inbound';
    }
    await fetchrouteStopData(currentData['route'], direction, currentData['service_type']);
    div_routeContainer.classList.remove('div_routeContainer-show');
    div_routeStopContainer.classList.add('div_routeStopContainer-show');
    div_routeName_aRoute.textContent = currentData.route;
    div_fromStop_aRoute.textContent = currentData.orig_tc;
    div_toStop_aRoute.textContent = currentData.dest_tc;
    routeStopData.map((data) => createRouteStopList(data));
}
btn_exchange.addEventListener('click', () => {
    
});
btn_closeRouteStopPage.addEventListener('click', () => {
    /* div_routeName_aRoute.textContent = ""; // clear previous data
    div_fromStop_aRoute.textContent = ""; // clear previous data
    div_toStop_aRoute.textContent = ""; // clear previous data */
    div_routeStopList.innerHTML = ""; // clear previous data
    div_routeStopContainer.classList.remove('div_routeStopContainer-show');
    div_routeContainer.classList.add('div_routeContainer-show');
    const query = ipt_search.value;
    handleSearchBar(query);
});

// Route List
const handleRouteListItem = (li_aRoute, route, bound, orig_tc, dest_tc, service_type) => {
    li_aRoute.addEventListener('click', () => {
        storeData(route, bound, orig_tc, dest_tc, service_type, null)
        openRouteStopPage();
        ipt_search.value = route;
    })
}
const createRouteList = (data) => {
    const {route, bound, orig_tc, dest_tc, service_type} = data;
    const ul = document.createElement("ul");
    ul.className = "ul_routeList";
    ul.innerHTML = `
        <li id="li_aRoute" class="li_aRoute">
            <div>
                <div class="div_routeName">${route}</div>
                <div class="borderRight"></div>
            </div>
            <div>
                <div class="div_titlefrom">From :</div>
                <div class="div_fromStop">${orig_tc}</div>
                <div class="borderRight"></div>
            </div>
            <div>
                <div class="div_titleTo">To :</div>
                <div class="div_toStop">${dest_tc}</div>
            </div>
        </li>
    `;
    div_routeList.append(ul);
    const li_aRoute = ul.querySelector('#li_aRoute');
    handleRouteListItem(li_aRoute, route, bound, orig_tc, dest_tc,service_type);
};
const handleSearchBar = (query) => {
    const searchQuery = query.trim().toLowerCase();
    if (searchQuery.length <= 0) {
        resetRouteList()
        return
    }
    let searchResults = routeListData.filter((data) => 
        data.route.toLowerCase().includes(searchQuery))
    div_routeStopList.innerHTML = ""; // clear previous data
    div_routeStopContainer.classList.remove('div_routeStopContainer-show');
    div_routeContainer.classList.add('div_routeContainer-show');
    if (searchResults.length >= 0) {
        div_routeList.classList.add('div_routeList-show');
    }
    if (searchResults.length == 0) {
        div_searchResult.innerHTML = "No results found"
        div_routeList.classList.remove('div_routeList-show');
    } else {
        div_searchResult.innerHTML = `${searchResults.length} results found for your query: ${query}`
    }
    div_routeList.innerHTML = ""; // clear previous data
    searchResults.map((data) => createRouteList(data));
};
// reset the page to its default state when the user clears the input field
const resetRouteList = () => {
    div_searchResult.innerHTML = ""
    div_routeList.innerHTML = "";
    div_routeContainer.classList.remove('div_routeContainer-show');
    div_routeList.classList.remove('div_routeList-show');
    div_routeStopList.innerHTML = "";
    div_routeStopContainer.classList.remove('div_routeStopContainer-show');
    /* postsData.map((post) => createRouteList(post)); */ // noneed
};

// input debounce
let debounceTimer;
const debounce = (callback, time) => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(callback, time);
};

// Search Bar
ipt_search.addEventListener("input", (event) => {
    const query = event.target.value;
    debounce(() => handleSearchBar(query), 500);
}, false);



