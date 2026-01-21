/**
 * Info Manager Module for Hotel 3 Paardekens Admin Panel
 * Handles CRUD operations for info blocks using Firebase Realtime Database
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_info'; // Legacy localStorage key for migration
  const FIREBASE_PATH = 'infoBlocks'; // Firebase database path

  // Helper to get Firebase database reference
  function getDatabase() {
    if (typeof firebase === 'undefined' || !firebase.database) {
      console.warn('Firebase not available, using localStorage fallback');
      return null;
    }
    return firebase.database();
  }

  // Info Manager API
  window.InfoManager = {
    /**
     * Get all info blocks
     * @returns {Promise<Array>} Promise resolving to array of info block objects
     */
    async getInfoBlocks() {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage if Firebase is not available
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch (e) {
            console.error('Error parsing stored info blocks:', e);
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
        console.error('Error fetching info blocks from Firebase:', error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    },

    /**
     * Get a single info block by ID
     * @param {string} id - Info block ID
     * @returns {Promise<object|null>} Promise resolving to info block object or null
     */
    async getInfoBlock(id) {
      const blocks = await this.getInfoBlocks();
      return blocks.find(b => b.id === id) || null;
    },

    /**
     * Save all info blocks to storage
     * @param {Array} blocks - Array of info block objects
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async saveInfoBlocks(blocks) {
      const db = getDatabase();
      
      if (!db) {
        // Fallback to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        return true;
      }

      try {
        // Convert array to object keyed by ID for Firebase
        const dataObject = {};
        blocks.forEach(block => {
          const { id, ...blockData } = block;
          dataObject[id] = blockData;
        });
        
        await db.ref(FIREBASE_PATH).set(dataObject);
        return true;
      } catch (error) {
        console.error('Error saving info blocks to Firebase:', error);
        // Fallback to localStorage on error
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
        return false;
      }
    },

    /**
     * Create a new info block
     * @param {object} blockData - Info block data {title, body}
     * @returns {Promise<object>} Promise resolving to created info block with generated ID
     */
    async createInfoBlock(blockData) {
      const blocks = await this.getInfoBlocks();
      const id = this._generateId();
      const order = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) + 1 : 1;
      
      const newBlock = {
        id,
        title: blockData.title,
        body: blockData.body || '',
        order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      blocks.push(newBlock);
      await this.saveInfoBlocks(blocks);
      return newBlock;
    },

    /**
     * Update an existing info block
     * @param {string} id - Info block ID
     * @param {object} updates - Fields to update
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async updateInfoBlock(id, updates) {
      const blocks = await this.getInfoBlocks();
      const index = blocks.findIndex(b => b.id === id);
      
      if (index === -1) return false;
      
      blocks[index] = {
        ...blocks[index],
        ...updates,
        id, // Preserve original ID
        updatedAt: new Date().toISOString()
      };
      
      await this.saveInfoBlocks(blocks);
      return true;
    },

    /**
     * Delete an info block
     * @param {string} id - Info block ID
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async deleteInfoBlock(id) {
      const blocks = await this.getInfoBlocks();
      const filtered = blocks.filter(b => b.id !== id);
      
      if (filtered.length === blocks.length) return false;
      
      await this.saveInfoBlocks(filtered);
      return true;
    },

    /**
     * Reorder info blocks
     * @param {Array} orderedIds - Array of info block IDs in the new order
     * @returns {Promise<boolean>} Promise resolving to true if successful
     */
    async reorderInfoBlocks(orderedIds) {
      const blocks = await this.getInfoBlocks();
      
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
      
      await this.saveInfoBlocks(reordered);
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
          console.log('Migrating', blocks.length, 'info blocks from localStorage to Firebase...');
          await this.saveInfoBlocks(blocks);
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
      return 'info-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    }
  };

})();
