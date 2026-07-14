/**
 * LocalHub State Management & Dynamic UI Engine
 * Vanilla JavaScript - Persistent client-side synchronization via localStorage
 */

// 1. Initial Static Data Seeds
const SEED_SERVICES = [
  {
    id: "svc-1",
    title: "Festive Wall Decorating",
    category: "home-decor",
    categoryLabel: "Home Decoration",
    price: 120,
    unit: "job",
    description: "Elegant, customized accent wall design and hanging setup for festivals, birthdays, or general home staging.",
    iconClass: "🎨"
  },
  {
    id: "svc-2",
    title: "Modern Living Room Staging",
    category: "home-decor",
    categoryLabel: "Home Decoration",
    price: 250,
    unit: "room",
    description: "Complete layout redesign, furniture placement strategy, and ambient light integration by professional home stylists.",
    iconClass: "🏡"
  },
  {
    id: "svc-3",
    title: "Custom Floating Shelves Setup",
    category: "home-decor",
    categoryLabel: "Home Decoration",
    price: 95,
    unit: "set",
    description: "Heavy-duty invisible floating shelves installation for books, plants, and showcase ornaments. Includes wall health-check.",
    iconClass: "📐"
  },
  {
    id: "svc-4",
    title: "Deep Home Cleaning",
    category: "cleaning",
    categoryLabel: "Cleaning Services",
    price: 150,
    unit: "house",
    description: "All-inclusive sterilization, vacuuming, window scraping, dust scrubbing, and deep kitchen/bathroom cleaning.",
    iconClass: "🧹"
  },
  {
    id: "svc-5",
    title: "Premium Carpet Wash",
    category: "cleaning",
    categoryLabel: "Cleaning Services",
    price: 80,
    unit: "carpet",
    description: "High-pressure hot water extraction and odor sanitizing for premium Turkish, Persian, or standard floor rugs.",
    iconClass: "🧼"
  },
  {
    id: "svc-6",
    title: "Kitchen Sanitization Service",
    category: "cleaning",
    categoryLabel: "Cleaning Services",
    price: 90,
    unit: "job",
    description: "Focused grease removing, oven interior degreasing, backsplash sterilization, and organic pest repellant spray.",
    iconClass: "✨"
  },
  {
    id: "svc-7",
    title: "Tesla Model 3 Long Range",
    category: "car-rentals",
    categoryLabel: "Car Rentals",
    price: 85,
    unit: "day",
    description: "Fully charged, autopilot-enabled luxury electric vehicle. Clean interior, smooth handling. Perfect for city or highway trips.",
    iconClass: "⚡"
  },
  {
    id: "svc-8",
    title: "Ford Bronco Outer Banks SUV",
    category: "car-rentals",
    categoryLabel: "Car Rentals",
    price: 110,
    unit: "day",
    description: "Tough four-wheel-drive SUV with open roof options. Ideal for weekend mountain excursions or highway cruising.",
    iconClass: "🚙"
  },
  {
    id: "svc-9",
    title: "Mustang GT Convertible V8",
    category: "car-rentals",
    categoryLabel: "Car Rentals",
    price: 140,
    unit: "day",
    description: "Unleash standard American horsepower with the soft-top convertible option. Stunning cherry red exterior, premium sound.",
    iconClass: "🏎️"
  }
];

const SEED_USERS = [
  {
    email: "customer@localhub.test",
    password: "password",
    name: "Charlie Customer",
    role: "customer"
  },
  {
    email: "provider@localhub.test",
    password: "password",
    name: "Dave Provider",
    role: "provider"
  }
];

const SEED_BOOKINGS = [
  {
    id: "LH-1001",
    customerName: "Alice Peterson",
    customerEmail: "alice@localhub.test",
    serviceId: "svc-4",
    serviceTitle: "Deep Home Cleaning",
    serviceCategory: "cleaning",
    price: 150,
    date: "2026-07-20",
    time: "10:00",
    status: "pending",
    createdAt: "2026-07-13T04:20:00Z",
    rating: null,
    reviewText: null
  },
  {
    id: "LH-1002",
    customerName: "Bob Henderson",
    customerEmail: "bob@localhub.test",
    serviceId: "svc-7",
    serviceTitle: "Tesla Model 3 Long Range",
    serviceCategory: "car-rentals",
    price: 85,
    date: "2026-07-10",
    time: "09:00",
    status: "completed",
    createdAt: "2026-07-10T09:15:00Z",
    rating: 5,
    reviewText: "Incredibly pristine car and stellar service! Highly recommended."
  }
];

