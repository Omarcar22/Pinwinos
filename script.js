// Consolidated script: splash modal, search, todos, animations, item states

// Wait for Firebase to initialize
let firebaseReady = false;
if (typeof firebase !== 'undefined') {
    // Initialize app after DOM is ready so DOM refs (todoList, etc.) exist
    firebaseReady = true;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            try { firebase.auth().signInAnonymously().catch(()=>{}); } catch(e){}
            initializeApp();
        });
    } else {
        try { firebase.auth().signInAnonymously().catch(()=>{}); } catch(e){}
        initializeApp();
    }
} else {
    // Fallback if Firebase is not available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            firebaseReady = true;
            initializeApp();
        }, 1000);
    });
}

function initializeApp() {
    // Try to sign in anonymously but don't block initialization
    if (typeof firebase !== 'undefined' && firebase.auth) {
        try { firebase.auth().signInAnonymously().catch(()=>{}); } catch(e){}
    }

    loadTodos();
    loadItemStates();
    initItemStates();
    getCustomPlans();
}

// --- Surprise Button Functionality ---
const surpriseBtn = document.getElementById('surpriseBtn');

function createConfetti() {
    const confettiPieces = 50;
    const emojis = ['💕', '💖', '💗', '💝', '✨', '🌹', '💐', '🎉', '🎊', '😍', '💑'];
    
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.animation = `fall ${Math.random() * 2 + 3}s ease-in forwards`;
        confetti.style.animationDelay = (i * 0.05) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

function createHearts() {
    const hearts = 20;
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '💕';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '50%';
        heart.style.animation = `float-up ${Math.random() * 2 + 2}s ease-out forwards`;
        heart.style.animationDelay = (i * 0.1) + 's';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }
}

function triggerSurprise() {
    createConfetti();
    createHearts();
    
    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
    
    // Message popup
    showLoveMessage();
    
    // Button animation
    surpriseBtn.style.animation = 'none';
    setTimeout(() => {
        surpriseBtn.style.animation = 'pulse 2s ease-in-out infinite';
    }, 100);
}

function showLoveMessage() {
    const messages = [
        '¡Te amo de aquí a la Luna! ',
        '¡Eres más fuerte de lo que crees! ',
        '¡Te elegiría una y mil veces! ',
        '¡Siempre vas a tener una gran parte de mi corazón! ',
        '¡Juntos! ',
        '¡Mua Mua Mua Mua Mua Mua! ',
        '¡Te voy a comer el chocho! '

    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    // Random position (top, bottom, left, right, or center)
    const positions = [
        { top: '10%', left: '50%', transform: 'translate(-50%, 0)' },      // top center
        { top: '50%', left: '10%', transform: 'translate(0, -50%)' },      // left center
        { top: '50%', right: '10%', left: 'auto', transform: 'translate(0, -50%)' }, // right center
        { bottom: '10%', left: '50%', top: 'auto', transform: 'translate(-50%, 0)' }, // bottom center
        { top: '20%', left: '20%', transform: 'translate(-50%, -50%)' },    // top left
        { top: '20%', right: '20%', left: 'auto', transform: 'translate(50%, -50%)' }, // top right
        { bottom: '20%', left: '20%', top: 'auto', transform: 'translate(-50%, 50%)' }, // bottom left
        { bottom: '20%', right: '20%', left: 'auto', top: 'auto', transform: 'translate(50%, 50%)' } // bottom right
    ];
    
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    
    const popup = document.createElement('div');
    popup.className = 'love-popup';
    popup.textContent = message;
    
    // Apply random position
    Object.assign(popup.style, randomPos);
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
}

if (surpriseBtn) {
    surpriseBtn.addEventListener('click', triggerSurprise);
}

// --- Splash Modal Functionality (safe guards if elements missing) ---
const splashModal = document.getElementById('splashModal');
const splashClose = document.getElementById('splashClose');
const splashButton = document.getElementById('splashButton');

function closeSplashModal() {
    if (!splashModal) return;
    splashModal.classList.add('hidden');
}

if (splashModal) {
    // always show modal on page load
    splashModal.classList.remove('hidden');

    if (splashClose) splashClose.addEventListener('click', closeSplashModal);
    if (splashButton) splashButton.addEventListener('click', closeSplashModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !splashModal.classList.contains('hidden')) {
            closeSplashModal();
        }
    });
}

// --- Search Functionality ---
const searchInput = document.getElementById('searchInput');
const sections = document.querySelectorAll('.content-section');

if (searchInput) {
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();

        sections.forEach(section => {
            const sectionItems = section.querySelectorAll('.item, .plan-card, .memory-card, .todo-item');
            let visibleInSection = false;

            sectionItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.classList.remove('hidden');
                    visibleInSection = true;
                } else {
                    item.classList.add('hidden');
                }
            });

            if (searchTerm === '') {
                section.classList.remove('hidden');
                sectionItems.forEach(item => item.classList.remove('hidden'));
            } else if (visibleInSection) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    });
}

