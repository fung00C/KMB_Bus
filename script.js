let searchQuery = ""
let routeListData = []
let stopListData = []
let routeStopData = []
let routeStopData_byRevDir = []
let ETAData = []
let currentData = {'route': '', 'bound': '', 'orig_tc': '', 'dest_tc': '','service_type': '', 'stop_id': ''}
let All_div_aStopList = [];
let canExchangeRoute;
const div_logoIcon = document.querySelector('#div_logoIcon');
const div_searchBar = document.querySelector("#div_searchBar");
const ipt_search = document.querySelector("#ipt_search");
const div_buttonBar = document.querySelector("#div_buttonBar");
const div_routeContainer = document.querySelector("#div_routeContainer");
const div_searchResult = document.querySelector("#div_searchResult");
const div_routeList = document.querySelector("#div_routeList");
const div_routeStopContainer = document.querySelector("#div_routeStopContainer");
const div_newSearch = document.querySelector("#div_newSearch");
const img_newSearch = div_newSearch.querySelector('img');
const div_exchangeRoute = document.querySelector("#div_exchangeRoute");
const img_exchangeRoute = div_exchangeRoute.querySelector('img');
const div_close_routeStopPage = document.querySelector("#div_close_routeStopPage");
const img_close_routeStopPage = div_close_routeStopPage.querySelector('img');
const div_routeName_aRoute = document.querySelector("#div_routeName_aRoute");
const div_fromStop_aRoute = document.querySelector("#div_fromStop_aRoute");
const div_toStop_aRoute = document.querySelector("#div_toStop_aRoute");
const div_routeStopList = document.querySelector("#div_routeStopList");

// get API 
async function fetchRouteListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/"); // https://data.etabus.gov.hk/v1/transport/kmb/route/
    const data = await response.json();
    routeListData = data['data'];
    //console.log(routeListData);
}
async function fetchStopListData() {
    const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop"); // https://data.etabus.gov.hk/v1/transport/kmb/stop
    const data = await response.json();
    stopListData = data['data'];
    //console.log(stopListData);
}
async function fetchRouteStopData(route, direction, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}
    const data = await response.json();
    routeStopData = data['data'];
    //console.log(routeStopData);
}
async function fetchRouteStopData_byRevDir(route, reverseDirection, service_type) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${reverseDirection}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}
    const data = await response.json();
    routeStopData_byRevDir = data['data'];
    //console.log(routeStopData_byRevDir);
}
async function fetchETAData(stop_id, seq, route, service_type, dir) {
    const response = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stop_id}/${route}/${service_type}`); // https://data.etabus.gov.hk/v1/transport/kmb/eta/{stop_id}/{route}/{service_type}
    const data = await response.json();
    let temp = [];
    for(let i = 0; i < data['data'].length; i++) {
        if(data['data'][i]['dir'] === dir && data['data'][i]['seq'] === Number(seq)) {
            temp.push(data['data'][i]);
        }
    }
    ETAData = temp;
    //console.log(ETAData);
}
// test
//fetchRouteListData();
//fetchRouteData('74B', 'outbound', '1');
//fetchRouteStopData('78A', 'outbound', '1');
//fetchETAData('A60AE774B09A5E44', '40', '1');

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
function calculateTimeDifference(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;
    let difference = totalMinutes2 - totalMinutes1;
    if (difference < 0) {
        difference += 24 * 60; // Add 24 hours in minutes if the difference is negative
    }
    if(difference > 1380) { // For API delay updating data
        return 'fail'
    }
    const hoursDiff = Math.floor(difference / 60);
    const minutesDiff = difference % 60;
    return `${hoursDiff}:${minutesDiff.toString().padStart(2, '0')}`;
}
function convertTimeToMinutes(time) {
    if (time === 'fail') {
        return 'fail'
    }
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes}`;
}
const createETADataList = (data, div_aStopList) => {
    const {data_timestamp, eta, rmk_tc} = data;
    let remainTime = '';
    let nowTime = '';
    let arriveTime = '';
    let remarkName = '';
    const data_dataTimeStamp = new Date(data_timestamp);
    const data_ets = new Date(eta);

    nowTime = `${data_dataTimeStamp.getHours()}:${data_dataTimeStamp.getMinutes().toString().padStart(2, '0')}`
    if(eta !== null) {
        arriveTime = `${data_ets.getHours()}:${data_ets.getMinutes().toString().padStart(2, '0')}`
    } else {
        arriveTime = `--:--`
    }
    const timeDifference = calculateTimeDifference(nowTime, arriveTime);
    const timeDifferenceMinutes = convertTimeToMinutes(timeDifference)
    if(eta !== null && timeDifferenceMinutes !== 'fail') {
        remainTime = `${timeDifferenceMinutes}`
    } else {
        remainTime = `--`
    }
    if(rmk_tc !== '' && eta !== null) {
        remarkName = rmk_tc;
    } else if(rmk_tc === '' && eta !== null) {
        remarkName = '';
    } else {
        remarkName = '暫停服務';
    }

    const div = document.createElement("div");
    div.className = "div_ETAListItem";
    div.id = 'div_ETAListItem'
    div.innerHTML = `
        <div class="div_arriveTime">
            <img src="./img/clock_icon.png">
            <div>${arriveTime}</div>
        </div>
        <div class="div_remainTime">
            <div>Arrive at: </div>    
            <div>${remainTime}</div>
            <div> min</div>    
        </div>
        <div id="div_timeRemark" class="div_timeRemark">
            <div>${remarkName}</div>
        </div>
    `;
    div_aStopList.append(div);

    const div_timeRemark = div.querySelector('#div_timeRemark'); 
    if(remarkName === '') {
        div_timeRemark.innerHTML = '';
    }
}
async function openETADataPage(div_aStopList, stop, stop_seq) {
    let current_div_aStopList = '';
    for(let i = 0; i < All_div_aStopList.length; i++) {
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
            return
        } else {
            current_div_aStopList.classList.remove('div_aStopList-show');
            current_div_aStopList.innerHTML = ""
            div_aStopList.classList.add('div_aStopList-show');
        }
    }
    await fetchETAData(stop, stop_seq, currentData['route'], currentData['service_type'], currentData['bound']);
    ETAData.map((data) => createETADataList(data, div_aStopList));
}

