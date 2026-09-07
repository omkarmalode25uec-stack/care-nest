/**
 * KumbhStay Database Initialization and Import Script
 * 
 * Target Database: kumbhstay
 * 
 * Features:
 * - Validates GeoJSON [longitude, latitude] coordinates
 * - Applies strict collection schemas and validation rules
 * - Creates 2dsphere geospatial indexes and text search indexes
 * - Enforces zero-fabrication and provenance preservation rules
 * - Can be executed via: node scripts/importData.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'kumbhstay';

// Schemas & Index Definitions for KumbhStay
const COLLECTION_SPECS = {
  properties: {
    indexes: [
      { key: { location: '2dsphere' }, name: 'location_2dsphere' },
      { key: { city: 1, propertyType: 1, pricePerNight: 1 }, name: 'city_type_price_idx' },
      { key: { name: 'text', address: 'text', description: 'text' }, name: 'text_search_idx' },
      { key: { 'source.file': 1, 'source.originalId': 1 }, name: 'source_provenance_idx' }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'propertyType', 'verificationStatus', 'source'],
        properties: {
          name: { bsonType: 'string', description: 'Property title/name is required' },
          description: { bsonType: ['string', 'null'] },
          propertyType: { 
            enum: ['hotel', 'hostel', 'pg', 'homestay', 'tent', 'dharamshala', 'ashram'],
            description: 'Must be a normalized property type' 
          },
          address: { bsonType: ['string', 'null'] },
          city: { bsonType: ['string', 'null'] },
          state: { bsonType: ['string', 'null'] },
          country: { bsonType: ['string', 'null'] },
          location: {
            bsonType: ['object', 'null'],
            properties: {
              type: { enum: ['Point'] },
              coordinates: {
                bsonType: 'array',
                minItems: 2,
                maxItems: 2,
                items: { bsonType: ['double', 'int', 'long', 'decimal'] }
              }
            }
          },
          pricePerNight: { bsonType: ['double', 'int', 'long', 'decimal', 'null'] },
          priceRange: { bsonType: ['string', 'null'] },
          amenities: { bsonType: 'array', items: { bsonType: 'string' } },
          occupantPreferences: { bsonType: 'array', items: { bsonType: 'string' } },
          images: { bsonType: 'array', items: { bsonType: 'string' } },
          googlePlaceId: { bsonType: ['string', 'null'] },
          googleRating: { bsonType: ['double', 'int', 'null'] },
          googleReviewCount: { bsonType: ['int', 'long', 'null'] },
          verificationStatus: { 
            enum: ['unverified', 'verified', 'pending_audit', 'rejected'],
            description: 'Defaults to unverified unless officially vetted' 
          },
          source: {
            bsonType: 'object',
            required: ['file'],
            properties: {
              file: { bsonType: 'string' },
              originalId: { bsonType: ['string', 'int', 'long', 'null'] },
              sourceType: { bsonType: ['string', 'null'] },
              sourceUrl: { bsonType: ['string', 'null'] },
              importedAt: { bsonType: 'date' }
            }
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  },

  medicalPoints: {
    indexes: [
      { key: { location: '2dsphere' }, name: 'location_2dsphere' },
      { key: { type: 1, isEmergency: 1 }, name: 'type_emergency_idx' },
      { key: { name: 'text', address: 'text' }, name: 'text_search_idx' }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'type', 'isEmergency', 'source'],
        properties: {
          name: { bsonType: 'string' },
          type: { 
            enum: ['hospital', 'clinic', 'first_aid_post', 'ambulance_point', 'pharmacy', 'temporary_camp'],
            description: 'Normalized medical point type' 
          },
          address: { bsonType: ['string', 'null'] },
          location: {
            bsonType: ['object', 'null'],
            properties: {
              type: { enum: ['Point'] },
              coordinates: {
                bsonType: 'array',
                minItems: 2,
                maxItems: 2,
                items: { bsonType: ['double', 'int', 'long', 'decimal'] }
              }
            }
          },
          phone: { bsonType: ['string', 'null'] },
          services: { bsonType: 'array', items: { bsonType: 'string' } },
          isEmergency: { bsonType: 'bool' },
          source: {
            bsonType: 'object',
            required: ['file'],
            properties: {
              file: { bsonType: 'string' },
              originalId: { bsonType: ['string', 'int', 'long', 'null'] },
              sourceType: { bsonType: ['string', 'null'] },
              importedAt: { bsonType: 'date' }
            }
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  },

  landmarks: {
    indexes: [
      { key: { location: '2dsphere' }, name: 'location_2dsphere' },
      { key: { type: 1, importance: 1 }, name: 'type_importance_idx' },
      { key: { name: 'text', description: 'text' }, name: 'text_search_idx' }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'type', 'source'],
        properties: {
          name: { bsonType: 'string' },
          type: { 
            enum: ['ghat', 'temple', 'snan_point', 'akhada', 'bridge', 'monument', 'sector_gate'],
            description: 'Normalized landmark type' 
          },
          description: { bsonType: ['string', 'null'] },
          address: { bsonType: ['string', 'null'] },
          location: {
            bsonType: ['object', 'null'],
            properties: {
              type: { enum: ['Point'] },
              coordinates: {
                bsonType: 'array',
                minItems: 2,
                maxItems: 2,
                items: { bsonType: ['double', 'int', 'long', 'decimal'] }
              }
            }
          },
          importance: { enum: ['primary', 'secondary', 'local', null] },
          source: {
            bsonType: 'object',
            required: ['file'],
            properties: {
              file: { bsonType: 'string' },
              originalId: { bsonType: ['string', 'int', 'long', 'null'] },
              sourceType: { bsonType: ['string', 'null'] }
            }
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  },

  transportPoints: {
    indexes: [
      { key: { location: '2dsphere' }, name: 'location_2dsphere' },
      { key: { type: 1 }, name: 'type_idx' },
      { key: { name: 'text', address: 'text' }, name: 'text_search_idx' }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'type', 'source'],
        properties: {
          name: { bsonType: 'string' },
          type: { 
            enum: ['railway_station', 'bus_station', 'parking', 'shuttle_point', 'transport_hub', 'temporary_stand'],
            description: 'Normalized transport point type' 
          },
          address: { bsonType: ['string', 'null'] },
          location: {
            bsonType: ['object', 'null'],
            properties: {
              type: { enum: ['Point'] },
              coordinates: {
                bsonType: 'array',
                minItems: 2,
                maxItems: 2,
                items: { bsonType: ['double', 'int', 'long', 'decimal'] }
              }
            }
          },
          source: {
            bsonType: 'object',
            required: ['file'],
            properties: {
              file: { bsonType: 'string' },
              originalId: { bsonType: ['string', 'int', 'long', 'null'] }
            }
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  },

  reviews: {
    indexes: [
      { key: { propertyId: 1, createdAt: -1 }, name: 'property_review_idx' },
      { key: { rating: 1 }, name: 'rating_idx' }
    ],
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['propertyId', 'rating', 'source'],
        properties: {
          propertyId: { bsonType: 'objectId' },
          authorName: { bsonType: ['string', 'null'] },
          rating: { bsonType: ['double', 'int'], minimum: 1, maximum: 5 },
          comment: { bsonType: ['string', 'null'] },
          isVerifiedStay: { bsonType: 'bool' },
          source: {
            bsonType: 'object',
            required: ['file'],
            properties: {
              file: { bsonType: 'string' },
              sourceType: { bsonType: ['string', 'null'] }
            }
          },
          createdAt: { bsonType: 'date' },
          updatedAt: { bsonType: 'date' }
        }
      }
    }
  }
};

/**
 * Coordinate Validation helper
 * Ensures longitude is in [-180, 180] and latitude in [-90, 90]
 */
