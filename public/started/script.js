// Function to create a star at the mouse position
function createStar(x, y) {
    const star = document.createElement('div');
    star.classList.add('star');
    document.body.appendChild(star);

    // Set the initial position of the star
    star.style.left = `${x - 2}px`; // Smaller center to reduce overlap
    star.style.top = `${y - 2}px`;  // Smaller center to reduce overlap

    // Remove the star after the animation is complete (0.6s)
    setTimeout(() => {
        star.remove();
    }, 600); // Shorter duration to remove stars faster
}

// Listen to mousemove event
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Create multiple stars per mousemove for a continuous trail
    createStar(mouseX, mouseY);
    // Optional: You can create more stars rapidly by calling the function multiple times
    setTimeout(() => {
        createStar(mouseX, mouseY);
    }, 50);  // Slightly offset to create even denser trail effect
});

// Function to scroll to the bottom of the page
function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Event listener to detect window resize
window.addEventListener('resize', function() {
    // Check if the window width is less than 768px (or any size you prefer)
    if (window.innerWidth <= 768) {
        scrollToBottom(); // Automatically scroll to the bottom
    }
});

// Smooth Scroll on Mouse Wheel
let scrollTimeout;

function smoothScrollHandler(event) {
    event.preventDefault(); // Prevent default scroll behavior

    // Determine scroll direction
    if (event.deltaY > 0) {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" }); // Scroll down
    } else {
        window.scrollBy({ top: -window.innerHeight, behavior: "smooth" }); // Scroll up
    }
}

// Attach the smooth scroll effect to mouse wheel event
window.addEventListener("wheel", smoothScrollHandler);


let getstarted = document.getElementById('getstarted');

getstarted.addEventListener("click",()=>{
    window.location.href = "land2.html"
})



