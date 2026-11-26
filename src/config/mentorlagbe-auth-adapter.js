import { createAdapterFactory } from "better-auth/adapters";
import { getDB } from "./db.js";

const COLLECTION_NAME = "users";

const buildFilter = (model, where = []) => {
  const filter = {
    __ba_model: model,
  };

  for (const condition of where) {
    const { field, value, operator } = condition;

    switch (operator) {
      case "ne":
        filter[field] = { $ne: value };
        break;

      case "in":
        filter[field] = { $in: value };
        break;

      case "not_in":
        filter[field] = { $nin: value };
        break;

      case "gt":
        filter[field] = { $gt: value };
        break;

      case "gte":
        filter[field] = { $gte: value };
        break;

      case "lt":
        filter[field] = { $lt: value };
        break;

      case "lte":
        filter[field] = { $lte: value };
        break;

      default:
        filter[field] = value;
    }
  }

  return filter;
};

export const mentorLagbeAuthAdapter = () =>
  createAdapterFactory({
    config: {
      adapterId: "mentorlagbe-mongodb",
      adapterName: "MentorLagbe MongoDB Adapter",
      supportsJSON: true,
      supportsDates: true,
      supportsBooleans: true,
      supportsNumericIds: false,
    },

    adapter: () => {
      const collection = () => getDB().collection(COLLECTION_NAME);

      return {
        create: async ({ model, data }) => {
          const document = {
            ...data,
            __ba_model: model,
          };

          await collection().insertOne(document);

          return document;
        },

        findOne: async ({ model, where }) => {
          return await collection().findOne(
            buildFilter(model, where)
          );
        },

        findMany: async ({
          model,
          where,
          limit,
          offset,
          sortBy,
        }) => {
          let cursor = collection().find(
            buildFilter(model, where)
          );

          if (sortBy) {
            cursor = cursor.sort({
              [sortBy.field]: sortBy.direction === "desc" ? -1 : 1,
            });
          }

          if (offset) cursor = cursor.skip(offset);
          if (limit) cursor = cursor.limit(limit);

          return await cursor.toArray();
        },

        update: async ({ model, where, update }) => {
          return await collection().findOneAndUpdate(
            buildFilter(model, where),
            { $set: update },
            { returnDocument: "after" }
          );
        },

        updateMany: async ({ model, where, update }) => {
          const result = await collection().updateMany(
            buildFilter(model, where),
            { $set: update }
          );

          return result.modifiedCount;
        },

        delete: async ({ model, where }) => {
          return await collection().findOneAndDelete(
            buildFilter(model, where)
          );
        },

        deleteMany: async ({ model, where }) => {
          const result = await collection().deleteMany(
            buildFilter(model, where)
          );

          return result.deletedCount;
        },

        count: async ({ model, where }) => {
          return await collection().countDocuments(
            buildFilter(model, where)
          );
        },
      };
    },
  });