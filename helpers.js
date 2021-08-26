import { 
	getPageValues 
} from "./notionRequests.js"

const getTextValue = field => {
    return field.rich_text[0]?.text.content;
}

const getTitleValue = field => {
    return field.title[0].text.content;
}

const getNumberValue = field => {
    return field.number;
}

const getMultiSelectValue = field => {
    return field.multi_select.map(val => val.name);
}

const getSelectValue = field => {
    return field.select.name;
}

const getRelationIds = field => {
    return field.relation.map(relation => relation.id);
}

export const getRelation = async (client, id) => {
    const relationObj = {};
    const pageValues = await getPageValues(client, id);
    for(const property of Object.keys(pageValues.properties)) {
        const propertyObject = pageValues.properties[property];
        const fieldValue = getRelevantFieldValue(propertyObject)
        if(propertyObject.type !== "relation" && fieldValue && property !== "Name") {
            relationObj[lowercaseFirstChar(property)] = fieldValue;
        }
    }
    return relationObj;
}

export const getRelevantFieldValue = field => {
    const getFieldValue = fieldFunctions[field.type];
    return getFieldValue(field);
};

export const lowercaseFirstChar = str => {
    return `${str.charAt(0).toLowerCase()}${str.slice(1)}`;
}

const fieldFunctions = {
    rich_text: getTextValue,
    title: getTitleValue,
    multi_select: getMultiSelectValue,
    relation: getRelationIds,
    number: getNumberValue,
    select: getSelectValue
}