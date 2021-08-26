import { Client } from "@notionhq/client";
import databaseIds from "./databaseIds.js";
import { 
	getDatabaseFields,
	getDatabasePageIds,
	getPageValues 
} from "./notionRequests.js"

import {
	getRelevantFieldValue,
	getRelation,
	lowercaseFirstChar
} from "./helpers.js";

import dotenv from "dotenv";
import express from "express";

const app = express();
const port = 3000;
dotenv.config();
const notion = new Client({ auth: process.env.SECRET });

app.get('/weapons', async (req, res) => {
	const weapons = await getWeapons();
	// console.log(weapons);
	res.send(JSON.stringify(weapons));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


const getWeapons = async () => {
	const mainObj = {}
	const fieldNames = await getDatabaseFields(notion, databaseIds.WEAPON_INFO);
	const pageIds = await getDatabasePageIds(notion, databaseIds.WEAPON_INFO);

	for(const pageId of pageIds) {
		const pageObj = {};
		const pageValues = await getPageValues(notion, pageId);
		for(const fieldName of fieldNames) {
			pageObj[lowercaseFirstChar(fieldName)] = getRelevantFieldValue(pageValues.properties[fieldName]);
			if(pageValues.properties[fieldName].type === "relation") {
				for (const relationId of pageObj[lowercaseFirstChar(fieldName)]) {
					const test = await getRelation(notion, relationId)
					pageObj[lowercaseFirstChar(fieldName)] = test;
				}
			}
		};
		const { script, ...formattedObj } = pageObj;
		mainObj[lowercaseFirstChar(script)] = formattedObj;
	}
	return mainObj;
}