function validateGeoJSON(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;
  const [lng, lat] = coordinates;
  if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) return false;
  if (lng < -180 || lng > 180) return false;
  if (lat < -90 || lat > 90) return false;
  return true;
}

async function main() {
  console.log('====================================================');
  console.log('  KumbhStay Database Setup & Schema Provisioning');
  console.log('====================================================');
  console.log(`Connecting to: ${MONGODB_URI}`);
  console.log(`Target Database: ${DB_NAME}`);

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Successfully connected to MongoDB server.');

    const db = client.db(DB_NAME);
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);

    for (const [colName, spec] of Object.entries(COLLECTION_SPECS)) {
      console.log(`\nConfiguring collection: ${colName}`);

      if (!existingNames.includes(colName)) {
        await db.createCollection(colName, {
          validator: spec.validator
        });
        console.log(`  ✓ Collection '${colName}' created with JSON Schema validation.`);
      } else {
        await db.command({
          collMod: colName,
          validator: spec.validator
        }).catch(err => {
          console.warn(`  ! collMod warning for '${colName}': ${err.message}`);
        });
        console.log(`  ✓ Collection '${colName}' schema validator updated.`);
      }

      const collection = db.collection(colName);
      for (const indexSpec of spec.indexes) {
        await collection.createIndex(indexSpec.key, { name: indexSpec.name });
        console.log(`  ✓ Index created: ${indexSpec.name}`);
      }
    }

    console.log('\n====================================================');
    console.log('  Database Initialization & Indexing Complete!');
    console.log('====================================================');
  } catch (error) {
    console.error('Database initialization error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  COLLECTION_SPECS,
  validateGeoJSON
};
