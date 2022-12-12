$(document).ready(function () {
    //getData();
    fetch("https://app.sportdataapi.com/api/v1/soccer/seasons?apikey=229c80a0-26b2-11ed-8f17-1b0c18f26fa5&league_id=237")
        .then(res => res.json())
        .then(result => {
            for (const key in result.data) {
                $("#input").append(`<option value="${result.data[key].season_id}">${result.data[key].name}</option>`)
            }
            let Controller = $("#input").val();
            loadData(Controller);

        })
    //new api
    $("#input").change(function (Controller) {
        $("#output tbody").empty();
        loadData($(this).val());
    })

    async function loadData(Controller) {
        await fetch(`https://app.sportdataapi.com/api/v1/soccer/standings?apikey=229c80a0-26b2-11ed-8f17-1b0c18f26fa5&season_id=${Controller}`) //get all main data 
            .then(res => res.json())
            .then(finalvalue => {
                loadStanding(finalvalue) // main point of the solution
            })
    }

    async function loadStanding(finalvalue) {
        let iteration = finalvalue.data.standings;
        for (const key in iteration) {
            console.log(iteration[key]);
            let logoIn = iteration[key].team_id;
            let logo;

            let item = iteration[key].overall;
            // for (const id in item) {
            //     console.log(id, item[id]);
            // }
            console.log(iteration[key].overall.won);
            await fetch(`https://app.sportdataapi.com/api/v1/soccer/teams/${logoIn}?apikey=229c80a0-26b2-11ed-8f17-1b0c18f26fa5`)   // get photo api 
                .then(res => res.json())
                .then(result => {
                    logo = result.data;
                    $("#output tbody").append(`<tr id="row">
                                <th class="col"> <img src="${logo.logo}"/></th>
                                <th class="col-7" colspan="2">${logo.name}</th>
                                <th class="col">${iteration[key].overall.games_played}</th>
                                <th class="col">${iteration[key].overall.won}</th>
                                <th class="col">${iteration[key].overall.draw}</th>
                                <th class="col">${iteration[key].overall.lost}</th>
                                <th class="col">${iteration[key].overall.goals_diff}</th>
                                <th class="col">${iteration[key].overall.goals_scored}</th>
                                <th class="col">${iteration[key].overall.goals_against}</th>
                                <th class="col">${iteration[key].points}</th>
                            </tr>`)
                    if (iteration[key].result == "Champions League") {
                        $("#row").css("background-color", "red");
                    } else if (iteration[key].result == "Europa Conference League") {
                        $("#row").css("background-color", "yellow");
                    } else if (iteration[key].result == "Europa League") {
                        $("#row").css("background-color", "blue");
                    }
                });


        }
    }
})