/**
 * Room Manager Module for Hotel 3 Paardekens Admin Panel
 * Handles CRUD operations for room categories using Firebase Realtime Database
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_rooms'; // Legacy localStorage key for migration
  const FIREBASE_PATH = 'rooms'; // Firebase database path

  // Helper to get Firebase database reference
  function getDatabase() {
    if (typeof firebase === 'undefined' || !firebase.database) {
      console.warn('Firebase not available, using localStorage fallback');
      return null;
    }
    
    // Check if Firebase app is initialized
    if (!firebase.apps || firebase.apps.length === 0) {
      console.warn('Firebase app not initialized, using localStorage fallback');
      return null;
    }
    
    try {
      const db = firebase.database();
      // Verify database is actually accessible
      if (!db) {
        console.warn('Firebase database not accessible, using localStorage fallback');
        return null;
      }
      return db;
    } catch (error) {
      console.error('Error accessing Firebase database:', error);
      return null;
    }
  }

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
     * @returns {Promise<Array>} Promise resolving to array of room objects
     */
    async getRooms() {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage if Firebase is not available
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
      }

      try {
        const snapshot = await db.ref(FIREBASE_PATH).once('value');
        const data = snapshot.val();
        
        if (!data) {
          // Try to migrate from localStorage if Firebase is empty
          return await this._migrateFromLocalStorage();
        }
        
        // Convert Firebase object to array
        return Object.keys(data).map(key => ({
          ...data[key],
          id: key
        }));
      } catch (error) {
        console.error('Error fetching rooms from Firebase:', error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
            return DEFAULT_ROOMS;
          }
        }
        return DEFAULT_ROOMS;
      }
    },

    /**
     * Get a single room by ID
     * @param {string} id - Room ID
     * @returns {Promise<object|null>} Promise resolving to room object or null
     */
    async getRoom(id) {
      const rooms = await this.getRooms();
      return rooms.find(r => r.id === id) || null;
    },

    /**
     * Save all rooms to storage
     * @param {Array} rooms - Array of room objects
     * @returns {Promise<boolean>} Promise resolving to true if successful, false on error
     */
    async saveRooms(rooms) {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage
        console.log('Using localStorage fallback for saving rooms');
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
          return true;
        } catch (error) {
          console.error('Error saving to localStorage:', error);
          return false;
        }
      }

      try {
        // Convert array to object keyed by ID for Firebase
        const dataObject = {};
        rooms.forEach(room => {
          const { id, ...roomData } = room;
          dataObject[id] = roomData;
        });
        
        console.log('Saving rooms to Firebase...');
        await db.ref(FIREBASE_PATH).set(dataObject);
        console.log('✓ Rooms saved successfully to Firebase');
        
        // Also save to localStorage as backup
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
        } catch (lsError) {
          console.warn('Could not save to localStorage backup:', lsError);
        }
        return true;
      } catch (error) {
        console.error('Error saving rooms to Firebase:', error);
        console.error('Error details:', error.message, error.code);
        // Fallback to localStorage on error
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
          console.log('Saved to localStorage as fallback');
          return true; // Success via fallback
        } catch (lsError) {
          console.error('Failed to save to localStorage fallback:', lsError);
          return false; // Complete failure
        }
      }
    },

    /**
     * Create a new room
     * @param {object} roomData - Room data {name, description, amenities, photos, bookingUrl}
     * @returns {Promise<object|null>} Promise resolving to created room with generated ID, or null on error
     */
    async createRoom(roomData) {
      console.log('Creating new room:', roomData.name);
      const rooms = await this.getRooms();
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
      
      const success = await this.saveRooms(rooms);
      if (success) {
        console.log('✓ Room created successfully:', id);
        return newRoom;
      } else {
        console.error('Failed to save new room');
        return null; // Maintain API contract by returning null on failure
      }
    },

    /**
     * Update an existing room
     * @param {string} id - Room ID
     * @param {object} updates - Fields to update
     * @returns {Promise<boolean>} Promise resolving to true if successful, false on error
     */
    async updateRoom(id, updates) {
      console.log('Updating room:', id);
      const rooms = await this.getRooms();
      const index = rooms.findIndex(r => r.id === id);
      
      if (index === -1) {
        console.error('Room not found:', id);
        return false;
      }
      
      rooms[index] = {
        ...rooms[index],
        ...updates,
        id // Preserve original ID
      };
      
      const success = await this.saveRooms(rooms);
      if (success) {
        console.log('✓ Room updated successfully:', id);
        return true;
      } else {
        console.error('Failed to update room');
        return false;
      }
    },

    /**
     * Delete a room
     * @param {string} id - Room ID
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async deleteRoom(id) {
      const rooms = await this.getRooms();
      const filtered = rooms.filter(r => r.id !== id);
      
      if (filtered.length === rooms.length) return false;
      
      await this.saveRooms(filtered);
      return true;
    },

    /**
     * Reset rooms to default data
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async resetToDefaults() {
      return await this.saveRooms(DEFAULT_ROOMS);
    },

    /**
     * Migrate data from localStorage to Firebase
     * @private
     * @returns {Promise<Array>} Promise resolving to migrated rooms
     */
    async _migrateFromLocalStorage() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_ROOMS;
      
      try {
        const rooms = JSON.parse(stored);
        if (rooms.length > 0) {
          console.log('Migrating', rooms.length, 'rooms from localStorage to Firebase...');
          await this.saveRooms(rooms);
          console.log('✓ Migration complete');
          return rooms;
        }
      } catch (e) {
        console.error('Error migrating from localStorage:', e);
      }
      return DEFAULT_ROOMS;
    },

    /**
     * Generate a unique ID from room name
     * @private
     * @param {string} name - Room name
     * @returns {string} Generated unique ID
     */
    async _generateId(name) {
      if (!name || typeof name !== 'string') {
        name = 'room';
      }
      
      const base = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Ensure we have a valid base ID
      const validBase = base || 'room';
      
      const rooms = await this.getRooms();
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
    // Bed types
    bed: '<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M6 7v10"></path><path d="M18 7v10"></path><path d="M6 12h12"></path><path d="M8 17h8"></path><path d="M9 17v3"></path><path d="M15 17v3"></path></svg>',
    king_bed: '<svg viewBox="0 0 24 24"><path d="M3 7h18"></path><path d="M5 7v10"></path><path d="M19 7v10"></path><path d="M5 12h14"></path><path d="M7 17h10"></path><path d="M8 17v3"></path><path d="M16 17v3"></path></svg>',
    queen_bed: '<svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M6 7v9"></path><path d="M18 7v9"></path><path d="M6 12h12"></path><path d="M8 16h8"></path><path d="M9 16v3"></path><path d="M15 16v3"></path></svg>',
    twin_bed: '<svg viewBox="0 0 24 24"><path d="M2 8h8"></path><path d="M14 8h8"></path><path d="M3 8v8"></path><path d="M9 8v8"></path><path d="M15 8v8"></path><path d="M21 8v8"></path><path d="M3 12h6"></path><path d="M15 12h6"></path></svg>',
    sofa_bed: '<svg viewBox="0 0 24 24"><path d="M4 10h16"></path><path d="M4 10v6"></path><path d="M20 10v6"></path><path d="M6 16h12"></path><path d="M4 6h2v4"></path><path d="M18 6h2v4"></path></svg>',
    
    // Electronics
    tv: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="10" rx="2"></rect><path d="M8 20h8"></path><path d="M12 16v4"></path></svg>',
    wifi: '<svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14 0"></path><path d="M8.5 16.5a6 6 0 0 1 7 0"></path><circle cx="12" cy="20" r="1"></circle></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    smart_tv: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2"></rect><path d="M7 21h10"></path><path d="M12 17v4"></path><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle></svg>',
    sound_system: '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
    
    // Bathroom
    bathroom: '<svg viewBox="0 0 24 24"><path d="M7 6a5 5 0 0 1 10 0"></path><path d="M17 6v4"></path><path d="M7 10h10"></path><path d="M8 14h8"></path><path d="M9 18h6"></path><path d="M10 14v4"></path><path d="M14 14v4"></path></svg>',
    shower: '<svg viewBox="0 0 24 24"><path d="M6 8v12"></path><path d="M10 8v12"></path><path d="M14 8v12"></path><path d="M18 8v12"></path><path d="M4 4h16"></path></svg>',
    bathtub: '<svg viewBox="0 0 24 24"><path d="M4 12h16"></path><path d="M6 12v6"></path><path d="M18 12v6"></path><path d="M4 18h16"></path><circle cx="8" cy="8" r="2"></circle></svg>',
    towel: '<svg viewBox="0 0 24 24"><rect x="8" y="4" width="10" height="16" rx="1"></rect><path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"></path></svg>',
    hairdryer: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"></circle><path d="M13 13l7 7"></path><path d="M16 8V6a2 2 0 0 1 2-2h2"></path></svg>',
    toiletries: '<svg viewBox="0 0 24 24"><path d="M9 3h6"></path><rect x="8" y="3" width="8" height="18" rx="2"></rect><path d="M10 8h4"></path><path d="M10 12h4"></path><path d="M10 16h4"></path></svg>',
    
    // Comfort & Climate
    ac: '<svg viewBox="0 0 24 24"><path d="M12 2v20"></path><path d="M2 12h20"></path><path d="m4.93 4.93 2.83 2.83"></path><path d="m16.24 16.24 2.83 2.83"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path></svg>',
    heating: '<svg viewBox="0 0 24 24"><path d="M10 14a2 2 0 1 0 4 0V6a2 2 0 0 0-4 0v8z"></path><path d="M12 20a4 4 0 0 0 2-7.5"></path><path d="M12 20a4 4 0 0 1-2-7.5"></path></svg>',
    fan: '<svg viewBox="0 0 24 24"><path d="M12 12v.01"></path><path d="M12 6a6 6 0 0 0 0 12"></path><path d="M12 6a6 6 0 0 1 0 12"></path><path d="M6 12a6 6 0 0 0 12 0"></path></svg>',
    fireplace: '<svg viewBox="0 0 24 24"><path d="M12 2c-1.5 3-3.5 5.5-3.5 9.5a3.5 3.5 0 0 0 7 0c0-4-2-6.5-3.5-9.5z"></path><path d="M5 22h14"></path><path d="M5 18h14"></path></svg>',
    
    // Furniture
    wardrobe: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="14" rx="2"></rect><path d="M9 7V5a3 3 0 0 1 6 0v2"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>',
    desk: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M7 20v-4"></path><path d="M17 20v-4"></path></svg>',
    chair: '<svg viewBox="0 0 24 24"><path d="M5 9v6"></path><path d="M19 9v6"></path><path d="M5 9h14"></path><path d="M5 15h14"></path><path d="M7 20v-5"></path><path d="M17 20v-5"></path></svg>',
    sofa: '<svg viewBox="0 0 24 24"><path d="M4 10h16"></path><path d="M4 10v8h16v-8"></path><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M4 6h2v4"></path><path d="M18 6h2v4"></path></svg>',
    table: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="4"></rect><path d="M6 8v12"></path><path d="M18 8v12"></path><path d="M10 8v12"></path><path d="M14 8v12"></path></svg>',
    nightstand: '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="12" height="16" rx="2"></rect><path d="M6 11h12"></path><circle cx="12" cy="7.5" r="0.5"></circle><circle cx="12" cy="14.5" r="0.5"></circle></svg>',
    
    // Kitchen & Dining
    coffee: '<svg viewBox="0 0 24 24"><path d="M10 4h4"></path><path d="M11 4v2"></path><path d="M13 4v2"></path><rect x="9" y="6" width="6" height="14" rx="2"></rect><path d="M10 10h4"></path></svg>',
    minibar: '<svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>',
    kettle: '<svg viewBox="0 0 24 24"><path d="M8 4h8"></path><path d="M9 4v2"></path><path d="M15 4v2"></path><path d="M8 6h8v10H8z"></path><path d="M6 10h2"></path><path d="M6 14h2"></path></svg>',
    microwave: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M4 10h16"></path><circle cx="17" cy="8" r="0.5"></circle><circle cx="17" cy="12" r="0.5"></circle><circle cx="17" cy="16" r="0.5"></circle></svg>',
    kitchen: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M9 6v10"></path><path d="M15 6v10"></path><path d="M4 10h16"></path></svg>',
    dining: '<svg viewBox="0 0 24 24"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="6" y="6" width="12" height="12" rx="2"></rect><path d="M6 11h12"></path></svg>',
    
    // Services & Amenities
    safe: '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"></rect><circle cx="12" cy="14" r="3"></circle><path d="M12 14v4"></path></svg>',
    iron: '<svg viewBox="0 0 24 24"><path d="M8 19V7.2c0-.6.4-1 1-1h6.5c.5 0 1 .4 1 1v11.8"></path><path d="M3 19h18"></path><path d="M8 15h8"></path></svg>',
    laundry: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"></rect><circle cx="12" cy="14" r="5"></circle><path d="M8 4h8"></path></svg>',
    hangers: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="2"></circle><path d="M12 8v2"></path><path d="M12 10L6 18h12L12 10z"></path><path d="M6 18h12"></path></svg>',
    slippers: '<svg viewBox="0 0 24 24"><path d="M4 16h6a4 4 0 0 1 4 4"></path><path d="M14 16h6a4 4 0 0 0-4 4"></path><path d="M4 12h6"></path><path d="M14 12h6"></path></svg>',
    
    // Views & Outdoor
    view: '<svg viewBox="0 0 24 24"><path d="M4 10h8a4 4 0 0 1 4 4v2H9a5 5 0 0 1-5-5v-1z"></path><path d="M16 12h4"></path><path d="M18 12v4"></path></svg>',
    balcony: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 12h16"></path><path d="M12 4v16"></path></svg>',
    terrace: '<svg viewBox="0 0 24 24"><path d="M4 18h16"></path><path d="M6 18v-6"></path><path d="M10 18v-6"></path><path d="M14 18v-6"></path><path d="M18 18v-6"></path><path d="M4 12h16"></path></svg>',
    garden: '<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 3 2 5 2 5h12s2-2 2-5a8 8 0 0 0-8-8z"></path><path d="M12 15v7"></path><path d="M8 22h8"></path></svg>',
    pool: '<svg viewBox="0 0 24 24"><path d="M2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"></path><path d="M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2"></path><circle cx="12" cy="8" r="4"></circle></svg>',
    parking: '<svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 0 8H8v8"></path><path d="M8 4v16"></path></svg>',
    
    // Business & Work
    workspace: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M6 8h12"></path><path d="M6 12h8"></path><path d="M6 16h10"></path></svg>',
    meeting_room: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 10h18"></path><circle cx="9" cy="7" r="1"></circle><circle cx="15" cy="7" r="1"></circle></svg>',
    printer: '<svg viewBox="0 0 24 24"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>',
    laptop: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="17" x2="22" y2="17"></line></svg>',
    
    // Security & Safety
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>',
    security: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    smoke_detector: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6"></path><circle cx="12" cy="16" r="1"></circle></svg>',
    
    // Accessibility
    wheelchair: '<svg viewBox="0 0 24 24"><circle cx="12" cy="11" r="8"></circle><path d="M12 3v8"></path><path d="M8 11h8"></path><circle cx="12" cy="5" r="2"></circle></svg>',
    elevator: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"></rect><path d="M12 6v12"></path><path d="M8 10l4-4 4 4"></path></svg>',
    
    // Entertainment
    games: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"></rect><path d="M10 10h4"></path><path d="M12 8v4"></path><circle cx="16" cy="10" r="1"></circle><circle cx="16" cy="14" r="1"></circle></svg>',
    books: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    
    // Extras
    breakfast: '<svg viewBox="0 0 24 24"><path d="M8 4v12a4 4 0 0 0 4 4"></path><path d="M16 4v12a4 4 0 0 1-4 4"></path><path d="M4 8h16"></path><path d="M4 12h16"></path></svg>',
    bar: '<svg viewBox="0 0 24 24"><path d="M3 3h18"></path><path d="M12 3v18"></path><path d="M6 15h12"></path><path d="M6 19h12"></path></svg>',
    restaurant: '<svg viewBox="0 0 24 24"><path d="M5 2v14"></path><path d="M9 2v6"></path><path d="M13 2v6"></path><path d="M3 8h8"></path><path d="M19 2v20"></path></svg>',
    room_service: '<svg viewBox="0 0 24 24"><path d="M3 16a9 9 0 1 1 18 0"></path><path d="M3 16h18"></path><path d="M12 6v4"></path></svg>',
    concierge: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"></circle><path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path></svg>',
    cleaning: '<svg viewBox="0 0 24 24"><path d="M12 2L4 8v12h16V8l-8-6z"></path><path d="M9 21V12h6v9"></path></svg>',
    pet_friendly: '<svg viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"></circle><circle cx="18" cy="8" r="2"></circle><circle cx="20" cy="16" r="2"></circle><circle cx="9" cy="10" r="2"></circle><path d="M12.5 21c.5-2 1.5-3.5 3-4s2.5 0 3.5 1"></path></svg>',
    luggage: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="14" rx="2"></rect><path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path><path d="M6 10h12"></path><path d="M6 14h12"></path></svg>'
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