// Stop list
const handleRouteStopListItem = (li_aStop, div_aStopList, stop, stop_seq) => {
    li_aStop.addEventListener('click', () => {
        openETADataPage(div_aStopList, stop, stop_seq);
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
    ul.innerHTML = `
        <li id="li_aStop" class="li_aStop">
            <div class="div_stopNumber">${seq}</div>
            <div class="div_stopName">${stopName}</div>
        </li>
        <div id="div_aStopList" class="div_aStopList"></div>   
    `;
    div_routeStopList.append(ul);
    const li_aStop = ul.querySelector('#li_aStop');
    const div_aStopList = ul.querySelector('#div_aStopList');
    All_div_aStopList.push(div_aStopList);
    handleRouteStopListItem(li_aStop, div_aStopList, stop, seq);
}
async function openRouteStopPage() {
    let direction = '';
    if(currentData.bound === 'O') {
        direction = 'outbound';
    } else if(currentData.bound === 'I') {
        direction = 'inbound';
    }
    checkExchangeRouteButton(direction);
    div_searchBar.classList.add('div_searchBar-hide');
    div_buttonBar.classList.add('div_buttonBar-show');
    div_routeContainer.classList.remove('div_routeContainer-show');
    div_routeStopContainer.classList.add('div_routeStopContainer-show');
    div_routeName_aRoute.textContent = currentData.route;
    div_fromStop_aRoute.textContent = currentData.orig_tc;
    div_toStop_aRoute.textContent = currentData.dest_tc;
    await fetchRouteStopData(currentData['route'], direction, currentData['service_type']);
    All_div_aStopList = [];
    routeStopData.map((data) => createRouteStopList(data));
}
async function updataRouteStopPage() {
    let direction = '';
    if(currentData.bound === 'O') {
        direction = 'outbound';
    } else if(currentData.bound === 'I') {
        direction = 'inbound';
    } 
    div_routeStopList.innerHTML = ""; // clear previous data
    div_routeName_aRoute.textContent = currentData.route;
    div_fromStop_aRoute.textContent = currentData.orig_tc;
    div_toStop_aRoute.textContent = currentData.dest_tc;
    await fetchRouteStopData(currentData['route'], direction, currentData['service_type']);
    All_div_aStopList = [];
    routeStopData.map((data) => createRouteStopList(data));
}
async function checkExchangeRouteButton(direction) {
    if(direction === 'outbound') {
        reverseDirection = 'inbound';
    } else if(direction === 'inbound') {
        reverseDirection = 'outbound';
    }
    await fetchRouteStopData_byRevDir(currentData['route'], reverseDirection, currentData['service_type']);
    if(routeStopData_byRevDir.length > 0) { // The routeStopData_byRevDir array is for checking null or not
        canExchangeRoute = true;
    } else {
        canExchangeRoute = false;
    }
    if(canExchangeRoute === true) {
        div_exchangeRoute.style.pointerEvents = 'auto'; // Enable pointer events on the element
        img_exchangeRoute.setAttribute('src', './img/exchange_icon.png');
    } else {
        div_exchangeRoute.style.pointerEvents = 'none'; // Able pointer events on the element
        img_exchangeRoute.setAttribute('src', './img/exchange_icon_gray.png');
    }
}
div_newSearch.addEventListener('click', () => {
    div_searchBar.classList.remove('div_searchBar-hide');
    div_buttonBar.classList.remove('div_buttonBar-show');
    div_routeStopList.innerHTML = ""; // clear previous data
    div_routeStopContainer.classList.remove('div_routeStopContainer-show');
    div_routeContainer.classList.add('div_routeContainer-show');
    const query = ipt_search.value = '';
    handleSearchBar(query);
    ipt_search.focus();
});
div_newSearch.addEventListener('mouseover', () => {
    img_newSearch.setAttribute('src', './img/search_icon_white.png');
});
div_newSearch.addEventListener('mouseout', () => {
    img_newSearch.setAttribute('src', './img/search_icon.png')
});
div_exchangeRoute.addEventListener('click', () => {
    const new_orig_tc = currentData['dest_tc'];
    const new_dest_tc = currentData['orig_tc'];
    const org_bound = currentData['bound'];
    if(canExchangeRoute) {
        if(org_bound === 'O') {
            currentData['bound'] = 'I';
        } else if(org_bound === 'I') {
            currentData['bound'] = 'O';
        }
        currentData['orig_tc'] = new_orig_tc;
        currentData['dest_tc'] = new_dest_tc;
        updataRouteStopPage();
    } else {
        console.log('OK')
        return
    }
});
div_exchangeRoute.addEventListener('mouseover', () => {
    if(canExchangeRoute) {
        img_exchangeRoute.setAttribute('src', './img/exchange_icon_white.png');
    } else {
        return
    }
});
div_exchangeRoute.addEventListener('mouseout', () => {
    if(canExchangeRoute) {
        img_exchangeRoute.setAttribute('src', './img/exchange_icon.png');
    } else {
        return
    }
});
div_close_routeStopPage.addEventListener('click', () => {
    div_searchBar.classList.remove('div_searchBar-hide');
    div_buttonBar.classList.remove('div_buttonBar-show');
    div_routeStopList.innerHTML = ""; // clear previous data
    div_routeStopContainer.classList.remove('div_routeStopContainer-show');
    div_routeContainer.classList.add('div_routeContainer-show');
    const query = ipt_search.value;
    handleSearchBar(query);
});
div_close_routeStopPage.addEventListener('mouseover', () => {
    img_close_routeStopPage.setAttribute('src', './img/close_icon_white.png');
});
div_close_routeStopPage.addEventListener('mouseout', () => {
    img_close_routeStopPage.setAttribute('src', './img/close_icon.png');
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
    const searchQuery = query.trim().toUpperCase();
    if (searchQuery.length <= 0) {
        resetRouteList()
        return
    }
    let searchResults = routeListData.filter((data) => 
        data.route.toUpperCase().includes(searchQuery))
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

// Window scroll bar effect
window.addEventListener('scroll', function() {
    let scrollDistance = window.pageYOffset || document.documentElement.scrollTop; // Calculate the distance scrolled from the top of the page
    // Fix scroll bar bounces when it tends to disappear or appear
    if(div_logoIcon.style.display === 'none') { 
        scrollDistance += 80;
    } else {
        scrollDistance -= 80;
    }
    // Adjust the opacity based on the scroll distance
    let opacity = 1 - (scrollDistance / 200); // Adjust the division value for desired speed
    div_logoIcon.style.opacity = opacity; // Apply the opacity to the logo icon
    // Hide the logo icon when opacity reaches 0
    if (opacity <= 0) {
        div_logoIcon.style.transform = 'translateY(-100%)';
        div_logoIcon.style.display = 'none'
    } else {
        div_logoIcon.style.display = 'block';
        this.setTimeout(() => {
            div_logoIcon.style.transform = 'translateY(0)';
        }, 100);
    }
});


