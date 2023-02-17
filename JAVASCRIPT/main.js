async function main(){
    display_head_page();
    display_list_movie("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score", "best-tendance-movies__list-film", "best-note-movies__block-list", 1);
    display_list_movie("http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score", "best-action-movies__list-film", "category-one__block-list", 1);
    display_list_movie("http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score", "best-comedy-movies__list-film", "category-two__block-list", 1);
    display_list_movie("http://localhost:8000/api/v1/titles/?genre=Crime&sort_by=-imdb_score", "best-crime-movies__list-film", "category-three__block-list",  1);
}

async function display_head_page(){
    let request_top_movies = await request_api("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    let id_top_movies = request_top_movies["results"]["0"]["id"]
    let top_movie = await request_api("http://localhost:8000/api/v1/titles/" + id_top_movies)
    
   let div_top_movies = document.getElementById("top-movie")
   let div_top_movies_child = div_top_movies.firstChild
   let button = div_top_movies.querySelectorAll("button")
   console.log(button);
   /* New balise */
   let img_movie = document.createElement("img")
   /* attribute balise */
   img_movie.setAttribute("class", "top-movie-img")
   img_movie.setAttribute("src", top_movie["image_url"])
   img_movie.setAttribute("alt", top_movie["title"])
   button[1].setAttribute("onclick", "open_movie(" + id_top_movies + ")")
   /* insert */
   div_top_movies.insertBefore(img_movie, div_top_movies_child)
   /* H1 */
   let h1_top_movie = document.createElement("h1")
   let text_h1 = document.createTextNode(top_movie["title"])
   h1_top_movie.appendChild(text_h1)
   div_top_movies.insertBefore(h1_top_movie, div_top_movies_child)
   /* description */
   let p_description_top_movie = document.createElement("p")
   let text_description = document.createTextNode(top_movie["description"])
   p_description_top_movie.appendChild(text_description)
   div_top_movies.insertBefore(p_description_top_movie, div_top_movies_child)
}

async function request_api(url){
    let response_api = await fetch(url);
    let result = response_api.json();
    return result
}

async function display_list_movie(url, id_ul, id_div, number_film){
    let lien_html = document.getElementById(id_div)
    let lien_html_child_first = lien_html.firstChild
    let lien_html_child_last = lien_html.lastChild
    
    /* Fleche de gauche */
    let new_a_fleche_gauche = document.createElement("a")
    let new_img_fleche_gauche = document.createElement("img")

    new_img_fleche_gauche.setAttribute("src", './CSS/Image/angle-de-la-fleche-gauche.png')
    new_img_fleche_gauche.setAttribute("alt", 'fleche gauche')
    new_a_fleche_gauche.setAttribute("class", "arrow")
    new_a_fleche_gauche.setAttribute("onclick", "move_list_movies('before', '" + id_ul + "')")

    new_a_fleche_gauche.append(new_img_fleche_gauche)
    lien_html.insertBefore(new_a_fleche_gauche, lien_html_child_first)

    /* Afficher les images */
    display_list_movie_extend(url, id_ul, number_film)
    
    /* Fleche de droite */
    let new_a_fleche_droite = document.createElement("a")
    let new_img_fleche_droite = document.createElement("img")
    
    new_img_fleche_droite.setAttribute("src", './CSS/Image/angle-de-la-fleche-droite.png')
    new_img_fleche_droite.setAttribute("alt", 'fleche gauche')
    new_a_fleche_droite.setAttribute("class", "arrow")
    new_a_fleche_droite.setAttribute("onclick", "move_list_movies('after', '" + id_ul + "')")
    
    new_a_fleche_droite.append(new_img_fleche_droite)
    lien_html.insertBefore(new_a_fleche_droite, lien_html_child_last)
}

async function display_list_movie_extend(url, id_parent, number_film){

    let request_page = await request_api(url);
    let i = number_film
    let lien_html = document.getElementById(id_parent)
    let lien_html_child_last = lien_html.lastChild

    /* image des films */
    for(let movie in request_page["results"]){
        let new_li = document.createElement("li")
        let new_a = document.createElement("a")
        let new_img = document.createElement("img")

        new_img.setAttribute("src", request_page["results"][movie]["image_url"])
        new_img.setAttribute("alt", request_page["results"][movie]["title"])
        new_a.setAttribute("onclick", "open_movie(" + request_page["results"][movie]["id"] + ")")
        new_li.setAttribute("style", "transform: translateX(0px)")

        new_li.append(new_a)
        new_a.append(new_img)

        lien_html.insertBefore(new_li, lien_html_child_last)
           
        /* stop after 7 movies */
        if(i == 7){
            break
        }
        i++
    }

    if(i < 7 ){
        await display_list_movie_extend(request_page["next"], id_parent, i)
    }
}

async function open_movie(id_film){

    let url =  "http://localhost:8000/api/v1/titles/" + id_film
    let request = await request_api(url)
    let get_id_balise = document.getElementById("open_infos_movies")
    let child_id_balise = get_id_balise.lastChild
    
    let title = request["title"]
    let img_url = request["image_url"]
    let genre = request["genres"]
    let year = request["year"]
    let rated = request["rated"]
    let imdb_score = request["imdb_score"]
    let writers = request["writers"]
    let actors = request["actors"]
    let duration = request["duration"]
    let countries = request["countries"]
    let avg_vote = request["avg_vote"]
    let long_description = request["long_description"]
    
    get_id_balise.setAttribute("style", "display: grid;")
    get_id_balise.innerHTML = "";

    let create_element_button_live = document.createElement("img")
    create_element_button_live.setAttribute("src", './CSS/Image/cancel.png')
    create_element_button_live.setAttribute("onclick", "close_windows()")
    get_id_balise.appendChild(create_element_button_live, child_id_balise)

    let create_element_img = document.createElement("img")
    create_element_img.setAttribute("src", img_url)
    create_element_img.setAttribute("alt", title)
    get_id_balise.appendChild(create_element_img, child_id_balise)
    
    let creat_div_text = document.createElement("div")
    creat_div_text.setAttribute("id", "open-infos-movies__block-texte")
    get_id_balise.appendChild(creat_div_text, child_id_balise)


    let get_id_balise_text = document.getElementById("open-infos-movies__block-texte")
    let child_id_balise_text = get_id_balise_text.firstChild
    
    
    let create_element_title = document.createElement("h2")
    let create_text_title = document.createTextNode("Titre : " + title)
    create_element_title.appendChild(create_text_title)
    get_id_balise_text.appendChild(create_element_title, child_id_balise_text)
    
    let create_element_genre = document.createElement("p")
    let new_genre = (genre.toString()).replaceAll(",", ", ")
    let create_text_genre = document.createTextNode("Genre : " + new_genre)
    create_element_genre.appendChild(create_text_genre)
    get_id_balise_text.appendChild(create_element_genre, child_id_balise_text)
    
    let create_element_year = document.createElement("p")
    let create_text_year = document.createTextNode("Année : " + year)
    create_element_year.appendChild(create_text_year)
    get_id_balise_text.appendChild(create_element_year, child_id_balise_text)
    
    let create_element_rated = document.createElement("p")
    let create_text_rated = document.createTextNode("Evaluation : " + rated)
    create_element_rated.appendChild(create_text_rated)
    get_id_balise_text.appendChild(create_element_rated, child_id_balise_text)
    
    let create_element_imdb_score = document.createElement("p")
    let create_text_imdb_score = document.createTextNode("Note : " + imdb_score)
    create_element_imdb_score.appendChild(create_text_imdb_score)
    get_id_balise_text.appendChild(create_element_imdb_score, child_id_balise_text)
    
    let create_element_writers = document.createElement("p")
    let new_writer = (writers.toString()).replaceAll(",", ", ")
    let create_text_writers = document.createTextNode("Réalisateur : " + new_writer)
    create_element_writers.appendChild(create_text_writers)
    get_id_balise_text.appendChild(create_element_writers, child_id_balise_text)
    
    let create_element_actors = document.createElement("p")
    let new_actors = (actors.toString()).replaceAll(",", ", ")
    let create_text_actors = document.createTextNode("Acteurs : " + new_actors)
    create_element_actors.appendChild(create_text_actors)
    get_id_balise_text.appendChild(create_element_actors, child_id_balise_text)
    
    let create_element_duration = document.createElement("p")
    let create_text_duration = document.createTextNode("Durée : " + duration + " minutes")
    create_element_duration.appendChild(create_text_duration)
    get_id_balise_text.appendChild(create_element_duration, child_id_balise)
    
    let create_element_countries = document.createElement("p")
    let new_countries = (countries.toString()).replaceAll(",", ", ")
    let create_text_countries = document.createTextNode("Pays : " + new_countries)
    create_element_countries.appendChild(create_text_countries)
    get_id_balise_text.appendChild(create_element_countries, child_id_balise_text)
    
    let create_element_avg_vote = document.createElement("p")
    let create_text_avg_vote = document.createTextNode("Note : " + avg_vote)
    create_element_avg_vote.appendChild(create_text_avg_vote)
    get_id_balise_text.appendChild(create_element_avg_vote, child_id_balise_text)
    
    let create_element_long_description = document.createElement("p")
    let create_text_long_description = document.createTextNode("Description : " + long_description)
    create_element_long_description.appendChild(create_text_long_description)
    get_id_balise_text.appendChild(create_element_long_description, child_id_balise_text)
    
    
    console.log(request)
}
function close_windows(){
    let id_element_close = document.getElementById("open_infos_movies")
    id_element_close.setAttribute("style", "display: none;")
}

function move_list_movies(direction, id_element_move){
    let element_move = document.getElementById(id_element_move).querySelectorAll("li")
    let length_width = document.getElementById(id_element_move).offsetWidth
    let length_li = element_move.length * 370 
    
    for(let i = 0; i < element_move.length; i++){
        let value_transform = element_move[i].getAttributeNode("style").nodeValue
        let value_transform_replace = value_transform.replace("transform: translateX(", "").replace("px)", "")
        if(direction == "before"){
            if(value_transform_replace == 0){
                /* No move */
            }
            else{
                
                element_move[i].setAttribute("style", "transform: translateX(" + (370 + parseInt(value_transform_replace)) + "px)");
            }
        }
        if(direction == "after"){
            if(value_transform_replace < ( -(length_li - length_width))){
            }
            else {
                element_move[i].setAttribute("style", "transform: translateX(" + (parseInt(value_transform_replace) - 370) + "px)");
            }
        }
    }
}

main()