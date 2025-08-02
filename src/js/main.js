dayjs.extend(dayjs_plugin_relativeTime);

let allUserRepo = [];

const toggleVisibility = (el) => {
  switch (el) {
    case "h3":
      document.querySelector(el).classList.remove("hidden");
      document.getElementById("userProfile").classList.add("hidden");
      document.getElementById("userProfile").classList.remove("grid");
      document.getElementById("userRepos").classList.add("hidden");
      document.getElementById("userRepos").classList.remove("flex");
      break;
    case "userProfile":
      document.querySelector("h3").classList.add("hidden");
      document.getElementById(el).classList.add("grid");
      document.getElementById(el).classList.remove("hidden");
      break;
    case "userRepos":
      document.querySelector("h3").classList.add("hidden");
      document.getElementById(el).classList.add("flex");
      document.getElementById(el).classList.remove("hidden");
      break;
    case "viewAll":
      document.getElementById(el).classList.toggle("hidden");
      break;
  }
};

const getUserAccount = (username) => {
  return fetch(`https://api.github.com/users/${username}`)
    .then((res) => {
      if (res.status == 404) {
        throw new Error("Data not found!");
      }
      return res.json();
    })
    .then((res) => res);
};

const getUserRepo = (username) => {
  return fetch(`https://api.github.com/users/${username.toLowerCase()}/repos`)
    .then((res) => res.json())
    .then((res) => res);
};

const createRepoItem = (data) => {
  return ` <div class="card">
              <p class="text-lg">${data.name}</p>
              <p class="text-white/70 text-sm">
               ${data.description || ""}
              </p>
              <div class="repo-description">
              ${
                data.license !== null
                  ? ` <p class="repo-description_item">
                  <img src="resources/Chield_alt.svg" alt="Chield_alt icon" />
                  <span>${data.license.spdx_id}</span>
                </p>`
                  : ""
              }
                <p class="repo-description_item">
                  <img src="resources/Nesting.svg" alt="nesting icon" />
                  <span>${data.forks}</span>
                </p>
                <p class="repo-description_item">
                  <img src="resources/Star.svg" alt="star icon" />
                  <span>${data.stargazers_count}</span>
                </p>
                <p class="text-[0.7rem]">${dayjs(
                  `${data.updated_at.slice(0, 10)}`
                ).fromNow()}</p>
              </div>
            </div>`;
};

const updateUiProfile = (data) => {
  document.getElementById("profileImg").setAttribute("src", data.avatar_url);
  document
    .getElementById("profileImg")
    .setAttribute("alt", `${data.name} profile`);
  document.getElementById("followers").innerText = data.followers;
  document.getElementById("following").innerText = data.following;
  document.getElementById("location").innerText = data.location || "Unknown";
  document.getElementById("username").innerText = data.name;
  document.getElementById("bio").innerText = data.bio;
};

const updateUiRepo = (howMany) => {
  const reposContainer = document.querySelector(".card-container");
  reposContainer.innerHTML = "";

  if (howMany === "all") {
    allUserRepo.forEach(
      (el) => (reposContainer.innerHTML += createRepoItem(el))
    );
  } else {
    allUserRepo.forEach((el, i) => {
      if (i < 4) {
        reposContainer.innerHTML += createRepoItem(el);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const viewAllRepos = document.getElementById("viewAll");
  viewAllRepos.addEventListener("click", () => {
    updateUiRepo("all");
    toggleVisibility("viewAll");
  });

  const inputProfileName = document.getElementById("inputProfileName");
  inputProfileName.addEventListener("input", () => {
    const getLabel = document.getElementById("labelInputProfileName");
    if (inputProfileName.value.length > 0) {
      getLabel.classList.add("invisible");
    } else {
      getLabel.classList.remove("invisible");
    }
  });

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = inputProfileName.value;

    try {
      const userData = await getUserAccount(username);
      updateUiProfile(userData);
    } catch (e) {
      Swal.fire({
        title: e,
        icon: "error",
      });
      toggleVisibility("h3");
      return;
    }

    allUserRepo = await getUserRepo(username);
    updateUiRepo("less");
    if (allUserRepo.length > 4) {
      toggleVisibility("viewAll");
    }

    toggleVisibility("userProfile");
    toggleVisibility("userRepos");
  });
});