// 2. State Engine Core API
const LocalHubStore = {
  init() {
    if (!localStorage.getItem("lh_services")) {
      localStorage.setItem("lh_services", JSON.stringify(SEED_SERVICES));
    }
    if (!localStorage.getItem("lh_users")) {
      localStorage.setItem("lh_users", JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem("lh_bookings")) {
      localStorage.setItem("lh_bookings", JSON.stringify(SEED_BOOKINGS));
    }
  },

  getServices() {
    return JSON.parse(localStorage.getItem("lh_services") || "[]");
  },

  getUsers() {
    return JSON.parse(localStorage.getItem("lh_users") || "[]");
  },

  getBookings() {
    return JSON.parse(localStorage.getItem("lh_bookings") || "[]");
  },

  saveBookings(bookings) {
    localStorage.setItem("lh_bookings", JSON.stringify(bookings));
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("lh_current_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem("lh_current_user", JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem("lh_current_user");
    window.location.href = "./index.html";
  },

  registerUser(name, email, password, role) {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Email already registered!" };
    }
    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem("lh_users", JSON.stringify(users));
    this.setCurrentUser({ name, email, role });
    return { success: true, user: newUser };
  },

  loginUser(email, password) {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      this.setCurrentUser({ name: found.name, email: found.email, role: found.role });
      return { success: true, user: found };
    }
    return { success: false, message: "Invalid email or password!" };
  },

  createBooking(customerName, customerEmail, serviceId, date, time) {
    const services = this.getServices();
    const service = services.find(s => s.id === serviceId);
    if (!service) return null;

    const bookings = this.getBookings();
    const nextIdNum = bookings.length > 0 
      ? Math.max(...bookings.map(b => parseInt(b.id.split("-")[1] || "1000"))) + 1 
      : 1001;
    
    const newBooking = {
      id: `LH-${nextIdNum}`,
      customerName,
      customerEmail,
      serviceId,
      serviceTitle: service.title,
      serviceCategory: service.category,
      price: service.price,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString(),
      rating: null,
      reviewText: null
    };

    bookings.push(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },

  updateBookingStatus(bookingId, status) {
    const bookings = this.getBookings();
    const found = bookings.find(b => b.id === bookingId);
    if (found) {
      found.status = status;
      this.saveBookings(bookings);
      return true;
    }
    return false;
  },

  submitReview(bookingId, rating, text) {
    const bookings = this.getBookings();
    const found = bookings.find(b => b.id === bookingId);
    if (found) {
      found.rating = parseInt(rating);
      found.reviewText = text;
      this.saveBookings(bookings);
      return true;
    }
    return false;
  }
};

// Initialize Store right away
LocalHubStore.init();

// 3. Shared Global DOM Controls
document.addEventListener("DOMContentLoaded", () => {
  setupNavbarUI();
});

function setupNavbarUI() {
  const user = LocalHubStore.getCurrentUser();
  const navAuthActions = document.getElementById("navAuthActions");
  
  if (navAuthActions) {
    if (user) {
      let dashboardUrl = "./customer.html";
      if (user.role === "provider") {
        dashboardUrl = "./provider.html";
      }
      
      navAuthActions.innerHTML = `
        <a href="${dashboardUrl}" class="nav-item">Dashboard</a>
        <div class="user-badge">
          <div class="user-dot"></div>
          <span>${user.name}</span>
        </div>
        <button id="logoutBtn" class="btn btn-sm btn-outline">Logout</button>
      `;

      document.getElementById("logoutBtn")?.addEventListener("click", () => {
        LocalHubStore.logout();
      });
    } else {
      navAuthActions.innerHTML = `
        <a href="./auth.html?tab=login" class="nav-item">Sign In</a>
        <a href="./auth.html?tab=register" class="btn btn-sm btn-primary">Join Marketplace</a>
      `;
    }
  }
}

// Helper to open dynamic notifications
function showToastNotification(message, type = "success") {
  const existing = document.querySelector(".lh-toast-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.className = `lh-toast-banner alert alert-${type === "success" ? "success" : "info"} pulse-glow`;
  banner.style.position = "fixed";
  banner.style.bottom = "20px";
  banner.style.right = "20px";
  banner.style.zIndex = "9999";
  banner.style.maxWidth = "350px";
  banner.style.boxShadow = "var(--shadow-xl)";
  banner.style.marginBottom = "0";

  banner.innerHTML = `
    <span style="font-size: 1.15rem">${type === 'success' ? '✔' : 'ℹ'}</span>
    <div>
      <strong style="display: block; font-size: 0.85rem">${type === 'success' ? 'Success' : 'Notice'}</strong>
      <span style="font-size: 0.8rem">${message}</span>
    </div>
  `;

  document.body.appendChild(banner);
  setTimeout(() => {
    banner.style.opacity = "0";
    banner.style.transition = "opacity 0.5s ease";
    setTimeout(() => banner.remove(), 500);
  }, 4000);
}

// Export modules securely to the window object so individual files can access them
window.LocalHubStore = LocalHubStore;
window.showToastNotification = showToastNotification;