// --- To Do Functionality with Firebase ---
const todoInput = document.getElementById('todoInput');
const todoAddBtn = document.querySelector('.todo-add-btn');
const todoList = document.getElementById('todoList');

function loadTodos() {
    if (!todoList || !db) return;
    db.ref('todos').on('value', snapshot => {
        const data = snapshot.val();
        todoList.innerHTML = '';
        if (data) {
            Object.entries(data).forEach(([key, todo]) => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.setAttribute('data-id', key);
                li.setAttribute('data-completed', todo.completed ? 'true' : 'false');
                li.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span>${todo.text}</span>
                    <button class="todo-delete">✕</button>
                `;
                todoList.appendChild(li);
                attachTodoListeners(li, key);
            });
        }
    });
}

function saveTodos() {
    if (!db) return;
    const todos = {};
    document.querySelectorAll('.todo-item').forEach(item => {
        const id = item.getAttribute('data-id');
        const checkbox = item.querySelector('input[type="checkbox"]');
        const span = item.querySelector('span');
        if (id) {
            todos[id] = { text: span.textContent, completed: checkbox.checked };
        }
    });
    db.ref('todos').set(todos).catch(e => console.error('Error saving todos', e));
}

function addTodo() {
    if (!todoInput || !todoList || !db) return;
    const todoText = todoInput.value.trim();
    if (todoText === '') { alert('¡Por favor escribe una tarea!'); return; }

    const newId = 'todo-' + Date.now();
    db.ref('todos/' + newId).set({ text: todoText, completed: false })
        .then(() => {
            todoInput.value = '';
        })
        .catch(e => console.error('Error adding todo', e));
}

function attachTodoListeners(item, id) {
    if (!item) return;
    const checkbox = item.querySelector('input[type="checkbox"]');
    const deleteBtn = item.querySelector('.todo-delete');
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            if (db && id) {
                db.ref('todos/' + id + '/completed').set(checkbox.checked)
                    .catch(e => console.error('Error updating todo', e));
            }
        });
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            if (db && id) {
                setTimeout(() => {
                    db.ref('todos/' + id).remove()
                        .catch(e => console.error('Error deleting todo', e));
                }, 300);
            }
        });
    }
}

if (todoAddBtn) todoAddBtn.addEventListener('click', addTodo);
if (todoInput) todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

// loadTodos() will be called from initializeApp() after Firebase is ready

// --- Smooth scrolling for anchors ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// --- Intersection observer animations ---
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.item, .plan-card, .memory-card').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease';
    observer.observe(item);
});

// click animation for cards (non-item cards)
document.querySelectorAll('.plan-card, .memory-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => { this.style.transform = ''; }, 150);
    });
});

// search button focus
const searchBtn = document.querySelector('.search-btn');
if (searchBtn && searchInput) searchBtn.addEventListener('click', () => searchInput.focus());

// --- Item 3-state functionality (Pendiente -> En curso -> Visto) with Firebase ---
const ITEM_STATE_KEY = 'itemStates';
let itemStates = {};

function loadItemStates() {
    if (!db) {
        itemStates = {};
        initItemStates();
        return itemStates;
    }

    db.ref('itemStates').on('value', snapshot => {
        itemStates = snapshot.val() || {};

        // Update visuals for all existing items when states change
        document.querySelectorAll('.item, .plan-card').forEach(item => {
            const id = item.dataset.id;
            if (!id) return;
            const current = itemStates[id] || 'pending';
            updateItemVisual(item, current, false);
        });

        // Ensure listeners are attached (idempotent)
        initItemStates();
    });

    return itemStates;
}

function saveItemStates(states) {
    if (!db) return;
    db.ref('itemStates').set(states).catch(e => console.error('Error saving item states', e));
}

function updateItemVisual(item, state, showBadge = true) {
    item.classList.remove('state-pending', 'state-progress', 'state-seen');
    if (state === 'pending') item.classList.add('state-pending');
    if (state === 'progress') item.classList.add('state-progress');
    if (state === 'seen') item.classList.add('state-seen');

    let badge = item.querySelector('.status-badge');
    if (showBadge) {
        if (!badge) { badge = document.createElement('div'); badge.className = 'status-badge'; item.appendChild(badge); }
        if (state === 'pending') badge.textContent = 'Pendiente';
        else if (state === 'progress') badge.textContent = 'En curso';
        else if (state === 'seen') badge.textContent = 'Visto ✓';
    } else {
        if (badge) badge.remove();
    }
}

const NEXT_STATE = { 'pending': 'progress', 'progress': 'seen', 'seen': 'pending' };

function initItemStates(){
    // Apply to both .item and .plan-card elements
    document.querySelectorAll('.item, .plan-card').forEach(item => {
        const id = item.dataset.id;
        if (!id) return; // skip items without id
        const current = itemStates[id] || 'pending';
        updateItemVisual(item, current, false); // Don't show badge on load

        item.style.cursor = 'pointer';
        // avoid attaching multiple listeners
        if (item.dataset.stateInit === 'true') return;
        item.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const prev = itemStates[id] || 'pending';
            const next = NEXT_STATE[prev] || 'pending';
            itemStates[id] = next;
            updateItemVisual(item, next, true); // Show badge on click
            saveItemStates(itemStates);
        });
        item.dataset.stateInit = 'true';
    });
}

// --- Add new movies/series functionality with Firebase ---
const addPlanBtn = document.getElementById('addPlanBtn');
const addPlanModal = document.getElementById('addPlanModal');
const closePlanModal = document.getElementById('closePlanModal');
const cancelPlanBtn = document.getElementById('cancelPlanBtn');
const savePlanBtn = document.getElementById('savePlanBtn');
const planEmojiInput = document.getElementById('planEmoji');
const planTitleInput = document.getElementById('planTitle');
const planDescriptionInput = document.getElementById('planDescription');
const plansGrid = document.querySelector('.plans-grid');

const PLANS_KEY = 'customPlans';

function getCustomPlans() {
    if (!db) return [];
    db.ref('customPlans').on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            Object.entries(data).forEach(([key, plan]) => {
                const existingCard = document.querySelector(`[data-id="${key}"]`);
                if (!existingCard && plansGrid) {
                    const card = createPlanCard(plan.emoji, plan.title, plan.description, key);
                    plansGrid.appendChild(card);
                }
            });
        }
    });
    return [];
}

function saveCustomPlans(plans) {
    if (!db) return;
    db.ref('customPlans').set(plans).catch(e => console.error('Error saving plans', e));
}

function openPlanModal() {
    if (addPlanModal) addPlanModal.classList.remove('hidden');
}

function closePlanModalFn() {
    if (addPlanModal) addPlanModal.classList.add('hidden');
    planEmojiInput.value = '';
    planTitleInput.value = '';
    planDescriptionInput.value = '';
}

function createPlanCard(emoji, title, description, id) {
    const card = document.createElement('div');
    card.className = 'plan-card';
    card.setAttribute('data-id', id);
    card.innerHTML = `
        <div class="plan-icon">${emoji}</div>
        <h3>${title}</h3>
        <p class="plan-description">${description}</p>
    `;

    // attach click listener for state cycling
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const states = loadItemStates();
        const prev = states[id] || 'pending';
        const next = NEXT_STATE[prev] || 'pending';
        states[id] = next;
        updateItemVisual(card, next);
        saveItemStates(states);
    });

    // initialize state
    const states = loadItemStates();
    const current = states[id] || 'pending';
    updateItemVisual(card, current, false); // Don't show badge on creation

    return card;
}

function addNewPlan() {
    const emoji = planEmojiInput.value.trim();
    const title = planTitleInput.value.trim();
    const description = planDescriptionInput.value.trim();

    if (!emoji || !title || !description) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (!db || !plansGrid) return;

    // create new plan with unique ID
    const newId = 'custom-' + Date.now();
    const newPlan = { emoji, title, description };
    
    // save to Firebase
    db.ref('customPlans/' + newId).set(newPlan)
        .then(() => {
            // add card to grid
            const card = createPlanCard(emoji, title, description, newId);
            plansGrid.appendChild(card);
            closePlanModalFn();
        })
        .catch(e => console.error('Error adding plan', e));
}

// attach modal listeners
if (addPlanBtn) addPlanBtn.addEventListener('click', openPlanModal);
if (closePlanModal) closePlanModal.addEventListener('click', closePlanModalFn);
if (cancelPlanBtn) cancelPlanBtn.addEventListener('click', closePlanModalFn);
if (savePlanBtn) savePlanBtn.addEventListener('click', addNewPlan);

// close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addPlanModal && !addPlanModal.classList.contains('hidden')) {
        closePlanModalFn();
    }
});

// load custom plans on page load from Firebase
(function loadCustomPlans() {
    if (!db) return;
    db.ref('customPlans').on('value', snapshot => {
        const data = snapshot.val();
        // clear existing custom cards
        document.querySelectorAll('[data-id^="custom-"]').forEach(card => {
            // only remove if not already in DOM with new data
            if (!card.hasAttribute('data-firebase-loaded')) {
                card.setAttribute('data-firebase-loaded', 'true');
            }
        });
        
        if (data) {
            Object.entries(data).forEach(([key, plan]) => {
                const existingCard = document.querySelector(`[data-id="${key}"]`);
                if (!existingCard && plansGrid) {
                    const card = createPlanCard(plan.emoji, plan.title, plan.description, key);
                    plansGrid.appendChild(card);
                }
            });
        }
    });
})();
