const user_data = {
  username: 'KodingNYoung'
}
const headers = {
  "Content-Type": "application/json",
}

const requestBody = JSON.stringify({
  query: `
  query { 
    user(login: "KodingNYoung") {
      bio,
      name,
      login,
      avatarUrl,
      repositories (first: 20, affiliations: [OWNER], ,orderBy: {field: PUSHED_AT, direction:DESC }) {
        totalCount,
        edges{
          node {
            name,
            url,
            isFork,
            description,
            repositoryTopics (first:5) {
              nodes{
                topic {
                  name
                }
              }
            },
            primaryLanguage{
              name
                color
            },
            stargazerCount,
            forkCount,
            licenseInfo {
              name
            },
            pushedAt,
            parent {
              url
              nameWithOwner
            }
          }
        }
      }
    }
  }    `
});

const fetchDetails = async () => {
  const res = await fetch('/github', { method: "POST", headers: headers, body: requestBody})

  if (!res.ok) {
    throw new Error('Couldn\'t get the data, :(')
  }else {
    const data = await res.json();
    return data.data.data.user;
  }
}


// create a UI class to take charge of all the DOM injections
class UI {
  constructor() {
    this.UIavatars = document.querySelectorAll('.profile-img');
    this.UIbios = document.querySelectorAll('.user-bio');
    this.UIusernames = document.querySelectorAll('.username');
    this.UInames = document.querySelectorAll('.name');
    this.UIRepoCounts = document.querySelectorAll('.repo-count')
    this.UIRepoList = document.querySelectorAll('.repositories');
  }
  
  setAvatarsUrl = src => {
    this.UIavatars.forEach(avatar => {
      avatar.src = src;
    })
  }

  setUserBio = bio => {
    this.UIbios.forEach(UIbio => {
      UIbio.textContent= bio;
    })
  }
  setUsername = username => {
    this.UIusernames.forEach(name => {
      name.textContent = username;
    })
  }
  setNames = name => {
    this.UInames.forEach(UIname => {
      UIname.textContent = name;
    })
  }

  setRepoCount = count => {
    this.UIRepoCounts.forEach(repoCount => {
      repoCount.textContent = count;
    })
  }
  generateTopicBadges = topics => {
    
    let topicBadges = '';
    topics.forEach(topic => {
      topicBadges +=  ` 
      <a href="#" class="topic-badge">
        <small>${topic.topic.name}</small>
      </a>`
    })

    return `<div class="topics">${topicBadges}</div>`
  }
  generateDominantLang = language => {
    if (language === null) return '';
    
    return `
    <span class="dominant-lang">
      <span class="circle" style="background-color: ${language.color};"></span>
      <span> ${language.name} </span>
    </span>
    `
  }
  getStarCountEl = starcount => {
    if (!starcount) return '';

    return `
    <a href="#" class="star-count">
    <svg height="16" viewBox="0 -10 511.98685 511" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="m114.59375 491.140625c-5.609375 0-11.179688-1.75-15.933594-5.1875-8.855468-6.417969-12.992187-17.449219-10.582031-28.09375l32.9375-145.089844-111.703125-97.960937c-8.210938-7.167969-11.347656-18.519532-7.976562-28.90625 3.371093-10.367188 12.542968-17.707032 23.402343-18.710938l147.796875-13.417968 58.433594-136.746094c4.308594-10.046875 14.121094-16.535156 25.023438-16.535156 10.902343 0 20.714843 6.488281 25.023437 16.511718l58.433594 136.769532 147.773437 13.417968c10.882813.980469 20.054688 8.34375 23.425782 18.710938 3.371093 10.367187.253906 21.738281-7.957032 28.90625l-111.703125 97.941406 32.9375 145.085938c2.414063 10.667968-1.726562 21.699218-10.578125 28.097656-8.832031 6.398437-20.609375 6.890625-29.910156 1.300781l-127.445312-76.160156-127.445313 76.203125c-4.308594 2.558594-9.109375 3.863281-13.953125 3.863281zm141.398438-112.875c4.84375 0 9.640624 1.300781 13.953124 3.859375l120.277344 71.9375-31.085937-136.941406c-2.21875-9.746094 1.089843-19.921875 8.621093-26.515625l105.472657-92.5-139.542969-12.671875c-10.046875-.917969-18.6875-7.234375-22.613281-16.492188l-55.082031-129.046875-55.148438 129.066407c-3.882812 9.195312-12.523438 15.511718-22.546875 16.429687l-139.5625 12.671875 105.46875 92.5c7.554687 6.613281 10.859375 16.769531 8.621094 26.539062l-31.0625 136.9375 120.277343-71.914062c4.308594-2.558594 9.109376-3.859375 13.953126-3.859375zm-84.585938-221.847656s0 .023437-.023438.042969zm169.128906-.0625.023438.042969c0-.023438 0-.023438-.023438-.042969zm0 0"/>
    </svg>
    <span class="count">${starcount}</span>
  </a>
    `
  }
  getForkCountEl = (forkcount) => {
    if (!forkcount) return '';

    return `
    <a href="#" class="fork-count">
      <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img">
        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
      </svg>
      <span class="count">3</span>
    </a>
    `
  }
  getLicenseEl = (license) => {
    if (license === null) return '';

    return `
    <span>
      <svg class="octicon octicon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path>
      </svg>
      <span class="license">${license.name}</span>
    </span>
    `
  }
  getRepoDesc = desc => {
    if (desc === null) return '';

    return `
      <p class="repo-desc">${desc}</p>
    `
  }

