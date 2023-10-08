const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchQuery');
const searchResultsDiv = document.getElementById('searchResults');
const userReposDiv = document.getElementById('userRepos');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const searchQuery = searchInput.value.trim();
  if (!searchQuery) return;

  const users = await searchUsers(searchQuery);
  displayUsers(users);
});

async function searchUsers(query) {
  const apiUrl = `https://api.github.com/search/users?q=${query}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const data = await response.json();
  return data.items;
}

async function displayUsers(users) {
  searchResultsDiv.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
      <button class="reposButton" data-username="${user.login}">View Repos</button>
    `;
    searchResultsDiv.appendChild(userDiv);
  });

  const reposButtons = document.querySelectorAll('.reposButton');
  reposButtons.forEach(button => {
    button.addEventListener('click', () => {
      const username = button.dataset.username;
      displayUserRepos(username);
    });
  });
}

async function displayUserRepos(username) {
  const repos = await getUserRepos(username);
  userReposDiv.innerHTML = '';

  repos.forEach(repo => {
    const repoDiv = document.createElement('div');
    repoDiv.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    userReposDiv.appendChild(repoDiv);
  });
}

async function getUserRepos(username) {
  const apiUrl = `https://api.github.com/users/${username}/repos`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const data = await response.json();
  return data;
}
function displayRepos(repos) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  const repoList = document.createElement('ul');
  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    repoList.appendChild(repoItem);
  });

  searchResults.appendChild(repoList);
}