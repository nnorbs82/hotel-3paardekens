/**
 * Room Manager Module for Hotel 3 Paardekens Admin Panel
 * Handles CRUD operations for room categories using localStorage
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_rooms';

  // Default rooms data (fallback if no custom data exists)
  const DEFAULT_ROOMS = [
    {
      id: 'single',
      name: 'Single Room',
      description: 'Comfortable single room, ideal for short business stays.',
      amenities: [
        { name: 'Single bed', icon: 'bed' },
        { name: 'TV', icon: 'tv' },
        { name: 'Private bathroom', icon: 'bathroom' },
        { name: 'City view', icon: 'view' },
        { name: 'Coffee/tea maker', icon: 'coffee' },
        { name: 'Heating', icon: 'heating' },
        { name: 'Wardrobe', icon: 'wardrobe' }
      ],
      photos: [
        { url: 'Rooms/Single/1.jpg', order: 1 },
        { url: 'Rooms/Single/2.jpg', order: 2 },
        { url: 'Rooms/Single/3.jpg', order: 3 },
        { url: 'Rooms/Single/4.jpg', order: 4 },
        { url: 'Rooms/Single/5.jpg', order: 5 },
        { url: 'Rooms/Single/6.jpg', order: 6 },
        { url: 'Rooms/Single/7.jpg', order: 7 }
      ],
      bookingUrl: 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6?mewsRoute=rooms'
    },
    {
      id: 'twin',
      name: 'Twin Room',
      description: 'Travelling with a friend? We have you. Twin beds in the middle of the city.',
      amenities: [
        { name: 'Twin beds', icon: 'bed' },
        { name: 'TV', icon: 'tv' },
        { name: 'Private bathroom', icon: 'bathroom' },
        { name: 'City view', icon: 'view' },
        { name: 'Coffee/tea maker', icon: 'coffee' },
        { name: 'Heating', icon: 'heating' },
        { name: 'Wardrobe', icon: 'wardrobe' }
      ],
      photos: [
        { url: 'Rooms/Twin/1.jpg', order: 1 },
        { url: 'Rooms/Twin/2.jpg', order: 2 },
        { url: 'Rooms/Twin/3.jpg', order: 3 },
        { url: 'Rooms/Twin/4.jpg', order: 4 }
      ],
      bookingUrl: 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6?mewsRoute=rooms'
    },
    {
      id: 'double',
      name: 'Double Room',
      description: 'Cosy getaway, or just need some extra space? Make it Double!',
      amenities: [
        { name: 'Double bed', icon: 'bed' },
        { name: 'TV', icon: 'tv' },
        { name: 'Private bathroom', icon: 'bathroom' },
        { name: 'City view', icon: 'view' },
        { name: 'Coffee/tea maker', icon: 'coffee' },
        { name: 'Heating', icon: 'heating' },
        { name: 'Wardrobe', icon: 'wardrobe' }
      ],
      photos: [
        { url: 'Rooms/Double/1.jpg', order: 1 },
        { url: 'Rooms/Double/2.jpg', order: 2 },
        { url: 'Rooms/Double/3.jpg', order: 3 },
        { url: 'Rooms/Double/4.jpg', order: 4 },
        { url: 'Rooms/Double/5.jpg', order: 5 },
        { url: 'Rooms/Double/6.jpg', order: 6 },
        { url: 'Rooms/Double/7.jpg', order: 7 },
        { url: 'Rooms/Double/8.jpg', order: 8 }
      ],
      bookingUrl: 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6?mewsRoute=rooms'
    }
  ];

  // Room Manager API
  window.RoomManager = {
    /**
     * Get all rooms
     * @returns {Array} Array of room objects
     */
    getRooms() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing stored rooms:', e);
          return DEFAULT_ROOMS;
        }
      }
      return DEFAULT_ROOMS;
    },

    /**
     * Get a single room by ID
     * @param {string} id - Room ID
     * @returns {object|null} Room object or null
     */
    getRoom(id) {
      const rooms = this.getRooms();
      return rooms.find(r => r.id === id) || null;
    },

    /**
     * Save all rooms to storage
     * @param {Array} rooms - Array of room objects
     */
    saveRooms(rooms) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    },

    /**
     * Create a new room
     * @param {object} roomData - Room data {name, description, amenities, photos, bookingUrl}
     * @returns {object} Created room with generated ID
     */
    createRoom(roomData) {
      const rooms = this.getRooms();
      const id = this._generateId(roomData.name);
      
      const newRoom = {
        id,
        name: roomData.name,
        description: roomData.description || '',
        amenities: roomData.amenities || [],
        photos: roomData.photos || [],
        bookingUrl: roomData.bookingUrl || 'https://app.mews.com/distributor/0a316d41-2e75-4b9d-b827-e77cd4fae3d6?mewsRoute=rooms'
      };

      rooms.push(newRoom);
      this.saveRooms(rooms);
      return newRoom;
    },

    /**
     * Update an existing room
     * @param {string} id - Room ID
     * @param {object} updates - Fields to update
     * @returns {boolean} True if successful
     */
    updateRoom(id, updates) {
      const rooms = this.getRooms();
      const index = rooms.findIndex(r => r.id === id);
      
      if (index === -1) return false;
      
      rooms[index] = {
        ...rooms[index],
        ...updates,
        id // Preserve original ID
      };
      
      this.saveRooms(rooms);
      return true;
    },

    /**
     * Delete a room
     * @param {string} id - Room ID
     * @returns {boolean} True if successful
     */
    deleteRoom(id) {
      const rooms = this.getRooms();
      const filtered = rooms.filter(r => r.id !== id);
      
      if (filtered.length === rooms.length) return false;
      
      this.saveRooms(filtered);
      return true;
    },

    /**
     * Reset rooms to default data
     */
    resetToDefaults() {
      this.saveRooms(DEFAULT_ROOMS);
    },

    /**
     * Generate a unique ID from room name
     * @private
     */
    _generateId(name) {
      if (!name || typeof name !== 'string') {
        name = 'room';
      }
      
      const base = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Ensure we have a valid base ID
      const validBase = base || 'room';
      
      const rooms = this.getRooms();
      let id = validBase;
      let counter = 1;
      
      while (rooms.some(r => r.id === id)) {
        id = `${validBase}-${counter}`;
        counter++;
      }
      
      return id;
    }
  };

  // Icon library for amenities
  window.IconLibrary = {
    bed: '<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M6 7v10"></path><path d="M18 7v10"></path><path d="M6 12h12"></path><path d="M8 17h8"></path><path d="M9 17v3"></path><path d="M15 17v3"></path></svg>',
    tv: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="10" rx="2"></rect><path d="M8 20h8"></path><path d="M12 16v4"></path></svg>',
    bathroom: '<svg viewBox="0 0 24 24"><path d="M7 6a5 5 0 0 1 10 0"></path><path d="M17 6v4"></path><path d="M7 10h10"></path><path d="M8 14h8"></path><path d="M9 18h6"></path><path d="M10 14v4"></path><path d="M14 14v4"></path></svg>',
    view: '<svg viewBox="0 0 24 24"><path d="M4 10h8a4 4 0 0 1 4 4v2H9a5 5 0 0 1-5-5v-1z"></path><path d="M16 12h4"></path><path d="M18 12v4"></path></svg>',
    coffee: '<svg viewBox="0 0 24 24"><path d="M10 4h4"></path><path d="M11 4v2"></path><path d="M13 4v2"></path><rect x="9" y="6" width="6" height="14" rx="2"></rect><path d="M10 10h4"></path></svg>',
    heating: '<svg viewBox="0 0 24 24"><path d="M10 14a2 2 0 1 0 4 0V6a2 2 0 0 0-4 0v8z"></path><path d="M12 20a4 4 0 0 0 2-7.5"></path><path d="M12 20a4 4 0 0 1-2-7.5"></path></svg>',
    wardrobe: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="14" rx="2"></rect><path d="M9 7V5a3 3 0 0 1 6 0v2"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>',
    wifi: '<svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14 0"></path><path d="M8.5 16.5a6 6 0 0 1 7 0"></path><circle cx="12" cy="20" r="1"></circle></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    ac: '<svg viewBox="0 0 24 24"><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="m4.93 4.93 2.83 2.83"></path><path d="m16.24 16.24 2.83 2.83"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path></svg>',
    minibar: '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',
    desk: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M7 20v-4"></path><path d="M17 20v-4"></path></svg>',
    chair: '<svg viewBox="0 0 24 24"><path d="M5 9v6"></path><path d="M19 9v6"></path><path d="M5 9h14"></path><path d="M5 15h14"></path><path d="M7 20v-5"></path><path d="M17 20v-5"></path></svg>',
    safe: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"></rect><circle cx="12" cy="14" r="3"></circle><path d="M12 14v4"></path></svg>',
    balcony: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 12h16"></path><path d="M12 4v16"></path></svg>',
    iron: '<svg viewBox="0 0 24 24"><path d="M8 19V7.2c0-.6.4-1 1-1h6.5c.5 0 1 .4 1 1v11.8"></path><path d="M3 19h18"></path><path d="M8 15h8"></path></svg>',
    hairdryer: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"></circle><path d="M13 13l7 7"></path><path d="M16 8V6a2 2 0 0 1 2-2h2"></path></svg>',
    shower: '<svg viewBox="0 0 24 24"><path d="M6 8v12"></path><path d="M10 8v12"></path><path d="M14 8v12"></path><path d="M18 8v12"></path><path d="M4 4h16"></path></svg>',
    bathtub: '<svg viewBox="0 0 24 24"><path d="M4 12h16"></path><path d="M6 12v6"></path><path d="M18 12v6"></path><path d="M4 18h16"></path><circle cx="8" cy="8" r="2"></circle></svg>',
    towel: '<svg viewBox="0 0 24 24"><rect x="8" y="4" width="10" height="16" rx="1"></rect><path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"></path></svg>',
    king_bed: '<svg viewBox="0 0 24 24"><path d="M3 7h18"></path><path d="M5 7v10"></path><path d="M19 7v10"></path><path d="M5 12h14"></path><path d="M7 17h10"></path><path d="M8 17v3"></path><path d="M16 17v3"></path></svg>',
    queen_bed: '<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M6 7v9"></path><path d="M18 7v9"></path><path d="M6 12h12"></path><path d="M8 16h8"></path><path d="M9 16v3"></path><path d="M15 16v3"></path></svg>'
  };

  // Get icon SVG by name
  window.IconLibrary.getIcon = function(iconName) {
    // Return the requested icon, or bed icon as fallback for backward compatibility
    if (this[iconName]) {
      return this[iconName];
    }
    
    // Log warning for debugging
    console.warn(`Icon '${iconName}' not found in IconLibrary, using 'bed' as fallback`);
    return this.bed;
  };

})();
