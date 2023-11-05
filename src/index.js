import Notiflix from 'notiflix'


const apiKey = '40489521-2d233b9ce133180f8f85686cd'; 
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let searchQuery = '';
let page = 0;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    page = 1; // Початкова сторінка при новому пошуку
    gallery.innerHTML = ''; // Очищення галереї
    searchQuery = e.target.searchQuery.value;
    searchImages(searchQuery, page);
});

loadMoreButton.addEventListener('click', () => {
    page++;
    searchImages(searchQuery, page);
});
if (page === 0) {
            loadMoreButton.style.display = 'none';
        }
async function searchImages(query, page) {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
        const data = await response.json();

        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }

        const totalHits = data.totalHits;
        const images = data.hits;

        images.forEach((image) => {
            const card = createImageCard(image);
            gallery.appendChild(card);
        });
        
        if (page === 1) {
            loadMoreButton.style.display = 'block';
        }
        

        if (page * 40 >= totalHits) {
            loadMoreButton.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function createImageCard(image) {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
        <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
    `;
    return card;
}


