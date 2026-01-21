/**
 * Info Manager Module for Hotel 3 Paardekens Admin Panel
 * Handles CRUD operations for info blocks using localStorage
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'hotel3p_info';

  // Info Manager API
  window.InfoManager = {
    /**
     * Get all info blocks
     * @returns {Array} Array of info block objects
     */
    getInfoBlocks() {
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
    },

    /**
     * Get a single info block by ID
     * @param {string} id - Info block ID
     * @returns {object|null} Info block object or null
     */
    getInfoBlock(id) {
      const blocks = this.getInfoBlocks();
      return blocks.find(b => b.id === id) || null;
    },

    /**
     * Save all info blocks to storage
     * @param {Array} blocks - Array of info block objects
     */
    saveInfoBlocks(blocks) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    },

    /**
     * Create a new info block
     * @param {object} blockData - Info block data {title, body}
     * @returns {object} Created info block with generated ID
     */
    createInfoBlock(blockData) {
      const blocks = this.getInfoBlocks();
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
      this.saveInfoBlocks(blocks);
      return newBlock;
    },

    /**
     * Update an existing info block
     * @param {string} id - Info block ID
     * @param {object} updates - Fields to update
     * @returns {boolean} True if successful
     */
    updateInfoBlock(id, updates) {
      const blocks = this.getInfoBlocks();
      const index = blocks.findIndex(b => b.id === id);
      
      if (index === -1) return false;
      
      blocks[index] = {
        ...blocks[index],
        ...updates,
        id, // Preserve original ID
        updatedAt: new Date().toISOString()
      };
      
      this.saveInfoBlocks(blocks);
      return true;
    },

    /**
     * Delete an info block
     * @param {string} id - Info block ID
     * @returns {boolean} True if successful
     */
    deleteInfoBlock(id) {
      const blocks = this.getInfoBlocks();
      const filtered = blocks.filter(b => b.id !== id);
      
      if (filtered.length === blocks.length) return false;
      
      this.saveInfoBlocks(filtered);
      return true;
    },

    /**
     * Reorder info blocks
     * @param {Array} orderedIds - Array of info block IDs in the new order
     * @returns {boolean} True if successful
     */
    reorderInfoBlocks(orderedIds) {
      const blocks = this.getInfoBlocks();
      
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
      
      this.saveInfoBlocks(reordered);
      return true;
    },

    /**
     * Generate a unique ID
     * @private
     */
    _generateId() {
      return 'info-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
  };

})();
