// NAME: Charles Rawlins
// FILE: officerProfileGen.js
// Desc: These functions automatically generates the officer entries for the officersAndContact.html
// page from the content in OfficerProfiles.csv.

// Basic class used for handling year and officer data.
class yearEntry{

    constructor(yearEntry) {
        this.year = yearEntry;
        this.contentID = "Content" + this.year.replace(/\s/g, '');
        this.tabID = "ID" + this.year.replace(/\s/g, '');
        this.officerEntries = [];
    }    addEntry(dataEntry){
        // Parse data over...
        var newOfficer = {name:dataEntry.name, role:dataEntry.role, image:dataEntry.image,
            educ:dataEntry.education, desc:dataEntry.officerDesc, email:dataEntry.email, linkedin:dataEntry.linkedin};
        this.officerEntries.push(newOfficer);
    }

}

// Generate the officer cards upon load of officersAndContact.html
window.onload = generateOfficers()

// Calls the d3 csv read function and parses/generates officer card entries for officersAndContact.html
function generateOfficers(){
    // Read in officer data with d3 (let this be the only function processed for clarity)
    d3.csv("../miscContent/OfficerProfiles.csv").then(function(data){

        // Parse csv lines into headers and officer data
        var yearEntries = [];
        var workingYear = {};
        for(var i = 0; i < data.length; i++){


            if(data[i].desc == "YEAR"){ // Year category entry
                if(Object.keys(workingYear).length != 0) {
                    yearEntries.push(workingYear);
                }
                workingYear = new yearEntry(data[i].name);


            }else{ // Officer entry (can add more categories if needed later)
                workingYear.addEntry(data[i]);

            }

        }
        yearEntries.push(workingYear);

        // Generate year tabs
        for(var i = 0; i < yearEntries.length; i++) {
            // Example entry
            // <li class="nav-item">
            //     <a class="nav-link active" id="2021" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
            //     </li>


            yearBlock = document.createElement('li',);
            yearBlock.setAttribute('class', 'nav-item');
            yearParam = document.createElement('a');
            if (i == 0) {
                yearParam.setAttribute('class', 'nav-link active');
            } else {
                yearParam.setAttribute('class', 'nav-link');
            }
            yearParam.setAttribute('id', yearEntries[i].tabID);
            yearParam.setAttribute('data-toggle', 'pill');
            yearParam.setAttribute('href', "#" + yearEntries[i].contentID);
            yearParam.setAttribute('role', 'tab');
            yearParam.setAttribute('aria-controls', yearEntries[i].contentID);
            if (i == 0) {
                yearParam.setAttribute('aria-selected', 'true');
            } else {
                yearParam.setAttribute('aria-selected', 'false');
            }
            // yearParam.setAttribute('style','color: dark;');
            yearParam.innerHTML = yearEntries[i].year;
            yearBlock.appendChild(yearParam);
            yearTabs = document.getElementById("yearTabs");
            yearTabs.appendChild(yearBlock);
            // yearTabs.style.marginBottom = "20px";

        }

        // Generate year tab contents from officer csv file.
        var officerTabContents = document.getElementById("officerTabContents");

        for (var i = 0; i < yearEntries.length; i++){

            // Example entry.
        // <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
        //     <div class="tab-pane fade show active" id="Fall2019Content" role="tabpanel" aria-labelledby="Fall2019ID" aria-selected="true">
        //         <div class="row justify-content-md-center" >
        //         <div class="col-md-auto" >
        //         <div class="card h-auto mb-3" style="width: 15rem;">
        //         <div class="card-header">Club Chair</div>
        //     <img class="img-fluid" src="../images/officers/kevin-newell.png" alt="Kevin" style="width: 100%">
        //         <div class="card-body"style="width: 15rem;">
        //         <h5 class="card-title">Kevin Newell</h5>
        //     <p class="card-text">Likes coding and being alive.</p>
        //     </div>
        //     <ul class="list-group list-group-flush">
        //         <li class="list-group-item">CS Senior</li>
        //     </ul>
        //     <div class="card-footer"style="width: 15rem;">
        //         <a href="mailto:kanm29@mst.edu" class="btn btn-secondary">Email</a>
        //         </div>
        //         </div>
        //         </div>
        //
        //         </div>
        //         </div>

            // Tab officer Content
            // Tab div
            tabBlock = "";
            if (i == 0){
                var tabBlock = '<div class="tab-pane fade show active" id="' + yearEntries[i].contentID + '"' +
                    ' role="tabpanel" aria-labelledby="'+ yearEntries[i].tabID + '" aria-selected="true">';
            }else{
                var tabBlock = '<div class="tab-pane fade show" id="' + yearEntries[i].contentID + '"' +
                    ' role="tabpanel" aria-labelledby="'+ yearEntries[i].tabID + '" aria-selected="false">';
            }
            // Row div
            tabBlock += '<div class="row justify-content-md-center py-1" style="background-color:#17191c;">';

            for(var j = 0; j < yearEntries[i].officerEntries.length; j++) {

                // Officer col div
                tabBlock += '<div class="col-md-auto py-2">'; // d-flex align-items-stretch" >';
                // Officer Card div
                tabBlock += '<div class="card h-100 mb-3 bg-dark text-white" style="width: 15rem;">'

                // Card header
                tabBlock += '<div class="card-header">' + yearEntries[i].officerEntries[j].role + '</div>'
                // Card image
                if (yearEntries[i].officerEntries[j].image == "N/A") {
                    tabBlock += '<img class="img-fluid" src="../images/OldOfficerPics/blank.png" alt="' +
                        yearEntries[i].officerEntries[j].name + '" style="width: 100%">';

                } else if(yearEntries[i].officerEntries[j].image == "BLANK"){
                    // Empty image
                }else {
                    tabBlock += '<img class="img-fluid" src="' + yearEntries[i].officerEntries[j].image + '" alt="' +
                        yearEntries[i].officerEntries[j].name + '" style="width: 100%">';
                }


                // Card body div
                tabBlock += '<div class="card-body"style="width: 15rem;">';
                // Card body title
                tabBlock += '<h5 class="card-title">' + yearEntries[i].officerEntries[j].name + '</h5>';
                // Card body desc.
                if (yearEntries[i].officerEntries[j].desc != "N/A") {
                    tabBlock += '<p class="card-text">' + yearEntries[i].officerEntries[j].desc + '\n</p>';
                    tabBlock += '<p class="card-text">' + yearEntries[i].officerEntries[j].educ + '</p>';
                }

                // Card body /div
                tabBlock += '</div>';

                //Card email and linkedin
                if((yearEntries[i].officerEntries[j].email || yearEntries[i].officerEntries[j].linkedin) != "N/A") {
                    tabBlock += '<div class="card-footer " style="width: 15rem;">';
                    if (yearEntries[i].officerEntries[j].email != "N/A") {
                        tabBlock += '<a href="mailto:' + yearEntries[i].officerEntries[j].email + '" class="btn btn-secondary float-left">Email</a>';
                    }

                    if (yearEntries[i].officerEntries[j].linkedin != "N/A") {
                        tabBlock += '<a href="' + yearEntries[i].officerEntries[j].linkedin + '" class="btn btn-secondary float-right">LinkedIn</a>';
                    }
                    // Card footer /div
                    tabBlock += '</div>';

                }
                // Officer card /div
                tabBlock += '</div>';
                // Officer col /div
                tabBlock += '</div>';
            }

            // Row /div
            tabBlock += '</div>';
            // Tab /div
            tabBlock +='</div>';
            officerTabContents.innerHTML += tabBlock;

        }
    });

}





