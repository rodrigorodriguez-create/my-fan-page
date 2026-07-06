/*====================================================
                FAKEBOOK
        Final Exposition - Rodrigo
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("Fakebook loaded successfully.");

    initLikeButtons();
    initNavigation();
    initSearch();
    initStarfield();
    initScrollReveal();
    initNotifications();
    initComments();
    initLightbox();
    initFeedVideoAutoplay();
    initConnectButtons();
    initSuggestionCardExpand();

});


/*====================================================
                SUGGESTION CARD EXPAND
=====================================================*/

function initSuggestionCardExpand() {

    const cards = document.querySelectorAll(".suggestion-card");
    if (!cards.length) return;

    const overlay = document.createElement("div");
    overlay.className = "card-overlay hidden";
    overlay.innerHTML = `
        <div class="card-overlay-content">
            <button class="card-overlay-close" title="Close"><i class="fa-solid fa-xmark"></i></button>
            <div class="card-overlay-photo"><img alt=""></div>
            <div class="card-overlay-info">
                <h2></h2>
                <span></span>
            </div>
            <div class="card-overlay-actions">
                <button class="btn-connect"><i class="fa-solid fa-user-plus"></i> Connect</button>
                <button class="btn-remove"><i class="fa-solid fa-xmark"></i> Remove</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector(".card-overlay-photo img");
    const overlayName = overlay.querySelector(".card-overlay-info h2");
    const overlayMutual = overlay.querySelector(".card-overlay-info span");
    const overlayClose = overlay.querySelector(".card-overlay-close");
    const overlayConnect = overlay.querySelector(".card-overlay-actions .btn-connect");
    const overlayRemove = overlay.querySelector(".card-overlay-actions .btn-remove");

    function syncConnectLabel(button, connected) {
        button.classList.toggle("connected", connected);
        button.innerHTML = connected
            ? `<i class="fa-solid fa-check"></i> Requested`
            : `<i class="fa-solid fa-user-plus"></i> Connect`;
    }

    function openCard(card) {

        const photo = card.querySelector(".suggestion-photo img");
        const name = card.querySelector(".suggestion-info h3")?.textContent || "";
        const mutual = card.querySelector(".suggestion-info span")?.textContent || "";
        const cardConnectBtn = card.querySelector(".btn-connect");

        overlayImg.src = photo ? (photo.currentSrc || photo.src) : "";
        overlayImg.alt = name;
        overlayName.textContent = name;
        overlayMutual.textContent = mutual;

        syncConnectLabel(overlayConnect, cardConnectBtn ? cardConnectBtn.classList.contains("connected") : false);

        overlay._sourceCard = card;
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";

    }

    function closeCard() {
        overlay.classList.add("hidden");
        document.body.style.overflow = "";
    }

    cards.forEach(card => {

        card.addEventListener("click", e => {
            if (e.target.closest("button")) return;
            openCard(card);
        });

    });

    overlayClose.addEventListener("click", closeCard);

    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeCard();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !overlay.classList.contains("hidden")) closeCard();
    });

    overlayConnect.addEventListener("click", () => {

        const connected = overlayConnect.classList.toggle("connected");
        syncConnectLabel(overlayConnect, connected);

        if (overlay._sourceCard) {
            const srcBtn = overlay._sourceCard.querySelector(".btn-connect");
            if (srcBtn) syncConnectLabel(srcBtn, connected);
        }

    });

    overlayRemove.addEventListener("click", () => {

        if (overlay._sourceCard) {
            overlay._sourceCard.classList.add("dismissed");
        }
        closeCard();

    });

}


/*====================================================
                CONNECT / DISMISS BUTTONS
=====================================================*/

function initConnectButtons() {

    const cards = document.querySelectorAll(".suggestion-card");
    if (!cards.length) return;

    cards.forEach(card => {

        const connectBtn = card.querySelector(".btn-connect");
        const removeBtn = card.querySelector(".btn-remove");

        if (connectBtn) {

            connectBtn.addEventListener("click", () => {

                const connected = connectBtn.classList.toggle("connected");

                connectBtn.innerHTML = connected
                    ? `<i class="fa-solid fa-check"></i> Requested`
                    : `<i class="fa-solid fa-user-plus"></i> Connect`;

            });

        }

        if (removeBtn) {

            removeBtn.addEventListener("click", () => {
                card.classList.add("dismissed");
            });

        }

    });

}


/*====================================================
                MEDIA FALLBACK
=====================================================*/

function mediaFallback(el, label) {

    const wrapper = el.parentElement;
    if (!wrapper) return;

    wrapper.innerHTML = `
        <div class="media-placeholder">
            <i class="fa-solid fa-image"></i>
            <span>Missing file: assets/posts/${label}</span>
        </div>
    `;

}


/*====================================================
                LIGHTBOX (fullscreen viewer)
=====================================================*/

function initLightbox() {

    const mediaItems = document.querySelectorAll(".post-image img, .post-image video, .gallery-item img, .photo-placeholder img");
    if (!mediaItems.length) return;

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay hidden";
    overlay.innerHTML = `
        <button class="lightbox-close" title="Close"><i class="fa-solid fa-xmark"></i></button>
        <div class="lightbox-content"></div>
    `;
    document.body.appendChild(overlay);

    const content = overlay.querySelector(".lightbox-content");
    const closeBtn = overlay.querySelector(".lightbox-close");

    function openLightbox(media) {

        content.innerHTML = "";

        if (media.tagName === "IMG") {

            const img = document.createElement("img");
            img.src = media.currentSrc || media.src;
            img.alt = media.alt || "";
            content.appendChild(img);

        } else if (media.tagName === "VIDEO") {

            media.pause();

            const video = document.createElement("video");
            video.src = media.currentSrc || media.src;
            video.controls = true;
            video.autoplay = true;
            video.muted = false;
            video.playsInline = true;
            content.appendChild(video);

        }

        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        overlay.dataset.sourceMedia = "";
        overlay._sourceThumb = media;

    }

    function closeLightbox() {

        const video = content.querySelector("video");
        if (video) video.pause();

        if (overlay._sourceThumb && overlay._sourceThumb.tagName === "VIDEO") {
            overlay._sourceThumb.play().catch(() => {});
        }

        overlay.classList.add("hidden");
        content.innerHTML = "";
        document.body.style.overflow = "";

    }

    mediaItems.forEach(media => {
        media.addEventListener("click", e => {
            e.stopPropagation();
            openLightbox(media);
        });
    });

    closeBtn.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeLightbox();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeLightbox();
    });

}


/*====================================================
                FEED VIDEO AUTOPLAY ON SCROLL
=====================================================*/

function initFeedVideoAutoplay() {

    const videos = document.querySelectorAll(".feed-post video");
    if (!videos.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            const video = entry.target;

            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }

        });

    }, { threshold: 0.5 });

    videos.forEach(video => observer.observe(video));

}


/*====================================================
                NOTIFICATIONS
=====================================================*/

function initNotifications() {

    const toggleBtn = document.getElementById("notif-toggle");
    const dropdown = document.getElementById("notif-dropdown");

    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener("click", e => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", e => {
        if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
            dropdown.classList.add("hidden");
        }
    });

}


/*====================================================
                COMMENTS (FUNCTIONAL)
=====================================================*/

function initComments() {

    const posts = document.querySelectorAll("article.post");

    posts.forEach(post => {

        const commentBtn = post.querySelector(".post-actions button:nth-child(2)");
        const commentsPanel = post.querySelector(".comments");
        const commentInput = post.querySelector(".comment-input");
        const commentList = post.querySelector(".comment-list");
        const statsCounter = post.querySelector(".post-stats span:last-child");

        if (!commentBtn || !commentsPanel) return;

        commentBtn.addEventListener("click", () => {
            commentsPanel.classList.toggle("hidden");
            if (!commentsPanel.classList.contains("hidden") && commentInput) {
                commentInput.focus();
            }
        });

        if (!commentInput || !commentList) return;

        commentInput.addEventListener("keydown", e => {

            if (e.key !== "Enter") return;

            const text = commentInput.value.trim();
            if (!text) return;

            const comment = document.createElement("div");
            comment.className = "comment";
            comment.innerHTML = `
                <div class="comment-avatar"></div>
                <div class="comment-body">
                    <strong>You</strong>
                    <p></p>
                </div>
            `;
            comment.querySelector("p").textContent = text;

            commentList.appendChild(comment);
            commentInput.value = "";

            if (statsCounter && /comments?$/.test(statsCounter.textContent.trim())) {
                const match = statsCounter.textContent.match(/\d+/);
                const count = match ? parseInt(match[0], 10) + 1 : 1;
                statsCounter.textContent = `${count} comments`;
            }

        });

    });

}


/*====================================================
                STARFIELD BACKGROUND
=====================================================*/

function initStarfield() {

    const canvas = document.getElementById("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createStars();
    }

    function createStars() {
        const count = Math.floor((canvas.width * canvas.height) / 9000);
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.4 + 0.3,
            baseAlpha: Math.random() * 0.6 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            phase: Math.random() * Math.PI * 2
        }));
    }

    function draw(time) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {

            const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);
            const alpha = star.baseAlpha + twinkle * 0.3;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
            ctx.fill();

        });

        requestAnimationFrame(draw);

    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);

}


/*====================================================
                SCROLL REVEAL
=====================================================*/

function initScrollReveal() {

    const revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length || !("IntersectionObserver" in window)) {
        revealItems.forEach(item => item.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const target = entry.target;
                target.classList.add("in-view");
                obs.unobserve(target);

                target.addEventListener("animationend", () => {
                    target.classList.remove("reveal", "in-view");
                }, { once: true });

            }

        });

    }, { threshold: 0.15 });

    revealItems.forEach(item => observer.observe(item));

}


/*====================================================
                LIKE BUTTONS
=====================================================*/

function initLikeButtons() {

    const likeButtons = document.querySelectorAll(".post-actions button:first-child");

    likeButtons.forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("liked");

            const icon = button.querySelector("i");

            if (button.classList.contains("liked")) {

                button.innerHTML = `
                    <i class="fa-solid fa-thumbs-up"></i>
                    Liked
                `;

            } else {

                button.innerHTML = `
                    <i class="fa-regular fa-thumbs-up"></i>
                    Like
                `;

            }

        });

    });

}


/*====================================================
                NAVIGATION
=====================================================*/

function initNavigation() {

    const navLinks = document.querySelectorAll(".left-sidebar li a");

    navLinks.forEach(link => {

        link.addEventListener("click", e => {

            if (link.getAttribute("href") === "#") {
                e.preventDefault();
            }

            navLinks.forEach(item =>
                item.classList.remove("active")
            );

            link.classList.add("active");

        });

    });

}


/*====================================================
                SEARCH
=====================================================*/

function initSearch() {

    const input = document.querySelector(".search input");

    input.addEventListener("focus", () => {

        input.placeholder = "";

    });

    input.addEventListener("blur", () => {

        input.placeholder = "Search Fakebook";

    });

}


/*====================================================
            FUTURE FUNCTIONS
=====================================================*/

// Dark Mode

function toggleDarkMode(){

}


// Comments

function openComments(){

}


// Share

function sharePost(){

}


// Notifications

function notifications(){

}


// Messenger

function messenger(){

}


// Profile

function openProfile(){

}