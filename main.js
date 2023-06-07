// / <reference path="jquery-3.6.1.js" />
"use strict";

$(() => {
    const Url = "https://randomuser.me/api/?results=40";
    const UrlTen = "https://randomuser.me/api/?results=10";
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let likedUsers = JSON.parse(localStorage.getItem("likedUsers")) || [];
    let likesCount = 0;

    // REMOVE ALL USERS:
    // users = [];
    // likedUsers = [];
    // localStorage.setItem("likedUsers", JSON.stringify(likedUsers));
    // localStorage.setItem("users", JSON.stringify(users));

    // Load initial users
    if (users.length === 0) {
        loadUsers(Url);
    } else {
        showUsers(users);
    }

    // Load more users when the user scrolls to the bottom of the page
    $(window).scroll(() => {
        const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight;
        if (scrolledToBottom) {
            loadUsers(UrlTen);
        }
    });

    // Update likes count and button color when a like button is clicked
    $("#container").on("click", ".toggle-btn", (event) => {
        const $button = $(event.currentTarget);
        const liked = $button.hasClass("liked");
        const likedId = parseInt(event.currentTarget.id);

        if (liked) {
            $button.text("Like");
            $button.css("background-color", "");
            $button.removeClass("liked");
            likesCount--;
            likedUsers[likedId] = 0;
        } else {
            $button.css("background-color", "green");
            $button.text("Unlike");
            $button.addClass("liked");
            likesCount++;
            likedUsers[likedId] = 1;
        }

        //save user likes to storage
        localStorage.setItem("likedUsers", JSON.stringify(likedUsers));

        $("#likes-count").text(likesCount);
    });

    async function loadUsers(url) {
        // Show loading message
        $("#loading").show();

        // Get users from API
        const containerObject = await getJson(url);
        const newUsers = containerObject.results;

        // Hide loading message
        $("#loading").hide();

        // Append new users to existing users array
        users = [...users, ...newUsers];

        // Save users to browser storage
        localStorage.setItem("users", JSON.stringify(users));

        // Show users on page
        showUsers(users);
    }

    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    function showUsers(users) {
        const container = document.getElementById("container");
        let html = "";
        let i = 0;
        likesCount = 0;

        for (const user of users) {
            if (i % 3 === 0) {
                html += "<div class='row'>";
            }
            html += `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${`${user.name.title} ${user.name.first} ${user.name.last}`}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Gender: ${user.gender}, Age: ${user.dob.age}</h6>
                        <p class="card-text">Email: ${user.email}</p>
                        <img class="card-img-top" src="${user.picture.medium}" alt="User Image" style="max-width: 50%; max-height: 50%;">
                       `

            if (likedUsers[i] === 1) {
                html += `<button id="${i}" class="toggle-btn btn btn-primary liked" style="background-color:green">Unlike</button>`;
                likesCount++;
            }
            else {
                html += `<button id="${i}" class="toggle-btn btn btn-primary" >Like</button>`;
            }

            html += `</div>
                </div>
            </div>
        `;

            $("#likes-count").text(likesCount);

            i++;
            if (i % 3 === 0) {
                html += '</div>';
            }
        }
        if (i % 3 !== 0) {
            html += '</div>';
        }
        container.innerHTML = html;
        // Make the user divs draggable
        $(".card").draggable();
        $(".card").droppable();
    }
}); 