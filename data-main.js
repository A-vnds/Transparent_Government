
var app = new Vue({
    el: '#vue-app',
    data: {
        senators: [],
        members: [],
        senateURL: "https://api.propublica.org/congress/v1/113/senate/members.json",
        houseURL: "https://api.propublica.org/congress/v1/113/house/members.json",
        states: [],
        hide_loader: false,
        hide_table: true,

    },
    created: function () {
        if (window.location.pathname == "/senate-data.html") {
            this.getData(this.senateURL);
        };
        if (window.location.pathname == "/house-data.html") {
            this.getData(this.houseURL);
        };
    },

    methods: {
        

        getData: function (url) {
            fetch(url, {
                    method: "GET",
                    headers: {
                        'X-API-Key': "9CWN1qilUH6MJzIghGk8igvIm0rNFPnIIs3wzi4Y",
                    }
                })
                .then(response => response.json()) // parses response to JSON
                .then(json => {
                    data = json;
                    this.members = data.results[0].members;
                    this.senators = data.results[0].members;
                    this.hide_loader = true;
                    this.hide_table = false;
                    this.removeDuplicates();
                })
                .catch(error => error)
        },



        removeDuplicates: function () {
            let stateListArray = [];

            for (let i = 0; i < this.members.length; i++) {
                if (stateListArray.indexOf(this.members[i].state) == -1) {
                    stateListArray.push(this.members[i].state);
                }
            }
            this.states = stateListArray;
        },


        zeroMatches: function () {
            this.filterArray();

            if (this.senators.length == 0) {
                alert("There are no matches for this values, the table will be reset");
                this.resetTableArr();
            }
        },

        resetTableArr: function () {

            checkDem = document.getElementById('checkDem');
            checkRep = document.getElementById('checkRep');
            checkInd = document.getElementById('checkInd');
            stateSelector = document.getElementById("selectState");

            stateSelector.value = 'All'
            checkDem.checked = true;
            checkRep.checked = true;
            checkInd.checked = true;
            this.filterArray();
        },

        caseReset: function () {

            checkDem = document.getElementById('checkDem');
            checkRep = document.getElementById('checkRep');
            checkInd = document.getElementById('checkInd');
            stateSelector = document.getElementById("selectState");


            if ((stateSelector.value == 'All' && (checkDem.checked == false) && (checkRep.checked == false) && (checkInd.checked == false))) {
                this.resetTableArr();
            } else {
                this.filterArray();
            }
            

        },


        filterArray: function () {

            checkDem = document.getElementById('checkDem');
            checkRep = document.getElementById('checkRep');
            checkInd = document.getElementById('checkInd');
            stateSelector = document.getElementById("selectState");


            let filteredArray = [];


            for (let i = 0; i < this.members.length; i++) {
            
                if (this.members[i].state == stateSelector.value || stateSelector.value == 'All') {

                    if ((this.members[i].party == 'D') && (checkDem.checked == true)) {
                        filteredArray.push(this.members[i]);
                    } else if ((this.members[i].party == 'R') && (checkRep.checked == true)) {
                        filteredArray.push(this.members[i]);
                    } else if ((this.members[i].party == 'I') && (checkInd.checked == true)) {
                        filteredArray.push(this.members[i]);
                    }
                }
            }
            this.senators = filteredArray;
        },
    }
});



window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        document.getElementById("myScrollBtn").style.display = "block";
    } else {
        document.getElementById("myScrollBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};


document.getElementById("wrap").addEventListener("scroll",function(){
   var translate = "translate(0,"+this.scrollTop+"px)";
   this.querySelector("thead").style.transform = translate;
});