  getRepoForkEl = parent => {
    if (parent === null) return '';

    return `
      
    <small class="fork-detail">Forked from <a href="${parent.url}">${parent.nameWithOwner}</a></small> 
    `
  }
  generateRepoString = repo => {
    let repoString = '';

    const heading = `<p class="repo-name"><a href="${repo.node.url}">${repo.node.name}</a></p>`;
    const fork = this.getRepoForkEl(repo.node.parent);
    const desc = this.getRepoDesc(repo.node.description);
    const topicBadges = this.generateTopicBadges(repo.node.repositoryTopics.nodes); 
    const dominantLang = this.generateDominantLang(repo.node.primaryLanguage);
    const starCount = this.getStarCountEl(repo.node.stargazerCount);
    const forkCount = this.getForkCountEl(repo.node.forkCount);
    const licenseEl = this.getLicenseEl(repo.node.licenseInfo);
    const updateTime = new Date(repo.node.pushedAt).toLocaleDateString('default', { day: 'numeric', month: 'short' });


    repoString = `
    <div class="repository">
      <div class="left">
        ${heading}
        ${fork}
        ${desc}
        ${topicBadges}
        <footer>
          ${dominantLang}    
          ${starCount}
          ${forkCount}
          ${licenseEl}
          <span class="updated-on">Updated on ${updateTime}</span>
        </footer>
      </div>
      <div class="right">
        <button class="star-repo-action">
          <svg height="16" viewBox="0 -10 511.98685 511" width="16" xmlns="http://www.w3.org/2000/svg">
            <path d="m114.59375 491.140625c-5.609375 0-11.179688-1.75-15.933594-5.1875-8.855468-6.417969-12.992187-17.449219-10.582031-28.09375l32.9375-145.089844-111.703125-97.960937c-8.210938-7.167969-11.347656-18.519532-7.976562-28.90625 3.371093-10.367188 12.542968-17.707032 23.402343-18.710938l147.796875-13.417968 58.433594-136.746094c4.308594-10.046875 14.121094-16.535156 25.023438-16.535156 10.902343 0 20.714843 6.488281 25.023437 16.511718l58.433594 136.769532 147.773437 13.417968c10.882813.980469 20.054688 8.34375 23.425782 18.710938 3.371093 10.367187.253906 21.738281-7.957032 28.90625l-111.703125 97.941406 32.9375 145.085938c2.414063 10.667968-1.726562 21.699218-10.578125 28.097656-8.832031 6.398437-20.609375 6.890625-29.910156 1.300781l-127.445312-76.160156-127.445313 76.203125c-4.308594 2.558594-9.109375 3.863281-13.953125 3.863281zm141.398438-112.875c4.84375 0 9.640624 1.300781 13.953124 3.859375l120.277344 71.9375-31.085937-136.941406c-2.21875-9.746094 1.089843-19.921875 8.621093-26.515625l105.472657-92.5-139.542969-12.671875c-10.046875-.917969-18.6875-7.234375-22.613281-16.492188l-55.082031-129.046875-55.148438 129.066407c-3.882812 9.195312-12.523438 15.511718-22.546875 16.429687l-139.5625 12.671875 105.46875 92.5c7.554687 6.613281 10.859375 16.769531 8.621094 26.539062l-31.0625 136.9375 120.277343-71.914062c4.308594-2.558594 9.109376-3.859375 13.953126-3.859375zm-84.585938-221.847656s0 .023437-.023438.042969zm169.128906-.0625.023438.042969c0-.023438 0-.023438-.023438-.042969zm0 0"/>
          </svg>
          <span>star</span>
        </button>
      </div>
    </div>
    `
    return repoString;
  }

  renderRepositories = repos => {
    let repoStrings = '';

    repos.forEach(repo => {
      repoStrings += this.generateRepoString(repo);
    })

    this.UIRepoList.forEach(UIRepo => {
      UIRepo.innerHTML = repoStrings;
    })
  }
}

const handleUiInjection = (user) => {
  const ui = new UI();
  console.log(user.repositories.edges);

  ui.setAvatarsUrl(user.avatarUrl);
  ui.setUserBio(user.bio);
  ui.setUsername(user.login);
  ui.setNames(user.name);
  ui.setRepoCount(user.repositories.totalCount)
  ui.renderRepositories(user.repositories.edges);
} 

fetchDetails()
  .then(data => handleUiInjection(data))
  // .catch(err => console.log(err))