
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
} */
async function fetchStopListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop"); // https://data.etabus.gov.hk/v1/transport/kmb/stop
    const data = await response.json();
    stopListData = data['data'];
    //console.log(stopListData);
}

async function fetchrouteStopData(route, direction, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}
    const data = await response.json();
    routeStopData = data['data'];
    //console.log(routeStopData);
}
async function fetchETAData(stop_id, route, service_type, dir) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop_id}/${route}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/eta/{stop_id}/{route}/{service_type}
    const data = await response.json();
    let temp = [];
    for(let i = 0; i < data['data'].length; i++) {
        if(data['data'][i]['dir'] === dir) {
            temp.push(data['data'][i]);
        }
    }
    ETAData = temp;
    //console.log(ETAData);
}

// test
//fetchRouteListData();
//fetchRouteData('74B', 'outbound', '1');
//fetchrouteStopData('1A', 'outbound', '1');
//fetchETAData('A60AE774B09A5E44', '40', '1');

let searchQuery = ""
let routeListData = []
let stopListData = []
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

let All_div_aStopList = [];

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
    //console.log(currentData)
}

fetchRouteListData();
fetchStopListData();

// ETA Data List
/* const handleETADataListItem = (div_ETAListItem) => {
    div_ETAListItem.addEventListener('click', () => {
        console.log('hi')
    });
} */
const createETADataList = (data, li_aStop, div_aStopList) => {
    const {data_timestamp, eta, rmk_tc} = data;
    let arriveTime = '';
    let remarkName = '';
    const d = new Date(eta);
    if(eta !== null) {
        arriveTime = `到達時間: ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    } else {
        arriveTime = `到達時間: ------`
    }
    if(rmk_tc !== '') {
        remarkName = rmk_tc;
    } else {
        remarkName = '暫停服務';
    }
    const div = document.createElement("div");
    div.className = "div_ETAListItem";
    div.id = 'div_ETAListItem'
    div.innerHTML = `
        <div class="div_timeRemark">${remarkName}</div>
        <div class="div_arriveTime">${arriveTime}</div>
    `;
    div_aStopList.append(div);
    /* const div_ETAListItem = div_aStopList.querySelector('#div_ETAListItem'); 
    handleETADataListItem(div_ETAListItem); */
}
async function openETADataPage(ul_routeStopList, div_aStopList, stop) {
    await fetchETAData(stop, currentData['route'], currentData['service_type'], currentData['bound']);
    console.log(ETAData);
    if (div_aStopList.getElementsByClassName("div_ETAListItem").length > 0) {
        div_aStopList.classList.remove('div_aStopList-show');
        div_aStopList.innerHTML = ""
        console.log('hi');
        return
    }
    
    /* console.log(div_routeStopList.getElementsByClassName("ul_routeStopList"));
    let All_ul_routeStopList = div_routeStopList.getElementsByClassName("ul_routeStopList");
    let AllArr_ul_routeStopList = [];
    for(let i = 0; i < All_ul_routeStopList.length; i++) {
        AllArr_ul_routeStopList.push(All_ul_routeStopList[i])
    }
    console.log(AllArr_ul_routeStopList)
    let All_div_aStopList = AllArr_ul_routeStopList.map(ul_routeStopList => {
        console.log(ul_routeStopList.getElementsByClassName("div_aStopList"))
        return ul_routeStopList.getElementsByClassName("div_aStopList")
    })
    console.log(All_div_aStopList);
    let AllArr_div_aStopList = [];
    for(let i = 0; i < All_div_aStopList.length; i++) {
        AllArr_div_aStopList.push(All_div_aStopList[i][0])
    }
    console.log(AllArr_div_aStopList);
    for(let i = 0; i < AllArr_div_aStopList.length; i++) {
        AllArr_div_aStopList[i].classList.remove('div_aStopList-show')
    } */

    console.log(All_div_aStopList);
    let current_div_aStopList = '';
    for(let i = 0; i < All_div_aStopList.length; i++) {
        console.log(All_div_aStopList[i].classList.contains('div_aStopList-show'))
        if(All_div_aStopList[i].classList.contains('div_aStopList-show')) {
            current_div_aStopList = All_div_aStopList[i]
        }
    }
    if(current_div_aStopList === '') {
        div_aStopList.classList.add('div_aStopList-show');
    } else {
        if(current_div_aStopList === div_aStopList) {
            div_aStopList.classList.remove('div_aStopList-show');
            div_aStopList.innerHTML = ""   
        } else {
            current_div_aStopList.classList.remove('div_aStopList-show');
            current_div_aStopList.innerHTML = ""
            div_aStopList.classList.add('div_aStopList-show');
        }
    }
    
    
    /* for(let i = 0; i < All_div_aStopList.length; i++) {
            if(All_div_aStopList[i].classList.contains('div_aStopList-show')) {
                All_div_aStopList[i].classList.remove('div_aStopList-show');
                All_div_aStopList[i].innerHTML = ""
            }
        } */
    /* div_aStopList.classList.add('div_aStopList-show'); */
    
    ETAData.map((data) => createETADataList(data, li_aStop, div_aStopList));
}

// Stop list
const handleRouteStopListItem = (li_aStop, ul_routeStopList, div_aStopList, stop) => {
    li_aStop.addEventListener('click', () => {
        openETADataPage(ul_routeStopList, div_aStopList, stop);
        
    });
}
const createRouteStopList = (data) => {
    const {seq, stop} = data;
    let stopName = '';
    for(let i = 0; i < stopListData.length; i++) {
        if(stopListData[i]['stop'] === stop) {
            stopName = stopListData[i]['name_tc'];
        }
    }
    const ul = document.createElement("ul");
    ul.className = "ul_routeStopList";
/*     ul.id = "ul_routeStopList"; */
    ul.innerHTML = `
        <li id="li_aStop" class="li_aStop">
            <div class="div_stopNumber">${seq}</div>
            <div class="div_stopName">${stopName}</div>
        </li>
        <div id="div_aStopList" class="div_aStopList">
            
        </div>
        
    `;/* <div style="height:3px; width:100%; background-color:#c2c2c2"></div> */
    div_routeStopList.append(ul);
    const li_aStop = ul.querySelector('#li_aStop');
    const ul_routeStopList = div_routeStopList.querySelector('#ul_routeStopList');
    const div_aStopList = ul.querySelector('#div_aStopList');
    All_div_aStopList.push(div_aStopList);
    handleRouteStopListItem(li_aStop, ul_routeStopList, div_aStopList, stop);
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




