/**
 * A set of functions called "actions" for `scan`
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import axiosRetry from "axios-retry";
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const DIRECTORY = "api::directory.directory";
const GAME = "api::game.game";

const getSubDirectories = async (source: string) =>
  (await fs.promises.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return {
        name: dirent.name,
        path: path.join(source, dirent.name),
        exists: true,
      };
    });

const getIgdbId = async (dirName: string) => {
  const sanitizedDirName = dirName
    .replace(/[^0-9a-z]/gi, " ")
    .replace(/  +/g, " ");

  const { data: searchResults } = await axios.get(
    `https://www.igdb.com/search_autocomplete_all?q=${sanitizedDirName}`
  );

  if (searchResults?.game_suggest?.length) {
    return `${searchResults.game_suggest[0].id}`;
  }

  return undefined;
};

export default {
  scanDirectory: async (ctx, next) => {
    try {
      const scanPath = ctx.request.body.path;

      // Get the subdirectories of the scanned directory (only one level deep)
      const subDirs = await getSubDirectories(scanPath);

      // Set every subdirectory inside the scanned directory to non-existing
      const { count } = await strapi.db.query(DIRECTORY).updateMany({
        where: {
          path: { $startsWith: scanPath },
          exists: true,
        },
        data: {
          exists: false,
        },
      });

      let added = 0;
      let identified = 0;
      let removed = count;

      // Get the subdirectories which already exist in the database
      const subDirsAlreadyInDb = await strapi.entityService.findMany(
        DIRECTORY,
        {
          fields: ["name", "path", "exists"],
          filters: {
            name: subDirs.map((d) => d.name),
          },
        }
      );

      for await (const dir of subDirs) {
        const existing = subDirsAlreadyInDb.find((d) => d.path === dir.path);

        // If the directory is already in the database, we only switch the exists flag to true
        if (existing) {
          await strapi.entityService.update(DIRECTORY, existing.id, {
            data: {
              exists: true,
            },
          });

          removed--;
          continue;
        }

        // If a directory with the same name is already in the database, we add the same game(s) to this directory
        const sameName = await strapi.entityService.findMany(DIRECTORY, {
          filters: { name: dir.name },
          populate: ["games"],
          fields: [],
          limit: 1,
        });

        if (sameName.length) {
          await strapi.entityService.create(DIRECTORY, {
            data: { ...dir, games: sameName[0].games },
          });

          added++;
          if (sameName[0].games.length) identified++;
          continue;
        }

        // Otherwise we have to call IGDB API to determine game id
        const igdbId = await getIgdbId(dir.name);
        let game;

        if (igdbId) {
          const gameInDb = await strapi.entityService.findMany(GAME, {
            filters: { igdbId },
            limit: 1,
          });

          if (gameInDb.length) {
            game = gameInDb[0];
          } else {
            game = await strapi.entityService.create(GAME, {
              data: { igdbId },
            });
          }

          identified++;
        }

        await strapi.entityService.create(DIRECTORY, {
          data: { ...dir, games: [game] },
        });

        added++;
      }

      ctx.body = {
        scanned: subDirs.length,
        added,
        identified,
        removed,
      };
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
};
