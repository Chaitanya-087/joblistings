window.addEventListener('load', () => {
    fetch('./data.json')
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('jobs',JSON.stringify(data))
    })
})

const jobs = JSON.parse(localStorage.getItem('jobs'))
localStorage.clear()

function displayJobs(jobs) {
    const jobsContainer = document.querySelector('.jobs');
    jobsContainer.innerHTML = jobs.map(job => {if (job) return `<div class='job ${job.featured ? "flag" : ""}'>${logo(job.logo)}${details(job)}${skills(job)}</div>`}).join('')
}

function logo(img) {
    return `
    <div class="logo-container">
        <img src=${img} alt="logo" class="logo">
    </div>
    `
}

function details(data) {
    return `
    <div class="details">
        <div class="top">
            <span class="company">${data.company}</span>
            ${data.new ? '<div class="recent">New!</div>':''}
            ${data.featured ?'<div class="featured">Featured</div>':''}
        </div>
        <div class="middle">
            <h2 class="position">${data.position}</h2>
        </div>
        <div class="bottom">
            <span class="postedAt">${data.postedAt}</span>
            <div class="dot"></div>
            <span class="contract">${data.contract}</span>
            <div class="dot"></div>
            <span class="location">${data.location}</span>
        </div>
    </div>
    `
}

function skills(data) {
    const skillSet = [data.role, data.level, ...data.languages]
    return `
    <div class="skills">
    ${skillSet.map(skill => `<div class="skill" onclick = addToFilter(this) >${skill}</div>`).join('')}
    </div>
    `
}

function filterJob(currFilters) {
    const filteredJobs = jobs.filter(job => {
        if ([...currFilters].every(filter => job.languages.includes(filter) || job.role === filter || job.level === filter)) return job
    })
    displayJobs(filteredJobs)
}

let currFilters = new Set()
const filterPick = document.querySelector('.filter-pick');

function showFilters(filters) {
    if (!filterPick.classList.contains('show')) {
        filterPick.classList.add('show')
    }
    if (filters.size === 0) filterPick.classList.remove('show')
    const filstr = [...filters].map(filter => `<div class="filter"><div class="filter-text">${filter}</div><div class="close" onclick="deleteFilter(this)"><img src="./images/icon-remove.svg" /></div></div>`).join('')
    const clearstr  = `<div class="clear" onclick="clearFilters()">Clear</div>`
    filterPick.innerHTML = `<div class = "filters-container"> ${filstr} </div> ${clearstr}`
}

function addToFilter(e) {
    filterPick.classList.add('show')
    currFilters.add(e.innerText)
    showFilters(currFilters)
    filterJob(currFilters)
}

function deleteFilter(e){
    currFilters.delete(e.parentElement.innerText)
    showFilters(currFilters)
    filterJob(currFilters)
}

function clearFilters() {
    currFilters.clear()
    showFilters(currFilters)
    filterJob(currFilters)
}

displayJobs(jobs)