document.addEventListener("DOMContentLoaded", async () => {
    const languageSelect = document.getElementById("language");
    const fetchRepoButton = document.getElementById("fetch-repo");
    const refreshRepoButton = document.getElementById("refresh-repo");
    const repoInfo = document.getElementById("repo-info");
    const repoName = document.getElementById("repo-name");
    const repoDescription = document.getElementById("repo-description");
    const repoStars = document.getElementById("repo-stars");
    const repoForks = document.getElementById("repo-forks");
    const repoIssues = document.getElementById("repo-issues");
    const repoLink = document.getElementById("repo-link");
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    let isFetching = false;

    const loadLanguages = async () => {
        try {
            console.log("🔄 Loading languages...");
            const response = await fetch(
                "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
            );

            if (!response.ok) throw new Error(`Failed to fetch languages: ${response.status}`);

            const languages = await response.json();
            console.log("✅ Fetched Languages JSON:", languages);

            languageSelect.innerHTML = '<option value="">Select a Language</option>';

            languages.forEach((lang) => {
                if (lang.title) {
                    const option = document.createElement("option");
                    option.value = lang.value || lang.title.toLowerCase();
                    option.textContent = lang.title;
                    languageSelect.appendChild(option);
                }
            });

            console.log("✅ Dropdown populated successfully!");
        } catch (err) {
            console.error("❌ Error loading languages:", err);
            languageSelect.innerHTML = '<option value="">Failed to load</option>';
        }
    };

    const fetchRandomRepo = async () => {
        if (isFetching) return;
        isFetching = true;

        const selectedLanguage = languageSelect.value;
        if (!selectedLanguage) {
            alert("Please select a language");
            isFetching = false;
            return;
        }

        loading.classList.remove('hidden');
        error.classList.add('hidden');
        repoInfo.classList.add('hidden');

        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc`);
            if (!response.ok) throw new Error(`Failed to fetch repositories: ${response.status}`);
            
            const data = await response.json();

            if (!data.items.length) throw new Error('No repositories found');

            const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
            repoName.textContent = randomRepo.name;
            repoDescription.textContent = randomRepo.description || 'No description available';
            repoStars.textContent = `⭐ ${randomRepo.stargazers_count}`;
            repoForks.textContent = `🍴 ${randomRepo.forks_count}`;
            repoIssues.textContent = `🔧 ${randomRepo.open_issues_count}`;
            repoLink.href = randomRepo.html_url;

            repoInfo.classList.remove('hidden');
            loading.classList.add('hidden');
        } catch (err) {
            console.error("❌ Error fetching repository:", err);
            loading.classList.add('hidden');
            error.classList.remove('hidden');
        } finally {
            isFetching = false;
        }
    };

    fetchRepoButton.addEventListener('click', fetchRandomRepo);
    refreshRepoButton.addEventListener('click', fetchRandomRepo);

    await loadLanguages();
});
