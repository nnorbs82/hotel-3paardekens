/**
 * FAQ Manager Module for Hotel 3 Paardekens Admin Panel
 * Handles CRUD operations for FAQ blocks using Firebase Realtime Database
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_faq'; // Legacy localStorage key for migration
  const FIREBASE_PATH = 'faqBlocks'; // Firebase database path

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

  // FAQ Manager API
  window.FAQManager = {
    /**
     * Get all FAQ blocks
     * @returns {Promise<Array>} Promise resolving to array of FAQ block objects
     */
    async getFAQBlocks() {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage if Firebase is not available
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing stored FAQ blocks:', e);
            return [];
          }
        }
        return [];
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
        })).sort((a, b) => a.order - b.order);
      } catch (error) {
        console.error('Error fetching FAQ blocks from Firebase:', error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing localStorage data:', e);
            return [];
          }
        }
        return [];
      }
    },

    /**
     * Get a single FAQ block by ID
     * @param {string} id - FAQ block ID
     * @returns {Promise<object|null>} Promise resolving to FAQ block object or null
     */
    async getFAQBlock(id) {
      const blocks = await this.getFAQBlocks();
      return blocks.find(b => b.id === id) || null;
    },

    /**
     * Save all FAQ blocks to storage
     * @param {Array} blocks - Array of FAQ block objects
     * @returns {Promise<boolean>} Promise resolving to true if successful, false on error
     */
    async saveFAQBlocks(blocks) {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage
        console.log('Using localStorage fallback for saving blocks');
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
          return true;
        } catch (error) {
          console.error('Error saving to localStorage:', error);
          return false;
        }
      }

      try {
        // Convert array to object keyed by ID for Firebase
        const dataObject = {};
        blocks.forEach(block => {
          const { id, ...blockData } = block;
          dataObject[id] = blockData;
        });
        
        console.log('Saving FAQ blocks to Firebase...');
        await db.ref(FIREBASE_PATH).set(dataObject);
        console.log('✓ FAQ blocks saved successfully to Firebase');
        
        // Also save to localStorage as backup
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        } catch (lsError) {
          console.warn('Could not save to localStorage backup:', lsError);
        }
        return true;
      } catch (error) {
        console.error('Error saving FAQ blocks to Firebase:', error);
        console.error('Error details:', error.message, error.code);
        
        // Check if this is a permission error
        if (error.code === 'PERMISSION_DENIED' || error.message?.includes('Permission denied')) {
          console.error('⚠ FIREBASE PERMISSION DENIED!');
          console.error('This means you are not authenticated with Firebase.');
          console.error('Possible causes:');
          console.error('1. Firebase Authentication is not enabled in Firebase Console');
          console.error('2. Email/Password sign-in method is not enabled');
          console.error('3. You need to log out and log in again');
          console.error('4. Firebase security rules are too restrictive');
          console.error('');
          console.error('IMPACT: Data is only saved to localStorage (browser-specific).');
          console.error('To fix: See FIREBASE_AUTH_SETUP.md for setup instructions.');
        }
        
        // Fallback to localStorage on error
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
          console.log('Saved to localStorage as fallback');
          console.warn('⚠ Data NOT synced to Firebase - only visible in this browser!');
          return true; // Success via fallback
        } catch (lsError) {
          console.error('Failed to save to localStorage fallback:', lsError);
          return false; // Complete failure
        }
      }
    },

    /**
     * Create a new FAQ block
     * @param {object} blockData - FAQ block data {title, body}
     * @returns {Promise<object|null>} Promise resolving to created FAQ block with generated ID, or null on error
     */
    async createFAQBlock(blockData) {
      console.log('Creating new FAQ block:', blockData?.en?.title || blockData?.title || 'untitled');
      const blocks = await this.getFAQBlocks();
      const id = this._generateId();
      const order = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) + 1 : 1;
      
      const newBlock = {
        id,
        ...(blockData || {}),
        order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      blocks.push(newBlock);
      
      const success = await this.saveFAQBlocks(blocks);
      if (success) {
        console.log('✓ FAQ block created successfully:', id);
        return newBlock;
      } else {
        console.error('Failed to save new FAQ block');
        return null; // Maintain API contract by returning null on failure
      }
    },

    /**
     * Update an existing FAQ block
     * @param {string} id - FAQ block ID
     * @param {object} updates - Fields to update
     * @returns {Promise<boolean>} Promise resolving to true if successful, false on error
     */
    async updateFAQBlock(id, updates) {
      console.log('Updating FAQ block:', id);
      const blocks = await this.getFAQBlocks();
      const index = blocks.findIndex(b => b.id === id);
      
      if (index === -1) {
        console.error('FAQ block not found:', id);
        return false;
      }
      
      blocks[index] = {
        ...blocks[index],
        ...updates,
        id, // Preserve original ID
        updatedAt: new Date().toISOString()
      };
      
      const success = await this.saveFAQBlocks(blocks);
      if (success) {
        console.log('✓ FAQ block updated successfully:', id);
        return true;
      } else {
        console.error('Failed to update FAQ block');
        return false;
      }
    },

    /**
     * Delete an FAQ block
     * @param {string} id - FAQ block ID
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async deleteFAQBlock(id) {
      const blocks = await this.getFAQBlocks();
      const filtered = blocks.filter(b => b.id !== id);
      
      if (filtered.length === blocks.length) return false;
      
      await this.saveFAQBlocks(filtered);
      return true;
    },

    /**
     * Reorder FAQ blocks
     * @param {Array} orderedIds - Array of FAQ block IDs in the new order
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async reorderFAQBlocks(orderedIds) {
      const blocks = await this.getFAQBlocks();
      
      // Create a map of id to block
      const blockMap = {};
      blocks.forEach(block => {
        blockMap[block.id] = block;
      });
      
      // Reorder and update order property
      const reordered = orderedIds.map((id, index) => {
        const block = blockMap[id];
        if (block) {
          return {
            ...block,
            order: index + 1
          };
        }
        return null;
      }).filter(b => b !== null);
      
      await this.saveFAQBlocks(reordered);
      return true;
    },

    /**
     * Migrate data from localStorage to Firebase
     * @private
     * @returns {Promise<Array>} Promise resolving to migrated blocks
     */
    async _migrateFromLocalStorage() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      try {
        const blocks = JSON.parse(stored);
        if (blocks.length > 0) {
          console.log('Migrating', blocks.length, 'FAQ blocks from localStorage to Firebase...');
          await this.saveFAQBlocks(blocks);
          console.log('✓ Migration complete');
          return blocks;
        }
      } catch (e) {
        console.error('Error migrating from localStorage:', e);
      }
      return [];
    },

    /**
     * Generate a unique ID
     * @private
     */
    _generateId() {
      return 'faq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    }
  };

})();
