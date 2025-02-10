//Get URL
function fetchGitHubData(username) {
  return axios
    .get(`https://api.github.com/users/${username}`)
    .then((response) => response.data);
}

// Build the User Card
function githubUserCard(user) {
  const userCard = document.createElement('div');
  userCard.className = 'card';

  const img = document.createElement('img');
  img.src = user.avatar_url;
  img.alt = `${user.name || 'User'}'s avatar`;

  const cardInfo = document.createElement('div');
  cardInfo.className = 'card-info';

  const name = document.createElement('h3');
  name.className = 'name';
  name.textContent = user.name || 'N/A';

  const username = document.createElement('p');
  username.className = 'username';
  username.textContent = `Username: ${user.login}`;

  const location = document.createElement('p');
  location.textContent = `Location: ${user.location || 'Not provided'}`;

  const profileLink = document.createElement('p');
  profileLink.innerHTML = `Profile: <a href="${user.html_url}" target="_blank">${user.html_url}</a>`;

  const bio = document.createElement('p');
  bio.textContent = `Bio: ${user.bio || 'No bio available'}`;

  const followers = document.createElement('p');
  followers.textContent = `Followers: ${user.followers}`;

  const following = document.createElement('p');
  following.textContent = `Following: ${user.following}`;

  cardInfo.append(
    name,
    username,
    location,
    profileLink,
    bio,
    followers,
    following
  );
  userCard.append(img, cardInfo);
  return userCard;
}

// Add the user card to the DOM
function addUser(user) {
  const container = document.querySelector('.cards');
  const userCard = githubUserCard(user);
  container.append(userCard);
}

// Fetch and display follower cards
function followersData(followers_url) {
  return axios.get(followers_url);
}

function addToDom(followers) {
  const container = document.querySelector('.cards');
  const followerPromises = followers.map((follower) =>
    axios.get(`https://api.github.com/users/${follower.login}`)
  );

  // Wait for all follower data to load
  Promise.all(followerPromises)
    .then((followerResponses) => {
      followerResponses.forEach((response) => {
        const followerCard = githubUserCard(response.data);
        container.append(followerCard);
      });
    })
    .catch((error) => {
      console.error('Error fetching follower data:', error);
    });
}

// Main logic: Fetch user data and display their card and follower cards
const username = 'Abdiqani-hashi';

fetchGitHubData(username)
  .then((user_Data) => {
    addUser(user_Data);
    followersData(user_Data.followers_url).then((followers) => {
      addToDom(followers.data); // Append follower cards
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    // Optionally display an error message to the user in the UI.
    const container = document.querySelector('.cards');
    const errorMessage = document.createElement('p');
    errorMessage.textContent =
      'Failed to fetch GitHub data. Please try again later.';
    container.append(errorMessage);
  });
