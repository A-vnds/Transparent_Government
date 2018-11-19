
var app = new Vue({
    el: '#vue-app',
    data: {
        senators: [],
        members: [],
        leastEngagedArray: [],
        mostEngagedArray: [],
        leastLoyalArray: [],
        mostLoyalArray: [],
        senateURL: "https://api.propublica.org/congress/v1/113/senate/members.json",
        houseURL: "https://api.propublica.org/congress/v1/113/house/members.json",
        statistics: [],
        hide_loader: false,
        hide_table: true,

    },
    
    
    
    created: function () {
        
        //Page URLs

        
        if ((window.location.pathname == "/senate-attendance.html") || (window.location.pathname == "/senate-loyalty.html")) {
            this.getDATA(this.senateURL);
        };


        if ((window.location.pathname == "/house-attendance.html") || (window.location.pathname == "/house-loyalty.html")) {
            this.getDATA(this.houseURL);
        };
        
 
        
    },
    
    
    methods: {


        getDATA: function (url) {
                fetch(url, {
                        method: "GET",
                        headers: {
                            'X-API-Key': "9CWN1qilUH6MJzIghGk8igvIm0rNFPnIIs3wzi4Y",
                        }
                    })
                    .then(response => response.json())
                    .then(json => {
                        data = json;
                        this.members = data.results[0].members;
                        this.senators = data.results[0].members;
                        this.hide_loader = true;
                        this.hide_table = false;
                        this.webLogic();
                    })
                    .catch(error => error)
            },
        
        
        webLogic: function () {
            demoLength = this.totalNumber('D');
            repuLength = this.totalNumber('R');
            indeLength = this.totalNumber('I');
            totalNumberOfCand = demoLength + repuLength + indeLength;

            demoMissedVotP = this.averMissedVotesPerc('D');
            repuMissedVotP = this.averMissedVotesPerc('R');
            indeMissedVotP = this.averMissedVotesPerc('I');
            averMissedVotP = ((demoMissedVotP + repuMissedVotP + indeMissedVotP) / 3);

            demoMissedVotP = demoMissedVotP || 0;
            repuMissedVotP = repuMissedVotP || 0;
            indeMissedVotP = indeMissedVotP || 0;
            averMissedVotP = averMissedVotP || 0;

            demoVotPerc = this.totalVotedPerc('D');
            repuVotPerc = this.totalVotedPerc('R');
            indeVotPerc = this.totalVotedPerc('I');

            averPVDemo = demoVotPerc / demoLength;
            averPVRepu = repuVotPerc / repuLength;
            averPVInde = indeVotPerc / indeLength;
            averAverPVP = ((averPVDemo + averPVRepu + averPVInde) / 3);

            // Convert any falsey values to 0; false, NaN, undefined, 0, " ", null.

            averPVDemo = averPVDemo || 0;
            averPVRepu = averPVRepu || 0;
            averPVInde = averPVInde || 0;
            averAverPVP = averAverPVP || 0;

            let leastEngaged = [...app.members].sort(function (a, b) {
                return parseFloat(b.missed_votes_pct) - parseFloat(a.missed_votes_pct);
            });

            let mostEngaged = [...app.members].sort(function (a, b) {
                return parseFloat(a.missed_votes_pct) - parseFloat(b.missed_votes_pct);
            });


            // Least Loyal: The ones with lowest 'Voted with Party' Percentage
            // Most Loyal: The ones with the highest 'Voted with Party' Percentage

            let leastLoyal = [...app.members].sort(function (a, b) {
                return parseFloat(a.votes_with_party_pct) - parseFloat(b.votes_with_party_pct);
            });


            let mostLoyal = [...app.members].sort(function (a, b) {
                return parseFloat(b.votes_with_party_pct) - parseFloat(a.votes_with_party_pct);
            });



            this.leastEngagedArray = this.find10Percent(leastEngaged, "missed_votes_pct", "des");
            this.mostEngagedArray = this.find10Percent(mostEngaged, "missed_votes_pct", "asc");

            this.leastLoyalArray = this.find10Percent(leastLoyal, "votes_with_party_pct", "asc");
            this.mostLoyalArray = this.find10Percent(mostLoyal, "votes_with_party_pct", "des");


            // Small Table and Rest of the Statistics

            stats = {
                'Number_of_Republicans': repuLength,
                'Average_Republican_Missed_Votes_Perc': Math.floor(demoMissedVotP),
                'Average_Republican_Voted_wParty_Perc': Math.floor(averPVDemo),
                
                'Number_of_Democrats': demoLength,
                'Average_Democratic_Missed_Votes_Perc': Math.floor(repuMissedVotP),
                'Average_Democratic_Voted_wParty_Perc': Math.floor(averPVRepu),

                
                'Number_of_Independents': indeLength,
                'Average_Inde_Missed_Votes_Perc': Math.floor(indeMissedVotP),
                'Average_Independent_Voted_wParty_Perc': Math.floor(averPVInde), 

                'Total_Senate_Number': totalNumberOfCand,
                'Aver_of_Aver_Missed_Votes_Perc': Math.floor(averMissedVotP), 
                'Average_of_averages_Voted_wParty_Perc': Math.floor(averAverPVP),
            }
            
            app.statistics = stats;

        },
        totalNumber: function (par){
                let arr = [];
                let total = 0;
                for (let i = 0; i < this.members.length; i++) {
                    if (this.members[i].party == par) {
                        arr.push(this.members[i]);
                    }
                }
                return total = arr.length;
            },
        
        averMissedVotesPerc: function(par) {
                let total = 0;
                let average = 0;

                for (let i = 0; i < this.members.length; i++) {
                    if (this.members[i].party == par) {
                        total += this.members[i].missed_votes_pct;
                        average = (total / this.totalNumber(par));
                    }
                }
                return average;
            },
        
        totalVotedPerc: function(par) {
                let total = 0;

                for (let i = 0; i < this.members.length; i++) {
                    if (this.members[i].party == par) {
                        total += this.members[i].votes_with_party_pct;
                    }
                }
                return total;
            },
        
        find10Percent: function find10Percent(arr, value, order) {
                let newArray = [];
                let newValue = (arr.length / 10);
                let newLength = newValue.toFixed(0);
                let comparator = arr[newLength][value];

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i][value] <= comparator && order == "asc") {
                        newArray.push(arr[i]);
                    }

                    if (arr[i][value] >= comparator && order == "des") {
                        newArray.push(arr[i]);
                    }
                }
                return newArray;
            },

        
 
         
        
    },
    

})



window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myScrollBtn").style.display = "block";
    } else {
        document.getElementById("myScrollBtn").style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
